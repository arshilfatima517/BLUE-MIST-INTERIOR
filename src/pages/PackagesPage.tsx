import { Check } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';
import { packages } from '@/data/packages';

export default function PackagesPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-32 lg:py-40 px-6 lg:px-10 bg-[#f5f0e8]">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="font-sans-ui text-xs tracking-[0.4em] uppercase text-[#b8945f] mb-6">
              Our Packages
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#3d3327] leading-[1.1] text-balance">
              Transparent Pricing, Tailored to You
            </h1>
            <p className="mt-8 font-sans-ui text-base md:text-lg text-[#5c4e3d]/70 max-w-2xl mx-auto leading-relaxed">
              Choose from our curated design packages, or contact us for a custom quote
              tailored to your specific project.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#faf8f5]">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-3 lg:items-stretch">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 100}>
              <div
                className={`relative h-full p-8 lg:p-10 flex flex-col transition-all duration-300 ${
                  pkg.highlighted
                    ? 'bg-[#3d3327] text-white shadow-[0_30px_60px_-20px_rgba(61,51,39,0.3)] lg:-translate-y-4'
                    : 'bg-white border border-[#e8ded3] hover:border-[#b8945f]/40'
                }`}
              >
                {pkg.highlighted && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#b8945f] text-white font-sans-ui text-[10px] tracking-[0.2em] uppercase px-4 py-1.5">
                    Most Popular
                  </span>
                )}

                <h3 className={`text-2xl font-serif mb-2 ${pkg.highlighted ? 'text-white' : 'text-[#3d3327]'}`}>
                  {pkg.name}
                </h3>
                <p className={`font-serif text-4xl mb-1 ${pkg.highlighted ? 'text-[#c9a973]' : 'text-[#b8945f]'}`}>
                  {pkg.price}
                </p>
                <p className={`font-sans-ui text-sm leading-relaxed mb-8 ${pkg.highlighted ? 'text-white/60' : 'text-[#5c4e3d]/70'}`}>
                  {pkg.description}
                </p>

                <div className={`w-full h-px mb-8 ${pkg.highlighted ? 'bg-white/15' : 'bg-[#e8ded3]'}`} />

                <ul className="space-y-4 flex-1">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        size={18}
                        className={`shrink-0 mt-0.5 ${pkg.highlighted ? 'text-[#c9a973]' : 'text-[#b8945f]'}`}
                      />
                      <span className={`font-sans-ui text-sm ${pkg.highlighted ? 'text-white/75' : 'text-[#5c4e3d]/80'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  <Button
                    page="contact"
                    variant={pkg.highlighted ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Custom quote CTA */}
      <section className="py-20 px-6 lg:px-10 bg-[#f5f0e8]">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <SectionTitle
              center
              title="Need Something Different?"
              description="Every project is unique. If our packages do not quite fit, we are happy to create a custom proposal for you."
            />
            <div className="mt-8 flex justify-center">
              <Button page="contact" variant="primary">
                Request a Custom Quote
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
