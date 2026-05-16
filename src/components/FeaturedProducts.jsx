import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

import { products } from '../data/products';

const featuredProducts = products.slice(0, 4);

function FeaturedProducts() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter uppercase mb-2">Featured Products</h2>
            <p className="text-gray-500 font-light">Curated pieces for the season</p>
          </div>
          <Link to="/shop" className="hidden sm:block text-sm font-semibold tracking-widest uppercase hover:text-gray-500 transition-colors border-b border-black pb-1">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
