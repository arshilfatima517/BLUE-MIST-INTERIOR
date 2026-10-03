import { Phone, Mail, MapPin, Linkedin, MessageCircle } from 'lucide-react';
import { useRouter, type Page } from '@/router/Router';

const footerLinks: { label: string; page: Page }[] = [
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

export default function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="bg-[#3d3327] text-white/70 pt-20 pb-8 px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-serif text-white mb-4">Blue Mist</h3>
            <p className="font-sans-ui text-sm leading-relaxed text-white/60 max-w-xs">
              Designing spaces that feel like home. Luxury interior design for those who
              appreciate timeless elegance.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://www.linkedin.com/in/arshil-fatima-9232903bb"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
                className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/60 hover:border-[#c9a973] hover:text-[#c9a973] transition-colors"
              >
                <Linkedin size={19} />
              </a>
              <a
                href="https://wa.me/917819086039"
                target="_blank"
                rel="noreferrer"
                aria-label="Chat on WhatsApp"
                className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/60 hover:border-[#c9a973] hover:text-[#c9a973] transition-colors"
              >
                <MessageCircle size={19} />
              </a>
              <a
                href="mailto:arshilfatima517@gmail.com"
                aria-label="Send an email"
                className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/60 hover:border-[#c9a973] hover:text-[#c9a973] transition-colors"
              >
                <Mail size={19} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans-ui text-sm tracking-[0.2em] uppercase text-[#c9a973] mb-5">
              Explore
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => navigate(link.page)}
                    className="font-sans-ui text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-sans-ui text-sm tracking-[0.2em] uppercase text-[#c9a973] mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              <li className="font-sans-ui text-sm text-white/60">Full Home Design</li>
              <li className="font-sans-ui text-sm text-white/60">Living Spaces</li>
              <li className="font-sans-ui text-sm text-white/60">Kitchen Design</li>
              <li className="font-sans-ui text-sm text-white/60">Commercial Spaces</li>
              <li className="font-sans-ui text-sm text-white/60">Design Consultation</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans-ui text-sm tracking-[0.2em] uppercase text-[#c9a973] mb-5">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#c9a973] mt-0.5 shrink-0" />
                <span className="font-sans-ui text-sm text-white/60">
                  Roorkee, Uttarakhand<br />India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#c9a973] shrink-0" />
                <a href="tel:+917819086039" className="font-sans-ui text-sm text-white/60 hover:text-white transition-colors">
                  +91 78190 86039
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#c9a973] shrink-0" />
                <a href="tel:+918477088386" className="font-sans-ui text-sm text-white/60 hover:text-white transition-colors">
                  +91 84770 88386
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#c9a973] shrink-0" />
                <a href="mailto:arshilfatima517@gmail.com" className="font-sans-ui text-sm text-white/60 hover:text-white transition-colors">
                  arshilfatima517@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans-ui text-xs text-white/40">
            &copy; {new Date().getFullYear()} Blue Mist Interiors. All rights reserved.
          </p>
          <p className="font-sans-ui text-xs text-white/40">
            Designed with intention and care.
          </p>
        </div>
      </div>
    </footer>
  );
}
