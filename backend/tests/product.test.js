// tests/product.test.js
//
// Jest + Supertest tests for the products API (ES modules).
// READ THE SETUP NOTES IN THE CHAT BEFORE RUNNING.
//
// Adjust these three imports/constants to match your project:
import request from "supertest";
import { describe, it, expect, beforeEach, afterAll, beforeAll } from "@jest/globals";
import app from "../app.js";              // Express app exported WITHOUT app.listen()
import pool from "../config/db.js";       // your mysql2/promise pool (default export)
const BASE = "/products";                 // where you mounted the product router

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Rows inserted before EVERY test, so each test starts from known data.
const SEED = [
  ["WM-001", "Wireless Mouse", 499.0, 20, 5], // normal stock
  ["KB-001", "Keyboard", 999.0, 3, 5],        // below threshold (low stock)
  ["PN-001", "Pen", 10.0, 5, 5],              // exactly AT threshold (boundary)
  ["HD-001", "Headset", 1500.0, 10, 5],       // above threshold
];

const validProduct = (overrides = {}) => ({
  name: "Test Product",
  sku: "TST-001",
  price: 100.5,
  stock: 10,
  low_stock_threshold: 5,
  ...overrides,
});

const countRows = async () => {
  const [rows] = await pool.query("SELECT COUNT(*) AS c FROM products");
  return rows[0].c;
};

const getRow = async (sku) => {
  const [rows] = await pool.query("SELECT * FROM products WHERE sku = ?", [sku]);
  return rows[0] || null;
};

// Your low-stock endpoint might return an array or an object wrapping it.
// Adjust this if your response shape is different.
const extractList = (body) =>
  Array.isArray(body) ? body : body.data || body.products || body.rows || [];

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeAll(async () => {
  // SAFETY: refuse to run against anything that is not a test database,
  // because these tests TRUNCATE the products table.
  const [rows] = await pool.query("SELECT DATABASE() AS db");
  const dbName = rows[0].db || "";
  if (!dbName.endsWith("_test")) {
    throw new Error(
      `Refusing to run tests on database "${dbName}". Use a database whose name ends with _test.`
    );
  }
});

beforeEach(async () => {
  await pool.query("TRUNCATE TABLE products");
  await pool.query(
    "INSERT INTO products (sku, name, price, stock, low_stock_threshold) VALUES ?",
    [SEED]
  );
});

afterAll(async () => {
  await pool.end();
});

// ---------------------------------------------------------------------------
// POST /products
// ---------------------------------------------------------------------------

describe("POST /products (create)", () => {
  it("creates a product with all fields -> 201", async () => {
    const res = await request(app).post(BASE).send(validProduct());
    expect(res.status).toBe(201);

    const row = await getRow("TST-001");
    expect(row).not.toBeNull();
    expect(row.name).toBe("Test Product");
    expect(Number(row.price)).toBe(100.5);
    expect(row.stock).toBe(10);
    expect(row.low_stock_threshold).toBe(5);
  });

  it("applies DB defaults when stock and threshold are omitted -> 201", async () => {
    const { stock, low_stock_threshold, ...body } = validProduct();
    const res = await request(app).post(BASE).send(body);
    console.log(res.status, res.body);
    expect(res.status).toBe(201);

    const row = await getRow("TST-001");
    expect(row.stock).toBe(0);
    expect(row.low_stock_threshold).toBe(5);
  });

  it("trims and uppercases the SKU -> stored as PEN-02", async () => {
    const res = await request(app)
      .post(BASE)
      .send(validProduct({ sku: "  pen-02  " }));
    expect(res.status).toBe(201);
    expect(await getRow("PEN-02")).not.toBeNull();
  });

  it("rejects a duplicate SKU -> 409", async () => {
    const res = await request(app).post(BASE).send(validProduct({ sku: "WM-001" }));
    expect(res.status).toBe(400);
    expect(await countRows()).toBe(SEED.length);
  });

  it("rejects a duplicate SKU in a different case -> 409", async () => {
    const res = await request(app).post(BASE).send(validProduct({ sku: "wm-001" }));
    expect(res.status).toBe(400);
    expect(await countRows()).toBe(SEED.length);
  });

  it("handles two simultaneous creates with the same SKU: one 201, one 409", async () => {
    const send = () => request(app).post(BASE).send(validProduct({ sku: "RACE-1" }));
    const results = await Promise.all([send(), send()]);
    const statuses = results.map((r) => r.status).sort();
    expect(statuses).toEqual([201, 400]);
  });

  // Missing required fields
  it.each(["name", "sku", "price"])("rejects when %s is missing -> 400", async (field) => {
    const body = validProduct();
    delete body[field];
    const res = await request(app).post(BASE).send(body);
    expect(res.status).toBe(400);
    expect(await countRows()).toBe(SEED.length);
  });

  // Invalid values
  // NOTE: remove the price 0 case if you allow free items.
  // NOTE: the threshold cases use values that are invalid under any sensible rule.
  it.each([
    ["empty name", { name: "" }],
    ["whitespace-only name", { name: "   " }],
    ["name of 101 characters", { name: "a".repeat(101) }],
    ["empty sku", { sku: "" }],
    ["whitespace-only sku", { sku: "   " }],
    ["sku of 2 characters", { sku: "AB" }],
    ["sku of 101 characters", { sku: "A".repeat(101) }],
    ["sku with a slash", { sku: "A/B" }],
    ["sku with a space inside", { sku: "PEN 01" }],
    ["reserved sku LOW-STOCK", { sku: "low-stock" }],
    ["sku sent as a number", { sku: 123 }],
    ["negative price", { price: -5 }],
    ["zero price", { price: 0 }],
    ["text price", { price: "abc" }],
    ["price with 3 decimals", { price: 10.999 }],
    ["negative stock", { stock: -1 }],
    ["decimal stock", { stock: 2.5 }],
    ["text stock", { stock: "abc" }],
    ["negative threshold", { low_stock_threshold: -1 }],
    ["decimal threshold", { low_stock_threshold: 2.5 }],
  ])("rejects %s -> 400", async (_label, override) => {
    const res = await request(app).post(BASE).send(validProduct(override));
    expect(res.status).toBe(400);
    expect(await countRows()).toBe(SEED.length);
  });

  it("rejects an empty body -> 400", async () => {
    const res = await request(app).post(BASE).send({});
    expect(res.status).toBe(400);
  });

  it("rejects malformed JSON -> 400", async () => {
    const res = await request(app)
      .post(BASE)
      .set("Content-Type", "application/json")
      .send("{ this is not json");
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// GET /products  (list)  -- your route is still a placeholder
// ---------------------------------------------------------------------------

describe("GET /products (list)", () => {
  // Turn these into real tests once getProducts is implemented.
  it.todo("returns the first page with defaults and a total count -> 200");
  it.todo("supports ?page=2&limit=2");
  it.todo("filters with ?search=pen (name or sku)");
  it.todo("returns an empty list (not 404) when nothing matches");
  it.todo("rejects page=0, limit=-1, limit=abc");
  it.todo("caps a huge limit at the maximum");
  it.todo("handles search text containing % or ' safely");
});

// ---------------------------------------------------------------------------
// GET /products/:sku
// ---------------------------------------------------------------------------

describe("GET /products/:sku", () => {
  it("returns an existing product -> 200", async () => {
    const res = await request(app).get(`${BASE}/WM-001`);
    expect(res.status).toBe(200);
    // If your response wraps the product (e.g. { data: {...} }), adjust here.
    expect(res.body).toMatchObject({ sku: "WM-001", name: "Wireless Mouse" });
  });

  it("normalizes a lowercase SKU -> 200", async () => {
    const res = await request(app).get(`${BASE}/wm-001`);
    expect(res.status).toBe(200);
  });

  it("returns 404 for an unknown SKU", async () => {
    const res = await request(app).get(`${BASE}/NOPE-999`);
    expect(res.status).toBe(404);
  });

  it.each([
    ["too short", "AB"],
    ["invalid characters", "A$B"],
    ["too long", "A".repeat(101)],
  ])("rejects a SKU that is %s -> 400", async (_label, sku) => {
    const res = await request(app).get(`${BASE}/${encodeURIComponent(sku)}`);
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// PUT /products/:sku
// ---------------------------------------------------------------------------

describe("PUT /products/:sku (update)", () => {
  const update = (overrides = {}) => ({
    name: "Wireless Mouse",
    price: 599,
    stock: 20,
    low_stock_threshold: 5,
    ...overrides,
  });

  it("updates the price -> 200, SKU unchanged", async () => {
    const res = await request(app).put(`${BASE}/WM-001`).send(update());
    expect(res.status).toBe(200);

    const row = await getRow("WM-001");
    expect(Number(row.price)).toBe(599);
    expect(row.sku).toBe("WM-001");
  });

  it("returns 200 (not 404) when the data is identical to what is stored", async () => {
    const res = await request(app)
      .put(`${BASE}/WM-001`)
      .send(update({ price: 499 }));
    expect(res.status).toBe(200);
  });

  it("returns 404 for an unknown SKU with a valid body", async () => {
    const res = await request(app).put(`${BASE}/NOPE-999`).send(update());
    expect(res.status).toBe(404);
  });

  

  it.each([
    ["empty name", { name: "" }],
    ["negative price", { price: -5 }],
    ["zero price", { price: 0 }],
    ["text price", { price: "abc" }],
    ["negative stock", { stock: -1 }],
    ["decimal stock", { stock: 2.5 }],
    ["negative threshold", { low_stock_threshold: -1 }],
  ])("rejects %s -> 400 and leaves the row unchanged", async (_label, override) => {
    const res = await request(app).put(`${BASE}/WM-001`).send(update(override));
    expect(res.status).toBe(400);

    const row = await getRow("WM-001");
    expect(row.name).toBe("Wireless Mouse");
    expect(Number(row.price)).toBe(499);
  });

  it("rejects an invalid SKU in the URL -> 400", async () => {
    const res = await request(app).put(`${BASE}/A%24B`).send(update());
    expect(res.status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// DELETE /products/:sku
// ---------------------------------------------------------------------------

describe("DELETE /products/:sku", () => {
  it("deletes an existing product -> 200 or 204, row gone", async () => {
    const res = await request(app).delete(`${BASE}/WM-001`);
    expect([200, 204]).toContain(res.status);
    expect(await getRow("WM-001")).toBeNull();
    expect(await countRows()).toBe(SEED.length - 1);
  });

  it("returns 404 when deleting the same product twice", async () => {
    await request(app).delete(`${BASE}/WM-001`);
    const res = await request(app).delete(`${BASE}/WM-001`);
    expect(res.status).toBe(404);
  });

  it("returns 404 for an unknown SKU", async () => {
    const res = await request(app).delete(`${BASE}/NOPE-999`);
    expect(res.status).toBe(404);
    expect(await countRows()).toBe(SEED.length);
  });

  it("rejects an invalid SKU -> 400", async () => {
    const res = await request(app).delete(`${BASE}/A%24B`);
    expect(res.status).toBe(400);
    expect(await countRows()).toBe(SEED.length);
  });

  it("returns 404 when fetching a deleted product", async () => {
    await request(app).delete(`${BASE}/WM-001`);
    const res = await request(app).get(`${BASE}/WM-001`);
    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// GET /products/low-stock
// ---------------------------------------------------------------------------

describe("GET /products/low-stock", () => {
  it("includes products below or exactly at the threshold, excludes the rest", async () => {
    const res = await request(app).get(`${BASE}/low-stock`);
    expect(res.status).toBe(200);

    const skus = extractList(res.body).map((p) => p.sku);
    expect(skus).toContain("KB-001"); // stock 3 < threshold 5
    expect(skus).toContain("PN-001"); // stock 5 == threshold 5 (boundary)
    expect(skus).not.toContain("WM-001");
    expect(skus).not.toContain("HD-001");
  });

  it("returns 200 with an empty list when nothing is low", async () => {
    await pool.query("UPDATE products SET stock = 100");
    const res = await request(app).get(`${BASE}/low-stock`);
    expect(res.status).toBe(200);
    expect(extractList(res.body)).toHaveLength(0);
  });

  it("is not swallowed by the /:sku route", async () => {
    const res = await request(app).get(`${BASE}/low-stock`);
    expect(res.status).not.toBe(400);
    expect(res.status).not.toBe(404);
  });
});

// ---------------------------------------------------------------------------
// Cross-cutting
// ---------------------------------------------------------------------------

describe("General API behavior", () => {
  it("returns 404 for an unknown URL", async () => {
    const res = await request(app).get("/productz");
    expect(res.status).toBe(404);
  });
});

// Not automated (do these by hand once):
//  - Stop MySQL and call an endpoint: expect a clean 500 and the server stays alive.
//  - Check that error responses never leak stack traces or SQL text.