import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="group cursor-pointer block">
      <div className="relative aspect-[3/4] bg-white overflow-hidden mb-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
          <button className="w-full bg-black text-white py-3 text-sm font-semibold tracking-widest uppercase hover:bg-gray-900 transition-colors">
            View Details
          </button>
        </div>
      </div>
      <h3 className="text-sm font-semibold tracking-wide uppercase mb-1 text-black">{product.name}</h3>
      <p className="text-gray-500 font-light">${product.price}</p>
    </Link>
  );
}

export default ProductCard;
