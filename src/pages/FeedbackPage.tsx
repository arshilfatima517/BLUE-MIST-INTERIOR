import { useState, useEffect, type FormEvent } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import Button from '@/components/Button';
import StarRating from '@/components/StarRating';
import { supabase } from '@/lib/supabase';

interface Feedback {
  id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  project_type: string | null;
  created_at: string;
}

export default function FeedbackPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [projectType, setProjectType] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setFeedbackList(data || []);
    } catch {
      // Table might be empty or not accessible
    } finally {
      setLoadingList(false);
    }
  };

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Please enter your name';
    if (!email.trim()) e.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email';
    if (!message.trim()) e.message = 'Please share your feedback';
    else if (message.trim().length < 10) e.message = 'Feedback must be at least 10 characters';
    return e;
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
      const { error: dbError } = await supabase.from('feedback').insert({
        name,
        email,
        rating,
        message,
        project_type: projectType || null,
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
            type: 'feedback',
            data: { name, email, rating, message, projectType },
          }),
        });
      } catch {
        // Best-effort
      }

      setSubmitted(true);
      setName('');
      setEmail('');
      setRating(5);
      setMessage('');
      setProjectType('');
      loadFeedback();
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : 'Failed to submit feedback' });
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
              <h1 className="text-4xl md:text-5xl font-serif text-[#3d3327] mb-4">Thank You</h1>
              <p className="font-sans-ui text-base text-[#5c4e3d]/70 leading-relaxed mb-10">
                Your feedback has been received. We appreciate you taking the time to share
                your experience with Blue Mist Interiors.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline">
                Leave Another Review
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
                <MessageSquare size={18} className="text-[#b8945f]" />
                <span className="font-sans-ui text-xs tracking-[0.2em] uppercase text-[#b8945f]">Feedback & Rating</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif text-[#3d3327] leading-[1.1] text-balance">
              Share Your Experience
            </h1>
            <p className="mt-8 font-sans-ui text-base md:text-lg text-[#5c4e3d]/70 max-w-2xl mx-auto leading-relaxed">
              Your feedback helps us improve and helps others find the right designer.
              Tell us about your project and rate your experience.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#faf8f5]">
        <div className="mx-auto max-w-5xl grid gap-12 lg:grid-cols-2">
          {/* Form */}
          <Reveal>
            <form onSubmit={handleSubmit} noValidate className="bg-white border border-[#e8ded3] p-6 sm:p-10">
              <h2 className="text-2xl font-serif text-[#3d3327] mb-6">Leave a Review</h2>

              <div className="space-y-5">
                <div>
                  <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass('name')}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500"><AlertCircle size={14} /> {errors.name}</p>}
                </div>

                <div>
                  <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass('email')}
                    placeholder="jane@example.com"
                  />
                  {errors.email && <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500"><AlertCircle size={14} /> {errors.email}</p>}
                </div>

                <div>
                  <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">Rating *</label>
                  <StarRating rating={rating} onChange={setRating} size={32} />
                </div>

                <div>
                  <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">Project Type (Optional)</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className={inputClass('projectType')}
                  >
                    <option value="">Select project type</option>
                    <option value="Full Home Design">Full Home Design</option>
                    <option value="Living Room">Living Room</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Office">Office</option>
                    <option value="Furniture Purchase">Furniture Purchase</option>
                    <option value="Consultation Only">Consultation Only</option>
                  </select>
                </div>

                <div>
                  <label className="block font-sans-ui text-xs tracking-[0.1em] uppercase text-[#5c4e3d]/70 mb-2">Your Feedback *</label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`${inputClass('message')} resize-none`}
                    placeholder="Tell us about your experience working with Blue Mist Interiors..."
                  />
                  {errors.message && <p className="mt-2 flex items-center gap-1.5 font-sans-ui text-xs text-red-500"><AlertCircle size={14} /> {errors.message}</p>}
                </div>
              </div>

              {errors.submit && (
                <p className="mt-4 flex items-center gap-1.5 font-sans-ui text-sm text-red-500"><AlertCircle size={16} /> {errors.submit}</p>
              )}

              <div className="mt-8">
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </div>
            </form>
          </Reveal>

          {/* Recent Feedback */}
          <Reveal delay={100}>
            <div>
              <h2 className="text-2xl font-serif text-[#3d3327] mb-6">Recent Reviews</h2>
              {loadingList ? (
                <div className="flex items-center gap-2 font-sans-ui text-sm text-[#5c4e3d]/60">
                  <Loader2 size={16} className="animate-spin" /> Loading reviews...
                </div>
              ) : feedbackList.length === 0 ? (
                <div className="p-6 bg-white border border-[#e8ded3] text-center">
                  <p className="font-sans-ui text-sm text-[#5c4e3d]/60">
                    No reviews yet. Be the first to share your experience!
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {feedbackList.map((fb) => (
                    <div key={fb.id} className="p-5 bg-white border border-[#e8ded3]">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-sans-ui text-sm font-medium text-[#3d3327]">{fb.name}</p>
                          {fb.project_type && (
                            <p className="font-sans-ui text-xs text-[#5c4e3d]/50">{fb.project_type}</p>
                          )}
                        </div>
                        <StarRating rating={fb.rating} readOnly size={16} />
                      </div>
                      <p className="font-sans-ui text-sm text-[#5c4e3d]/70 leading-relaxed">{fb.message}</p>
                      <p className="font-sans-ui text-xs text-[#5c4e3d]/40 mt-3">
                        {new Date(fb.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
