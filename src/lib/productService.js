import { supabase } from './supabase';

const withTimeout = (promise, timeoutMs = 15000, operationName = 'Database query') => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${operationName} timed out after ${timeoutMs}ms. Check your connection.`)), timeoutMs)
    ),
  ]);
};

export async function getProducts() {
  try {
    const { data, error } = await withTimeout(
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      15000,
      'getProducts'
    );
    if (error) {
      console.error('FULL SUPABASE PRODUCTS ERROR:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('UNEXPECTED PRODUCTS ERROR:', err);
    return [];
  }
}

export async function getProductById(id) {
  try {
    const { data, error } = await withTimeout(
      supabase.from('products').select('*').eq('id', id).single(),
      10000,
      `getProductById ${id}`
    );
    if (error) {
      console.error(`FULL PRODUCT ${id} ERROR:`, error);
      return null;
    }
    return data;
  } catch (err) {
    console.error(`UNEXPECTED PRODUCT ${id} ERROR:`, err);
    return null;
  }
}

export async function getFeaturedProducts(limit = 4) {
  try {
    const { data, error } = await withTimeout(
      supabase.from('products').select('*').eq('featured', true).limit(limit),
      10000,
      'getFeaturedProducts'
    );
    if (error) {
      console.error('FULL FEATURED PRODUCTS ERROR:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('UNEXPECTED FEATURED PRODUCTS ERROR:', err);
    return [];
  }
}

export async function createProduct(productData) {
  try {
    const { data, error } = await withTimeout(
      supabase.from('products').insert([productData]).select().single(),
      15000,
      'createProduct'
    );
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('UNEXPECTED CREATE ERROR:', err);
    throw err;
  }
}

export async function updateProduct(id, productData) {
  try {
    const { data, error } = await withTimeout(
      supabase.from('products').update(productData).eq('id', id).select().single(),
      15000,
      'updateProduct'
    );
    if (error) throw error;
    return data;
  } catch (err) {
    console.error(`UNEXPECTED UPDATE ${id} ERROR:`, err);
    throw err;
  }
}

export async function deleteProduct(id) {
  // Coerce id to a number — products table uses serial (integer) PK.
  // Passing a string id to .eq() can silently match nothing in some Supabase versions.
  const numericId = Number(id);

  console.log('[deleteProduct] Starting delete for id:', numericId, '(original:', id, 'type:', typeof id, ')');

  try {
    // IMPORTANT: use .select() so Supabase returns the deleted row.
    // Without .select(), Supabase returns { data: [], error: null } even when
    // RLS blocks the delete — making it impossible to detect a silent no-op.
    const { data, error } = await withTimeout(
      supabase.from('products').delete().eq('id', numericId).select('id'),
      15000,
      'deleteProduct'
    );

    console.log('[deleteProduct] Raw Supabase response — data:', data, 'error:', error);

    if (error) {
      console.error('[deleteProduct] Supabase returned error:', JSON.stringify(error, null, 2));
      throw error;
    }

    // data is an array of deleted rows. If empty, the row wasn't found or RLS blocked it.
    if (!data || data.length === 0) {
      console.warn('[deleteProduct] Delete silently matched 0 rows. Either the product does not exist or RLS blocked the operation. id:', numericId);
      throw new Error(`Delete matched 0 rows for id ${numericId}. Check RLS policies and confirm the product exists.`);
    }

    console.log('[deleteProduct] Successfully deleted rows:', data);
    return true;
  } catch (err) {
    console.error(`[deleteProduct] FAILED for id ${numericId}:`, err.message, err);
    throw err;
  }
}

/**
 * Decrement stock for multiple cart items after a successful order.
 * Calls the `decrement_product_stock` security-definer RPC so it works for
 * authenticated customers AND guests — bypasses the admin-only RLS update policy.
 * GREATEST(0, stock - qty) is enforced inside the DB function, never goes negative.
 * Fails gracefully — a stock decrement failure must never block order confirmation UX.
 *
 * @param {Array<{id: number|string, quantity: number}>} items
 */
export async function decrementStockForOrder(items) {
  if (!items || items.length === 0) return;

  const decrementPromises = items.map(async (item) => {
    try {
      const { error } = await supabase.rpc('decrement_product_stock', {
        product_id: Number(item.id),
        qty: Number(item.quantity),
      });
      if (error) {
        console.warn(`RPC stock decrement failed for product ${item.id}:`, error);
      }
    } catch (err) {
      // Intentionally silent — stock sync failure must never break checkout UX
      console.warn(`Stock decrement error for product ${item.id}:`, err);
    }
  });

  await Promise.allSettled(decrementPromises);
}

/**
 * Validates stock for all items in a cart against live DB values.
 * Returns { valid: true } or { valid: false, blockedItems: [...] }
 *
 * @param {Array<{id: number|string, quantity: number, name: string}>} cartItems
 */
export async function validateCartStock(cartItems) {
  try {
    const ids = cartItems.map((i) => i.id);
    const { data: products, error } = await supabase
      .from('products')
      .select('id, stock, name')
      .in('id', ids);

    if (error) throw error;

    const stockMap = {};
    (products || []).forEach((p) => { stockMap[p.id] = p.stock; });

    const blockedItems = cartItems.filter((item) => {
      const available = stockMap[item.id] ?? 0;
      return available < item.quantity;
    });

    return { valid: blockedItems.length === 0, blockedItems };
  } catch (err) {
    console.error('validateCartStock error:', err);
    // On error, allow checkout rather than silently blocking the customer
    return { valid: true, blockedItems: [] };
  }
}