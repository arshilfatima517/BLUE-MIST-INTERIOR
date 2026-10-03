import Hero from '@/components/home/Hero';
import FeaturedServices from '@/components/home/FeaturedServices';
import FeaturedProjects from '@/components/home/FeaturedProjects';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import HomeTestimonials from '@/components/home/HomeTestimonials';
import FinalCTA from '@/components/home/FinalCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <FeaturedProjects />
      <WhyChooseUs />
      <HomeTestimonials />
      <FinalCTA />
    </>
  );
}
