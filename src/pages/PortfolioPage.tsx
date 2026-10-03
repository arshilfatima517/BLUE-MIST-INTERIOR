import { useState, useMemo } from 'react';
import { projects } from '@/data/projects';
import type { ProjectCategory } from '@/types';
import Reveal from '@/components/Reveal';
import SectionTitle from '@/components/SectionTitle';

const categories: (ProjectCategory | 'All')[] = [
  'All',
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Dining Room',
  'Office',
  'Full Home',
];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | 'All'>('All');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-32 lg:py-40 px-6 lg:px-10 bg-[#f5f0e8]">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="font-sans-ui text-xs tracking-[0.4em] uppercase text-[#b8945f] mb-6">
              Our Portfolio
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#3d3327] leading-[1.1] text-balance">
              A Collection of Designed Spaces
            </h1>
            <p className="mt-8 font-sans-ui text-base md:text-lg text-[#5c4e3d]/70 max-w-2xl mx-auto leading-relaxed">
              Explore our portfolio of completed projects, each one a unique response
              to the way our clients live and work.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 lg:py-28 px-6 lg:px-10 bg-[#faf8f5]">
        <div className="mx-auto max-w-7xl">
          {/* Category filters */}
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-sans-ui text-sm tracking-wide px-5 py-2.5 border transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-[#3d3327] text-white border-[#3d3327]'
                      : 'bg-transparent text-[#5c4e3d] border-[#e8ded3] hover:border-[#b8945f] hover:text-[#b8945f]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Projects grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, i) => (
              <Reveal key={project.id} delay={(i % 3) * 80}>
                <div className="group relative overflow-hidden bg-[#3d3327] aspect-[4/5]">
                  <img
                    src={project.image}
                    alt={project.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3d3327]/90 via-[#3d3327]/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-85" />

                  {/* Category badge */}
                  <div className="absolute top-5 left-5">
                    <span className="font-sans-ui text-[10px] tracking-[0.2em] uppercase bg-white/15 backdrop-blur-sm text-white px-3 py-1.5">
                      {project.category}
                    </span>
                  </div>

                  {/* Hover content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-7 transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                    <p className="font-sans-ui text-xs tracking-[0.15em] uppercase text-[#c9a973] mb-2">
                      {project.style}
                    </p>
                    <h3 className="text-2xl font-serif text-white mb-2">{project.name}</h3>
                    <p className="font-sans-ui text-sm leading-relaxed text-white/70 max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                      {project.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="font-serif text-xl text-[#5c4e3d]/60">
                No projects in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
