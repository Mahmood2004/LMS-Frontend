import { Video, FileText, File } from "lucide-react";

interface ModuleIconProps {
  type: string;
}

const ModuleIcon = ({ type }: ModuleIconProps) => {
  if (type === "video") return <Video className="w-4 h-4 text-primary" />;
  if (type === "pdf") return <FileText className="w-4 h-4 text-amber-500" />;
  return <File className="w-4 h-4 text-muted-foreground" />;
};

export default ModuleIcon;
