import { useState } from "react";
import Modal from "./Modal";
import { createProduct,updateProduct} from "../api/products";
import { toast } from "sonner";

const EMPTY = { name: "", sku: "", price: "", stock: "", low_stock_threshold: "" };

// Defined outside ProductModal on purpose: a component defined inside would be
// recreated on every keystroke and the input would lose focus.
function Field(
  { label, name, value, onChange, error, hint, ...inputProps }
                                  
) {                     
  return (                                      
    <div className="mb-3 flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-lg border px-3 py-2 ${
          error ? "border-red-700 bg-red-50" : "border-slate-300"
        }`}
        {...inputProps}
      />
      {error ? (
        <span id={`${name}-error`} className="text-sm font-semibold text-red-700">
          {error}
        </span>
      ) : hint ? (
        <span className="text-sm text-slate-600">{hint}</span>
      ) : null}
    </div>
  );
}

export default function ProductModal({ product, onClose, onSaved }) {

  const [form, setForm] = useState(product || EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setFormError("");

    const next = {};
    const name = form.name.trim();
    const sku = form.sku.trim();
    const price = Number(form.price);

    if (!name) {
      next.name = "Name is required";
    } else if (name.length > 100) {
      next.name = "Name must be 100 characters or fewer";
    }

    if (!product && !sku) {
      next.sku = "SKU is required";
    } else if (!product && !/^[a-zA-Z0-9_-]+$/.test(sku)) {
      next.sku =
        "SKU can contain only letters, numbers, hyphens and underscores";
    }

    if (form.price === "") {
      next.price = "Price is required";
    } else if (!Number.isFinite(price) || price < 0) {
      next.price = "Price must be a valid non-negative number";
    }

    for (const field of ["stock", "low_stock_threshold"]) {
      const value = form[field];
      if (
        value !== "" &&
        (!Number.isInteger(Number(value)) || Number(value) < 0)
      ) {
        next[field] = "Must be a non-negative whole number";
      }
    }

    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    const payload = {
      name,
      price,
    };
    if (!product) payload.sku = sku;
    if (form.stock !== "") payload.stock = Number(form.stock);
    if (form.low_stock_threshold !== "")
      payload.low_stock_threshold = Number(form.low_stock_threshold);

    setSaving(true);
    try {
      const savePromise = product
        ? updateProduct(product.sku, payload)
        : createProduct(payload);

      toast.promise(savePromise, {
        loading: product ? "Updating product..." : "Adding product...",
        success: product
          ? `${name} has been updated`
          : `${name} has been added`,
        error: product ? "Failed to update product" : "Failed to add product",
      });

      await savePromise;
      onSaved();
    } catch (err) {
      if (err.status === 400 && Array.isArray(err.body?.errors)) {
        const map = {};
        err.body.errors.forEach((x) => {
          if (!map[x.path]) map[x.path] = x.msg;
        });
        setErrors(map);
      } else if (err.status === 409) {
        setErrors({ sku: "This SKU is already in use" });
      } else {
        setFormError(err.message || "Could not save product");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={product ? "Edit Product ":"Add Product"} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <Field label="Product name" name="name" value={form.name}
          onChange={handleChange} error={errors.name} autoFocus maxLength={100} />
        <Field label="SKU" name="sku" 
        value={form.sku} disabled={!!product}
        // value="WM-100"
          onChange={handleChange} error={errors.sku}  pattern="[a-zA-Z0-9_-]+"
          hint={product ? "Sku cannot be changed" : "Letters, numbers, hyphens and underscores. Can't be changed later."} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (₹)" name="price" type="number" step="0.01" min="0"
            value={form.price} onChange={handleChange} error={errors.price} />
          <Field label="Current stock" name="stock" type="number" step="1" min="0"
            value={form.stock} onChange={handleChange} error={errors.stock}
            hint="Leave empty for 0" />
        </div>                                                  
        <Field label="Low stock threshold" name="low_stock_threshold" type="number"
          step="1" min="0" value={form.low_stock_threshold}
          onChange={handleChange} error={errors.low_stock_threshold}
          hint="Leave empty for the default (5)" />
                                                                                        
        {formError && (
          <p className="mb-3 text-sm font-semibold text-red-700">{formError}</p>
        )}
              
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose}
            className="rounded-full border border-[#2b7cff] px-5 py-2 font-semibold text-[#1d5fd0]">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="rounded-full bg-[#2b7cff] px-5 py-2 font-semibold text-white disabled:opacity-60">
            {saving ? "Saving..." : "Save product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}