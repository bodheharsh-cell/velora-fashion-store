import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createProduct, updateProduct } from '../../lib/productService';
import toast from 'react-hot-toast';

function ProductModal({ isOpen, onClose, product, onSave }) {
  const isEditing = !!product;
  
  const [formData, setFormData] = useState({
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
    colors: ''
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
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
        colors: product.colors ? product.colors.join(', ') : ''
      });
    } else if (isOpen && !product) {
      setFormData({
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
        colors: ''
      });
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        details: formData.details ? formData.details.split(',').map(s => s.trim()).filter(Boolean) : [],
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: formData.colors ? formData.colors.split(',').map(s => s.trim()).filter(Boolean) : []
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-sm">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex items-center justify-between z-10">
          <h2 className="text-xl font-light tracking-widest uppercase">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <X size={24} strokeWidth={1} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">Slug</label>
              <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors" />
            </div>
            
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">Price ($)</label>
              <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">Stock</label>
              <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors" />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors bg-transparent">
                <option value="Women">Women</option>
                <option value="Men">Men</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div className="flex items-center mt-8">
              <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 mr-3 accent-black" />
              <label htmlFor="featured" className="text-sm font-semibold tracking-widest uppercase text-gray-500 cursor-pointer">Featured Product</label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">Image URL</label>
            <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors" />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">Description</label>
            <textarea required rows="3" name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors resize-none"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">Sizes (comma separated)</label>
              <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} placeholder="e.g. S, M, L" className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">Colors (comma separated)</label>
              <input type="text" name="colors" value={formData.colors} onChange={handleChange} placeholder="e.g. Black, White" className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">Details (comma separated)</label>
            <input type="text" name="details" value={formData.details} onChange={handleChange} placeholder="e.g. 100% Cotton, Dry clean only" className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-black transition-colors" />
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-semibold tracking-widest uppercase border border-gray-300 text-gray-600 hover:border-black hover:text-black transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-8 py-3 text-sm font-semibold tracking-widest uppercase bg-black text-white hover:bg-gray-900 transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
