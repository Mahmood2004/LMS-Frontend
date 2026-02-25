import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (v: number) => void;
}

const StarRating = ({ value, onChange }: StarRatingProps) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        onClick={() => onChange(s)}
        className="transition-transform hover:scale-110"
      >
        <Star
          className={`w-6 h-6 transition-colors ${s <= value ? "fill-amber-400 text-amber-400" : "text-muted"}`}
        />
      </button>
    ))}
  </div>
);

export default StarRating;
