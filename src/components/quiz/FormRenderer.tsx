import { motion } from "framer-motion";
import { animationPresets } from "../../config/motion-config";
import { MentalHealthCombined } from "./MentalHealthCombined";
import { MentalHealthEnhanced } from "./MentalHealthEnhanced";
import { QuestionConfig, QuestionRenderer } from "./QuestionTypes";
import { QuizResults } from "./QuizResults";


export interface StageConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  layout: string;
  questions?: QuestionConfig[];
  layoutConfig?: {
    grid?: Record<string, string>;
  };
  footer?: {
    type: string;
    content: string | { title: string; items: string[] };
    className: string;
  };
  customComponents?: Record<string, unknown>;
  customComponent?: string;
}

export interface FormRendererProps {
  stage: StageConfig;
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export const FormRenderer = ({ stage, data, onUpdate }: FormRendererProps) => {
  const handleQuestionChange = (questionId: string, value: unknown) => {
    onUpdate({ [questionId]: value });
  };

  const renderFooter = () => {
    if (!stage.footer) return null;

    const { type, content, className } = stage.footer;

    if (type === "info") {
      if (typeof content === "string") {
        return (
          <div className={className}>
            <p className="text-sm text-foreground">
              <strong>Privacy Note:</strong> {content}
            </p>
          </div>
        );
      } else {
        return (
          <div className={className}>
            <h4 className="font-medium mb-2">{content.title}</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {content.items.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>
        );
      }
    }

    return null;
  };

  const renderCustomComponent = () => {
    if (stage.customComponent === "QuizResults") {
      return <QuizResults data={data} />;
    }
    return null;
  };

  const renderMentalHealthCombined = () => {
    if (stage.id === "mental") {
      return (
        <MentalHealthCombined
          data={data}
          onUpdate={onUpdate}
        />
      );
    }
    return null;
  };

  const renderMentalHealthEnhanced = () => {
    if (stage.id === "depression" || stage.id === "anxiety") {
      const question = stage.questions?.[0];
      if (question && question.scale) {
        return (
          <MentalHealthEnhanced
            data={data}
            onUpdate={onUpdate}
            config={question as QuestionConfig & { scale: { name: string; questions: string[]; responses: Array<{ value: number; label: string }> } }}
          />
        );
      }
    }
    return null;
  };

  const renderBMI = () => {
    if (stage.customComponents?.bmi) {
      const weight = typeof data.weight === 'number' ? data.weight : undefined;
      const height = typeof data.height === 'number' ? data.height : undefined;
      
      if (weight && height) {
        const heightInM = height / 100;
        const bmi = weight / (heightInM * heightInM);
        const bmiCategory = 
          bmi < 18.5 ? " (Underweight)" :
          bmi < 25 ? " (Normal weight)" :
          bmi < 30 ? " (Overweight)" : " (Obese)";

        const bmiConfig = stage.customComponents.bmi as { className: string };
        return (
          <div className={bmiConfig.className}>
            <p className="text-sm">
              <strong>Your BMI:</strong> {bmi.toFixed(1)} kg/m²{bmiCategory}
            </p>
          </div>
        );
      }
    }
    return null;
  };

  if (stage.layout === "results") {
    return (
      <motion.div
        variants={animationPresets.page}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {renderCustomComponent()}
      </motion.div>
    );
  }

  if (stage.layout === "special") {
    // Handle special layouts like mental health
    const mentalHealthComponent = renderMentalHealthCombined();
    if (mentalHealthComponent) {
      return (
        <motion.div
          variants={animationPresets.mentalHealth.container}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {mentalHealthComponent}
        </motion.div>
      );
    }

    // Handle enhanced mental health components
    const enhancedMentalHealthComponent = renderMentalHealthEnhanced();
    if (enhancedMentalHealthComponent) {
      return enhancedMentalHealthComponent;
    }
    
    // Fallback to regular question rendering
    return (
      <motion.div 
        className="space-y-6"
        variants={animationPresets.formStage.container}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {stage.questions?.map((question, index) => (
          <motion.div
            key={question.id}
            variants={animationPresets.formStage.item}
            custom={index}
          >
            <QuestionRenderer
              config={question}
              value={data[question.id]}
              onChange={(value) => handleQuestionChange(question.id, value)}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="space-y-4 sm:space-y-6"
      variants={animationPresets.formStage.container}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div className="space-y-3 sm:space-y-4">
        {stage.layout === "vertical" && (
          <motion.div className="space-y-3 sm:space-y-4">
            {stage.questions?.map((question, index) => (
              <motion.div
                key={question.id}
                variants={animationPresets.formStage.field}
                custom={index}
              >
                <QuestionRenderer
                  config={question}
                  value={data[question.id]}
                  onChange={(value) => handleQuestionChange(question.id, value)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {stage.layout === "grid" && stage.layoutConfig?.grid && (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
            variants={animationPresets.formStage.container}
          >
            {stage.questions?.map((question, index) => (
              <motion.div 
                key={question.id} 
                className={stage.layoutConfig.grid[question.id] || ""}
                variants={animationPresets.formStage.field}
                custom={index}
              >
                <QuestionRenderer
                  config={question}
                  value={data[question.id]}
                  onChange={(value) => handleQuestionChange(question.id, value)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Render custom components like BMI */}
        {renderBMI() && (
          <motion.div variants={animationPresets.formStage.item}>
            {renderBMI()}
          </motion.div>
        )}
      </motion.div>

      {/* Render footer */}
      {renderFooter() && (
        <motion.div variants={animationPresets.formStage.footer}>
          {renderFooter()}
        </motion.div>
      )}
    </motion.div>
  );
};
