import type { LucideIcon } from "lucide-react";

export type AttendanceStatus = "present" | "absent" | "late";

export type InstructorCourse = {
  id: number;
  name: string;
  students: number;
  pendingGrades: number;
  description: string;
  content: Array<{
    id: number;
    title: string;
    type: "pdf" | "video";
    url: string;
    createdAt: number;
  }>;
  createdAt: number;
};

export type RosterStudent = {
  id: number;
  name: string;
  email: string;
};

export type Assignment = {
  id: number;
  course_id: number;
  title: string;
  description: string;
  type: "assignment" | "project";
  dueDate: string;
  maxScore: number;
  createdAt: string;
};

export type Submission = {
  id: number;
  student: string;
  assignment_id: number;
  course_id: number;
  title: string;
  submitted: string;
  type: string;
  graded: boolean;
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
  cvUrl: string;
  skills: string[];
};

export type SidebarItem = {
  icon: LucideIcon;
  label: string;
  id: string;
};
