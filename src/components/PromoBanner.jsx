import { Link } from 'react-router-dom';

function PromoBanner() {
  return (
    <section className="relative py-32 bg-black overflow-hidden flex items-center justify-center">
      <img 
        src="/promo_bg_1778924896175.png" 
        alt="Promo background" 
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="relative z-10 text-center px-4">
        <h2 className="text-white text-3xl md:text-5xl font-bold tracking-tighter uppercase mb-6">
          Elevate Your Wardrobe
        </h2>
        <p className="text-gray-300 text-lg font-light mb-10 max-w-xl mx-auto">
          Join our exclusive members club to receive early access to new collections and private sales.
        </p>
        <Link 
          to="/login" 
          className="inline-block bg-white text-black px-12 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-gray-200 transition-colors"
        >
          Join Now
        </Link>
      </div>
    </section>
  );
}

export default PromoBanner;
