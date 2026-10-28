import ProductTable from './ProductTable'
import PrmryButton from './PrmryButton'
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import ProductModal from './ProductModel'
import Modal from './Modal';
import { deleteProduct } from '../api/products';
const ProdMainWindow = ({ products = [], pagination = {}, onPageChange, onRefresh }) => {
  //handiling add product
  const [showAdd, setShowAdd] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [productToDelete, setProductToDelete] = useState("");
  const [productToEdit, setProductToEdit] = useState(null);

  const page = Number(pagination.page ?? 1)
  const limit = Number(pagination.limit ?? 10)
  const totalProducts = Number(pagination.totalProducts ?? products.length)
  const totalPages = Number(pagination.totalPages ?? Math.max(1, Math.ceil(totalProducts / limit)))

  const start = totalProducts === 0 ? 0 : (page - 1) * limit + 1
  const end = totalProducts === 0 ? 0 : Math.min(page * limit, totalProducts)

  const handlePageChange = (nextPage) => {
    if (typeof onPageChange === 'function') {
      onPageChange(nextPage)
    }
  }

  function onEdit(item) {
    setProductToEdit(item)
    setShowEdit(true);
  }
  //ondelete
  function onDelete(sku) {
    setProductToDelete(sku);
  }
  async function DeleteProduct(sku) {
    try {
   toast.promise(deleteProduct(sku), {
    loading: "Deleting product...",
    success: `${productToDelete.name} has been deleted`,
    error: "Failed to delete product",
  });

  setRefreshKey((k) => k + 1);
} catch (err) {
  console.error(err);
} finally {
  setProductToDelete("");
  setShowDialog(false);
}
  }
useEffect(() => {
  if (!productToDelete) {
    return
  }
  setShowDialog(true);
  console.log(productToDelete);
}, [productToDelete])



return (
  <div className='flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white text-black'>
    <header className='flex shrink-0 items-center justify-between gap-3 p-3'>
      <div className='flex items-center gap-3'>
        <h1 className='windowHeading'>Item Inventory</h1>
      </div>
      <div className='flex gap-2.5'>
        {/* <button type='button' className='rounded-xl bg-blue-500 px-3 py-2 text-white'>Add Product</button> */}
        <PrmryButton name="Add Product" onclick={setShowAdd} />
      </div>
    </header>

    <main className='min-h-0 flex-1 overflow-hidden px-3 pb-3'>
      <ProductTable products={products} ondelete={onDelete} onedit={onEdit} />

      {showEdit && (
        <ProductModal
          product={productToEdit}
          onClose={() => setShowEdit(false)}
          onSaved={() => {
            setShowEdit(false);
            setRefreshKey((k) => k + 1);
            setProductToEdit(null)
            onRefresh();
          }}
        />
      )}
      {showAdd && (
        <ProductModal
          onClose={() => setShowAdd(false)}
          onSaved={() => {
            setShowAdd(false);
            setRefreshKey((k) => k + 1);
            onRefresh();
          }}
        />
      )}
      
{showDialog && (
  <Modal
    title={`Delete ${productToDelete.name}?`}
    onClose={() => {
      setShowDialog(false);
      setProductToDelete("");
    }}
    onConfirm={async () => {
      try {
        await DeleteProduct(productToDelete.sku);
        setShowDialog(false);
        setProductToDelete("");
        onRefresh();
      } catch (err) {
        console.error("Failed to delete product:", err);
      }
    }}
  >
    <p>
      Do you want to delete {productToDelete.sku} from your inventory?
    </p>
    <p>Press Confirm to delete this product.</p>
  </Modal>
)}

    </main>

    <footer className='flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white p-3'>
      <p className='text-sm text-gray-600'>
        Showing {start}-{end} of {totalProducts} products
      </p>

      <div className='flex items-center gap-2'>
        <button
          type='button'
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          className='rounded-lg border px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40'
        >
          Previous
        </button>

        <span className='whitespace-nowrap text-sm'>
          Page {page} of {totalPages}
        </span>

        <button
          type='button'
          disabled={page >= totalPages || totalProducts === 0}
          onClick={() => handlePageChange(page + 1)}
          className='rounded-lg border px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40'
        >
          Next
        </button>
      </div>
    </footer>

  </div>

)
}

export default ProdMainWindow
