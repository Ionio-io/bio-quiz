import { HealthQuiz } from "@/components/HealthQuiz";
import { motion } from "framer-motion";
const Index = () => {
  return (

    <div className="relative">
       <motion.div
        className="absolute inset-0 pointer-events-none "
        style={{
          background: "radial-gradient(ellipse 80% 90% at 50% 0%, rgba(34, 197, 94, 0.25), transparent 70%), #000000",
        }}
        animate={{
          background: [
            "radial-gradient(ellipse 80% 90% at 50% 0%, rgba(34, 197, 94, 0.25), transparent 70%)",
            "radial-gradient(ellipse 90% 100% at 50% 0%, rgba(34, 197, 94, 0.35), transparent 70%)",
            "radial-gradient(ellipse 80% 90% at 50% 0%, rgba(34, 197, 94, 0.25), transparent 70%)"
          ]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    <HealthQuiz />;
    </div>
  ) 
};

export default Index;
