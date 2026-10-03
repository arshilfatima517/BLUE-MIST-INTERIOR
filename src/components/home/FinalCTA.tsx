import Button from '@/components/Button';
import Reveal from '@/components/Reveal';

export default function FinalCTA() {
  return (
    <section className="relative py-32 lg:py-40 px-6 lg:px-10 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/7546323/pexels-photo-7546323.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Elegant living room"
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#3d3327]/70" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="font-sans-ui text-xs tracking-[0.4em] uppercase text-[#c9a973] mb-6">
            Ready to Begin
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] text-balance">
            Let&apos;s Create a Space<br />That Tells Your Story
          </h2>
          <p className="mt-6 font-sans-ui text-base md:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Book a complimentary consultation and take the first step toward a home
            designed with intention.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button page="contact" variant="primary">
              Book a Consultation
            </Button>
            <Button page="furniture" variant="light">
              Buy Furniture
            </Button>
            <Button page="packages" variant="light">
              View Packages
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
