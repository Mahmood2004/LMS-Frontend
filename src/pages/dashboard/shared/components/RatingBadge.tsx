interface RatingBadgeProps {
  rating: number;
}

const RatingBadge = ({ rating }: RatingBadgeProps) => {
  const color =
    rating >= 4
      ? "bg-emerald-100 text-emerald-700"
      : rating >= 3
        ? "bg-amber-100 text-amber-700"
        : "bg-destructive/10 text-destructive";
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>
      {rating}.0 / 5
    </span>
  );
};

export default RatingBadge;
