interface InitialsProps {
  name: string;
}

const Initials = ({ name }: InitialsProps) => {
  const i = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="w-9 h-9 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
      {i}
    </div>
  );
};

export default Initials;
