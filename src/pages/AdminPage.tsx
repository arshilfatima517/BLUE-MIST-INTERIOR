import { useState, useEffect } from 'react';
import {
  Check,
  X,
  Clock,
  Mail,
  Phone,
  Calendar,
  Package,
  ImageIcon,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import StarRating from '@/components/StarRating';
import { supabase } from '@/lib/supabase';
import { useCurrency } from '@/lib/currency-context';

interface Consultation {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  rooms: any[];
  is_multi_room: boolean;
  currency: string;
  delivery_area: string | null;
  delivery_charges: number;
  deposit_option: string;
  user_photo_url: string | null;
  preferred_date: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

interface FurnitureOrder {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  item_name: string;
  material: string;
  material_price: number;
  quantity: number;
  delivery_area: string | null;
  delivery_charges: number;
  currency: string;
  total_price: number;
  deposit_option: string;
  created_at: string;
}

interface FeedbackRow {
  id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  project_type: string | null;
  created_at: string;
}

interface DesignImage {
  id: string;
  session_id: string | null;
  user_email: string | null;
  room_type: string;
  style: string;
  image_url: string;
  created_at: string;
}

type Tab = 'consultations' | 'orders' | 'feedback' | 'designs';

export default function AdminPage() {
  const { format } = useCurrency();
  const [tab, setTab] = useState<Tab>('consultations');
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [orders, setOrders] = useState<FurnitureOrder[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [designs, setDesigns] = useState<DesignImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, oRes, fRes, dRes] = await Promise.all([
        supabase.from('consultations').select('*').order('created_at', { ascending: false }),
        supabase.from('furniture_orders').select('*').order('created_at', { ascending: false }),
        supabase.from('feedback').select('*').order('created_at', { ascending: false }),
        supabase.from('design_images').select('*').order('created_at', { ascending: false }),
      ]);

      if (cRes.data) setConsultations(cRes.data);
      if (oRes.data) setOrders(oRes.data);
      if (fRes.data) setFeedback(fRes.data);
      if (dRes.data) setDesigns(dRes.data);
    } catch {
      // Tables might not be accessible
    } finally {
      setLoading(false);
    }
  };

  const updateConsultationStatus = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('consultations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setConsultations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );

      const consultation = consultations.find((c) => c.id === id);
      if (consultation) {
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
              type: 'consultation_action',
              data: {
                action: status,
                clientName: consultation.full_name,
                clientPhone: consultation.phone,
                clientEmail: consultation.email,
              },
            }),
          });
        } catch {
          // Best-effort
        }
      }
    } catch {
      // Error updating
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 border-amber-300',
    accepted: 'bg-green-100 text-green-700 border-green-300',
    rejected: 'bg-red-100 text-red-700 border-red-300',
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'consultations', label: 'Consultations', count: consultations.length },
    { key: 'orders', label: 'Furniture Orders', count: orders.length },
    { key: 'feedback', label: 'Feedback', count: feedback.length },
    { key: 'designs', label: 'Saved Designs', count: designs.length },
  ];

  return (
    <div className="pt-20 min-h-screen bg-[#faf8f5]">
      <section className="py-16 px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h1 className="text-4xl font-serif text-[#3d3327] mb-2">Admin Dashboard</h1>
            <p className="font-sans-ui text-sm text-[#5c4e3d]/70 mb-8">
              Manage consultations, orders, feedback, and saved designs.
            </p>
          </Reveal>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-[#e8ded3]">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-3 font-sans-ui text-sm tracking-wide transition-colors relative ${
                  tab === t.key
                    ? 'text-[#b8945f]'
                    : 'text-[#5c4e3d]/60 hover:text-[#3d3327]'
                }`}
              >
                {t.label}
                <span className="ml-1.5 text-xs text-[#5c4e3d]/40">({t.count})</span>
                {tab === t.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b8945f]" />
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center gap-2 py-20 justify-center font-sans-ui text-sm text-[#5c4e3d]/60">
              <Loader2 size={20} className="animate-spin" /> Loading...
            </div>
          ) : (
            <>
              {/* Consultations */}
              {tab === 'consultations' && (
                <div className="space-y-4">
                  {consultations.length === 0 ? (
                    <EmptyState text="No consultation requests yet." />
                  ) : (
                    consultations.map((c) => (
                      <div key={c.id} className="bg-white border border-[#e8ded3] p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-serif text-[#3d3327]">{c.full_name}</h3>
                              <span className={`px-2 py-0.5 text-xs font-sans-ui border ${statusColors[c.status]}`}>
                                {c.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 font-sans-ui text-xs text-[#5c4e3d]/70">
                              <span className="flex items-center gap-1"><Mail size={12} /> {c.email}</span>
                              <span className="flex items-center gap-1"><Phone size={12} /> {c.phone}</span>
                              {c.preferred_date && <span className="flex items-center gap-1"><Calendar size={12} /> {c.preferred_date}</span>}
                            </div>
                          </div>
                          {c.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateConsultationStatus(c.id, 'accepted')}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white text-xs font-sans-ui hover:bg-green-700 transition-colors"
                              >
                                <Check size={14} /> Accept
                              </button>
                              <button
                                onClick={() => updateConsultationStatus(c.id, 'rejected')}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white text-xs font-sans-ui hover:bg-red-600 transition-colors"
                              >
                                <X size={14} /> Reject
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Rooms */}
                        {c.rooms && c.rooms.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {c.rooms.map((room: any, i: number) => (
                              <div key={i} className="p-3 bg-[#faf8f5] border border-[#e8ded3]">
                                <p className="font-sans-ui text-xs text-[#3d3327] font-medium mb-1">
                                  Room {i + 1}: {room.roomType} — {room.roomSize}
                                </p>
                                <p className="font-sans-ui text-xs text-[#5c4e3d]/70">
                                  Style: {room.style} | Budget: {room.budget} | Colors: {room.colors || 'N/A'}
                                  {room.materials && ` | Material: ${room.materials}`}
                                </p>
                                {room.furnitureRequirements && (
                                  <p className="font-sans-ui text-xs text-[#5c4e3d]/60 mt-1">
                                    Furniture: {room.furnitureRequirements}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Extra info */}
                        <div className="mt-4 flex flex-wrap gap-3 font-sans-ui text-xs text-[#5c4e3d]/60">
                          {c.is_multi_room && <span className="px-2 py-1 bg-[#b8945f]/10 text-[#b8945f]">Multi-room</span>}
                          {c.delivery_area && <span>Delivery: {c.delivery_area} ({c.currency} {c.delivery_charges})</span>}
                          <span>Deposit: {c.deposit_option === 'half' ? 'Half' : 'Full'}</span>
                          {c.user_photo_url && (
                            <a href={c.user_photo_url} target="_blank" rel="noreferrer" className="text-[#b8945f] hover:underline">
                              View user photo
                            </a>
                          )}
                        </div>

                        {c.message && (
                          <p className="mt-3 font-sans-ui text-sm text-[#5c4e3d]/70 italic">
                            "{c.message}"
                          </p>
                        )}

                        <p className="mt-3 font-sans-ui text-xs text-[#5c4e3d]/40">
                          {new Date(c.created_at).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Furniture Orders */}
              {tab === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <EmptyState text="No furniture orders yet." />
                  ) : (
                    orders.map((o) => (
                      <div key={o.id} className="bg-white border border-[#e8ded3] p-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="text-lg font-serif text-[#3d3327]">{o.full_name}</h3>
                            <div className="flex flex-wrap gap-4 font-sans-ui text-xs text-[#5c4e3d]/70 mt-1">
                              <span className="flex items-center gap-1"><Mail size={12} /> {o.email}</span>
                              <span className="flex items-center gap-1"><Phone size={12} /> {o.phone}</span>
                            </div>
                          </div>
                          <span className="font-serif text-2xl text-[#b8945f]">
                            {format(o.total_price)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 font-sans-ui text-xs">
                          <div className="p-2 bg-[#faf8f5]">
                            <p className="text-[#5c4e3d]/50 uppercase tracking-wide mb-0.5">Item</p>
                            <p className="text-[#3d3327]">{o.item_name}</p>
                          </div>
                          <div className="p-2 bg-[#faf8f5]">
                            <p className="text-[#5c4e3d]/50 uppercase tracking-wide mb-0.5">Material</p>
                            <p className="text-[#3d3327]">{o.material}</p>
                          </div>
                          <div className="p-2 bg-[#faf8f5]">
                            <p className="text-[#5c4e3d]/50 uppercase tracking-wide mb-0.5">Quantity</p>
                            <p className="text-[#3d3327]">{o.quantity}</p>
                          </div>
                          <div className="p-2 bg-[#faf8f5]">
                            <p className="text-[#5c4e3d]/50 uppercase tracking-wide mb-0.5">Deposit</p>
                            <p className="text-[#3d3327]">{o.deposit_option === 'half' ? 'Half' : 'Full'}</p>
                          </div>
                        </div>
                        {o.delivery_area && (
                          <p className="mt-3 font-sans-ui text-xs text-[#5c4e3d]/60">
                            Delivery to {o.delivery_area} — {format(o.delivery_charges)}
                          </p>
                        )}
                        <p className="mt-3 font-sans-ui text-xs text-[#5c4e3d]/40">
                          {new Date(o.created_at).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Feedback */}
              {tab === 'feedback' && (
                <div className="space-y-4">
                  {feedback.length === 0 ? (
                    <EmptyState text="No feedback submitted yet." />
                  ) : (
                    feedback.map((f) => (
                      <div key={f.id} className="bg-white border border-[#e8ded3] p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-sans-ui text-sm font-medium text-[#3d3327]">{f.name}</h3>
                            <p className="font-sans-ui text-xs text-[#5c4e3d]/50">{f.email}</p>
                          </div>
                          <StarRating rating={f.rating} readOnly size={16} />
                        </div>
                        {f.project_type && (
                          <p className="font-sans-ui text-xs text-[#b8945f] mb-2">{f.project_type}</p>
                        )}
                        <p className="font-sans-ui text-sm text-[#5c4e3d]/70 leading-relaxed">{f.message}</p>
                        <p className="mt-3 font-sans-ui text-xs text-[#5c4e3d]/40">
                          {new Date(f.created_at).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Saved Designs */}
              {tab === 'designs' && (
                <div className="space-y-4">
                  {designs.length === 0 ? (
                    <EmptyState text="No saved designs yet." />
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {designs.map((d) => (
                        <div key={d.id} className="bg-white border border-[#e8ded3] overflow-hidden">
                          {d.image_url && (
                            <img src={d.image_url} alt={d.style} className="w-full h-48 object-cover" />
                          )}
                          <div className="p-4">
                            <h3 className="font-sans-ui text-sm font-medium text-[#3d3327]">{d.style}</h3>
                            <p className="font-sans-ui text-xs text-[#5c4e3d]/60">{d.room_type}</p>
                            {d.user_email && (
                              <p className="font-sans-ui text-xs text-[#b8945f] mt-1">{d.user_email}</p>
                            )}
                            <p className="font-sans-ui text-xs text-[#5c4e3d]/40 mt-2">
                              {new Date(d.created_at).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="bg-white border border-[#e8ded3] p-12 text-center">
      <p className="font-sans-ui text-sm text-[#5c4e3d]/60">{text}</p>
    </div>
  );
}
