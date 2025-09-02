import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Brain, CheckCircle, ChevronLeft, ChevronRight, Droplets, Heart, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { animationPresets } from "../config/motion-config";
import quizConfig from "../config/quiz-config.json";
import { FormRenderer } from "./quiz/FormRenderer";
import BioFitLogo from "/bio-fit-logo.png";

export interface QuizData {
  // Basic Info
  age?: number;
  gender?: "male" | "female";

  // Cardiovascular
  totalCholesterol?: number;
  hdlCholesterol?: number;
  systolicBP?: number;
  smokingStatus?: "never" | "former" | "current";
  diabetesHistory?: boolean;

  // Diabetes Risk
  weight?: number;
  height?: number;
  familyDiabetes?: boolean;
  physicalActivity?: "none" | "light" | "moderate" | "vigorous";

  // Mental Health
  phq9Responses?: number[];
  gad7Responses?: number[];

  // Kidney Health
  creatinine?: number;
  ethnicity?: "white" | "black" | "other";

  // Allow for additional dynamic fields
  [key: string]: unknown;
}

// Icon mapping for dynamic icon rendering
const iconMap = {
  User,
  Heart,
  Activity,
  Brain,
  Droplets,
  CheckCircle
};

const steps = quizConfig.stages.map(stage => ({
  ...stage,
  icon: iconMap[stage.icon as keyof typeof iconMap] || User
}));

export const HealthQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState<Partial<QuizData>>({});

  // Initialize default values from config
  useEffect(() => {
    const defaultData: Partial<QuizData> = {};
    quizConfig.stages.forEach(stage => {
      stage?.questions?.forEach(question => {
        if (question?.defaultValue !== undefined) {
          defaultData[question.id] = question.defaultValue;
        }
      });
    });
    setQuizData(defaultData);
  }, []);


  console.log(quizData, "quizData");

  const updateQuizData = (data: Partial<QuizData>) => {
    setQuizData(prev => ({ ...prev, ...data }));
  };

  const canProceed = () => {
    const currentStage = quizConfig.stages[currentStep];
    const requiredFields = quizConfig.validation[currentStage.id as keyof typeof quizConfig.validation];

    if (!requiredFields || requiredFields.length === 0) {
      return true;
    }

    const result = requiredFields.every(field => {
      const value = quizData[field];
      if (Array.isArray(value)) {
        const isValid = value.length > 0 && value.every(v => v !== -1); // -1 means unanswered, -2 means custom response, 0-3 means valid option
        console.log(`Field ${field}:`, value, 'Valid:', isValid);
        return isValid;
      }
      const isValid = value !== undefined && value !== null && value !== "";
      console.log(`Field ${field}:`, value, 'Valid:', isValid);
      return isValid;
    });

    console.log(`Stage ${currentStage.id} can proceed:`, result);
    return result;
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderCurrentForm = () => {
    const currentStage = quizConfig.stages[currentStep];
    return (
      <FormRenderer
        stage={currentStage}
        data={quizData}
        onUpdate={updateQuizData}
      />
    );
  };

  return (
    <div className="min-h-screen bg-background py-4 px-2 sm:py-8 sm:px-4"
      style={{
        background: "radial-gradient(ellipse 80% 90% at 50% 0%, rgba(34, 197, 94, 0.25), transparent 70%), #000000",
      }}>
      <motion.div
        className="max-w-4xl mx-auto space-y-4 sm:space-y-8"
        variants={animationPresets.page}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Header */}
        <motion.div
          className="text-center px-2"
          variants={animationPresets.formStage.item}
        >
         <img src={BioFitLogo} alt="BioFit Logo" className="w-fit h-9 aspect-auto mx-auto mb-2" />
            <h1 className="text-xl sm:text-xl font-bold text-foreground">
              Health Assessment
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Complete your personalized health evaluation
            </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          className="flex items-center justify-center gap-1 sm:gap-2 md:gap-4 mb-4 sm:mb-6 md:mb-8 px-2"
          variants={animationPresets.navigation.container}
          initial="initial"
          animate="animate"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="flex items-center"
              variants={animationPresets.navigation.step}
              custom={index}
            >
              <div className="flex flex-col items-center">
                <motion.div
                  className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center text-xs sm:text-sm font-medium transition-all ${index < currentStep
                      ? "bg-primary border-primary text-primary-foreground"
                      : index === currentStep
                        ? "border-primary text-primary bg-background"
                        : "border-muted-foreground/30 text-muted-foreground bg-background"
                    }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  ) : (
                    index + 1
                  )}
                </motion.div>
                <span className="text-xs text-muted-foreground mt-1 hidden md:block max-w-16 text-center leading-tight">
                  {step.title.split(' ')[0]}
                </span>
              </div>
              {index < steps.length - 1 && (
                <motion.div
                  className={`w-4 sm:w-6 md:w-12 h-0.5 mx-1 sm:mx-2 ${index < currentStep ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  variants={animationPresets.navigation.progress}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          variants={animationPresets.formStage.card}
          initial="initial"
          animate="animate"
          exit="exit"
          key={currentStep}
          className="px-2"
        >
          <Card className="border-border bg-card shadow-lg w-full">
            <CardContent className="py-3 sm:py-4 px-3 sm:px-6">
              {/* Section Header */}
              <motion.div
                className="flex items-center gap-3 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border"
                variants={animationPresets.formStage.item}
              >
                <motion.div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {React.createElement(steps[currentStep].icon, {
                    className: "h-4 w-4 sm:h-6 sm:w-6 text-primary"
                  })}
                </motion.div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-card-foreground tracking-tight mt-2">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-muted-foreground tracking-tight text-xs sm:text-sm mt-1">
                    {steps[currentStep].description}
                  </p>
                </div>
              </motion.div>

              {/* Form Content */}
              <div className="w-full">
                <AnimatePresence mode="wait">
                  {renderCurrentForm()}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Buttons */}
        <AnimatePresence>
          {currentStep < steps.length - 1 && (
            <motion.div
              className="flex justify-between gap-2 sm:gap-4 px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                whileHover={animationPresets.navigation.button.hover}
                whileTap={animationPresets.navigation.button.tap}
                aria-disabled={currentStep === 0}
                className="flex-1 sm:flex-none"
              >
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 text-sm"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={animationPresets.navigation.button.hover}
                whileTap={animationPresets.navigation.button.tap}
                aria-disabled={!canProceed()}
                className="flex-1 sm:flex-none"
              >
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="flex items-center gap-1  text-sm"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};