import Button from '@/components/Button';

export default function Hero() {
  return (
    <section className="relative h-[100vh] min-h-[640px] w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/8135492/pexels-photo-8135492.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Luxury interior living space"
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#3d3327]/50 via-[#3d3327]/40 to-[#3d3327]/60" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="mx-auto max-w-7xl w-full px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="font-sans-ui text-xs tracking-[0.4em] uppercase text-[#c9a973] mb-8 animate-fade-up">
              Luxury Interior Design Studio
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white leading-[1.05] tracking-tight text-balance animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Designing Spaces<br />That Feel Like Home
            </h1>
            <p className="mt-8 max-w-xl font-sans-ui text-base md:text-lg leading-relaxed text-white/75 animate-fade-in-delayed" style={{ animationDelay: '0.3s' }}>
              We craft interiors that blend timeless elegance with modern comfort.
              Every space we design is an expression of your story, tailored with
              intention and care.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 animate-fade-in-slow" style={{ animationDelay: '0.5s' }}>
              <Button page="portfolio" variant="primary">
                Explore Our Work
              </Button>
              <Button page="contact" variant="light">
                Book a Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 animate-fade-in-slow">
        <span className="font-sans-ui text-[10px] tracking-[0.3em] uppercase text-white/40">Scroll</span>
        <div className="w-px h-12 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/60 animate-pulse" style={{ animationDuration: '2s' }} />
        </div>
      </div>
    </section>
  );
}
