import { Link } from 'react-router-dom';

const collections = [
  {
    id: 1,
    title: 'Fall / Winter 2026',
    description: 'Embracing texture and structure in a muted palette.',
    image: '/collection_1_1778925657292.png'
  },
  {
    id: 2,
    title: 'The Essentials',
    description: 'Foundational pieces designed for everyday elegance.',
    image: '/collection_2_1778925676336.png'
  }
];

function Collections() {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl md:text-5xl font-light tracking-tighter uppercase mb-4 text-center">Collections</h1>
        <p className="text-gray-500 text-center font-light mb-20 max-w-2xl mx-auto">
          Explore our curated seasonal campaigns and permanent core collections.
        </p>

        <div className="space-y-32">
          {collections.map((collection, index) => (
            <div key={collection.id} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 items-center`}>
              <div className="w-full md:w-1/2 aspect-[3/4] overflow-hidden group cursor-pointer">
                <img 
                  src={collection.image} 
                  alt={collection.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-12 text-center md:text-left">
                <h2 className="text-3xl font-light tracking-tight uppercase mb-4">{collection.title}</h2>
                <p className="text-gray-500 font-light leading-relaxed mb-8">{collection.description}</p>
                <Link 
                  to="/shop" 
                  className="inline-block border border-black px-8 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-black hover:text-white transition-colors self-center md:self-start"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Collections;
