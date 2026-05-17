import { useState, useRef, useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw, CheckCircle2 } from 'lucide-react';
import { uploadProductImage, validateImageFile } from '../../lib/imageService';
import toast from 'react-hot-toast';

/**
 * ImageUploader
 * ─────────────────────────────────────────────────────────────
 * Props:
 *   currentImage  {string}   – existing image URL (for edit mode)
 *   onUploadComplete {fn}    – called with public URL after upload
 *   disabled     {boolean}   – disable interactions while parent is submitting
 */
function ImageUploader({ currentImage = '', onUploadComplete, onUploadingChange, disabled = false }) {
  const [previewUrl, setPreviewUrl] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Notify parent when uploading state changes
  const setUploadingWithNotify = (value) => {
    setUploading(value);
    onUploadingChange?.(value);
  };

  // Sync preview when parent changes currentImage (e.g. modal opens for a different product)
  const prevCurrentImageRef = useRef(currentImage);
  if (prevCurrentImageRef.current !== currentImage) {
    prevCurrentImageRef.current = currentImage;
    if (!uploading) setPreviewUrl(currentImage);
  }

  // ── Core upload handler ────────────────────────────────────
  const handleFile = useCallback(
    async (file) => {
      if (!file || disabled || uploading) return;

      // Client-side validation
      const { valid, error } = validateImageFile(file);
      if (!valid) {
        toast.error(error);
        return;
      }

      // Instant local preview for perceived speed
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
      setUploadingWithNotify(true);

      try {
        const publicUrl = await uploadProductImage(file);
        setPreviewUrl(publicUrl);
        onUploadComplete(publicUrl);
        toast.success('Image uploaded successfully');
        URL.revokeObjectURL(localUrl);
      } catch (err) {
        // Revert to previous image on failure
        setPreviewUrl(currentImage);
        toast.error(err.message || 'Upload failed — please try again');
      } finally {
        setUploadingWithNotify(false);
        // Reset file input so same file can be re-selected after an error
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [disabled, uploading, currentImage, onUploadComplete]
  );

  // ── Drag-and-drop ─────────────────────────────────────────
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!disabled && !uploading) setDragOver(true);
  }, [disabled, uploading]);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  // ── File input ─────────────────────────────────────────────
  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const openFilePicker = useCallback(() => {
    if (!disabled && !uploading) fileInputRef.current?.click();
  }, [disabled, uploading]);

  const clearImage = useCallback(
    (e) => {
      e.stopPropagation();
      setPreviewUrl('');
      onUploadComplete('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [onUploadComplete]
  );

  // ── Render ────────────────────────────────────────────────
  const isInteractive = !disabled && !uploading;
  const hasImage = !!previewUrl;

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">
        Product Image
      </label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={handleInputChange}
        disabled={!isInteractive}
      />

      {/* Drop / Preview zone */}
      <div
        onClick={openFilePicker}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative w-full rounded-sm border-2 transition-all duration-200 select-none
          ${hasImage ? 'border-gray-200 bg-gray-50' : 'border-dashed border-gray-300 bg-gray-50'}
          ${dragOver ? 'border-black bg-gray-100 scale-[1.01]' : ''}
          ${isInteractive ? 'cursor-pointer hover:border-gray-500 hover:bg-gray-100' : 'cursor-default opacity-75'}
        `}
        style={{ minHeight: hasImage ? '220px' : '160px' }}
      >
        {/* ── With image ── */}
        {hasImage && (
          <>
            <img
              src={previewUrl}
              alt="Product preview"
              className="w-full h-full object-contain rounded-sm"
              style={{ maxHeight: '280px', minHeight: '160px' }}
              onError={() => setPreviewUrl('')}
            />

            {/* Overlay controls */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors rounded-sm flex items-center justify-center gap-3 group">
              {!uploading && isInteractive && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); openFilePicker(); }}
                    className="bg-white text-black text-xs font-semibold tracking-widest uppercase px-3 py-2 rounded-sm flex items-center gap-1.5 shadow hover:bg-gray-100 transition-colors"
                  >
                    <RefreshCw size={12} /> Replace
                  </button>
                  <button
                    type="button"
                    onClick={clearImage}
                    className="bg-white text-red-600 text-xs font-semibold tracking-widest uppercase px-3 py-2 rounded-sm flex items-center gap-1.5 shadow hover:bg-red-50 transition-colors"
                  >
                    <X size={12} /> Remove
                  </button>
                </div>
              )}
            </div>

            {/* Upload progress spinner over image */}
            {uploading && (
              <div className="absolute inset-0 bg-white/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3 rounded-sm">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-600">
                  Uploading…
                </p>
              </div>
            )}
          </>
        )}

        {/* ── No image: empty state ── */}
        {!hasImage && !uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className={`p-3 rounded-full transition-colors ${dragOver ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
              <UploadCloud size={22} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {dragOver ? 'Drop image here' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP or AVIF · Max 5 MB</p>
            </div>
          </div>
        )}

        {/* ── No image: loading state ── */}
        {!hasImage && uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-600">Uploading…</p>
          </div>
        )}
      </div>

      {/* Success indicator strip below zone */}
      {hasImage && !uploading && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600">
          <CheckCircle2 size={12} />
          <span>Image ready</span>
        </div>
      )}

      {/* Fallback URL input (advanced — visible only when no file uploaded) */}
      {!hasImage && !uploading && (
        <div className="mt-3">
          <p className="text-xs text-gray-400 mb-1.5">Or paste an external URL:</p>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            className="w-full border border-gray-200 p-2.5 text-sm outline-none focus:border-gray-400 transition-colors rounded-sm text-gray-600 placeholder:text-gray-300"
            onChange={(e) => {
              const val = e.target.value.trim();
              if (val) {
                setPreviewUrl(val);
                onUploadComplete(val);
              }
            }}
            disabled={!isInteractive}
          />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
