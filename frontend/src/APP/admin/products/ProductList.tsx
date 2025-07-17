import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';
import { Link } from 'react-router-dom';
interface Product {
  _id: string;
  name: string;
  category: string;
  pricePerDay: number;
  description?: string;
  image?: string;
  quantity: number;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(products => products.filter(p => p._id !== id));
        toast.success('Product deleted successfully!');
      } else {
        setError(data.message || 'Failed to delete product.');
        toast.error(data.message || 'Failed to delete product.');
      }
    } catch (err) {
      setError('Network error.');
      toast.error('Network error occurred while deleting product.');
    }
  };

  if (loading) return <div className="p-8">Loading products...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <AdminLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--text-primary)]">Product Management</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[var(--secondary-bg)] rounded-lg shadow border border-[var(--border-color)] text-[var(--text-primary)]">
            <thead>
              <tr className="bg-[var(--primary-bg)]">
                <th className="py-2 px-4 text-left">Image</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Price/Day</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="border-b">
                  <td className="py-2 px-4">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                  <td className="py-2 px-4 font-semibold">{product.name}</td>
                  <td className="py-2 px-4">{product.category}</td>
                  <td className="py-2 px-4">${product.pricePerDay}</td>
                  <td className="py-2 px-4 max-w-xs truncate">{product.description}</td>
                  <td className="py-2 px-4 font-semibold">{product.quantity}</td>
                  <td className="py-2 px-4">
                    {product.quantity === 0 ? (
                      <span className="text-red-500 font-bold">Out of Stock</span>
                    ) : (
                      <Link
                        to={`/admin/products/${product._id}`}
                        className="bg-slate-500 hover:bg-slate-600 text-white px-3 py-1 rounded text-sm mr-2"
                      >
                        View
                      </Link>
                    )}
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductList; 