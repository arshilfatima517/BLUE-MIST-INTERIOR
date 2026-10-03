import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter, type Page } from '@/router/Router';
import Logo from '@/components/Logo';
import CurrencyToggle from '@/components/CurrencyToggle';

const navItems: { label: string; page: Page }[] = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'about' },
  { label: 'Services', page: 'services' },
  { label: 'Portfolio', page: 'portfolio' },
  { label: 'Packages', page: 'packages' },
  { label: 'AI Designer', page: 'ai-designer' },
  { label: 'Furniture', page: 'furniture' },
  { label: 'Feedback', page: 'feedback' },
  { label: 'Contact', page: 'contact' },
];

export default function Navbar() {
  const { page, navigate } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleNavigate = (p: Page) => {
    navigate(p);
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#faf8f5]/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(184,148,95,0.15)]'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10 h-20">
          <Logo scrolled={scrolled} />

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.page}>
                <button
                  onClick={() => handleNavigate(item.page)}
                  className={`font-sans-ui text-sm tracking-wide transition-colors duration-300 relative group py-1 ${
                    page === item.page
                      ? scrolled
                        ? 'text-[#b8945f]'
                        : 'text-[#c9a973]'
                      : scrolled
                        ? 'text-[#5c4e3d] hover:text-[#b8945f]'
                        : 'text-white/85 hover:text-white'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px bg-[#b8945f] transition-all duration-300 ${
                      page === item.page ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* CTA + Currency (desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <CurrencyToggle />
            <button
              onClick={() => handleNavigate('contact')}
              className="font-sans-ui text-sm tracking-wide px-6 py-2.5 border border-[#b8945f] text-[#b8945f] hover:bg-[#b8945f] hover:text-white transition-all duration-300"
            >
              Book Consultation
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className={`lg:hidden transition-colors ${scrolled ? 'text-[#3d3327]' : 'text-white'}`}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-[#3d3327]" />
        <div className="relative flex flex-col h-full">
          <div className="flex items-center justify-between px-6 h-20">
            <span className="text-2xl font-serif text-white">Blue Mist</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="text-white"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <ul className="flex-1 flex flex-col items-center justify-center gap-6">
            {navItems.map((item) => (
              <li key={item.page}>
                <button
                  onClick={() => handleNavigate(item.page)}
                  className={`font-serif text-2xl transition-colors ${
                    page === item.page ? 'text-[#c9a973]' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="pb-10 flex flex-col items-center gap-4">
            <CurrencyToggle />
            <button
              onClick={() => handleNavigate('contact')}
              className="font-sans-ui text-sm tracking-wide px-8 py-3 border border-[#b8945f] text-[#b8945f] hover:bg-[#b8945f] hover:text-white transition-all duration-300"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
