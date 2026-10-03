import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';
import { teamMembers } from '@/data/team';

const stats = [
  { value: '15+', label: 'Years of Experience' },
  { value: '250+', label: 'Projects Completed' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '40+', label: 'Design Awards' },
];

const values = [
  {
    title: 'Timeless Over Trendy',
    description: 'We design spaces that endure. Our interiors are meant to be lived in and loved for decades, not seasons.',
  },
  {
    title: 'Intentional Detail',
    description: 'Every texture, every shadow, every proportion is considered. Nothing is accidental.',
  },
  {
    title: 'Collaborative Process',
    description: 'We see design as a dialogue. Your input shapes every decision, and you are part of the journey from start to finish.',
  },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-32 lg:py-48 px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/8086360/pexels-photo-8086360.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Architect working on design"
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#3d3327]/60" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="font-sans-ui text-xs tracking-[0.4em] uppercase text-[#c9a973] mb-6">
              Our Story
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] text-balance">
              The People Behind the Spaces
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#faf8f5]">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <p className="font-serif text-2xl md:text-3xl leading-[1.5] text-[#3d3327] text-balance">
              Blue Mist Interiors was founded on a simple belief: that a home should be
              a reflection of the people who live in it. We do not impose a style.
              We uncover one that already lives within you, and give it form.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 lg:px-10 bg-[#3d3327]">
        <div className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="text-center">
                <p className="text-4xl lg:text-5xl font-serif text-[#c9a973] mb-2">{stat.value}</p>
                <p className="font-sans-ui text-sm text-white/60">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#faf8f5]">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionTitle
              center
              eyebrow="Our Philosophy"
              title="What Guides Every Project"
            />
          </Reveal>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 100}>
                <div className="text-center">
                  <div className="w-12 h-px bg-[#b8945f] mx-auto mb-6" />
                  <h3 className="text-2xl font-serif text-[#3d3327] mb-4">{value.title}</h3>
                  <p className="font-sans-ui text-sm leading-relaxed text-[#5c4e3d]/70">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#f5f0e8]">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionTitle
              center
              eyebrow="Meet the Team"
              title="The Designers Who Bring It to Life"
            />
          </Reveal>
          <div className="mt-16 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {teamMembers.map((member, i) => (
              <Reveal key={member.id} delay={i * 100}>
                <div className="group">
                  <div className="aspect-[3/4] mb-6 flex items-center justify-center bg-[#f5f0e8]">
                    <span className="text-5xl font-serif text-[#b8945f]">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif text-[#3d3327] mb-1">{member.name}</h3>
                  <p className="font-sans-ui text-xs tracking-[0.15em] uppercase text-[#b8945f] mb-3">
                    {member.role}
                  </p>
                  <p className="font-sans-ui text-sm leading-relaxed text-[#5c4e3d]/70">
                    {member.bio}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 lg:px-10 bg-[#faf8f5]">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-serif text-[#3d3327] mb-4">
              Let&apos;s work together
            </h2>
            <p className="font-sans-ui text-sm text-[#5c4e3d]/70 mb-8">
              Ready to start your design journey? We would love to hear about your project.
            </p>
            <Button page="contact" variant="primary">Book a Consultation</Button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
