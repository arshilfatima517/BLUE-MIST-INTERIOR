import { Home, Sofa, BedDouble, ChefHat, Briefcase, Lightbulb, type LucideIcon } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';
import { services } from '@/data/services';

const iconMap: Record<string, LucideIcon> = {
  Home,
  Sofa,
  BedDouble,
  ChefHat,
  Briefcase,
  Lightbulb,
};

export default function ServicesPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-32 lg:py-40 px-6 lg:px-10 bg-[#f5f0e8]">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="font-sans-ui text-xs tracking-[0.4em] uppercase text-[#b8945f] mb-6">
              Our Services
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#3d3327] leading-[1.1] text-balance">
              Design Services for Every Need
            </h1>
            <p className="mt-8 font-sans-ui text-base md:text-lg text-[#5c4e3d]/70 max-w-2xl mx-auto leading-relaxed">
              Whether you are designing a single room or an entire home, our services
              are tailored to bring your vision to life with precision and care.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Services list */}
      <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#faf8f5]">
        <div className="mx-auto max-w-7xl space-y-20 lg:space-y-32">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? Home;
            const reversed = i % 2 === 1;
            return (
              <Reveal key={service.id}>
                <div className={`grid gap-10 lg:gap-16 lg:grid-cols-2 items-center ${reversed ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex items-center justify-center w-12 h-12 bg-[#f5f0e8]">
                        <Icon size={22} className="text-[#b8945f]" />
                      </div>
                      <span className="font-sans-ui text-xs tracking-[0.2em] uppercase text-[#b8945f]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-serif text-[#3d3327] mb-4">
                      {service.title}
                    </h2>
                    <p className="font-sans-ui text-base leading-relaxed text-[#5c4e3d]/70 mb-6">
                      {service.description}
                    </p>
                    <Button page="contact" variant="outline">
                      Enquire About This Service
                    </Button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Process */}
      <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#f5f0e8]">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionTitle
              center
              eyebrow="How We Work"
              title="Our Design Process"
              description="A clear, collaborative process that keeps you informed at every step."
            />
          </Reveal>
          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {[
              { step: '01', title: 'Discovery', description: 'We start with a deep conversation about your needs, style, and how you use your space.' },
              { step: '02', title: 'Concept', description: 'We develop a design concept with mood boards, color palettes, and material selections.' },
              { step: '03', title: 'Design', description: 'Detailed plans, 3D renders, and furniture layouts bring the concept to life.' },
              { step: '04', title: 'Delivery', description: 'We manage sourcing, installation, and the final reveal of your completed space.' },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 100}>
                <div className="border-t border-[#b8945f]/30 pt-6">
                  <p className="font-serif text-3xl text-[#b8945f] mb-3">{item.step}</p>
                  <h3 className="font-serif text-xl text-[#3d3327] mb-2">{item.title}</h3>
                  <p className="font-sans-ui text-sm leading-relaxed text-[#5c4e3d]/70">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
