import { Home, Sofa, BedDouble, ChefHat, Briefcase, Lightbulb, type LucideIcon } from 'lucide-react';
import { services } from '@/data/services';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';

const iconMap: Record<string, LucideIcon> = {
  Home,
  Sofa,
  BedDouble,
  ChefHat,
  Briefcase,
  Lightbulb,
};

export default function FeaturedServices() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#faf8f5]">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionTitle
            center
            eyebrow="What We Do"
            title="Crafted Services for Every Space"
            description="From single rooms to full homes, we offer a range of design services tailored to your vision and lifestyle."
          />
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? Home;
            return (
              <Reveal key={service.id} delay={i * 80}>
                <div className="group bg-white border border-[#e8ded3] p-8 lg:p-10 h-full flex flex-col transition-all duration-500 hover:border-[#b8945f]/40 hover:shadow-[0_20px_50px_-20px_rgba(61,51,39,0.15)]">
                  <div className="flex items-center justify-center w-14 h-14 bg-[#f5f0e8] mb-6 transition-colors duration-300 group-hover:bg-[#b8945f]/10">
                    <Icon size={24} className="text-[#b8945f]" />
                  </div>
                  <h3 className="text-2xl font-serif text-[#3d3327] mb-3">{service.title}</h3>
                  <p className="font-sans-ui text-sm leading-relaxed text-[#5c4e3d]/70 flex-1">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
