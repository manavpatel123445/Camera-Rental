import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';
import ProductModal from './ProductModal';
import UpdateProductModal from './UpdateProductModal';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import ReactModal from 'react-modal';

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
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      const res = await fetch('https://camera-rental-ndr0.onrender.com/api/products', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (res.status === 401) {
        setError('Authentication failed. Please log in again.');
        return;
      }
      
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      } else {
        setError(data.message || 'Failed to fetch products.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleView = (product: Product) => {
    setViewProduct(product);
    setViewModalOpen(true);
  };

  const handleUpdate = (product: any) => {
    setSelectedProduct(product);
    setUpdateModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          toast.error('No authentication token found. Please log in again.');
          return;
        }

        const res = await fetch(`https://camera-rental-ndr0.onrender.com/api/products/${id}`, {
          method: 'DELETE',
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        if (res.status === 401) {
          toast.error('Authentication failed. Please log in again.');
          return;
        }
        
        const data = await res.json();
        if (res.ok) {
                  toast.success('Product deleted successfully!');
        // Remove the product from the current list immediately
        setProducts(prevProducts => prevProducts.filter(p => p._id !== id));
        // Refresh the product list
          window.location.reload();
        } else {
          toast.error(data.message || 'Failed to delete product.');
        }
      } catch (err) {
        toast.error('Network error occurred.');
      }
    }
  };

  const handleAddProduct = (product: any) => {
    // Add the new product to the current list
    setProducts(prevProducts => [product, ...prevProducts]);
    // Also refresh the list to ensure we have the latest data
    fetchProducts();
    // Call your API or update state here
    console.log('New product:', product);
  };

  // Add handler for toggling product status
  const handleToggleStatus = async (product: Product) => {
    const newStatus = product.status === "Active" ? "Inactive" : "Active";
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        toast.error('No authentication token found. Please log in again.');
        return;
      }

      const res = await fetch(`https://camera-rental-ndr0.onrender.com/api/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include',
      });
      
      if (res.status === 401) {
        toast.error('Authentication failed. Please log in again.');
        return;
      }
      
      if (res.ok) {
        toast.success(`Product ${newStatus === "Active" ? "activated" : "deactivated"}!`);
        // Refresh the product list
        fetchProducts();
      } else {
        toast.error('Failed to update status.');
      }
    } catch {
      toast.error('Network error.');
    }
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
      <div className="p-4 md:p-8 max-w-8xl mx-auto w-full">
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
                    <button
                      className={
                        "px-3 py-1 rounded-full text-xs font-bold transition " +
                        (product.status === "Active"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : product.status === "Inactive"
                          ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                          : "bg-yellow-100 text-yellow-700")
                      }
                      onClick={() => handleToggleStatus(product)}
                      title={
                        product.status === "Active"
                          ? "Deactivate"
                          : product.status === "Inactive"
                          ? "Activate"
                          : "Set status"
                      }
                    >
                      {product.status === "Active"
                        ? "Active"
                        : product.status === "Inactive"
                        ? "Inactive"
                        : "Unknown"}
                    </button>
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
      {/* View Product Modal */}
      <ReactModal
        isOpen={viewModalOpen}
        onRequestClose={() => setViewModalOpen(false)}
        contentLabel="View Product"
        ariaHideApp={false}
        className="max-w-md mx-auto mt-24 bg-white rounded-lg shadow-lg p-6 outline-none"
        overlayClassName="fixed inset-0 bg-white/40 flex items-center justify-center z-50"
      >
        {viewProduct && (
          <div className="space-y-4 text-slate-800">
            <div className="flex flex-col items-center">
              {viewProduct.image && (
                <img src={viewProduct.image} alt={viewProduct.name || ''} className="w-32 h-32 object-cover rounded mb-2" />
              )}
              <h2 className="text-xl font-bold mb-1">{viewProduct?.name}</h2>
              <span className="text-sm text-gray-500 mb-2">{viewProduct?.category}</span>
            </div>
            <div><span className="font-semibold">Price/Day:</span> ${viewProduct?.pricePerDay}</div>
            <div><span className="font-semibold">Description:</span> {viewProduct?.description || 'No description'}</div>
            <div><span className="font-semibold">Quantity:</span> {viewProduct?.quantity}</div>
            <div><span className="font-semibold">Status:</span> {viewProduct?.status || 'Unknown'}</div>
            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              onClick={() => setViewModalOpen(false)}
            >
              Close
            </button>
          </div>
        )}
      </ReactModal>
    </AdminLayout>
  );
};

export default ProductList; 