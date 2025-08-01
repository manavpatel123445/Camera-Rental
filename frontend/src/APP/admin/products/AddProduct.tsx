import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaUpload, FaTag, FaList, FaDollarSign, FaAlignLeft, FaImage } from 'react-icons/fa';
import AdminLayout from '../components/AdminLayout';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import ProductShowcase from '../../../components/3D/ProductShowcase';
interface ProductForm {
  name: string;
  category: string;
  pricePerDay: string;
  description: string;
  image: File | null;
  imageUrl: string;
  quantity: string;
  splineUrl: string;
}

const AddProduct = () => {
  const [form, setForm] = useState<ProductForm>({
    name: '',
    category: '',
    pricePerDay: '',
    description: '',
    image: null,
    imageUrl: '',
    quantity: '1',
    splineUrl: '',
  });
  const [imageType, setImageType] = useState<'file' | 'url'>('file');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent) => {
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
       // For testing, let's try JSON first
       const productData = {
         name: form.name,
         category: form.category,
         pricePerDay: form.pricePerDay,
         description: form.description,
         quantity: form.quantity,
         imageUrl: imageType === 'url' ? form.imageUrl : undefined,
         splineUrl: form.splineUrl
       };
       
       console.log('Sending product data:', productData);

             const token = localStorage.getItem('adminToken');
       console.log('Token found:', token ? 'Yes' : 'No');
       console.log('Token value:', token);
       if (!token) {
         setError('No authentication token found. Please log in again.');
         setLoading(false);
         return;
       }
       
       // Test token first
       try {
         const testResponse = await fetch('https://camera-rental-ndr0.onrender.com/api/admin/profile', {
           headers: { Authorization: `Bearer ${token}` },
           credentials: 'include',
         });
         console.log('Token test response:', testResponse.status);
         if (testResponse.status === 401) {
           setError('Token is invalid. Please log in again.');
           setLoading(false);
           return;
         }
       } catch (err) {
         console.error('Token test error:', err);
       }
      const res = await fetch('https://camera-rental-ndr0.onrender.com/api/products', {
        method: 'POST',
         body: JSON.stringify(productData),
         headers: { 
           Authorization: `Bearer ${token}`,
           'Content-Type': 'application/json',
         },
      });
      const data = await res.json();
       console.log('Response status:', res.status);
       console.log('Response data:', data);
      if (res.ok) {
        setSuccess('Product added successfully!');
        toast.success('Product added successfully!');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
        return;
      } else {
        setError(data.message || 'Failed to add product.');
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

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
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-center">Add New Product</CardTitle>
            <CardDescription className="text-center">
              Fill in the details below to add a new product to your catalog.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-sm">Name<span className="text-red-500">*</span></label>
                  <Input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Product name"
                    leftIcon={<FaTag className="w-4 h-4" />}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-sm">Category<span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10"><FaList /></span>
                    <select
                      name="category"
                       value={form.category || ''}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-lg px-10 py-2 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition text-sm appearance-none bg-white"
                      required
                    >
                       <option value="">Select category</option>
                      {categoryOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-sm">Price Per Day ($)<span className="text-red-500">*</span></label>
                  <Input
                    type="number"
                    name="pricePerDay"
                    value={form.pricePerDay}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    leftIcon={<FaDollarSign className="w-4 h-4" />}
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-semibold mb-2 text-sm">Description</label>
                <div className="relative">
                  <span className="absolute left-3 top-4 text-slate-400"><FaAlignLeft /></span>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-10 py-2 focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition text-sm"
                    rows={3}
                    placeholder="Product description (optional)"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-2 text-sm">Quantity<span className="text-red-500">*</span></label>
                  <Input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                    min="1"
                    step="1"
                    placeholder="Quantity"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-sm">3D Model URL (Spline)</label>
                  <Input
                    type="text"
                    name="splineUrl"
                    value={form.splineUrl}
                    onChange={handleChange}
                    placeholder="https://spline.design/your-3d-model"
                    leftIcon={<FaImage className="w-4 h-4" />}
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-semibold mb-2 text-sm">Image</label>
                <div className="flex items-center gap-4 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="imageType"
                      value="file"
                      checked={imageType === 'file'}
                      onChange={handleImageTypeChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Upload File</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="imageType"
                      value="url"
                      checked={imageType === 'url'}
                      onChange={handleImageTypeChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Image URL</span>
                  </label>
                </div>
                {imageType === 'file' ? (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <FaUpload className="w-4 h-4" />
                      {form.image ? 'Change File' : 'Upload File'}
                    </Button>
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
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200 shadow"
                      />
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <Input
                      type="text"
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                      leftIcon={<FaImage className="w-4 h-4" />}
                    />
                    {form.imageUrl && (
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200 mt-2 shadow"
                      />
                    )}
                  </div>
                )}
              </div>
              
              {/* 3D Model Preview */}
              {(form.splineUrl || form.imageUrl) && (
                <div>
                  <label className="block font-semibold mb-2 text-sm">Preview</label>
                  <ProductShowcase
                    splineUrl={form.splineUrl}
                    fallbackImage={form.imageUrl}
                    productName={form.name}
                    className="w-full"
                  />
                </div>
              )}
                          {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  {success}
                </div>
              )}
              
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                loading={loading}
                className="w-full"
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AddProduct; 