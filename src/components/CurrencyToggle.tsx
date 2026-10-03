import { useCurrency } from '@/lib/currency-context';

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="inline-flex items-center border border-[#b8945f]/30 bg-white/5 backdrop-blur-sm">
      <button
        onClick={() => setCurrency('INR')}
        className={`px-3 py-1.5 font-sans-ui text-xs tracking-wide transition-colors ${
          currency === 'INR'
            ? 'bg-[#b8945f] text-white'
            : 'text-[#b8945f] hover:text-[#a07f4a]'
        }`}
      >
        ₹ INR
      </button>
      <button
        onClick={() => setCurrency('USD')}
        className={`px-3 py-1.5 font-sans-ui text-xs tracking-wide transition-colors ${
          currency === 'USD'
            ? 'bg-[#b8945f] text-white'
            : 'text-[#b8945f] hover:text-[#a07f4a]'
        }`}
      >
        $ USD
      </button>
    </div>
  );
}
