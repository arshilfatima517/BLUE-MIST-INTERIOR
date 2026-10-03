import { useRouter } from '@/router/Router';

export default function Logo({ scrolled = false }: { scrolled?: boolean }) {
  const { navigate } = useRouter();

  return (
    <button
      onClick={() => navigate('home')}
      className="flex items-center gap-2.5 group"
      aria-label="Blue Mist Interiors home"
    >
      {/* Logo: mist swirl + snowflake */}
      <svg
        width="36"
        height="36"
        viewBox="0 0 48 48"
        fill="none"
        className="shrink-0"
      >
        {/* Mist swirls */}
        <path
          d="M6 18 Q12 12, 18 18 T30 18 T42 18"
          stroke="#b8945f"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M6 24 Q12 18, 18 24 T30 24 T42 24"
          stroke="#b8945f"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M6 30 Q12 24, 18 30 T30 30 T42 30"
          stroke="#b8945f"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />
        {/* Snowflake */}
        <g transform="translate(24 24)" stroke="#c9a973" strokeWidth="1.5" strokeLinecap="round">
          <line x1="0" y1="-8" x2="0" y2="8" />
          <line x1="-8" y1="0" x2="8" y2="0" />
          <line x1="-5.6" y1="-5.6" x2="5.6" y2="5.6" />
          <line x1="-5.6" y1="5.6" x2="5.6" y2="-5.6" />
          <line x1="0" y1="-8" x2="-2" y2="-6" />
          <line x1="0" y1="-8" x2="2" y2="-6" />
          <line x1="0" y1="8" x2="-2" y2="6" />
          <line x1="0" y1="8" x2="2" y2="6" />
          <line x1="-8" y1="0" x2="-6" y2="-2" />
          <line x1="-8" y1="0" x2="-6" y2="2" />
          <line x1="8" y1="0" x2="6" y2="-2" />
          <line x1="8" y1="0" x2="6" y2="2" />
        </g>
      </svg>
      <div className="flex flex-col">
        <span
          className={`text-2xl font-serif tracking-wide transition-colors duration-300 leading-none ${
            scrolled ? 'text-[#3d3327]' : 'text-white'
          }`}
        >
          Blue Mist
        </span>
        <span className="hidden sm:inline text-[10px] font-sans-ui tracking-[0.25em] uppercase text-[#b8945f] mt-0.5">
          Interiors
        </span>
      </div>
    </button>
  );
}
