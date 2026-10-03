import { useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Plus,
  Trash2,
  Upload,
  X,
  Info,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';
import { useCurrency } from '@/lib/currency-context';
import {
  roomTypeSuggestions,
  roomSizeSuggestions,
  designStyleSuggestions,
  materialSuggestions,
  colorSuggestions,
  formatPrice,
} from '@/lib/config';

interface RoomEntry {
  roomType: string;
  roomSize: string;
  style: string;
  colors: string;
  budget: string;
  furnitureRequirements: string;
  materials: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  isMultiRoom: boolean;
  rooms: RoomEntry[];
  preferredDate: string;
  deliveryArea: string;
  message: string;
  depositOption: 'half' | 'full';
  userPhotoUrl: string;
}

const emptyRoom: RoomEntry = {
  roomType: '',
  roomSize: '',
  style: '',
  colors: '',
  budget: '',
  furnitureRequirements: '',
  materials: '',
};

const initialData: FormData = {
  fullName: '',
  email: '',
  phone: '',
  isMultiRoom: false,
  rooms: [{ ...emptyRoom }],
  preferredDate: '',
  deliveryArea: '',
  message: '',
  depositOption: 'half',
  userPhotoUrl: '',
};

const budgetRangesINR = [
  'Under ₹40,000',
  '₹40,000 - ₹1,20,000',
  '₹1,20,000 - ₹2,40,000',
  '₹2,40,000 - ₹4,00,000',
  '₹4,00,000 - ₹8,00,000',
  '₹8,00,000+',
];

const budgetRangesUSD = [
  'Under $500',
  '$500 - $1,500',
  '$1,500 - $3,000',
  '$3,000 - $5,000',
  '$5,000 - $10,000',
  '$10,000+',
];

const deliveryRates: Record<string, number> = {
  'Roorkee': 500,
  'Haridwar': 800,
  'Dehradun': 1200,
  'Delhi NCR': 2000,
  'Mumbai': 3000,
  'Bangalore': 3500,
  'Other City': 4000,
};

export default function ContactPage() {
  const { currency } = useCurrency();
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const budgetRanges = currency === 'INR' ? budgetRangesINR : budgetRangesUSD;

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};

    if (!data.fullName.trim()) e.fullName = 'Please enter your full name';
    else if (data.fullName.trim().length < 2) e.fullName = 'Name must be at least 2 characters';

    if (!data.email.trim()) e.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Please enter a valid email address';

    if (!data.phone.trim()) e.phone = 'Please enter your phone number';
    else if (!/^[+]?[\d\s()\-]{7,}$/.test(data.phone)) e.phone = 'Please enter a valid phone number';

    data.rooms.forEach((room, i) => {
      if (!room.roomType) e[`room${i}_type`] = 'Select room type';
      if (!room.roomSize) e[`room${i}_size`] = 'Select room size';
      if (!room.style) e[`room${i}_style`] = 'Select a style';
      if (!room.budget) e[`room${i}_budget`] = 'Select budget range';
      if (!room.furnitureRequirements.trim()) e[`room${i}_furniture`] = 'Describe furniture needs';
    });

    if (!data.preferredDate) e.preferredDate = 'Please select a preferred date';
    else {
      const selected = new Date(data.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) e.preferredDate = 'Please select a future date';
    }

    return e;
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleRoomChange = (index: number, field: keyof RoomEntry, value: string) => {
    setData((prev) => {
      const rooms = [...prev.rooms];
      rooms[index] = { ...rooms[index], [field]: value };
      return { ...prev, rooms };
    });
    const errKey = `room${index}_${field}`;
    if (errors[errKey]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[errKey];
        return copy;
      });
    }
  };

  const addRoom = () => {
    setData((prev) => ({
      ...prev,
      isMultiRoom: true,
      rooms: [...prev.rooms, { ...emptyRoom }],
    }));
  };

  const removeRoom = (index: number) => {
    setData((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index),
    }));
  };

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileName = `user-photos/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(fileName, file);

      if (uploadError) {
        // If bucket doesn't exist, store as data URL fallback
        const reader = new FileReader();
        reader.onload = () => {
          handleChange('userPhotoUrl', reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        const { data: urlData } = supabase.storage
          .from('user-photos')
          .getPublicUrl(fileName);
        handleChange('userPhotoUrl', urlData.publicUrl);
      }
    } catch {
      // Fallback to data URL
      const reader = new FileReader();
      reader.onload = () => {
        handleChange('userPhotoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const deliveryCharges = data.deliveryArea ? deliveryRates[data.deliveryArea] ?? 4000 : 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      const consultationData = {
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        rooms: data.rooms,
        is_multi_room: data.rooms.length > 1,
        currency,
        delivery_area: data.deliveryArea,
        delivery_charges: deliveryCharges,
        deposit_option: data.depositOption,
        user_photo_url: data.userPhotoUrl || null,
        preferred_date: data.preferredDate,
        message: data.message,
        status: 'pending',
      };

      const { error: dbError } = await supabase.from('consultations').insert(consultationData);

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
            type: 'consultation',
            data: {
              ...data,
              currency,
              deliveryCharges,
              rooms: data.rooms,
            },
          }),
        });
      } catch {
        // Notification is best-effort
      }

      setSubmitted(true);
      setData(initialData);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to submit. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (errorKey: string) =>
    `w-full bg-white border px-4 py-3 font-sans-ui text-sm text-[#3d3327] placeholder:text-[#5c4e3d]/40 transition-colors outline-none ${
      errors[errorKey]
        ? 'border-red-400 focus:border-red-500'
        : 'border-[#e8ded3] focus:border-[#b8945f]'
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
              <h1 className="text-4xl md:text-5xl font-serif text-[#3d3327] mb-4">
                Thank You
              </h1>
              <p className="font-sans-ui text-base text-[#5c4e3d]/70 leading-relaxed mb-6">
                Your consultation request has been received and saved. We have sent a
                notification via WhatsApp and email. Our team will review and respond within 48 hours.
              </p>
              <p className="font-sans-ui text-sm text-[#b8945f] mb-10">
                You can also reach us directly on WhatsApp at +91 78190 86039
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline">
                Send Another Request
              </Button>
            </Reveal>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-32 lg:py-40 px-6 lg:px-10 bg-[#f5f0e8]">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="font-sans-ui text-xs tracking-[0.4em] uppercase text-[#b8945f] mb-6">
              Get in Touch
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#3d3327] leading-[1.1] text-balance">
              Book Your Consultation
            </h1>
            <p className="mt-8 font-sans-ui text-base md:text-lg text-[#5c4e3d]/70 max-w-2xl mx-auto leading-relaxed">
              Share the details of your project and we will be in touch to schedule your
              design consultation. Multi-room bookings supported.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Form + Contact info */}
      <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#faf8f5]">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
          {/* Contact info */}
          <Reveal>
            <div className="lg:sticky lg:top-32 self-start">
              <h2 className="text-3xl font-serif text-[#3d3327] mb-6">Contact Information</h2>
              <p className="font-sans-ui text-sm leading-relaxed text-[#5c4e3d]/70 mb-10">
                Prefer to reach us directly? We are available during studio hours and
                always happy to answer your questions.
              </p>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-11 h-11 flex items-center justify-center bg-[#f5f0e8] shrink-0">
                    <MapPin size={20} className="text-[#b8945f]" />
                  </div>
                  <div>
                    <p className="font-sans-ui text-xs tracking-[0.15em] uppercase text-[#5c4e3d]/50 mb-1">Studio</p>
                    <p className="font-sans-ui text-sm text-[#3d3327]">Roorkee, Uttarakhand<br />India</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-11 h-11 flex items-center justify-center bg-[#f5f0e8] shrink-0">
                    <Phone size={20} className="text-[#b8945f]" />
                  </div>
                  <div>
                    <p className="font-sans-ui text-xs tracking-[0.15em] uppercase text-[#5c4e3d]/50 mb-1">Phone</p>
                    <a href="tel:+917819086039" className="font-sans-ui text-sm text-[#3d3327] hover:text-[#b8945f] transition-colors block">
                      +91 78190 86039
                    </a>
                    <a href="tel:+918477088386" className="font-sans-ui text-sm text-[#3d3327] hover:text-[#b8945f] transition-colors block mt-1">
                      +91 84770 88386
                    </a>
                    <a href="https://wa.me/917819086039" target="_blank" rel="noreferrer" className="font-sans-ui text-sm text-[#b8945f] hover:text-[#a07f4a] transition-colors block mt-1">
                      WhatsApp Chat
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-11 h-11 flex items-center justify-center bg-[#f5f0e8] shrink-0">
                    <Mail size={20} className="text-[#b8945f]" />
                  </div>
                  <div>
                    <p className="font-sans-ui text-xs tracking-[0.15em] uppercase text-[#5c4e3d]/50 mb-1">Email</p>
                    <a href="mailto:arshilfatima517@gmail.com" className="font-sans-ui text-sm text-[#3d3327] hover:text-[#b8945f] transition-colors">
                      arshilfatima517@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-11 h-11 flex items-center justify-center bg-[#f5f0e8] shrink-0">
                    <Clock size={20} className="text-[#b8945f]" />
                  </div>
                  <div>
                    <p className="font-sans-ui text-xs tracking-[0.15em] uppercase text-[#5c4e3d]/50 mb-1">Hours</p>
                    <p className="font-sans-ui text-sm text-[#3d3327]">Mon - Fri: 9am - 6pm<br />Sat: 10am - 4pm</p>
                  </div>
                </li>
              </ul>

              {/* Policy info */}
              <div className="mt-8 p-5 bg-[#f5f0e8] border border-[#e8ded3]">
                <div className="flex items-start gap-3">
                  <Info size={18} className="text-[#b8945f] shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="font-sans-ui text-xs text-[#5c4e3d]/80 leading-relaxed">
                      <strong className="text-[#3d3327]">Deposit Policy:</strong> Half deposit required before delivery. Full payment option also available.
                    </p>
                    <p className="font-sans-ui text-xs text-[#5c4e3d]/80 leading-relaxed">
                      <strong className="text-[#3d3327]">Return Policy:</strong> No returns on custom-made furniture and design services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={100}>
            <form onSubmit={handleSubmit} noValidate className="bg-white border border-[#e8ded3] p-6 sm:p-10 lg:p-12">
              {/* Personal Info */}
              <div className="grid gap-6 sm:grid-cols-2 mb-8">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={data.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className={inputClass('fullName')}
                    placeholder="Jane Doe"
                  />
                  {errors.fullName && (
                    <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500">
                      <AlertCircle size={14} /> {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={inputClass('email')}
                    placeholder="jane@example.com"
                  />
                  {errors.email && (
                    <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500">
                      <AlertCircle size={14} /> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={data.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={inputClass('phone')}
                    placeholder="+91 78190 86039"
                  />
                  {errors.phone && (
                    <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500">
                      <AlertCircle size={14} /> {errors.phone}
                    </p>
                  )}
                </div>

                {/* Photo Upload */}
                <div className="sm:col-span-2">
                  <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                    Your Photo (Optional)
                  </label>
                  <div className="flex items-center gap-4">
                    {data.userPhotoUrl ? (
                      <div className="relative">
                        <img src={data.userPhotoUrl} alt="User" className="w-20 h-20 object-cover border border-[#e8ded3]" />
                        <button
                          type="button"
                          onClick={() => handleChange('userPhotoUrl', '')}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-[#e8ded3] hover:border-[#b8945f] cursor-pointer transition-colors">
                        <Upload size={20} className="text-[#b8945f]" />
                        {uploading && <span className="text-[10px] mt-1 text-[#5c4e3d]/60">Uploading...</span>}
                      </label>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="photo-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload(file);
                      }}
                    />
                    <label htmlFor="photo-upload" className="font-sans-ui text-sm text-[#5c4e3d]/60 cursor-pointer hover:text-[#b8945f] transition-colors">
                      Upload a photo of yourself or your space
                    </label>
                  </div>
                </div>
              </div>

              {/* Room Details */}
              <div className="border-t border-[#e8ded3] pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-serif text-[#3d3327]">
                    Room Details {data.rooms.length > 1 && `(${data.rooms.length} rooms)`}
                  </h3>
                  <button
                    type="button"
                    onClick={addRoom}
                    className="inline-flex items-center gap-1.5 font-sans-ui text-sm text-[#b8945f] hover:text-[#a07f4a] transition-colors"
                  >
                    <Plus size={16} /> Add Another Room
                  </button>
                </div>

                {data.rooms.map((room, index) => (
                  <div key={index} className={`p-5 bg-[#faf8f5] border border-[#e8ded3] mb-4 ${index > 0 ? 'relative' : ''}`}>
                    {data.rooms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoom(index)}
                        className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                          Room Type *
                        </label>
                        <select
                          value={room.roomType}
                          onChange={(e) => handleRoomChange(index, 'roomType', e.target.value)}
                          className={inputClass(`room${index}_type`)}
                        >
                          <option value="">Select room type</option>
                          {roomTypeSuggestions.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                        {errors[`room${index}_type`] && (
                          <p className="mt-1.5 flex items-center gap-1 font-sans-ui text-xs text-red-500">
                            <AlertCircle size={12} /> {errors[`room${index}_type`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                          Room Size *
                        </label>
                        <select
                          value={room.roomSize}
                          onChange={(e) => handleRoomChange(index, 'roomSize', e.target.value)}
                          className={inputClass(`room${index}_size`)}
                        >
                          <option value="">Select room size</option>
                          {roomSizeSuggestions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {errors[`room${index}_size`] && (
                          <p className="mt-1.5 flex items-center gap-1 font-sans-ui text-xs text-red-500">
                            <AlertCircle size={12} /> {errors[`room${index}_size`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                          Design Style *
                        </label>
                        <select
                          value={room.style}
                          onChange={(e) => handleRoomChange(index, 'style', e.target.value)}
                          className={inputClass(`room${index}_style`)}
                        >
                          <option value="">Select a style</option>
                          {designStyleSuggestions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {errors[`room${index}_style`] && (
                          <p className="mt-1.5 flex items-center gap-1 font-sans-ui text-xs text-red-500">
                            <AlertCircle size={12} /> {errors[`room${index}_style`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                          Budget Range *
                        </label>
                        <select
                          value={room.budget}
                          onChange={(e) => handleRoomChange(index, 'budget', e.target.value)}
                          className={inputClass(`room${index}_budget`)}
                        >
                          <option value="">Select budget range</option>
                          {budgetRanges.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                        {errors[`room${index}_budget`] && (
                          <p className="mt-1.5 flex items-center gap-1 font-sans-ui text-xs text-red-500">
                            <AlertCircle size={12} /> {errors[`room${index}_budget`]}
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                          Preferred Colors
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {colorSuggestions.map((c) => (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => {
                                const current = room.colors ? room.colors.split(', ') : [];
                                if (!current.includes(c.name)) {
                                  handleRoomChange(index, 'colors', [...current, c.name].join(', '));
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#e8ded3] hover:border-[#b8945f] transition-colors font-sans-ui text-xs text-[#5c4e3d]"
                            >
                              <span className="w-3 h-3 rounded-full border border-[#e8ded3]" style={{ backgroundColor: c.hex }} />
                              {c.name}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={room.colors}
                          onChange={(e) => handleRoomChange(index, 'colors', e.target.value)}
                          className={inputClass(`room${index}_colors`)}
                          placeholder="Selected colors or type your own..."
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                          Material Preference
                        </label>
                        <select
                          value={room.materials}
                          onChange={(e) => handleRoomChange(index, 'materials', e.target.value)}
                          className={inputClass(`room${index}_materials`)}
                        >
                          <option value="">Select material (optional)</option>
                          {materialSuggestions.map((m) => (
                            <option key={m.name} value={m.name}>
                              {m.name} — {formatPrice(currency === 'INR' ? m.priceINR : m.priceUSD, currency)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                          Furniture Requirements *
                        </label>
                        <textarea
                          rows={3}
                          value={room.furnitureRequirements}
                          onChange={(e) => handleRoomChange(index, 'furnitureRequirements', e.target.value)}
                          className={`${inputClass(`room${index}_furniture`)} resize-none`}
                          placeholder="Describe what furniture you need..."
                        />
                        {errors[`room${index}_furniture`] && (
                          <p className="mt-1.5 flex items-center gap-1 font-sans-ui text-xs text-red-500">
                            <AlertCircle size={12} /> {errors[`room${index}_furniture`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery & Deposit */}
              <div className="grid gap-6 sm:grid-cols-2 mt-8">
                <div>
                  <label htmlFor="deliveryArea" className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                    Delivery Area
                  </label>
                  <select
                    id="deliveryArea"
                    value={data.deliveryArea}
                    onChange={(e) => handleChange('deliveryArea', e.target.value)}
                    className={inputClass('deliveryArea')}
                  >
                    <option value="">Select your area</option>
                    {Object.keys(deliveryRates).map((area) => (
                      <option key={area} value={area}>
                        {area} — {formatPrice(deliveryRates[area], currency)}
                      </option>
                    ))}
                  </select>
                  {data.deliveryArea && (
                    <p className="mt-2 font-sans-ui text-xs text-[#b8945f]">
                      Delivery charge: {formatPrice(deliveryCharges, currency)}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="depositOption" className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                    Payment Option
                  </label>
                  <select
                    id="depositOption"
                    value={data.depositOption}
                    onChange={(e) => handleChange('depositOption', e.target.value)}
                    className={inputClass('depositOption')}
                  >
                    <option value="half">Half Deposit Before Delivery</option>
                    <option value="full">Full Payment Upfront</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="consultationDate" className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                    Preferred Consultation Date *
                  </label>
                  <input
                    id="consultationDate"
                    type="date"
                    value={data.preferredDate}
                    onChange={(e) => handleChange('preferredDate', e.target.value)}
                    className={inputClass('preferredDate')}
                  />
                  {errors.preferredDate && (
                    <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500">
                      <AlertCircle size={14} /> {errors.preferredDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="mt-6">
                <label htmlFor="message" className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                  Additional Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={data.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className={`${inputClass('message')} resize-none`}
                  placeholder="Any other details about your project..."
                />
              </div>

              {errors.submit && (
                <p className="mt-4 flex items-center gap-1.5 font-sans-ui text-sm text-red-500">
                  <AlertCircle size={16} /> {errors.submit}
                </p>
              )}

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <Button type="submit" variant="primary" disabled={submitting} className="w-full sm:w-auto">
                  {submitting ? 'Sending...' : 'Book Consultation'}
                </Button>
                <a
                  href={`https://wa.me/917819086039?text=${encodeURIComponent('Hi, I would like to book a consultation with Blue Mist Interiors.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-sans-ui text-sm text-[#b8945f] hover:text-[#a07f4a] transition-colors"
                >
                  Or message us directly on WhatsApp
                </a>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
