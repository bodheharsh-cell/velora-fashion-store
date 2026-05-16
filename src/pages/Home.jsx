import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedProducts from '../components/FeaturedProducts';
import PromoBanner from '../components/PromoBanner';

function Home() {
    return (
        <div className="w-full">
            <Hero />
            <Categories />
            <FeaturedProducts />
            <PromoBanner />
        </div>
    )
}

export default Home;