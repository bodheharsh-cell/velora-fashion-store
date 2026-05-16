import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="relative h-[70vh] md:h-[90vh] w-full bg-gray-100 overflow-hidden mt-20">
      <img 
        src="/hero_img_1778924780520.png" 
        alt="Hero fashion" 
        className="absolute inset-0 w-full h-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-white text-4xl md:text-7xl font-bold tracking-tight mb-4 md:mb-6 drop-shadow-lg uppercase">
          The New Elegance
        </h1>
        <p className="text-white text-base md:text-xl font-light mb-8 md:mb-10 max-w-lg drop-shadow-md">
          Discover the Fall/Winter collection. Minimalist design for the modern aesthetic.
        </p>
        <Link 
          to="/shop" 
          className="bg-white text-black px-10 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-300"
        >
          Shop Collection
        </Link>
      </div>
    </div>
  );
}

export default Hero;
