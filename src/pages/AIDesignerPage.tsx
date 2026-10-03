import { useState, type FormEvent } from 'react';
import {
  Sparkles,
  Palette,
  Sofa,
  Lightbulb,
  Frame,
  Loader2,
  AlertCircle,
  Wand2,
  Save,
  Check,
  Plus,
  Lightbulb as LightBulbIcon,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import Button from '@/components/Button';
import RoomEditor from '@/components/RoomEditor';
import { useCurrency } from '@/lib/currency-context';
import { supabase } from '@/lib/supabase';
import {
  roomTypeSuggestions,
  roomSizeSuggestions,
  designStyleSuggestions,
  colorSuggestions,
  formatPrice,
} from '@/lib/config';
import { roomSuggestions } from '@/data/roomSuggestions';
import type { DesignResult, AIRequest } from '@/types/ai-designer';
import { generateMockDesign } from '@/data/mockDesign';

const budgetRangesINR = [
  'Under ₹40,000',
  '₹40,000 - ₹1,20,000',
  '₹1,20,000 - ₹2,40,000',
  '₹2,40,000 - ₹4,00,000',
  '₹4,00,000 - ₹8,00,000',
  '₹8,00,000+',
];

const budgetRangesUSD = [
  'Under $5,000',
  '$5,000 - $15,000',
  '$15,000 - $30,000',
  '$30,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000+',
];

interface FormErrors {
  roomType?: string;
  roomSize?: string;
  preferredStyle?: string;
  preferredColors?: string;
  budget?: string;
  furnitureRequirements?: string;
  email?: string;
}

export default function AIDesignerPage() {
  const { currency } = useCurrency();
  const budgetRanges = currency === 'INR' ? budgetRangesINR : budgetRangesUSD;

  const [request, setRequest] = useState<AIRequest & { email?: string }>({
    roomType: '',
    roomSize: '',
    preferredStyle: '',
    preferredColors: '',
    budget: '',
    furnitureRequirements: '',
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<DesignResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const currentSuggestion = request.roomType ? roomSuggestions[request.roomType] : null;

  const addSuggestionToRequirements = (item: string) => {
    const key = `${request.roomType}:${item}`;
    if (addedItems.has(key)) return;
    setAddedItems((prev) => new Set(prev).add(key));
    const current = request.furnitureRequirements.trim();
    const prefix = current && !current.endsWith('.') && !current.endsWith(',') ? ', ' : current ? ' ' : '';
    handleChange('furnitureRequirements', `${current}${prefix}${item}`);
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!request.roomType) e.roomType = 'Please select a room type';
    if (!request.roomSize.trim()) e.roomSize = 'Please enter the room size';
    if (!request.preferredStyle) e.preferredStyle = 'Please select a preferred style';
    if (!request.preferredColors.trim()) e.preferredColors = 'Please enter preferred colors';
    if (!request.budget) e.budget = 'Please select a budget range';
    if (!request.furnitureRequirements.trim()) e.furnitureRequirements = 'Please describe your furniture needs';
    return e;
  };

  const handleChange = (field: keyof typeof request, value: string) => {
    setRequest((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      let designResult: DesignResult | null = null;

      if (supabaseUrl && supabaseAnonKey) {
        const response = await fetch(`${supabaseUrl}/functions/v1/ai-designer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify(request),
        });

        if (response.ok) {
          designResult = (await response.json()) as DesignResult;
        }
      }

      if (!designResult) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        designResult = generateMockDesign(request);
      }

      setResult(designResult);
    } catch {
      const mockResult = generateMockDesign(request);
      setResult(mockResult);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const sessionId = sessionStorage.getItem('session_id') || crypto.randomUUID();
      sessionStorage.setItem('session_id', sessionId);

      const { error: saveError } = await supabase.from('design_images').insert({
        session_id: sessionId,
        user_email: request.email || null,
        room_type: request.roomType,
        style: result.recommendedStyle,
        image_url: result.imageUrl || '',
        design_data: result,
      });

      if (saveError) throw saveError;
      setSaved(true);
    } catch {
      setError('Could not save design. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full bg-white border px-4 py-3 font-sans-ui text-sm text-[#3d3327] placeholder:text-[#5c4e3d]/40 transition-colors outline-none ${
      errors[field]
        ? 'border-red-400 focus:border-red-500'
        : 'border-[#e8ded3] focus:border-[#b8945f]'
    }`;

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-32 lg:py-40 px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/9617384/pexels-photo-9617384.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Architect at work"
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#3d3327]/60" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <Reveal>
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles size={16} className="text-[#c9a973]" />
                <span className="font-sans-ui text-xs tracking-[0.2em] uppercase text-white">AI-Powered</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] text-balance">
              AI Interior Design Assistant
            </h1>
            <p className="mt-8 font-sans-ui text-base md:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
              Tell us about your space and preferences. Our AI assistant will generate
              personalized interior design recommendations tailored to your needs.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Form */}
      <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#faf8f5]">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-[#3d3327] mb-3">
                Tell Us About Your Space
              </h2>
              <p className="font-sans-ui text-sm text-[#5c4e3d]/70">
                Fill in the details below and let our AI craft a design concept for you.
              </p>
            </div>
          </Reveal>

          {/* Suggestion box */}
          <Reveal delay={50}>
            <div className="mb-6 p-4 bg-[#f5f0e8] border border-[#e8ded3] flex items-start gap-3">
              <LightBulbIcon size={18} className="text-[#b8945f] shrink-0 mt-0.5" />
              <div className="font-sans-ui text-xs text-[#5c4e3d]/80 leading-relaxed">
                <strong className="text-[#3d3327]">Design Suggestions:</strong> Not sure where to start?
                Popular styles include <em>Modern</em> for clean lines, <em>Scandinavian</em> for cozy minimalism,
                <em> Japandi</em> for serene simplicity, and <em>Luxury</em> for rich textures.
                For room size, a typical bedroom is 120-180 sq ft, a living room 200-400 sq ft.
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <form onSubmit={handleSubmit} noValidate className="bg-white border border-[#e8ded3] p-6 sm:p-10">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Room Type with suggestions */}
                <div>
                  <label htmlFor="ai-roomType" className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                    Room Type *
                  </label>
                  <select
                    id="ai-roomType"
                    value={request.roomType}
                    onChange={(e) => handleChange('roomType', e.target.value)}
                    className={inputClass('roomType')}
                  >
                    <option value="">Select room type</option>
                    {roomTypeSuggestions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  {errors.roomType && (
                    <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500">
                      <AlertCircle size={14} /> {errors.roomType}
                    </p>
                  )}
                </div>

                {/* Dynamic furniture + showpiece suggestions based on room type */}
                {currentSuggestion && (
                  <div className="sm:col-span-2 animate-fade-in">
                    <div className="p-4 bg-[#f5f0e8] border border-[#b8945f]/20 rounded-md">
                      <div className="flex items-center gap-2 mb-3">
                        <Sofa size={16} className="text-[#b8945f]" />
                        <p className="font-sans-ui text-xs tracking-[0.1em] uppercase text-[#b8945f]">
                          Suggested Furniture for {request.roomType}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {currentSuggestion.furniture.map((item) => {
                          const key = `${request.roomType}:${item}`;
                          const isAdded = addedItems.has(key);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => addSuggestionToRequirements(item)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-sans-ui transition-all ${
                                isAdded
                                  ? 'border-[#b8945f] bg-[#b8945f] text-white cursor-default'
                                  : 'border-[#e8ded3] text-[#5c4e3d] hover:border-[#b8945f] hover:bg-white'
                              }`}
                            >
                              {isAdded ? <Check size={12} /> : <Plus size={12} />}
                              {item}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 mb-3 mt-4 pt-3 border-t border-[#e8ded3]">
                        <Frame size={16} className="text-[#b8945f]" />
                        <p className="font-sans-ui text-xs tracking-[0.1em] uppercase text-[#b8945f]">
                          Showpiece & Decor Suggestions
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentSuggestion.showpieces.map((item) => {
                          const key = `${request.roomType}:${item}`;
                          const isAdded = addedItems.has(key);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => addSuggestionToRequirements(item)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-sans-ui transition-all ${
                                isAdded
                                  ? 'border-[#b8945f] bg-[#b8945f] text-white cursor-default'
                                  : 'border-[#e8ded3] text-[#5c4e3d] hover:border-[#b8945f] hover:bg-white'
                              }`}
                            >
                              {isAdded ? <Check size={12} /> : <Plus size={12} />}
                              {item}
                            </button>
                          );
                        })}
                      </div>
                      <p className="mt-3 font-sans-ui text-[11px] text-[#5c4e3d]/50">
                        Click any chip to add it to your furniture requirements. You can still type your own items below.
                      </p>
                    </div>
                  </div>
                )}

                {/* Room Size with suggestions */}
                <div>
                  <label htmlFor="ai-roomSize" className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                    Room Size *
                  </label>
                  <select
                    id="ai-roomSize"
                    value={request.roomSize}
                    onChange={(e) => handleChange('roomSize', e.target.value)}
                    className={inputClass('roomSize')}
                  >
                    <option value="">Select room size</option>
                    {roomSizeSuggestions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.roomSize && (
                    <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500">
                      <AlertCircle size={14} /> {errors.roomSize}
                    </p>
                  )}
                </div>

                {/* Preferred Style with suggestions */}
                <div>
                  <label htmlFor="ai-style" className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                    Preferred Style *
                  </label>
                  <select
                    id="ai-style"
                    value={request.preferredStyle}
                    onChange={(e) => handleChange('preferredStyle', e.target.value)}
                    className={inputClass('preferredStyle')}
                  >
                    <option value="">Select a style</option>
                    {designStyleSuggestions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.preferredStyle && (
                    <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500">
                      <AlertCircle size={14} /> {errors.preferredStyle}
                    </p>
                  )}
                </div>

                {/* Budget */}
                <div>
                  <label htmlFor="ai-budget" className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                    Budget * ({currency})
                  </label>
                  <select
                    id="ai-budget"
                    value={request.budget}
                    onChange={(e) => handleChange('budget', e.target.value)}
                    className={inputClass('budget')}
                  >
                    <option value="">Select budget range</option>
                    {budgetRanges.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  {errors.budget && (
                    <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500">
                      <AlertCircle size={14} /> {errors.budget}
                    </p>
                  )}
                </div>

                {/* Preferred Colors with color picker suggestions */}
                <div className="sm:col-span-2">
                  <label htmlFor="ai-colors" className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                    Preferred Colors *
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {colorSuggestions.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => {
                          const current = request.preferredColors ? request.preferredColors.split(', ') : [];
                          if (!current.includes(c.name)) {
                            handleChange('preferredColors', [...current, c.name].join(', '));
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
                    id="ai-colors"
                    type="text"
                    value={request.preferredColors}
                    onChange={(e) => handleChange('preferredColors', e.target.value)}
                    className={inputClass('preferredColors')}
                    placeholder="e.g. warm whites, beige, gold accents, dark brown"
                  />
                  {errors.preferredColors && (
                    <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500">
                      <AlertCircle size={14} /> {errors.preferredColors}
                    </p>
                  )}
                </div>

                {/* Furniture Requirements */}
                <div className="sm:col-span-2">
                  <label htmlFor="ai-furniture" className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                    Furniture Requirements *
                  </label>
                  <textarea
                    id="ai-furniture"
                    rows={4}
                    value={request.furnitureRequirements}
                    onChange={(e) => handleChange('furnitureRequirements', e.target.value)}
                    className={`${inputClass('furnitureRequirements')} resize-none`}
                    placeholder="Describe what furniture you need, e.g. a sofa for 4, coffee table, TV unit, bookshelf..."
                  />
                  {errors.furnitureRequirements && (
                    <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500">
                      <AlertCircle size={14} /> {errors.furnitureRequirements}
                    </p>
                  )}
                </div>

                {/* Email (optional, for saving) */}
                <div className="sm:col-span-2">
                  <label htmlFor="ai-email" className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">
                    Your Email (to save your design)
                  </label>
                  <input
                    id="ai-email"
                    type="email"
                    value={request.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={inputClass('email')}
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 font-sans-ui text-sm tracking-wide px-8 py-3.5 bg-[#b8945f] text-white hover:bg-[#a07f4a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 size={18} />
                      Generate Design Idea
                    </>
                  )}
                </button>
                {error && (
                  <p className="flex items-center gap-1.5 font-sans-ui text-xs text-amber-600">
                    <AlertCircle size={14} /> {error}
                  </p>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      {/* Results */}
      {result && (
        <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#f5f0e8] animate-fade-in">
          <div className="mx-auto max-w-5xl">
            {/* Header + Save */}
            <Reveal>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <p className="font-sans-ui text-xs tracking-[0.4em] uppercase text-[#b8945f] mb-2">
                    Your Design Concept
                  </p>
                  <h2 className="text-3xl md:text-4xl font-serif text-[#3d3327]">
                    {result.recommendedStyle}
                  </h2>
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving || saved}
                  className="inline-flex items-center gap-2 font-sans-ui text-sm px-5 py-2.5 border border-[#b8945f] text-[#b8945f] hover:bg-[#b8945f] hover:text-white transition-all duration-300 disabled:opacity-50"
                >
                  {saved ? (
                    <><Check size={16} /> Saved</>
                  ) : saving ? (
                    <><Loader2 size={16} className="animate-spin" /> Saving...</>
                  ) : (
                    <><Save size={16} /> Save Design</>
                  )}
                </button>
              </div>
              <p className="font-sans-ui text-base text-[#5c4e3d]/70 max-w-2xl leading-relaxed mb-8">
                {result.styleDescription}
              </p>
            </Reveal>

            {/* AI image + draggable furniture overlay */}
            {result.imageUrl && (
              <Reveal delay={100}>
                <div className="mb-8">
                  <RoomEditor
                    imageUrl={result.imageUrl}
                    roomTypeLabel={request.roomType}
                    furnitureSuggestions={result.furnitureSuggestions}
                  />
                </div>
              </Reveal>
            )}

            {/* Color Palette */}
            <Reveal>
              <div className="bg-white border border-[#e8ded3] p-8 lg:p-10 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <Palette size={22} className="text-[#b8945f]" />
                  <h3 className="text-2xl font-serif text-[#3d3327]">Color Palette</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {result.colorPalette.map((color) => (
                    <div key={color.name} className="text-center">
                      <div
                        className="w-full aspect-square mb-3 border border-[#e8ded3]"
                        style={{ backgroundColor: color.hex }}
                      />
                      <p className="font-sans-ui text-sm text-[#3d3327]">{color.name}</p>
                      <p className="font-sans-ui text-xs text-[#5c4e3d]/50 mt-0.5">{color.hex}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Furniture + Lighting */}
            <div className="grid gap-8 md:grid-cols-2 mb-8">
              <Reveal>
                <div className="bg-white border border-[#e8ded3] p-8 lg:p-10 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <Sofa size={22} className="text-[#b8945f]" />
                    <h3 className="text-2xl font-serif text-[#3d3327]">Furniture Suggestions</h3>
                  </div>
                  <ul className="space-y-3">
                    {result.furnitureSuggestions.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-[#b8945f] rounded-full mt-2 shrink-0" />
                        <span className="font-sans-ui text-sm text-[#5c4e3d]/80 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="bg-white border border-[#e8ded3] p-8 lg:p-10 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <Lightbulb size={22} className="text-[#b8945f]" />
                    <h3 className="text-2xl font-serif text-[#3d3327]">Lighting Suggestions</h3>
                  </div>
                  <ul className="space-y-3">
                    {result.lightingSuggestions.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 bg-[#b8945f] rounded-full mt-2 shrink-0" />
                        <span className="font-sans-ui text-sm text-[#5c4e3d]/80 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            {/* Decoration */}
            <Reveal>
              <div className="bg-white border border-[#e8ded3] p-8 lg:p-10 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <Frame size={22} className="text-[#b8945f]" />
                  <h3 className="text-2xl font-serif text-[#3d3327]">Decoration Suggestions</h3>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {result.decorationSuggestions.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-[#b8945f] rounded-full mt-2 shrink-0" />
                      <span className="font-sans-ui text-sm text-[#5c4e3d]/80 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Budget */}
            <Reveal>
              <div className="bg-[#3d3327] p-8 lg:p-10 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[#c9a973] text-2xl font-serif">{currency === 'INR' ? '₹' : '$'}</span>
                  <h3 className="text-2xl font-serif text-white">Estimated Budget</h3>
                </div>
                <p className="font-serif text-4xl text-[#c9a973] mb-8">{result.estimatedBudget}</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {result.budgetBreakdown.map((item) => (
                    <div key={item.item} className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="font-sans-ui text-sm text-white/60">{item.item}</span>
                      <span className="font-sans-ui text-sm text-white font-medium">{item.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* CTA */}
            <div className="mt-12 text-center">
              <Reveal>
                <p className="font-sans-ui text-sm text-[#5c4e3d]/70 mb-6">
                  Like what you see? Let's turn this concept into reality.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button page="contact" variant="primary">
                    Book a Consultation
                  </Button>
                  <Button page="furniture" variant="outline">
                    Buy Furniture
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
