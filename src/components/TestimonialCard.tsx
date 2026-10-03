import { Star } from 'lucide-react';
import type { Testimonial } from '@/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <figure className="bg-white border border-[#e8ded3] p-8 lg:p-10 flex flex-col h-full">
      <div className="flex gap-1 mb-5">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={16} className="fill-[#b8945f] text-[#b8945f]" />
        ))}
      </div>
      <blockquote className="font-serif text-lg md:text-xl leading-relaxed text-[#3d3327] italic flex-1">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 pt-6 border-t border-[#e8ded3]">
        <p className="font-sans-ui text-sm font-medium text-[#3d3327]">{testimonial.name}</p>
        <p className="font-sans-ui text-xs text-[#5c4e3d]/60 mt-1">
          {testimonial.role} &middot; {testimonial.location}
        </p>
      </figcaption>
    </figure>
  );
}
