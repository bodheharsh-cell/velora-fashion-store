import { useState, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';

import { getProducts } from '../lib/productService';

const categories = ['All', 'Women', 'Men', 'Accessories'];

function Shop() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            
            {/* Mobile Filter Toggle */}
            <button 
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="md:hidden w-full flex items-center justify-between border-b border-gray-200 pb-4 mb-4"
            >
              <div className="flex items-center text-sm font-semibold tracking-widest uppercase">
                <Filter size={18} className="mr-3" /> Filters
              </div>
              <ChevronDown size={20} className={`transform transition-transform ${isMobileFiltersOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Desktop Header */}
            <h2 className="hidden md:block text-sm font-semibold tracking-widest uppercase mb-8 pb-4 border-b border-gray-200">Filters</h2>
            
            {/* Filter Content (Collapsible on Mobile) */}
            <div className={`grid transition-all duration-300 ease-in-out ${isMobileFiltersOpen ? 'grid-rows-[1fr] opacity-100 mb-8' : 'grid-rows-[0fr] opacity-0 md:grid-rows-[1fr] md:opacity-100'}`}>
              <div className="overflow-hidden">
                <div className="pt-2 md:pt-0">
                  <div className="mb-8">
                    <h3 className="text-sm tracking-wide uppercase text-gray-500 mb-4">Category</h3>
                    <ul className="space-y-3">
                      {categories.map((cat, i) => (
                        <li key={i}>
                          <button className={`text-sm tracking-wide ${i === 0 ? 'text-black font-semibold' : 'text-gray-500 hover:text-black transition-colors'}`}>
                            {cat}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-sm tracking-wide uppercase text-gray-500 mb-4">Sort By</h3>
                    <ul className="space-y-3">
                      <li><button className="text-sm tracking-wide text-black font-semibold">Featured</button></li>
                      <li><button className="text-sm tracking-wide text-gray-500 hover:text-black transition-colors">Price: Low to High</button></li>
                      <li><button className="text-sm tracking-wide text-gray-500 hover:text-black transition-colors">Price: High to Low</button></li>
                      <li><button className="text-sm tracking-wide text-gray-500 hover:text-black transition-colors">Newest Arrivals</button></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-light tracking-tight uppercase">Shop</h1>
              <span className="text-sm text-gray-500">{products.length} Products</span>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-32">{error}</div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-500 py-32">No products found.</div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination / Load More */}
            {!loading && products.length > 0 && (
              <div className="mt-20 flex justify-center border-t border-gray-100 pt-16">
                <button className="border border-black px-12 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-colors">
                  Load More
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Shop;
