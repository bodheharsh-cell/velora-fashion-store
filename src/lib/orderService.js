import { supabase } from './supabase';

const withTimeout = (promise, timeoutMs = 15000, operationName = 'Database query') => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${operationName} timed out after ${timeoutMs}ms. Check your connection.`)), timeoutMs)
    ),
  ]);
};

/**
 * Create a new order
 */
export async function createOrder(orderData) {
  try {
    const { data, error } = await withTimeout(
      supabase.from('orders').insert([orderData]).select().single(),
      15000,
      'createOrder'
    );
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('UNEXPECTED CREATE ORDER ERROR:', err);
    return { data: null, error: err };
  }
}

/**
 * Fetch orders for a specific user
 */
export async function getUserOrders(userId) {
  if (!userId) return [];
  try {
    const { data, error } = await withTimeout(
      supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      15000,
      'getUserOrders'
    );
    if (error) {
      console.error('SUPABASE GET USER ORDERS ERROR:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('UNEXPECTED GET USER ORDERS ERROR:', err);
    return [];
  }
}

/**
 * Admin: Fetch all orders
 */
export async function getAllOrders() {
  try {
    const { data, error } = await withTimeout(
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      15000,
      'getAllOrders'
    );
    if (error) {
      console.error('SUPABASE GET ALL ORDERS ERROR:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('UNEXPECTED GET ALL ORDERS ERROR:', err);
    return [];
  }
}

/**
 * Admin: Update order status
 */
export async function updateOrderStatus(orderId, status) {
  try {
    const { data, error } = await withTimeout(
      supabase.from('orders').update({ status }).eq('id', orderId).select().single(),
      15000,
      'updateOrderStatus'
    );
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error(`UNEXPECTED UPDATE ORDER ${orderId} ERROR:`, err);
    return { data: null, error: err };
  }
}
