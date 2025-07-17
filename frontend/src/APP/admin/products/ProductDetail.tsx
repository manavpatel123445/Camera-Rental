import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUpload, FaTag, FaList, FaDollarSign, FaAlignLeft, FaImage } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import toast from 'react-hot-toast';

interface ProductForm {
  name: string;
  category: string;
  pricePerDay: string;
  description: string;
  image: File | null;
  imageUrl: string;
  quantity: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<ProductForm>({
    name: '',
    category: '',
    pricePerDay: '',
    description: '',
    image: null,
    imageUrl: '',
    quantity: '1',
  });
  const [imageType, setImageType] = useState<'file' | 'url'>('file');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/products/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const data = await res.json();
        if (res.ok) {
          setForm({
            name: data.name || '',
            category: data.category || '',
            pricePerDay: data.pricePerDay ? String(data.pricePerDay) : '',
            description: data.description || '',
            image: null,
            imageUrl: data.image || '',
            quantity: data.quantity ? String(data.quantity) : '1',
          });
          setImageType(data.image ? 'url' : 'file');
        } else {
          setError(data.message || 'Failed to fetch product.');
        }
      } catch (err) {
        setError('Network error.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleImageTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageType(e.target.value as 'file' | 'url');
    setForm((prev) => ({ ...prev, image: null, imageUrl: '' }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name || !form.category || !form.pricePerDay || !form.quantity) {
      setError('Please fill in all required fields.');
      return;
    }
    if (imageType === 'file') {
      if (!form.image) {
        setError('Please upload an image file.');
        return;
      }
      if (form.imageUrl) {
        setError('Please remove the image URL when uploading a file.');
        return;
      }
    }
    if (imageType === 'url') {
      if (!form.imageUrl) {
        setError('Please provide an image URL.');
        return;
      }
      if (form.image) {
        setError('Please remove the uploaded file when using an image URL.');
        return;
      }
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('pricePerDay', form.pricePerDay);
      formData.append('description', form.description);
      formData.append('quantity', form.quantity);
      if (imageType === 'file' && form.image) formData.append('image', form.image);
      if (imageType === 'url' && form.imageUrl) formData.append('imageUrl', form.imageUrl);
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'PATCH',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Product updated successfully!');
        toast.success('Product updated successfully!');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
        return;
      } else {
        setError(data.message || 'Failed to update product.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Product deleted successfully!');
        navigate('/admin/products');
      } else {
        setError(data.message || 'Failed to delete product.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const categoryOptions = [
    'Camera',
    'Lens',
    'Video Camera',
    'Tripod',
    'Lighting',
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-center py-4 px-2 min-h-screen">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-5 border border-slate-200">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-1 text-center tracking-tight">Product Details</h2>
          <form onSubmit={handleUpdate} className="space-y-3">
            <div>
              <label className="block font-semibold mb-1 text-slate-700">Name<span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><FaTag /></span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-10 py-2 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition text-sm"
                  required
                  placeholder="Product name"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700">Category<span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><FaList /></span>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-10 py-2 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition text-sm appearance-none"
                  required
                >
                  <option value="" disabled>Select category</option>
                  {categoryOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700">Price Per Day ($)<span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><FaDollarSign /></span>
                <input
                  type="number"
                  name="pricePerDay"
                  value={form.pricePerDay}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-10 py-2 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition text-sm"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700">Description</label>
              <div className="relative">
                <span className="absolute left-3 top-4 text-slate-400"><FaAlignLeft /></span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-lg px-10 py-2 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition text-sm"
                  rows={2}
                  placeholder="Product description (optional)"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700">Quantity<span className="text-red-500">*</span></label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition text-sm"
                required
                min="1"
                step="1"
                placeholder="Quantity"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700">Image</label>
              <div className="flex items-center gap-4 mb-1">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="imageType"
                    value="file"
                    checked={imageType === 'file'}
                    onChange={handleImageTypeChange}
                  />
                  Upload File
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="imageType"
                    value="url"
                    checked={imageType === 'url'}
                    onChange={handleImageTypeChange}
                  />
                  Image URL
                </label>
              </div>
              {imageType === 'file' ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-slate-500 text-white px-4 py-1 rounded-lg hover:bg-slate-600 focus:outline-none shadow text-sm"
                  >
                    <FaUpload />
                    {form.image ? 'Change File' : 'Upload File'}
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  {form.image && (
                    <span className="text-xs text-gray-700 truncate max-w-xs">{form.image.name}</span>
                  )}
                  {form.image && (
                    <img
                      src={URL.createObjectURL(form.image)}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200 ml-2 shadow"
                    />
                  )}
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><FaImage /></span>
                  <input
                    type="text"
                    name="imageUrl"
                    value={form.imageUrl}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-10 py-2 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                  {form.imageUrl && (
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200 ml-2 mt-1 shadow"
                    />
                  )}
                </div>
              )}
            </div>
            {error && <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-1 rounded-lg font-semibold text-center animate-pulse text-sm">{error}</div>}
            {success && <div className="bg-green-100 border border-green-300 text-green-700 px-3 py-1 rounded-lg font-semibold text-center animate-fade-in text-sm">{success}</div>}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-slate-700 to-slate-500 text-white px-4 py-2 rounded-lg hover:from-slate-800 hover:to-slate-600 shadow-lg font-bold text-base transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Product'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow font-bold text-base transition disabled:opacity-50"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductDetail; 