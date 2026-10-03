import { projects } from '@/data/projects';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';

export default function FeaturedProjects() {
  const featured = projects.slice(0, 4);

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#f5f0e8]">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <Reveal>
            <SectionTitle
              eyebrow="Selected Work"
              title="Featured Projects"
              description="A glimpse of our recent interior design work, each space crafted with a distinct character and purpose."
            />
          </Reveal>
          <Reveal delay={100}>
            <Button page="portfolio" variant="outline" className="shrink-0">
              View All Projects
            </Button>
          </Reveal>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((project, i) => (
            <Reveal key={project.id} delay={i * 100}>
              <div className="group relative overflow-hidden bg-[#3d3327] aspect-[4/3]">
                <img
                  src={project.image}
                  alt={project.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3d3327]/80 via-[#3d3327]/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <p className="font-sans-ui text-xs tracking-[0.2em] uppercase text-[#c9a973] mb-2">
                    {project.category}
                  </p>
                  <h3 className="text-2xl lg:text-3xl font-serif text-white mb-1">{project.name}</h3>
                  <p className="font-sans-ui text-sm text-white/70">{project.style}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
