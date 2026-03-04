import {
  BookOpen,
  Calendar,
  ClipboardCheck,
  Star,
  Users,
  User,
  BadgeCheck,
} from "lucide-react";
import type {
  InstructorCourse,
  RosterStudent,
  Submission,
  FeedbackEntry,
  StudentEntry,
  SidebarItem,
  Assignment,
} from "../types";

export const coursesData: InstructorCourse[] = [
  {
    id: 1,
    name: "Advanced React Patterns",
    students: 32,
    pendingGrades: 8,
    description:
      "Deep-dive into advanced React patterns, hooks, and performance.",
    content: [
      {
        id: 101,
        title: "Intro Slides",
        type: "pdf",
        url: "/mock-files/intro.pdf",
        createdAt: 1687000000000,
      },
      {
        id: 102,
        title: "Lesson 1 Video",
        type: "video",
        url: "/mock-files/lesson1.mp4",
        createdAt: 1687001000000,
      },
    ],
    createdAt: 1687001000000,
  },
  {
    id: 2,
    name: "System Design Architecture",
    students: 28,
    pendingGrades: 3,
    description: "Scalable system design principles for modern applications.",
    content: [
      {
        id: 101,
        title: "Intro Slides",
        type: "pdf",
        url: "/mock-files/intro.pdf",
        createdAt: 1687005000000,
      },
      {
        id: 102,
        title: "Lesson 1 Video",
        type: "video",
        url: "/mock-files/lesson1.mp4",
        createdAt: 1687003000000,
      },
    ],
    createdAt: 1687003000000,
  },
  {
    id: 3,
    name: "Cloud Computing Essentials",
    students: 45,
    pendingGrades: 12,
    description: "Core cloud concepts, AWS, and serverless architectures.",
    content: [],
    createdAt: 1687001000000,
  },
];

export const rosterData: RosterStudent[] = [
  { id: 1, name: "Alex Rivera", email: "alex@edu.com" },
  { id: 2, name: "Priya Sharma", email: "priya@edu.com" },
  { id: 3, name: "Marcus Johnson", email: "marcus@edu.com" },
  { id: 4, name: "Lisa Chen", email: "lisa@edu.com" },
  { id: 5, name: "David Kim", email: "david@edu.com" },
];

export const assignmentsData: Assignment[] = [
  {
    id: 1,
    course_id: 1,
    title: "React Hooks Deep Dive",
    description: "Advanced Hooks usage with context and effects.",
    type: "assignment",
    dueDate: "2026-02-20",
    maxScore: 100,
    createdAt: "2026-02-10",
  },
  {
    id: 2,
    course_id: 1,
    title: "State Management Essay",
    description: "Compare Redux, MobX, and Zustand in React apps.",
    type: "assignment",
    dueDate: "2026-02-22",
    maxScore: 100,
    createdAt: "2026-02-11",
  },
  {
    id: 3,
    course_id: 2,
    title: "Microservices Design Doc",
    description: "Design a microservices architecture for e-commerce.",
    type: "project",
    dueDate: "2026-02-25",
    maxScore: 100,
    createdAt: "2026-02-12",
  },
  {
    id: 4,
    course_id: 3,
    title: "Cloud Architecture Lab",
    description: "Deploy an app using AWS cloud services.",
    type: "project",
    dueDate: "2026-02-28",
    maxScore: 100,
    createdAt: "2026-02-13",
  },
];

export const submissionsData: Submission[] = [
  {
    id: 1,
    student: "Alex Rivera",
    assignment_id: 1,
    course_id: 1,
    title: "React Hooks Deep Dive",
    submitted: "Feb 16, 2026",
    type: "assignment",
    graded: false,
  },
  {
    id: 2,
    student: "Priya Sharma",
    assignment_id: 2,
    course_id: 1,
    title: "State Management Essay",
    submitted: "Feb 15, 2026",
    type: "assignment",
    graded: true,
  },
  {
    id: 3,
    student: "Marcus Johnson",
    assignment_id: 3,
    course_id: 2,
    title: "Microservices Design Doc",
    submitted: "Feb 17, 2026",
    type: "project",
    graded: false,
  },
  {
    id: 4,
    student: "Lisa Chen",
    assignment_id: 4,
    course_id: 3,
    title: "Cloud Architecture Lab",
    submitted: "Feb 16, 2026",
    type: "project",
    graded: false,
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
    cvUrl: "/mock-cvs/john-doe-cv.pdf",
    skills: ["React", "Node.js", "System Design"],
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@edu.com",
    courses: ["Advanced React Patterns"],
    feedback: "Good progress. Needs improvement in code review practices.",
    cvUrl: "/mock-cvs/john-doe-cv.pdf",
    skills: ["React", "Node.js", "System Design"],
  },
  {
    id: 3,
    name: "Marcus Johnson",
    email: "marcus@edu.com",
    courses: ["System Design Architecture", "Cloud Computing"],
    feedback:
      "Solid understanding. Could push further on system design problems.",
    cvUrl: "/mock-cvs/john-doe-cv.pdf",
    skills: ["React", "Node.js", "System Design"],
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
    cvUrl: "/mock-cvs/john-doe-cv.pdf",
    skills: ["React", "Node.js", "System Design"],
  },
  {
    id: 5,
    name: "David Kim",
    email: "david@edu.com",
    courses: ["System Design Architecture"],
    feedback: "Very promising. Analytical thinking is a strong suit.",
    cvUrl: "/mock-cvs/john-doe-cv.pdf",
    skills: ["React", "Node.js", "System Design"],
  },
];

export const sidebarItems: SidebarItem[] = [
  { icon: BookOpen, label: "My Courses", id: "courses" },
  { icon: Calendar, label: "Attendance", id: "attendance" },
  { icon: ClipboardCheck, label: "Assignments", id: "assignments" },
  { icon: Star, label: "Feedback", id: "feedback" },
  { icon: Users, label: "Students", id: "students" },
  { icon: BadgeCheck, label: "Skills", id: "skills" },
  { icon: User, label: "Profile", id: "profile" },
];
