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
  try {
    const { error } = await withTimeout(
      supabase.from('products').delete().eq('id', id),
      15000,
      'deleteProduct'
    );
    if (error) throw error;
    return true;
  } catch (err) {
    console.error(`UNEXPECTED DELETE ${id} ERROR:`, err);
    throw err;
  }
}