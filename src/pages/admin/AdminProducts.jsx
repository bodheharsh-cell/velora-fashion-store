import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { getProducts, deleteProduct } from '../../lib/productService';
import ProductModal from '../../components/admin/ProductModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Delete confirmation state
  const [pendingDeleteProduct, setPendingDeleteProduct] = useState(null); // product object to confirm
  const [deletingId, setDeletingId] = useState(null);                    // id currently being deleted

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Step 1: open confirmation modal — no window.confirm
  const requestDelete = (product) => {
    console.log('[requestDelete] Opening confirm modal for product:', product.id, product.name);
    setPendingDeleteProduct(product);
  };

  // Step 2: user clicked Cancel in modal
  const cancelDelete = () => {
    console.log('[cancelDelete] User cancelled deletion.');
    setPendingDeleteProduct(null);
  };

  // Step 3: user clicked Delete in modal — run the actual deletion
  const confirmDelete = async () => {
    if (!pendingDeleteProduct) return;

    const id = pendingDeleteProduct.id;
    console.log('[confirmDelete] Called with id:', id, '| type:', typeof id);

    const numericId = Number(id);
    console.log('[confirmDelete] Numeric id to delete:', numericId);

    setDeletingId(numericId);

    // Snapshot for rollback
    const previousProducts = [...products];
    console.log('[confirmDelete] Products before optimistic remove:', previousProducts.map(p => p.id));

    // Optimistic update
    setProducts(prev => {
      const filtered = prev.filter(p => Number(p.id) !== numericId);
      console.log('[confirmDelete] After optimistic filter, remaining ids:', filtered.map(p => p.id));
      return filtered;
    });

    // Close modal immediately — the spinner on the delete button is inside the modal
    // Keep modal open while isDeleting so the spinner shows, then close on finish
    try {
      console.log('[confirmDelete] Calling deleteProduct(', numericId, ')...');
      await deleteProduct(numericId);
      console.log('[confirmDelete] deleteProduct resolved successfully for id:', numericId);
      toast.success('Product deleted successfully');
      setPendingDeleteProduct(null); // close modal on success
    } catch (error) {
      console.error('[confirmDelete] deleteProduct threw:', error.message);
      console.log('[confirmDelete] Rolling back to previous products list.');
      setProducts(previousProducts); // rollback
      toast.error(
        error.message?.includes('0 rows')
          ? 'Delete blocked: RLS policy prevented removal. Check Supabase policies.'
          : error.message?.includes('policy')
          ? 'Permission denied — ensure your account has admin role in Supabase.'
          : `Delete failed: ${error.message || 'Unknown error'}`
      );
      setPendingDeleteProduct(null); // close modal even on error
    } finally {
      setDeletingId(null);
      console.log('[confirmDelete] Done. deletingId cleared.');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-lg sm:text-2xl font-light tracking-tight uppercase">Products</h1>
        <button
          type="button"
          onClick={handleAddProduct}
          className="flex items-center space-x-2 bg-black text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-gray-900 transition-colors"
        >
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 outline-none focus:border-black transition-colors rounded-sm"
            />
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            {filteredProducts.length} Products
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold tracking-widest uppercase text-gray-500">
              <tr>
                <th className="px-3 sm:px-6 py-4">Product</th>
                <th className="px-3 sm:px-6 py-4">Category</th>
                <th className="px-3 sm:px-6 py-4">Price</th>
                <th className="px-3 sm:px-6 py-4">Stock</th>
                <th className="px-3 sm:px-6 py-4">Status</th>
                <th className="px-3 sm:px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                          <img
                            src={product.image || 'https://via.placeholder.com/40'}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate max-w-[90px] sm:max-w-none">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-400 truncate max-w-[90px] sm:max-w-none">
                            {product.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-gray-500">{product.category}</td>
                    <td className="px-3 sm:px-6 py-4 text-gray-900">{formatPrice(product.price)}</td>
                    <td className="px-3 sm:px-6 py-4">
                      {product.stock > 10 ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          In Stock · {product.stock}
                        </span>
                      ) : product.stock > 0 ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
                          Low · {product.stock} left
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      {product.featured && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditProduct(product)}
                          disabled={deletingId === product.id}
                          className="text-gray-400 hover:text-black transition-colors disabled:opacity-40 p-1"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            console.log('DELETE BUTTON CLICKED', product.id);
                            requestDelete(product);
                          }}
                          disabled={deletingId === product.id}
                          className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40 p-1"
                          title="Delete"
                        >
                          {deletingId === product.id ? (
                            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product add/edit modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSave={fetchProducts}
      />

      {/* Delete confirmation modal — replaces window.confirm */}
      <DeleteConfirmModal
        isOpen={!!pendingDeleteProduct}
        productName={pendingDeleteProduct?.name}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isDeleting={deletingId !== null}
      />
    </div>
  );
}

export default AdminProducts;
