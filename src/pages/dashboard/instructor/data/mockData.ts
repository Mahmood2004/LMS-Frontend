import {
  BookOpen,
  Calendar,
  ClipboardCheck,
  Star,
  Users,
  User,
} from "lucide-react";
import type {
  InstructorCourse,
  RosterStudent,
  Submission,
  FeedbackEntry,
  StudentEntry,
  SidebarItem,
} from "../types";

export const coursesData: InstructorCourse[] = [
  {
    id: 1,
    name: "Advanced React Patterns",
    students: 32,
    pendingGrades: 8,
    description:
      "Deep-dive into advanced React patterns, hooks, and performance.",
  },
  {
    id: 2,
    name: "System Design Architecture",
    students: 28,
    pendingGrades: 3,
    description: "Scalable system design principles for modern applications.",
  },
  {
    id: 3,
    name: "Cloud Computing Essentials",
    students: 45,
    pendingGrades: 12,
    description: "Core cloud concepts, AWS, and serverless architectures.",
  },
];

export const rosterData: RosterStudent[] = [
  { id: 1, name: "Alex Rivera", email: "alex@edu.com" },
  { id: 2, name: "Priya Sharma", email: "priya@edu.com" },
  { id: 3, name: "Marcus Johnson", email: "marcus@edu.com" },
  { id: 4, name: "Lisa Chen", email: "lisa@edu.com" },
  { id: 5, name: "David Kim", email: "david@edu.com" },
];

export const submissionsData: Submission[] = [
  {
    id: 1,
    student: "Alex Rivera",
    title: "React Hooks Deep Dive",
    course: "Advanced React Patterns",
    submitted: "Feb 16, 2026",
    type: "assignment",
  },
  {
    id: 2,
    student: "Priya Sharma",
    title: "State Management Essay",
    course: "Advanced React Patterns",
    submitted: "Feb 15, 2026",
    type: "assignment",
  },
  {
    id: 3,
    student: "Marcus Johnson",
    title: "Microservices Design Doc",
    course: "System Design Architecture",
    submitted: "Feb 17, 2026",
    type: "project",
  },
  {
    id: 4,
    student: "Lisa Chen",
    title: "Cloud Architecture Lab",
    course: "Cloud Computing Essentials",
    submitted: "Feb 16, 2026",
    type: "project",
  },
];

export const feedbackHistoryData: FeedbackEntry[] = [
  {
    id: 1,
    student: "Alex Rivera",
    course: "Advanced React Patterns",
    rating: 5,
    date: "Feb 14, 2026",
    feedback:
      "Excellent understanding of hooks lifecycle. Could improve error handling patterns.",
  },
  {
    id: 2,
    student: "Priya Sharma",
    course: "Advanced React Patterns",
    rating: 4,
    date: "Feb 13, 2026",
    feedback:
      "Good grasp of concepts, creative solutions. Needs better code documentation.",
  },
  {
    id: 3,
    student: "Marcus Johnson",
    course: "System Design Architecture",
    rating: 3,
    date: "Feb 12, 2026",
    feedback:
      "Solid system design skills. Should focus more on scalability considerations.",
  },
];

export const studentsData: StudentEntry[] = [
  {
    id: 1,
    name: "Alex Rivera",
    email: "alex@edu.com",
    courses: ["Advanced React Patterns", "Cloud Computing"],
    feedback: "Excellent work overall. Strong technical fundamentals.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@edu.com",
    courses: ["Advanced React Patterns"],
    feedback: "Good progress. Needs improvement in code review practices.",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    email: "marcus@edu.com",
    courses: ["System Design Architecture", "Cloud Computing"],
    feedback:
      "Solid understanding. Could push further on system design problems.",
  },
  {
    id: 4,
    name: "Lisa Chen",
    email: "lisa@edu.com",
    courses: [
      "Cloud Computing Essentials",
      "Advanced React Patterns",
      "System Design",
    ],
    feedback: "Outstanding student. Consistently high-quality work.",
  },
  {
    id: 5,
    name: "David Kim",
    email: "david@edu.com",
    courses: ["System Design Architecture"],
    feedback: "Very promising. Analytical thinking is a strong suit.",
  },
];

export const sidebarItems: SidebarItem[] = [
  { icon: BookOpen, label: "My Courses", id: "courses" },
  { icon: Calendar, label: "Attendance", id: "attendance" },
  { icon: ClipboardCheck, label: "Assignments", id: "assignments" },
  { icon: Star, label: "Feedback", id: "feedback" },
  { icon: Users, label: "Students", id: "students" },
  { icon: User, label: "Profile", id: "profile" },
];
