import { useEffect, useState } from 'react';
import { Loader2, MessageSquarePlus } from 'lucide-react';
import Reveal from '@/components/Reveal';
import TestimonialCard from '@/components/TestimonialCard';
import SectionTitle from '@/components/SectionTitle';
import Button from '@/components/Button';
import StarRating from '@/components/StarRating';
import { testimonials } from '@/data/testimonials';
import { supabase } from '@/lib/supabase';

interface FeedbackRow {
  id: string;
  name: string;
  rating: number;
  message: string;
  project_type: string | null;
  created_at: string;
}

export default function TestimonialsPage() {
  const [liveFeedback, setLiveFeedback] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('id, name, rating, message, project_type, created_at')
          .order('created_at', { ascending: false })
          .limit(12);
        if (!error && data) setLiveFeedback(data);
      } catch {
        // ignore — fall back to static testimonials
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-32 lg:py-40 px-6 lg:px-10 bg-[#f5f0e8]">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="font-sans-ui text-xs tracking-[0.4em] uppercase text-[#b8945f] mb-6">
              Testimonials
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[#3d3327] leading-[1.1] text-balance">
              Words from Our Clients
            </h1>
            <p className="mt-8 font-sans-ui text-base md:text-lg text-[#5c4e3d]/70 max-w-2xl mx-auto leading-relaxed">
              The relationships we build with our clients are at the heart of our studio.
              Here is what they have to say.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Live customer reviews */}
      {liveFeedback.length > 0 && (
        <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#f5f0e8]">
          <div className="mx-auto max-w-7xl">
            <SectionTitle
              eyebrow="Latest Reviews"
              title="Recent Customer Feedback"
              description="Real reviews submitted by our clients."
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              {liveFeedback.map((fb, i) => (
                <Reveal key={fb.id} delay={(i % 3) * 100}>
                  <div className="bg-white border border-[#e8ded3] p-6 h-full flex flex-col">
                    <StarRating rating={fb.rating} readOnly size={18} />
                    <p className="mt-4 font-sans-ui text-sm text-[#5c4e3d]/80 leading-relaxed flex-1">
                      "{fb.message}"
                    </p>
                    <div className="mt-5 pt-4 border-t border-[#e8ded3]">
                      <p className="font-sans-ui text-sm font-medium text-[#3d3327]">{fb.name}</p>
                      {fb.project_type && (
                        <p className="font-sans-ui text-xs text-[#b8945f] mt-0.5">{fb.project_type}</p>
                      )}
                      <p className="font-sans-ui text-xs text-[#5c4e3d]/40 mt-1">
                        {new Date(fb.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button page="feedback" variant="outline">
                <span className="inline-flex items-center gap-2">
                  <MessageSquarePlus size={16} /> Share Your Experience
                </span>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* All testimonials */}
      <section className="py-24 lg:py-32 px-6 lg:px-10 bg-[#faf8f5]">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Featured Stories"
            title="Client Transformations"
            description="A selection of our most memorable projects and the words that came with them."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 100}>
                <TestimonialCard testimonial={t} />
              </Reveal>
            ))}
          </div>
          {loading && (
            <div className="flex items-center justify-center gap-2 mt-8 font-sans-ui text-sm text-[#5c4e3d]/60">
              <Loader2 size={16} className="animate-spin" /> Loading more reviews...
            </div>
          )}
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-16 px-6 lg:px-10 bg-[#3d3327]">
        <div className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { value: '98%', label: 'Would Recommend' },
            { value: '250+', label: 'Happy Clients' },
            { value: '15+', label: 'Years of Trust' },
            { value: '4.9/5', label: 'Average Rating' },
          ].map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div>
                <p className="text-3xl lg:text-4xl font-serif text-[#c9a973] mb-1">{stat.value}</p>
                <p className="font-sans-ui text-xs text-white/50">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
