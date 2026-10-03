import { testimonials } from '@/data/testimonials';
import TestimonialCard from '@/components/TestimonialCard';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';

export default function HomeTestimonials() {
  const featured = testimonials.slice(0, 3);

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionTitle
            center
            eyebrow="Client Stories"
            title="What Our Clients Say"
            description="The trust our clients place in us is the foundation of everything we do."
          />
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {featured.map((t, i) => (
            <Reveal key={t.id} delay={i * 100}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
