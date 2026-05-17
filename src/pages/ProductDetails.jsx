import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Heart, Star, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/formatPrice';
import { getProductById, getProducts } from '../lib/productService';

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState('details');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const [p, allProducts] = await Promise.all([
          getProductById(id),
          getProducts()
        ]);
        
        setProduct(p);
        
        if (p) {
          setSelectedSize(p.sizes?.[0] || '');
          setSelectedColor(p.colors?.[0] || '');
          setQuantity(1);
          window.scrollTo(0, 0);
          
          const related = allProducts.filter(item => item.id !== p.id).slice(0, 4);
          setRelatedProducts(related);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-32 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-light mb-4">{error || 'Product not found.'}</h1>
        <Link to="/shop" className="text-sm font-semibold tracking-widest uppercase hover:underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-16 md:mb-24">
          
          {/* Image Gallery */}
          <div className="flex flex-col space-y-4">
            <div className="aspect-[3/4] bg-gray-50 overflow-hidden w-full">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center" />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-light tracking-tight uppercase mb-4">{product.name}</h1>
            <p className="text-xl text-gray-900 mb-6">{formatPrice(product.price)}</p>
            
            <div className="flex items-center mb-8">
              <div className="flex text-black">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500 underline underline-offset-4 cursor-pointer">{product.reviews || 0} Reviews</span>
            </div>

            <p className="text-gray-600 font-light leading-relaxed mb-10">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold tracking-widest uppercase">Color</span>
                  <span className="text-sm text-gray-500">{selectedColor}</span>
                </div>
                <div className="flex space-x-3">
                  {product.colors.map(color => (
                    <button 
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-2 text-sm tracking-wide border transition-colors ${selectedColor === color ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-black'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-semibold tracking-widest uppercase">Size</span>
                  <Link to="#" className="text-sm text-gray-500 underline underline-offset-4">Size Guide</Link>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 flex items-center justify-center text-sm tracking-wide border transition-colors ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-200 text-gray-600 hover:border-black'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold tracking-widest uppercase">Quantity</span>
                {product.stock > 0 && product.stock <= 10 && (
                  <span className="text-xs font-medium text-orange-600 tracking-wide">
                    Only {product.stock} left
                  </span>
                )}
              </div>
              <div className={`flex items-center border w-32 h-14 ${
                product.stock <= 0 ? 'border-gray-200 opacity-40 pointer-events-none' : 'border-gray-300'
              }`}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={product.stock <= 0}
                  className="flex-1 flex justify-center text-gray-500 hover:text-black disabled:cursor-not-allowed"
                >
                  <Minus size={16} />
                </button>
                <span className="text-base font-medium w-10 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={product.stock <= 0 || quantity >= product.stock}
                  className="flex-1 flex justify-center text-gray-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Out-of-Stock Badge */}
            {product.stock <= 0 && (
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-sm">
                <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                <span className="text-sm font-semibold tracking-widest uppercase text-gray-700">Out of Stock</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button
                onClick={() => addToCart(product, quantity, selectedSize, selectedColor)}
                disabled={product.stock <= 0}
                className={`flex-1 py-4 text-sm font-semibold tracking-widest uppercase transition-colors ${
                  product.stock <= 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-900'
                }`}
              >
                {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={() => { addToCart(product, quantity, selectedSize, selectedColor); navigate('/checkout'); }}
                disabled={product.stock <= 0}
                className={`flex-1 border py-4 text-sm font-semibold tracking-widest uppercase transition-colors ${
                  product.stock <= 0
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                    : 'bg-white text-black border-black hover:bg-gray-50'
                }`}
              >
                Buy Now
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className="flex items-center justify-center border border-gray-200 w-14 hover:border-black transition-colors text-gray-500 hover:text-black"
              >
                <Heart size={20} strokeWidth={1.5} fill={isInWishlist(product.id) ? 'black' : 'none'} color={isInWishlist(product.id) ? 'black' : 'currentColor'} />
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t border-gray-200 divide-y divide-gray-200">
              {/* Details Accordion */}
              {product.details && product.details.length > 0 && (
                <div className="py-6">
                  <button 
                    onClick={() => setActiveAccordion(activeAccordion === 'details' ? '' : 'details')}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <span className="text-sm font-semibold tracking-widest uppercase">Product Details</span>
                    <ChevronDown size={20} className={`transform transition-transform ${activeAccordion === 'details' ? 'rotate-180' : ''}`} />
                  </button>
                  {activeAccordion === 'details' && (
                    <ul className="mt-6 space-y-2 text-gray-600 font-light list-disc pl-5">
                      {product.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Shipping Accordion */}
              <div className="py-6">
                <button 
                  onClick={() => setActiveAccordion(activeAccordion === 'shipping' ? '' : 'shipping')}
                  className="w-full flex justify-between items-center text-left"
                >
                  <span className="text-sm font-semibold tracking-widest uppercase">Shipping & Returns</span>
                  <ChevronDown size={20} className={`transform transition-transform ${activeAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                {activeAccordion === 'shipping' && (
                  <div className="mt-6 text-gray-600 font-light space-y-4">
                    <p>Complimentary standard shipping on all orders over $200.</p>
                    <p>Returns are accepted within 30 days of purchase. Items must be in original condition with tags attached.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-gray-200 pt-24 mt-24">
            <h2 className="text-2xl font-light tracking-tight uppercase mb-12 text-center">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
              {relatedProducts.map(rp => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProductDetails;
