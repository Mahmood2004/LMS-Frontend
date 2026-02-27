import type { LucideIcon } from "lucide-react";

export type AssignmentStatus = "pending" | "submitted" | "graded";

export type Stat = {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
};

export type CourseModule = {
  title: string;
  type: string;
  desc: string;
};

export type Course = {
  id: number;
  name: string;
  instructor: string;
  progress: number;
  modules: CourseModule[];
};

export type Assignment = {
  id: number;
  title: string;
  course: string;
  due: string;
  status: AssignmentStatus;
  type: "assignment" | "project";
  grade?: string;
  rating?: number;
  feedback?: string;
};

export type Notification = {
  id: number;
  title: string;
  body: string;
  time: string;
  type: "assignment" | "grade" | "announcement";
  read: boolean;
};

export type NavItem = {
  icon: LucideIcon;
  label: string;
  id: string;
};

export type ChatMsg = {
  role: "user" | "bot";
  text: string;
  timestamp?: string;
};

export type { ChatSession } from "./types/chat";

export type ChatHistory = {
  userId: string;
  messages: ChatMsg[];
  updatedAt: string;
};
