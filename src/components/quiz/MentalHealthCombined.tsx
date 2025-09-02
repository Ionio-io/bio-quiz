import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Heart } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { animationPresets } from "../../config/motion-config";

interface MentalHealthCombinedProps {
  data: {
    phq9Responses?: number[];
    gad7Responses?: number[];
  };
  onUpdate: (data: { phq9Responses?: number[]; gad7Responses?: number[] }) => void;
}

const phq9Questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself or that you are a failure",
  "Trouble concentrating on things",
  "Moving or speaking slowly, or being fidgety/restless",
  "Thoughts that you would be better off dead or hurting yourself"
];

const gad7Questions = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen"
];

const responseOptions = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" }
];

export const MentalHealthCombined = ({ data, onUpdate }: MentalHealthCombinedProps) => {
  const [currentSection, setCurrentSection] = useState<"phq9" | "gad7">("phq9");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Ensure arrays are initialized to required lengths
  useEffect(() => {
    if (!data.phq9Responses || data.phq9Responses.length !== 9) {
      onUpdate({ phq9Responses: Array(9).fill(-1) });
    }
    if (!data.gad7Responses || data.gad7Responses.length !== 7) {
      onUpdate({ gad7Responses: Array(7).fill(-1) });
    }
  }, [data.phq9Responses, data.gad7Responses, onUpdate]);

  const phq9Responses = useMemo(() => data.phq9Responses || Array(9).fill(-1), [data.phq9Responses]);
  const gad7Responses = useMemo(() => data.gad7Responses || Array(7).fill(-1), [data.gad7Responses]);

  const handleSelect = (value: number) => {
    if (currentSection === "phq9") {
      const updated = [...phq9Responses];
      updated[currentIndex] = value;
      onUpdate({ phq9Responses: updated });

      const nextIndex = currentIndex + 1;
      if (nextIndex < phq9Questions.length) {
        setCurrentIndex(nextIndex);
      } else {
        setCurrentSection("gad7");
        setCurrentIndex(0);
      }
    } else {
      const updated = [...gad7Responses];
      updated[currentIndex] = value;
      onUpdate({ gad7Responses: updated });

      const nextIndex = currentIndex + 1;
      if (nextIndex < gad7Questions.length) {
        setCurrentIndex(nextIndex);
      }
    }
  };

  const allDone = useMemo(() => {
    const phqDone = phq9Responses.every(v => v !== -1);
    const gadDone = gad7Responses.every(v => v !== -1);
    return phqDone && gadDone;
  }, [phq9Responses, gad7Responses]);

  const renderAnsweredPairs = (
    questions: string[],
    answers: number[],
    count: number,
    icon: React.ReactNode
  ) => {
    return (
      <motion.div 
        className="space-y-3"
        variants={animationPresets.mentalHealth.container}
      >
        {Array.from({ length: count }).map((_, i) => (
          <motion.div 
            key={i} 
            className="space-y-2"
            variants={animationPresets.mentalHealth.question}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-center gap-2">
              <div className="shrink-0">
                {i + 1}.
              </div>
              <div className="max-w-[85%] rounded-lg bg-muted border border-border px-3 py-2 text-sm">
                {questions[i]}
              </div>
            </div>
            <AnimatePresence>
              {answers[i] !== -1 && (
                <motion.div 
                  className="flex justify-end"
                  variants={animationPresets.mentalHealth.response}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div className="max-w-[85%] w-fit rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm">
                    {responseOptions.find(o => o.value === answers[i])?.label}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderCurrentQuestion = () => {
    if (allDone) return null;

    const isPhq = currentSection === "phq9";
    const questions = isPhq ? phq9Questions : gad7Questions;
    const questionText = questions[currentIndex];

    return (
      <motion.div 
        className="space-y-3"
        variants={animationPresets.mentalHealth.question}
        initial="initial"
        animate="animate"
        exit="exit"
        key={`${currentSection}-${currentIndex}`}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">
            {isPhq ? "Depression Screening (PHQ-9)" : "Anxiety Screening (GAD-7)"}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="shrink-0">
            {currentIndex + 1}.
          </div>
          <div className="max-w-[85%] rounded-lg bg-muted border border-border px-3 py-2 text-sm">
            {questionText}
          </div>
        </div>
        <motion.div 
          className="grid grid-cols-1 gap-2"
          variants={animationPresets.mentalHealth.container}
        >
          {responseOptions.map((option, index) => (
            <motion.div
              key={option.value}
              variants={animationPresets.mentalHealth.options}
              custom={index}
            >
              <Button
                variant="outline"
                className="justify-center w-full"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={animationPresets.mentalHealth.container}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div 
        className="bg-primary/10 border border-primary/20 rounded-lg p-4"
        variants={animationPresets.mentalHealth.infoBox}
      >
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-5 w-5 text-primary" />
          <p className="font-medium text-foreground">Mental Health Assessment</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Over the last 2 weeks, how often have you been bothered by any of the following problems? This assessment uses validated screening tools (PHQ-9 for depression, GAD-7 for anxiety).
        </p>
      </motion.div>

      <motion.div 
        className="space-y-6"
        variants={animationPresets.mentalHealth.container}
      >
        {/* Transcript for PHQ-9 answered pairs */}
        {renderAnsweredPairs(
          phq9Questions,
          phq9Responses,
          currentSection === "phq9" ? currentIndex : phq9Questions.length,
          <Heart className="h-4 w-4 text-blue-500" />
        )}

        {/* Divider when switching sections */}
        <AnimatePresence>
          {currentSection === "gad7" && (
            <motion.div 
              className="flex items-center gap-2 text-xs text-muted-foreground"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-px flex-1 bg-border" />
              Starting Anxiety Screening
              <div className="h-px flex-1 bg-border" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transcript for GAD-7 answered pairs (only after PHQ-9 done) */}
        {currentSection === "gad7" && renderAnsweredPairs(
          gad7Questions,
          gad7Responses,
          currentIndex,
          <Brain className="h-4 w-4 text-purple-500" />
        )}

        {/* Active question */}
        <AnimatePresence mode="wait">
          {renderCurrentQuestion()}
        </AnimatePresence>

        {/* Completion message */}
        <AnimatePresence>
          {allDone && (
            <motion.div 
              className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-600"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              All mental health questions completed. You can proceed to the next step.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
