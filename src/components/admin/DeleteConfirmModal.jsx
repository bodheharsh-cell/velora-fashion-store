import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * DeleteConfirmModal
 * A styled React confirmation dialog — replaces window.confirm().
 *
 * Props:
 *   isOpen     {boolean}  — controls visibility
 *   productName {string}  — shown in the body copy
 *   onConfirm  {fn}       — called when Delete button is clicked
 *   onCancel   {fn}       — called when Cancel or backdrop is clicked
 *   isDeleting {boolean}  — shows spinner on Delete button, disables both buttons
 */
function DeleteConfirmModal({ isOpen, productName, onConfirm, onCancel, isDeleting }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape' && !isDeleting) onCancel();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!isDeleting ? onCancel : undefined}
      />

      {/* Dialog */}
      <div className="relative bg-white w-full max-w-md shadow-2xl rounded-sm animate-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900">
              Delete Product
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="text-gray-400 hover:text-black transition-colors disabled:opacity-40"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            Are you sure you want to delete{' '}
            {productName ? (
              <span className="font-semibold text-gray-900">"{productName}"</span>
            ) : (
              'this product'
            )}
            ?
          </p>
          <p className="text-xs text-gray-400 mt-2">
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-6 py-2.5 text-sm font-semibold tracking-widest uppercase border border-gray-300 text-gray-600 hover:border-black hover:text-black transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2.5 text-sm font-semibold tracking-widest uppercase bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting…
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
