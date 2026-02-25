import { Star } from "lucide-react";

interface StarDisplayProps {
  rating: number;
}

const StarDisplay = ({ rating }: StarDisplayProps) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`w-4 h-4 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-muted"}`}
      />
    ))}
  </div>
);

export default StarDisplay;
