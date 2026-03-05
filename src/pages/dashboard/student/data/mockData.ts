import {
  BookOpen,
  ClipboardCheck,
  Calendar,
  BarChart3,
  Brain,
  Bell,
  User,
} from "lucide-react";
import type { Stat, Course, Assignment, Notification, NavItem } from "../types";

export const stats: Stat[] = [
  {
    label: "Enrolled Courses",
    value: "6",
    icon: BookOpen,
    color: "text-primary",
  },
  {
    label: "Assignments Due",
    value: "3",
    icon: ClipboardCheck,
    color: "text-primary",
  },
  {
    label: "Attendance",
    value: "94%",
    icon: Calendar,
    color: "text-muted-foreground",
  },
];

export const courses: Course[] = [
  {
    id: 1,
    name: "Advanced React Patterns",
    instructor: "Dr. Sarah Chen",
    modules: [
      {
        title: "Week 1: Component Architecture",
        type: "pdf",
        desc: "Slides covering compound components and render props.",
        url: "/mock-files/lesson1.pdf",
        createdAt: 1709164800,
      },
      {
        title: "Week 2: State Management Deep Dive",
        type: "video",
        desc: "3-hour video lecture on Zustand, Jotai & Redux Toolkit.",
        url: "/mock-files/intro.mp4",
        createdAt: 1709251200,
      },
      {
        title: "Week 3: Performance Optimization",
        type: "pdf",
        desc: "PDF guide on memoization, lazy loading and Profiler API.",
        url: "/mock-files/lesson1.pdf",
        createdAt: 1709337600,
      },
    ],
    createdAt: 1709164800,
  },
  {
    id: 2,
    name: "Machine Learning Fundamentals",
    instructor: "Prof. James Okafor",
    modules: [
      {
        title: "Week 1: Linear Algebra Refresher",
        type: "pdf",
        desc: "Core matrix operations for ML practitioners.",
        url: "/mock-files/lesson1.pdf",
        createdAt: 1709164800,
      },
      {
        title: "Week 2: Supervised Learning",
        type: "video",
        desc: "Walkthrough of regression and classification algorithms.",
        url: "/mock-files/intro.mp4",
        createdAt: 1709251200,
      },
    ],
    createdAt: 1709164800,
  },
  {
    id: 3,
    name: "System Design Architecture",
    instructor: "Dr. Maria Gonzalez",
    modules: [
      {
        title: "Week 1: CAP Theorem & Trade-offs",
        type: "pdf",
        desc: "Distributed systems fundamentals.",
        url: "/mock-files/lesson1.pdf",
        createdAt: 1709164800,
      },
      {
        title: "Week 2: Load Balancing Strategies",
        type: "video",
        desc: "Deep dive into horizontal scaling patterns.",
        url: "/mock-files/intro.mp4",
        createdAt: 1709251200,
      },
      {
        title: "Week 3: Database Sharding",
        type: "file",
        desc: "Reference guide on database partitioning strategies.",
        url: "/mock-files/lesson1.pdf",
        createdAt: 1709337600,
      },
    ],
    createdAt: 1709164800,
  },
];

export const assignmentsData: Assignment[] = [
  {
    id: 1,
    title: "React Hooks Deep Dive",
    course: "Advanced React Patterns",
    due: "Feb 22, 2026",
    status: "pending",
    type: "assignment",
  },
  {
    id: 2,
    title: "Neural Network Lab",
    course: "Machine Learning Fundamentals",
    due: "Feb 25, 2026",
    status: "pending",
    type: "assignment",
  },
  {
    id: 3,
    title: "Microservices Design Doc",
    course: "System Design Architecture",
    due: "Feb 20, 2026",
    status: "submitted",
    fileName:"test",
    type: "project",
  },
  {
    id: 4,
    title: "State Management Essay",
    course: "Advanced React Patterns",
    due: "Feb 15, 2026",
    status: "graded",
    type: "assignment",
    rating: 5,
    feedback:
      "Excellent analysis of state management patterns. Very well-structured argument.",
  },
  {
    id: 5,
    title: "ML Capstone Project",
    course: "Machine Learning Fundamentals",
    due: "Feb 10, 2026",
    status: "graded",
    type: "project",
    rating: 4,
    feedback:
      "Good implementation. Could improve model accuracy with better feature engineering.",
  },
];

export const notificationsData: Notification[] = [
  {
    id: 1,
    title: "New Assignment Posted",
    body: "React Hooks Deep Dive is due Feb 22.",
    time: "2 hours ago",
    type: "assignment",
    read: false,
  },
  {
    id: 2,
    title: "Assignment Graded",
    body: "Your State Management Essay has been evaluated.",
    time: "1 day ago",
    type: "grade",
    read: false,
  },
  {
    id: 3,
    title: "Instructor Announcement",
    body: "Office hours moved to Thursday 2–4pm.",
    time: "2 days ago",
    type: "announcement",
    read: true,
  },
  {
    id: 4,
    title: "Project Deadline Extended",
    body: "System Design final project now due March 5.",
    time: "3 days ago",
    type: "announcement",
    read: true,
  },
];

export const navItems: NavItem[] = [
  { icon: BarChart3, label: "Dashboard", id: "dashboard" },
  { icon: BookOpen, label: "My Courses", id: "courses" },
  { icon: ClipboardCheck, label: "Assignments", id: "assignments" },
  { icon: Brain, label: "AI Assistant", id: "assistant" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: User, label: "Profile & CV", id: "profile" },
];

export const botReplies = [
  "Great question! Based on your course material, I'd suggest reviewing the week 2 lecture notes first.",
  "This is covered in the System Design module on CAP theorem. Want me to summarise the key points?",
  "The React Hooks deep dive covers this pattern extensively — specifically the useCallback and useMemo sections.",
  "I'd recommend cross-referencing the ML Fundamentals slides with Andrew Ng's notes on gradient descent.",
];
