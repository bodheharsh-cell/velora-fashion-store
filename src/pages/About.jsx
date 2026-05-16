function About() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Header */}
      <section className="py-32 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-light tracking-tighter uppercase mb-8">The Brand</h1>
        <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed">
          ÉLÉGANCE was founded on the principle that true luxury lies in simplicity. We strip away the unnecessary to reveal the essential, creating timeless pieces for the modern aesthetic.
        </p>
      </section>

      {/* Editorial Image 1 */}
      <section className="w-full h-[70vh]">
        <img 
          src="/about_1_1778925708168.png" 
          alt="Brand aesthetic" 
          className="w-full h-full object-cover"
        />
      </section>

      {/* Story Text */}
      <section className="py-32 px-4 md:px-12 lg:px-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-light tracking-tight uppercase mb-6">Our Heritage</h2>
          <p className="text-gray-600 font-light leading-relaxed mb-6">
            Born from a desire to redefine contemporary fashion, our studio combines traditional craftsmanship with architectural silhouettes. Every garment is a study in proportion, texture, and restraint.
          </p>
          <p className="text-gray-600 font-light leading-relaxed">
            We source only the finest materials, ensuring that our commitment to quality is woven into the very fabric of our collections.
          </p>
        </div>
        <div className="aspect-[4/5] bg-gray-100">
          <img 
            src="/about_2_1778925641424.png" 
            alt="Craftsmanship" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );
}

export default About;
