import type {
  InstructorEntry,
  StudentEntry,
  SkillEntry,
  SidebarItem,
} from "../types";
import { Users, Brain, BadgeCheck } from "lucide-react";

export const sidebarItems: SidebarItem[] = [
  { icon: Brain, label: "Instructors", id: "instructors" },
  { icon: Users, label: "Students", id: "students" },
  { icon: BadgeCheck, label: "Skills", id: "skills" },
];

export const instructorsData: InstructorEntry[] = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    username: "schen",
    email: "schen@edu.com",
    bio: "Researcher and educator specializing in distributed systems and React architecture.",
    courses: ["Advanced React Patterns", "System Design Architecture"],
  },
  {
    id: 2,
    name: "Dr. Michael Brown",
    username: "mbrown",
    email: "mbrown@edu.com",
    bio: "Expert in cloud computing and scalable architectures.",
    courses: ["Cloud Computing Essentials"],
  },
];

export const studentsData: StudentEntry[] = [
  {
    id: 1,
    name: "Alex Rivera",
    username: "alexr",
    email: "alex@edu.com",
    bio: "Computer Science student passionate about AI and distributed systems.",
    skills: ["React", "Node.js", "System Design"],
    // cvUrl: "/mock-cvs/alex-rivera-cv.pdf",
    linkedin: "https://linkedin.com/in/alexrivera",
    github: "https://github.com/alexrivera",
    portfolio: "https://alexrivera.dev",
    courses: ["Advanced React Patterns", "Cloud Computing Essentials"],
  },
  {
    id: 2,
    name: "Priya Sharma",
    username: "priyash",
    email: "priya@edu.com",
    bio: "Student interested in front-end frameworks and UX design.",
    skills: ["React", "Next.js", "UI/UX Design"],
    cvUrl: "/mock-cvs/priya-sharma-cv.pdf",
    linkedin: "https://linkedin.com/in/priyasharma",
    github: "https://github.com/priyasharma",
    portfolio: "https://priyasharma.dev",
    courses: ["Advanced React Patterns"],
  },
];

export const skillsData: SkillEntry[] = [
  { id: 1, name: "JavaScript" },
  { id: 2, name: "TypeScript" },
  { id: 3, name: "React" },
  { id: 4, name: "Next.js" },
  { id: 5, name: "Node.js" },
  { id: 6, name: "Python" },
  { id: 7, name: "Data Structures" },
  { id: 8, name: "Algorithms" },
  { id: 9, name: "System Design" },
  { id: 10, name: "UI/UX Design" },
];
