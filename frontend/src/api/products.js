import { request } from "./client";
import { mockGetProducts } from "./mockProducts";

const USE_MOCK = false; // set to false to use the real backend

const realGetProducts = ({ page = 1, limit = 10, search = "" } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (search) params.set("search", search);
  return request(`/products?${params}`);
};

export const getProducts = (args) =>
  USE_MOCK ? mockGetProducts(args) : realGetProducts(args);

export const createProduct = (data) =>
  request("/products", { method: "POST", body: JSON.stringify(data) });

export const deleteProduct = (sku)=> request(`/products/${encodeURIComponent(sku)}`, {method : 'DELETE' });

export const updateProduct = (sku,data)=> request(`/products/${encodeURIComponent(sku)}`, {method : 'PUT',body: JSON.stringify(data)})