import type { LucideIcon } from "lucide-react";

export type SidebarItem = {
  icon: LucideIcon;
  label: string;
  id: string;
};

export type InstructorEntry = {
  id: number;
  name: string;
  username: string;
  email: string;
  bio: string;
  courses: string[];
};

export type StudentEntry = {
  id: number;
  name: string;
  username: string;
  email: string;
  bio: string;
  skills: string[];
  cvUrl?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  courses: string[];
};

export type SkillEntry = {
  id: number;
  name: string;
};
