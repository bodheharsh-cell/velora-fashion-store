import { supabase } from './supabase';

// ─── Config ───────────────────────────────────────────────────────────────────
export const BUCKET_NAME = 'product-images';
export const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

// ─── Validation ───────────────────────────────────────────────────────────────
export function validateImageFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPG, PNG, WebP, or AVIF images are allowed.' };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: 'Image must be under 5 MB.' };
  }
  return { valid: true, error: null };
}

// ─── Upload ───────────────────────────────────────────────────────────────────
/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * @param {File} file
 * @returns {Promise<string>} publicUrl
 */
export async function uploadProductImage(file) {
  const validation = validateImageFile(file);
  if (!validation.valid) throw new Error(validation.error);

  // Generate a unique, collision-safe filename
  const ext = file.name.split('.').pop().toLowerCase();
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const filename = `products/${timestamp}-${random}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) throw new Error(uploadError.message);

  // Get permanent public URL
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename);
  if (!data?.publicUrl) throw new Error('Could not retrieve public URL after upload.');

  return data.publicUrl;
}

// ─── Delete ───────────────────────────────────────────────────────────────────
/**
 * Attempts to delete an old product image from storage by its public URL.
 * Fails silently — a broken delete should never block a product save.
 * @param {string} publicUrl
 */
export async function deleteProductImage(publicUrl) {
  try {
    if (!publicUrl) return;

    // Extract path after /object/public/<bucket>/
    const marker = `/object/public/${BUCKET_NAME}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return; // Not a Supabase storage URL — skip

    const storagePath = decodeURIComponent(publicUrl.slice(idx + marker.length));
    await supabase.storage.from(BUCKET_NAME).remove([storagePath]);
  } catch {
    // Intentionally silent — old image cleanup is best-effort
  }
}
