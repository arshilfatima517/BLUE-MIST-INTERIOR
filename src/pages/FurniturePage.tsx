import { useState, type FormEvent } from 'react';
import {
  Sofa,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Info,
  Package,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';
import { useCurrency } from '@/lib/currency-context';
import { materialSuggestions, formatPrice } from '@/lib/config';

const furnitureItems = [
  'Sofa (3-seater)',
  'Sofa (L-shaped)',
  'Coffee Table',
  'Dining Table (6-seater)',
  'Bed Frame (Queen)',
  'Bed Frame (King)',
  'Wardrobe',
  'TV Unit / Media Console',
  'Bookshelf',
  'Nightstand (pair)',
  'Office Desk',
  'Office Chair',
  'Accent Chair',
  'Shoe Rack',
  'Sideboard / Credenza',
  'Custom Furniture',
];

const deliveryRates: Record<string, { INR: number; USD: number }> = {
  'Roorkee': { INR: 500, USD: 6 },
  'Haridwar': { INR: 800, USD: 10 },
  'Dehradun': { INR: 1200, USD: 15 },
  'Delhi NCR': { INR: 2000, USD: 25 },
  'Mumbai': { INR: 3000, USD: 36 },
  'Bangalore': { INR: 3500, USD: 42 },
  'Other City': { INR: 4000, USD: 48 },
};

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  itemName: string;
  material: string;
  quantity: number;
  deliveryArea: string;
  depositOption: 'half' | 'full';
}

export default function FurniturePage() {
  const { currency, format } = useCurrency();
  const [data, setData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    itemName: '',
    material: '',
    quantity: 1,
    deliveryArea: '',
    depositOption: 'half',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedMaterial = materialSuggestions.find((m) => m.name === data.material);
  const materialPrice = selectedMaterial ? (currency === 'INR' ? selectedMaterial.priceINR : selectedMaterial.priceUSD) : 0;
  const deliveryCharge = data.deliveryArea ? deliveryRates[data.deliveryArea]?.[currency] ?? 0 : 0;
  const subtotal = materialPrice * data.quantity;
  const total = subtotal + deliveryCharge;

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!data.fullName.trim()) e.fullName = 'Enter your name';
    if (!data.email.trim()) e.email = 'Enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email';
    if (!data.phone.trim()) e.phone = 'Enter your phone number';
    if (!data.itemName) e.itemName = 'Select a furniture item';
    if (!data.material) e.material = 'Select a material';
    return e;
  };

  const handleChange = (field: keyof FormData, value: string | number) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { error: dbError } = await supabase.from('furniture_orders').insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        item_name: data.itemName,
        material: data.material,
        material_price: materialPrice,
        quantity: data.quantity,
        delivery_area: data.deliveryArea,
        delivery_charges: deliveryCharge,
        currency,
        total_price: total,
        deposit_option: data.depositOption,
      });

      if (dbError) throw dbError;

      // Send notification
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      try {
        await fetch(`${supabaseUrl}/functions/v1/notify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            type: 'furniture_order',
            data: {
              ...data,
              materialPrice,
              deliveryCharges: deliveryCharge,
              total,
              currency,
            },
          }),
        });
      } catch {
        // Best-effort notification
      }

      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to submit order' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (errorKey: string) =>
    `w-full bg-white border px-4 py-3 font-sans-ui text-sm text-[#3d3327] placeholder:text-[#5c4e3d]/40 transition-colors outline-none ${
      errors[errorKey] ? 'border-red-400 focus:border-red-500' : 'border-[#e8ded3] focus:border-[#b8945f]'
    }`;

  if (submitted) {
    return (
      <div className="pt-20">
        <section className="py-32 lg:py-48 px-6 lg:px-10 bg-[#faf8f5]">
          <div className="mx-auto max-w-lg text-center">
            <Reveal>
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 flex items-center justify-center bg-[#b8945f]/10 rounded-full">
                  <CheckCircle2 size={40} className="text-[#b8945f]" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-[#3d3327] mb-4">Order Received</h1>
              <p className="font-sans-ui text-base text-[#5c4e3d]/70 leading-relaxed mb-10">
                Your furniture order has been placed. We will contact you via WhatsApp and email
                to confirm details and arrange delivery.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline">
                Place Another Order
              </Button>
            </Reveal>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="py-32 lg:py-40 px-6 lg:px-10 bg-[#f5f0e8]">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#b8945f]/10">
                <Sofa size={18} className="text-[#b8945f]" />
                <span className="font-sans-ui text-xs tracking-[0.2em] uppercase text-[#b8945f]">Furniture Only</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-[#3d3327] leading-[1.1] text-balance">
              Buy Furniture
            </h1>
            <p className="mt-8 font-sans-ui text-base md:text-lg text-[#5c4e3d]/70 max-w-2xl mx-auto leading-relaxed">
              Order custom-made furniture directly. Choose your material, get transparent pricing,
              and we will deliver it to your door.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#faf8f5]">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            {/* Policy notice */}
            <div className="mb-6 p-4 bg-[#f5f0e8] border border-[#e8ded3] flex items-start gap-3">
              <Info size={18} className="text-[#b8945f] shrink-0 mt-0.5" />
              <div className="font-sans-ui text-xs text-[#5c4e3d]/80 leading-relaxed space-y-1">
                <p><strong className="text-[#3d3327]">Deposit:</strong> Half deposit required before delivery. Full payment also accepted.</p>
                <p><strong className="text-[#3d3327]">Returns:</strong> No returns on custom-made furniture.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="bg-white border border-[#e8ded3] p-6 sm:p-10">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={data.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className={inputClass('fullName')}
                    placeholder="Jane Doe"
                  />
                  {errors.fullName && <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500"><AlertCircle size={14} /> {errors.fullName}</p>}
                </div>

                <div>
                  <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">Email *</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={inputClass('email')}
                    placeholder="jane@example.com"
                  />
                  {errors.email && <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500"><AlertCircle size={14} /> {errors.email}</p>}
                </div>

                <div>
                  <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={data.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={inputClass('phone')}
                    placeholder="+91 78190 86039"
                  />
                  {errors.phone && <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500"><AlertCircle size={14} /> {errors.phone}</p>}
                </div>

                <div>
                  <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">Furniture Item *</label>
                  <select
                    value={data.itemName}
                    onChange={(e) => handleChange('itemName', e.target.value)}
                    className={inputClass('itemName')}
                  >
                    <option value="">Select furniture</option>
                    {furnitureItems.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                  {errors.itemName && <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500"><AlertCircle size={14} /> {errors.itemName}</p>}
                </div>

                <div>
                  <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">Material *</label>
                  <select
                    value={data.material}
                    onChange={(e) => handleChange('material', e.target.value)}
                    className={inputClass('material')}
                  >
                    <option value="">Select material</option>
                    {materialSuggestions.map((m) => (
                      <option key={m.name} value={m.name}>
                        {m.name} — {format(currency === 'INR' ? m.priceINR : m.priceUSD)}
                      </option>
                    ))}
                  </select>
                  {errors.material && <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500"><AlertCircle size={14} /> {errors.material}</p>}
                </div>

                <div>
                  <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={data.quantity}
                    onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 1)}
                    className={inputClass('quantity')}
                  />
                </div>

                <div>
                  <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">Delivery Area</label>
                  <select
                    value={data.deliveryArea}
                    onChange={(e) => handleChange('deliveryArea', e.target.value)}
                    className={inputClass('deliveryArea')}
                  >
                    <option value="">Select your area</option>
                    {Object.keys(deliveryRates).map((area) => (
                      <option key={area} value={area}>
                        {area} — {format(deliveryRates[area][currency])}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">Payment Option</label>
                  <select
                    value={data.depositOption}
                    onChange={(e) => handleChange('depositOption', e.target.value)}
                    className={inputClass('depositOption')}
                  >
                    <option value="half">Half Deposit Before Delivery</option>
                    <option value="full">Full Payment Upfront</option>
                  </select>
                </div>
              </div>

              {/* Price Summary */}
              <div className="mt-8 p-5 bg-[#f5f0e8] border border-[#e8ded3]">
                <div className="flex items-center gap-2 mb-4">
                  <Package size={18} className="text-[#b8945f]" />
                  <h3 className="font-sans-ui text-sm tracking-[0.1em] uppercase text-[#3d3327]">Price Summary</h3>
                </div>
                <div className="space-y-2 font-sans-ui text-sm">
                  <div className="flex justify-between text-[#5c4e3d]/70">
                    <span>Material Price ({data.quantity}x)</span>
                    <span>{format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#5c4e3d]/70">
                    <span>Delivery Charges</span>
                    <span>{format(deliveryCharge)}</span>
                  </div>
                  <div className="border-t border-[#e8ded3] pt-2 flex justify-between text-[#3d3327] font-medium">
                    <span>Total</span>
                    <span className="text-lg">{format(total)}</span>
                  </div>
                  {data.depositOption === 'half' && (
                    <div className="flex justify-between text-[#b8945f]">
                      <span>Deposit Required (50%)</span>
                      <span>{format(Math.round(total / 2))}</span>
                    </div>
                  )}
                </div>
              </div>

              {errors.submit && (
                <p className="mt-4 flex items-center gap-1.5 font-sans-ui text-sm text-red-500"><AlertCircle size={16} /> {errors.submit}</p>
              )}

              <div className="mt-8">
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </Button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
