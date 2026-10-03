import { ArrowRight } from 'lucide-react';
import { useRouter, type Page } from '@/router/Router';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  page?: Page;
  variant?: 'primary' | 'outline' | 'light';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  page,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const { navigate } = useRouter();

  const handleClick = () => {
    if (onClick) onClick();
    if (page) navigate(page);
  };

  const base =
    'group inline-flex items-center justify-center gap-2 font-sans-ui text-sm tracking-wide px-7 py-3.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#b8945f] text-white hover:bg-[#a07f4a]',
    outline: 'border border-[#b8945f] text-[#b8945f] hover:bg-[#b8945f] hover:text-white',
    light:
      'border border-white/40 text-white hover:bg-white hover:text-[#3d3327]',
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
      {variant !== 'light' && <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />}
    </button>
  );
}
