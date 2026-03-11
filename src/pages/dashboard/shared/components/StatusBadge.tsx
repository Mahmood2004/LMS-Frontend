import { Clock, CheckCircle2, Award } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const map: Record<string, string> = {
    pending:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400",
    submitted: "bg-primary/10 text-primary border-primary/20",
    graded:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400",  
    "Deadline Passed": "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400",
  };
  const icons: Record<string, React.ReactNode> = {
    pending: <Clock className="w-3 h-3" />,
    submitted: <CheckCircle2 className="w-3 h-3" />,
    graded: <Award className="w-3 h-3" />,
    "Deadline Passed": <Clock className="w-3 h-3" />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${map[status] ?? ""}`}
    >
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
