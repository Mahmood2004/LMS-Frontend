import type { SidebarItem } from "./types";
import {
  Users,
  Brain,
  BookOpen,
  Calendar,
  ClipboardCheck,
  Star,
  User,
  BadgeCheck,
  Megaphone,
  BarChart3,
  Bell,
} from "lucide-react";

export const adminSidebarItems: SidebarItem[] = [
  { icon: Brain, label: "Instructors", id: "instructors" },
  { icon: Users, label: "Students", id: "students" },
  { icon: BadgeCheck, label: "Skills", id: "skills" },
];

export const instructorSidebarItems: SidebarItem[] = [
  { icon: BookOpen, label: "My Courses", id: "courses" },
  { icon: Calendar, label: "Attendance", id: "attendance" },
  { icon: ClipboardCheck, label: "Assignments", id: "assignments" },
  { icon: Star, label: "Feedback", id: "feedback" },
  { icon: Users, label: "Students", id: "students" },
  { icon: Megaphone, label: "Announcements", id: "announcements" },
  { icon: BadgeCheck, label: "Skills", id: "skills" },
  { icon: User, label: "Profile", id: "profile" },
];

export const studentNavItems: SidebarItem[] = [
  { icon: BarChart3, label: "Dashboard", id: "dashboard" },
  { icon: BookOpen, label: "My Courses", id: "courses" },
  { icon: ClipboardCheck, label: "Assignments", id: "assignments" },
  { icon: Brain, label: "AI Assistant", id: "assistant" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: User, label: "Profile & CV", id: "profile" },
];