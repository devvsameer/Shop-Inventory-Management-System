
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import "../index.css";

const ProductTable = ({ products = [] , ondelete , onedit }) => {
  const money = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });

  function getStatus(product) {
    const stock = Number(product.stock);
    const threshold = Number(product.low_stock_threshold);

    if (stock <= 0) return "Out of stock";
    if (stock <= threshold) return "Low";

    return "Healthy";
  }

  const statusStyles = {
    Healthy: "bg-green-200 text-green-600",
    Low: "bg-yellow-200 text-yellow-700",
    "Out of stock": "bg-red-300 text-red-700",
  };

  return (
    <div className="h-full min-h-0 w-full min-w-0 overflow-auto">
      <table className="w-full min-w-175 table-fixed border-collapse">
      <thead className="sticky top-0 z-10 bg-white">
          <tr>
            <th scope="col" className="product-heading">SKU</th>
            <th scope="col" className="product-heading">Name</th>
            <th scope="col" className="product-heading">Price</th>
            <th scope="col" className="product-heading">Stock</th>
            <th scope="col" className="product-heading">Threshold</th>
            <th scope="col" className="product-heading">Status</th>
            <th scope="col" className="product-heading">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((item) => {
            const status = getStatus(item);

            return (
              <tr
                // key={item.id ?? item.sku}
                 key={item.sku}
                className={
                  status === "Healthy"
                    ? ""
                    : status === "Low"
                    ? "bg-yellow-50"
                    : "bg-red-100"
                }
              >
                <td className="product-data">{item.sku}</td>

                <td className="product-data">{item.name}</td>

                <td className="product-data">
                  {money.format(Number(item.price) || 0)}
                </td>

                <td className="product-data">{item.stock}</td>

                <td className="product-data">
                  {item.low_stock_threshold}
                </td>

                <td className="product-data">
                  <p
                    className={`font-bold text-center m-1 rounded-full ${statusStyles[status]}`}
                  >
                    {status}
                  </p>
                </td>

                <td className="product-data">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      aria-label={`Edit ${item.name}`}
                      title="Edit product"
                      className="border-2 border-gray-200 rounded p-1 text-blue-500 hover:bg-blue-50"
                      onClick={() => {
                        onedit(item);// Add your edit navigation or handler here.
                      }}
                    >
                      <MdOutlineEdit size={20} />
                    </button>

                    <button
                      type="button"
                      aria-label={`Delete ${item.name}`}
                      title="Delete product"
                      className="border-2 border-gray-200 rounded p-1 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        ondelete({sku:item.sku,name:item.name});
                        // Add your delete confirmation and API handler here.
                      }}
                    >
                      <MdDeleteOutline size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;