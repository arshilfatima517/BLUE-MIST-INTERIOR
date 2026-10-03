import { Award, Users, Clock, Leaf } from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';

const reasons = [
  {
    icon: Award,
    title: 'Award-Winning Design',
    description: 'Recognized by the Interior Design Society for excellence in residential and commercial projects.',
  },
  {
    icon: Users,
    title: 'Client-Centered Approach',
    description: 'Every design begins with understanding you. Your story, your style, your way of living.',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    description: 'We respect your time and investment. Projects are completed on schedule, every time.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Materials',
    description: 'We source eco-friendly, premium materials that are beautiful and built to last.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#faf8f5]">
      <div className="mx-auto max-w-7xl grid gap-16 lg:grid-cols-2 lg:items-center">
        {/* Image side */}
        <Reveal>
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="https://images.pexels.com/photos/7490852/pexels-photo-7490852.jpeg?auto=compress&cs=tinysrgb&w=940"
                alt="Designers selecting fabric samples"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-4 lg:-right-8 w-48 lg:w-64 aspect-square overflow-hidden border-8 border-[#faf8f5] hidden sm:block">
              <img
                src="https://images.pexels.com/photos/6583373/pexels-photo-6583373.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Color and fabric samples"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </Reveal>

        {/* Content side */}
        <div>
          <Reveal>
            <SectionTitle
              eyebrow="Why Blue Mist"
              title="A Studio Built on Trust and Craft"
              description="For over 15 years, we have helped families and businesses create spaces that are both beautiful and deeply functional. Our approach combines artistry with precision."
            />
          </Reveal>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {reasons.map((reason, i) => (
              <Reveal key={reason.title} delay={i * 100}>
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-12 h-12 shrink-0 bg-[#f5f0e8]">
                    <reason.icon size={22} className="text-[#b8945f]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-[#3d3327] mb-1.5">{reason.title}</h3>
                    <p className="font-sans-ui text-sm leading-relaxed text-[#5c4e3d]/70">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
