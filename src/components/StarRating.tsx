import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  size?: number;
  readOnly?: boolean;
}

export default function StarRating({ rating, onChange, size = 24, readOnly = false }: StarRatingProps) {
  const [hover, setHover] = useState(0);
  const display = hover || rating;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          className={`transition-transform ${readOnly ? 'cursor-default' : 'hover:scale-110 cursor-pointer'}`}
        >
          <Star
            size={size}
            className={star <= display ? 'fill-[#b8945f] text-[#b8945f]' : 'text-[#e8ded3]'}
          />
        </button>
      ))}
    </div>
  );
}
