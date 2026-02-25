import type { LucideIcon } from "lucide-react";

export type AttendanceStatus = "present" | "absent" | "late";

export type InstructorCourse = {
  id: number;
  name: string;
  students: number;
  pendingGrades: number;
  description: string;
};

export type RosterStudent = {
  id: number;
  name: string;
  email: string;
};

export type Submission = {
  id: number;
  student: string;
  title: string;
  course: string;
  submitted: string;
  type: string;
};

export type FeedbackEntry = {
  id: number;
  student: string;
  course: string;
  rating: number;
  date: string;
  feedback: string;
};

export type StudentEntry = {
  id: number;
  name: string;
  email: string;
  courses: string[];
  feedback: string;
};

export type SidebarItem = {
  icon: LucideIcon;
  label: string;
  id: string;
};
