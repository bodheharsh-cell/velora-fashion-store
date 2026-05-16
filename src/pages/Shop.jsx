import ProductCard from '../components/ProductCard';

import { products } from '../data/products';

const categories = ['All', 'Women', 'Men', 'Accessories'];

function Shop() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <h2 className="text-sm font-semibold tracking-widest uppercase mb-8 pb-4 border-b border-gray-200">Filters</h2>
            
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
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-light tracking-tight uppercase">Shop</h1>
              <span className="text-sm text-gray-500">{products.length} Products</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination / Load More */}
            <div className="mt-20 flex justify-center border-t border-gray-100 pt-16">
              <button className="border border-black px-12 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-colors">
                Load More
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Shop;
