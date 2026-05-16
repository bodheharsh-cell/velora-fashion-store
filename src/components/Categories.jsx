import { Link } from 'react-router-dom';

const categories = [
  { id: 1, title: 'Women', image: '/cat_women_1778924852509.png' },
  { id: 2, title: 'Men', image: '/cat_men_1778924812899.png' },
  { id: 3, title: 'Accessories', image: '/cat_acc_1778924827588.png' },
];

function Categories() {
  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Layout: Compact Horizontal Circular Thumbnails */}
        <div className="md:hidden flex justify-center gap-6 sm:gap-12">
          {categories.map((cat) => (
            <Link key={cat.id} to="/shop" className="flex flex-col items-center gap-3 group active:scale-95 transition-transform duration-200">
              <div className="w-[90px] h-[90px] sm:w-28 sm:h-28 rounded-full overflow-hidden border border-gray-100 shadow-sm relative">
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/5 group-active:bg-black/10 transition-colors" />
              </div>
              <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-gray-900">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop Layout: Unchanged Premium Vertical Cards */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link key={cat.id} to="/shop" className="group relative block h-[600px] overflow-hidden cursor-pointer">
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-end justify-center pb-12">
                <span className="bg-white/90 backdrop-blur-sm text-black px-10 py-3 text-sm font-semibold tracking-widest uppercase shadow-lg">
                  {cat.title}
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Categories;
