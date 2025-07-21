import React, { useRef } from 'react';
import { FaUpload, FaTag, FaList, FaDollarSign, FaAlignLeft, FaImage, FaTimes } from 'react-icons/fa';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
}

const initialForm = {
  name: '',
  category: '',
  price: '',
  status: 'Active',
  image: null as File | null,
  imageUrl: '',
  description: '',
  imageType: 'file' as 'file' | 'url',
  quantity: '',
};

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = React.useState(initialForm);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, image: e.target.files[0] });
    }
  };

  const handleImageTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, imageType: e.target.value as 'file' | 'url', image: null, imageUrl: '' });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('pricePerDay', form.price); 
      formData.append('status', form.status);
      formData.append('description', form.description);
      formData.append('quantity', form.quantity);

      if (form.imageType === 'file' && form.image) {
        formData.append('image', form.image);
      }
      if (form.imageType === 'url' && form.imageUrl) {
        formData.append('imageUrl', form.imageUrl);
      }

      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      const data = await res.json();
      if (res.ok) {
        onSave(data); 
        setForm(initialForm);
        onClose();
      } else {
        alert(data.message || 'Failed to add product.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-40">
      <div className="w-full max-w-2xl bg-[var(--secondary-bg)] rounded-2xl shadow-2xl p-6 border border-[var(--border-color)] relative max-h-[90vh] overflow-y-auto">
        {/* X Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-xl focus:outline-none"
          aria-label="Close"
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-1 text-center tracking-tight">Add New Product</h2>
        <p className="text-[var(--text-secondary)] mb-4 text-center text-sm">Fill in the details below to add a new product to your catalog.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block font-semibold mb-1 text-slate-700">Name<span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><FaTag /></span>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-lg px-10 py-2 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition text-sm"
                placeholder="Product name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          </div>
          {/* Category */}
          <div>
            <label className="block font-semibold mb-1 text-slate-700">Category<span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><FaList /></span>
              <select
                className="w-full border border-slate-200 rounded-lg px-10 py-2 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition text-sm appearance-none"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                required
                style={{ paddingLeft: '2.5rem' }}
              >
                <option value="">Select category</option>
                <option value="Camera">Camera</option>
                <option value="Lens">Lens</option>
                <option value="Lighting">Lighting</option>
                <option value="Accessories">Accessories</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          {/* Price */}
          <div>
            <label className="block font-semibold mb-1 text-slate-700">Price ($)<span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><FaDollarSign /></span>
              <input
                type="number"
                className="w-full border border-slate-200 rounded-lg px-10 py-2 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition text-sm"
                placeholder="0.00"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          {/* Status */}
          <div>
            <label className="block font-semibold mb-1 text-slate-700">Status</label>
            <select
              className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition text-sm"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
          {/* Quantity */}
          <div>
            <label className="block font-semibold mb-1 text-slate-700">Quantity<span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                type="number"
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition text-sm"
                placeholder="Quantity"
                value={form.quantity || ''}
                onChange={e => setForm({ ...form, quantity: e.target.value })}
                required
                min="1"
              />
            </div>
          </div>
        </div>
        {/* Description (full row) */}
        <div className="mt-4">
          <label className="block font-semibold mb-1 text-slate-700">Description</label>
          <div className="relative">
            <span className="absolute left-3 top-4 text-slate-400"><FaAlignLeft /></span>
            <textarea
              className="w-full border border-slate-200 rounded-lg px-10 py-2 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition text-sm"
              placeholder="Product description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={2}
            />
          </div>
        </div>
        {/* Image and Buttons */}
        <div className="mt-4">
          <label className="block font-semibold mb-1 text-slate-700">Image</label>
          <div className="flex items-center gap-4 mb-1">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="imageType"
                value="file"
                checked={form.imageType === 'file'}
                onChange={handleImageTypeChange}
              />
              <FaUpload />
              Upload File
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="imageType"
                value="url"
                checked={form.imageType === 'url'}
                onChange={handleImageTypeChange}
              />
              <FaImage />
              Image URL
            </label>
          </div>
          {form.imageType === 'file' ? (
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
                onChange={handleImageChange}
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
                onChange={e => setForm({ ...form, imageUrl: e.target.value })}
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
        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded font-semibold">Cancel</button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-500 text-white rounded-lg font-bold shadow"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
