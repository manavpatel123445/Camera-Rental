import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';
import ProductModal from './ProductModal';
import UpdateProductModal from './UpdateProductModal';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import ReactModal from 'react-modal';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Box, Pagination, Stack } from "@mui/material";

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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [quantityFilter, setQuantityFilter] = useState({ min: '', max: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7); 
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
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
void fetchProducts();
  }, []);

  const handleView = (product: Product) => {
    setViewProduct(product);
    setViewModalOpen(true);
  };

  const handleUpdate = (product: Product) => {
    setSelectedProduct(product);
    setUpdateModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This will only soft-delete the product if it\'s not used in any active orders.')) {
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
        } else if (res.status === 400 && data.orderCount) {
          toast.error(`Cannot delete: Product is used in ${data.orderCount} active order(s). Consider deactivating instead.`);
        } else {
          toast.error(data.message || 'Failed to delete product.');
        }
      } catch {
        toast.error('Network error occurred.');
      }
    }
  };

  const handleAddProduct = (product: Product) => {
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

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(products.map(p => p.category))).sort();

  // Filter products based on all criteria
  const filteredProducts = products.filter(product => {
    const searchLower = search.toLowerCase();
    
    // Text search
    const matchesSearch = !search || (
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      (product.description && product.description.toLowerCase().includes(searchLower))
    );
    
    // Category filter
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    // Status filter
    const matchesStatus = !selectedStatus || product.status === selectedStatus;
    
    // Price range filter
    const matchesPrice = (!priceRange.min || product.pricePerDay >= Number(priceRange.min)) &&
                        (!priceRange.max || product.pricePerDay <= Number(priceRange.max));
    
    // Quantity filter
    const matchesQuantity = (!quantityFilter.min || product.quantity >= Number(quantityFilter.min)) &&
                           (!quantityFilter.max || product.quantity <= Number(quantityFilter.max));
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPrice && matchesQuantity;
  });

  // Pagination handlers
  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage - 1);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate paginated products
  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) return <div className="p-8">Loading products...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <AdminLayout>
      <div className="p-4 md:p-8 max-w-8xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--text-primary)]">Product Management</h1>
          <button
            className="bg-white text-black border border-slate-300 px-4 py-2 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            Add product
          </button>
        </div>
        
        {/* Filter Section - Aligned with table columns */}
        <div className="bg-[var(--secondary-bg)] rounded-lg shadow border border-[var(--border-color)] mb-6">
          <div className="p-4">
            <div className="grid grid-cols-12 gap-4 items-end">
              {/* Image column - hidden for filters */}
              <div className="hidden md:block md:col-span-1"></div>
              
              {/* Name/Search */}
              <div className="col-span-12 md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:ring-1 focus:ring-blue-400 outline-none"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              
              {/* Category */}
              <div className="col-span-12 md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <select
                  className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:ring-1 focus:ring-blue-400 outline-none"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                >
                  <option value="">All</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Price Range */}
              <div className="col-span-12 md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Price/Day</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    placeholder="Min"
                    className="border border-slate-300 rounded px-2 py-2 w-full text-sm focus:ring-1 focus:ring-blue-400 outline-none"
                    value={priceRange.min}
                    onChange={e => setPriceRange({...priceRange, min: e.target.value})}
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="border border-slate-300 rounded px-2 py-2 w-full text-sm focus:ring-1 focus:ring-blue-400 outline-none"
                    value={priceRange.max}
                    onChange={e => setPriceRange({...priceRange, max: e.target.value})}
                    min="0"
                  />
                </div>
              </div>
              
              {/* Description - hidden for filters */}
              <div className="hidden md:block md:col-span-2"></div>
              
              {/* Quantity Range */}
              <div className="col-span-12 md:col-span-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Qty</label>
                <div className="flex gap-1">
                  <input
                    type="number"
                    placeholder="Min"
                    className="border border-slate-300 rounded px-2 py-2 w-full text-sm focus:ring-1 focus:ring-blue-400 outline-none"
                    value={quantityFilter.min}
                    onChange={e => setQuantityFilter({...quantityFilter, min: e.target.value})}
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="border border-slate-300 rounded px-2 py-2 w-full text-sm focus:ring-1 focus:ring-blue-400 outline-none"
                    value={quantityFilter.max}
                    onChange={e => setQuantityFilter({...quantityFilter, max: e.target.value})}
                    min="0"
                  />
                </div>
              </div>
              
              {/* Status */}
              <div className="col-span-12 md:col-span-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:ring-1 focus:ring-blue-400 outline-none"
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              {/* Actions - Clear Filters */}
              <div className="col-span-12 md:col-span-1 flex items-end">
                <button
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded border border-blue-200 hover:border-blue-300 transition-colors"
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('');
                    setSelectedStatus('');
                    setPriceRange({ min: '', max: '' });
                    setQuantityFilter({ min: '', max: '' });
                  }}
                  title="Clear all filters"
                >
                  Clear
                </button>
              </div>
            </div>
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
              {paginatedProducts.map(product => (
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
                  <td className="py-2 px-4 w-20">
                    <span className={`font-bold ${
                      product.quantity === 0 ? 'text-red-600' : 
                      product.quantity <= 5 ? 'text-orange-600' : 
                      product.quantity <= 10 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {product.quantity}
                    </span>
                    {product.quantity === 0 && (
                      <span className="ml-1 text-xs text-red-500 font-bold">OUT</span>
                    )}
                    {product.quantity > 0 && product.quantity <= 5 && (
                      <span className="ml-1 text-xs text-orange-500 font-bold">LOW</span>
                    )}
                  </td>
                  <td className="py-2 px-4 w-24">
                    <button
                      className={
                        "px-3 py-1 rounded-full text-xs font-bold transition " +
                        (product.status === "Active"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : product.status === "Inactive"
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
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
          
          {/* Material-UI Pagination */}
          <Stack spacing={2} sx={{ mt: 3, mb: 2, alignItems: 'center' }}>
            <Pagination
              count={Math.ceil(filteredProducts.length / rowsPerPage)}
              page={page + 1}
              onChange={handleChangePage}
              color="primary"
              siblingCount={0}
              boundaryCount={1}
              showFirstButton={false}
              showLastButton={false}
              hidePrevButton={filteredProducts.length <= rowsPerPage}
              hideNextButton={filteredProducts.length <= rowsPerPage}
            />
          </Stack>
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
            <div>
              <span className="font-semibold">Quantity:</span> 
              <span className={`font-bold ml-2 ${
                viewProduct?.quantity === 0 ? 'text-red-600' : 
                viewProduct?.quantity <= 5 ? 'text-orange-600' : 
                viewProduct?.quantity <= 10 ? 'text-yellow-600' : 
                'text-green-600'
              }`}>
                {viewProduct?.quantity}
              </span>
              {viewProduct?.quantity === 0 && (
                <span className="ml-1 text-xs text-red-500 font-bold">OUT OF STOCK</span>
              )}
              {viewProduct?.quantity > 0 && viewProduct?.quantity <= 5 && (
                <span className="ml-1 text-xs text-orange-500 font-bold">LOW STOCK</span>
              )}
            </div>
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