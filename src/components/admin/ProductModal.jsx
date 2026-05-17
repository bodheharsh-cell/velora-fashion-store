import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { createProduct, updateProduct } from '../../lib/productService';
import ImageUploader from './ImageUploader';
import toast from 'react-hot-toast';

function ProductModal({ isOpen, onClose, product, onSave }) {
  const isEditing = !!product;

  const emptyForm = {
    name: '',
    slug: '',
    price: '',
    image: '',
    category: 'Women',
    description: '',
    stock: 0,
    featured: false,
    details: '',
    sizes: '',
    colors: '',
  };

  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Track the key for ImageUploader so we can remount it on modal open
  const uploaderKey = useRef(0);

  useEffect(() => {
    if (!isOpen) return;
    uploaderKey.current += 1; // remount uploader on each open

    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug || '',
        price: product.price || '',
        image: product.image || '',
        category: product.category || 'Women',
        description: product.description || '',
        stock: product.stock || 0,
        featured: product.featured || false,
        details: product.details ? product.details.join(', ') : '',
        sizes: product.sizes ? product.sizes.join(', ') : '',
        colors: product.colors ? product.colors.join(', ') : '',
      });
    } else {
      setFormData(emptyForm);
    }
  }, [isOpen, product]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Called by ImageUploader with the final public URL (or '' to clear)
  const handleImageUploaded = (url) => {
    setFormData((prev) => ({ ...prev, image: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploading) {
      toast.error('Please wait for the image upload to finish.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        price: parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        description: formData.description,
        stock: parseInt(formData.stock, 10),
        featured: formData.featured,
        details: formData.details
          ? formData.details.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        sizes: formData.sizes
          ? formData.sizes.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        colors: formData.colors
          ? formData.colors.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (isEditing) {
        await updateProduct(product.id, payload);
        toast.success('Product updated successfully');
      } else {
        await createProduct(payload);
        toast.success('Product created successfully');
      }

      onSave();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const isBusy = loading || uploading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl rounded-sm">
        {/* ── Header ── */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between z-10">
          <h2 className="text-lg sm:text-xl font-light tracking-widest uppercase">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors"
            disabled={isBusy}
          >
            <X size={24} strokeWidth={1} />
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-6">

          {/* Row 1: Name + Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
                Name
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors rounded-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
                Slug
              </label>
              <input
                required
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors rounded-sm"
              />
            </div>
          </div>

          {/* Row 2: Price + Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
                Price (₹)
              </label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors rounded-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
                Stock
              </label>
              <input
                required
                type="number"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors rounded-sm"
              />
            </div>
          </div>

          {/* Row 3: Category + Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors bg-transparent rounded-sm"
              >
                <option value="Women">Women</option>
                <option value="Men">Men</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pb-1">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-4 h-4 accent-black flex-shrink-0"
              />
              <label
                htmlFor="featured"
                className="text-sm font-semibold tracking-widest uppercase text-gray-500 cursor-pointer"
              >
                Featured Product
              </label>
            </div>
          </div>

          {/* ── Image Upload ── */}
          <ImageUploader
            key={uploaderKey.current}
            currentImage={formData.image}
            onUploadComplete={handleImageUploaded}
            onUploadingChange={setUploading}
            disabled={loading}
          />

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
              Description
            </label>
            <textarea
              required
              rows="3"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors resize-none rounded-sm"
            />
          </div>

          {/* Sizes + Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
                Sizes (comma separated)
              </label>
              <input
                type="text"
                name="sizes"
                value={formData.sizes}
                onChange={handleChange}
                placeholder="e.g. S, M, L, XL"
                className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors rounded-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
                Colors (comma separated)
              </label>
              <input
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleChange}
                placeholder="e.g. Black, White, Beige"
                className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors rounded-sm"
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
              Details (comma separated)
            </label>
            <input
              type="text"
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="e.g. 100% Cotton, Machine washable"
              className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors rounded-sm"
            />
          </div>

          {/* ── Footer ── */}
          <div className="pt-6 border-t border-gray-100 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isBusy}
              className="px-6 py-3 text-sm font-semibold tracking-widest uppercase border border-gray-300 text-gray-600 hover:border-black hover:text-black transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="px-8 py-3 text-sm font-semibold tracking-widest uppercase bg-black text-white hover:bg-gray-900 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : uploading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading…
                </>
              ) : (
                'Save Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
