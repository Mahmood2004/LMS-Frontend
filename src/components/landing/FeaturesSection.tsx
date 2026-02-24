import { motion } from "framer-motion";
import {
  GraduationCap,
  Users,
  Brain,
  Search,
  BookOpen,
  Bell,
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Smart Course Management",
    description:
      "Track attendance, performance, assignments and projects with deep instructor feedback loops.",
  },
  {
    icon: Search,
    title: "AI Talent Discovery",
    description:
      "Recruiters find candidates using natural language — powered by hybrid vector search and re-ranking.",
  },
  {
    icon: Brain,
    title: "Intelligent Course Assistant",
    description:
      "Context-aware RAG chatbot bridging courseware with live documentation from official sources.",
  },
  {
    icon: Users,
    title: "Automated Onboarding",
    description:
      "Bulk import users with CV extraction via LLM — skills, education, and experience parsed instantly.",
  },
  {
    icon: BookOpen,
    title: "Deep Feedback System",
    description:
      "Instructor ratings and text feedback are indexed in real-time for recruitment AI to leverage.",
  },
  {
    icon: Bell,
    title: "Targeted Notifications",
    description:
      "Course-specific announcements, assignment alerts, and grade notifications keep everyone in sync.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section className="py-24 px-6 bg-background relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-primary">
            Platform Features
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold font-display text-foreground">
            Everything you need to{" "}
            <span className="text-gradient">learn & recruit</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            A dual-purpose platform combining intelligent learning management
            with AI-powered talent discovery.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold font-display text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
