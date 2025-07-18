import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';
import ProductModal from './ProductModal';
import UpdateProductModal from './UpdateProductModal';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

interface Product {
  _id: string;
  name: string;
  category: string;
  pricePerDay: number;
  description?: string;
  image?: string;
  quantity: number;
  status: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/products', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      } else {
        setError(data.message || 'Failed to fetch products.');
        toast.error(data.message || 'Failed to fetch products.');
      }
    } catch (err) {
      setError('Network error.');
      toast.error('Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleView = (product: any) => {
    console.log('View product:', product);
  };

  const handleUpdate = (product: any) => {
    setSelectedProduct(product);
    setUpdateModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      console.log('Delete product:', id);
      // TODO: Call backend to delete and refresh list
    }
  };

  const handleAddProduct = (product: any) => {
    // Call your API or update state here
    console.log('New product:', product);
  };

  // Filter products based on search
  const filteredProducts = products.filter(product => {
    const searchLower = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      (product.description && product.description.toLowerCase().includes(searchLower))
    );
  });

  if (loading) return <div className="p-8">Loading products...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <AdminLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--text-primary)]">Product Management</h1>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              className="border border-slate-300 rounded px-4 py-2 w-full md:w-64 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setIsModalOpen(true)}
            >
              Add product
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed bg-[var(--secondary-bg)] rounded-lg shadow border border-[var(--border-color)] text-[var(--text-primary)]">
            <thead>
              <tr className="bg-[var(--primary-bg)]">
                <th className="py-2 px-4 text-left w-24">Image</th>
                <th className="py-2 px-4 text-left w-40">Name</th>
                <th className="py-2 px-4 text-left w-32">Category</th>
                <th className="py-2 px-4 text-left w-24">Price/Day</th>
                <th className="py-2 px-4 text-left w-64">Description</th>
                <th className="py-2 px-4 text-left w-20">Quantity</th>
                <th className="py-2 px-4 text-left w-24">Status</th>
                <th className="py-2 px-4 text-left w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product._id} className="border-b">
                  <td className="py-2 px-4 w-24">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="py-2 px-4 w-40 font-semibold truncate">{product.name}</td>
                  <td className="py-2 px-4 w-32 truncate">{product.category}</td>
                  <td className="py-2 px-4 w-24">${product.pricePerDay}</td>
                  <td className="py-2 px-4 w-64 max-w-xs truncate">{product.description}</td>
                  <td className="py-2 px-4 w-20 font-semibold">{product.quantity}</td>
                  <td className="py-2 px-4 w-24">
                    <span
                      className={
                        "px-3 py-1 rounded-full text-xs font-bold " +
                        (product.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : product.status === "Inactive"
                          ? "bg-gray-200 text-gray-600"
                          : "bg-yellow-100 text-yellow-700")
                      }
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 w-32 flex gap-2">
                    <button
                      onClick={() => handleView(product)}
                      className="p-2 rounded hover:bg-blue-100 text-blue-600"
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleUpdate(product)}
                      className="p-2 rounded hover:bg-yellow-100 text-yellow-600"
                      title="Update"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 rounded hover:bg-red-100 text-red-600"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddProduct}
      />
      <UpdateProductModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        product={selectedProduct}
        onUpdated={fetchProducts}
      />
    </AdminLayout>
  );
};

export default ProductList; 