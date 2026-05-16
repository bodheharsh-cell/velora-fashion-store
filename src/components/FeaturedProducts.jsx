import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '../lib/productService';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getFeaturedProducts(4);
        console.log('FEATURED:', data);
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading...
      </div>
    );
  }

  return (
    <section className="px-6 md:px-16 py-20">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-light uppercase">
            Featured Products
          </h2>
          <p className="text-gray-500 mt-2">
            Curated pieces for the season
          </p>
        </div>

        <Link
          to="/shop"
          className="uppercase border-b border-black pb-1 text-sm tracking-widest"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group"
          >
            <div className="aspect-[3/4] overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>

            <div className="mt-4">
              <h3 className="uppercase text-sm tracking-wide">
                {product.name}
              </h3>

              <p className="mt-1 text-gray-500">
                ₹{product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;