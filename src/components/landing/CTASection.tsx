import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient opacity-[0.06]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
          Ready to transform your{" "}
          <span className="text-gradient">talent pipeline?</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join organizations that trust AI-verified skills over self-reported
          résumés. Pre-provisioned accounts ensure security from day one.
        </p>
        <div className="mt-8">
          <Button
            variant="hero"
            size="lg"
            className="text-base px-8 py-6"
            onClick={() => navigate("/login")}
          >
            Access Your Account
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
