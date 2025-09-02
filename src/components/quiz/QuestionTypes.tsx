import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { animationPresets } from "../../config/motion-config";

export interface QuestionConfig {
  id: string;
  type: string;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: unknown;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
  };
  step?: number;
  className?: {
    container?: string;
    label?: string;
    description?: string;
    input?: string;
    option?: string;
    optionLabel?: string;
    question?: string;
    response?: string;
    header?: string;
  };
  scale?: {
    name: string;
    questions: string[];
    responses: Array<{ value: number; label: string }>;
  };
}

export interface QuestionProps {
  config: QuestionConfig;
  value: unknown;
  onChange: (value: unknown) => void;
}

// Number Input Component
export const NumberQuestion = ({ config, value, onChange }: QuestionProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value);
    onChange(isNaN(numValue) ? undefined : numValue);
  };

  const numValue = typeof value === 'number' ? value : '';

  return (
    <motion.div 
      className={config.className?.container || "space-y-2"}
      variants={animationPresets.formStage.field}
    >
      <Label htmlFor={config.id} className={config.className?.label || "text-sm font-medium"}>
        {config.label}
      </Label>
      {config.description && (
        <motion.p 
          className={config.className?.description || "text-xs text-muted-foreground mb-2"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {config.description}
        </motion.p>
      )}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <Input
          id={config.id}
          type="number"
          placeholder={config.placeholder}
          value={numValue}
          onChange={handleChange}
          step={config.step}
          min={config.validation?.min}
          max={config.validation?.max}
          className={config.className?.input || "w-full max-w-xs sm:max-w-sm"}
        />
      </motion.div>
    </motion.div>
  );
};

// Radio Group Component
export const RadioQuestion = ({ config, value, onChange }: QuestionProps) => {
  const stringValue = typeof value === 'string' ? value : (config.defaultValue as string) || "";

  return (
    <motion.div 
      className={config.className?.container || "space-y-2"}
      variants={animationPresets.formStage.field}
    >
      <Label className={config.className?.label || "text-sm font-medium"}>
        {config.label}
      </Label>
      {config.description && (
        <motion.p 
          className={config.className?.description || "text-xs text-muted-foreground mb-2"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {config.description}
        </motion.p>
      )}
      <RadioGroup
        value={stringValue}
        onValueChange={onChange}
      >
        {config.options?.map((option, index) => (
          <motion.div 
            key={option.value} 
            className={config.className?.option || "flex items-center space-x-2 py-1"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.03 }}
          >
            <RadioGroupItem value={option.value} id={`${config.id}-${option.value}`} className="shrink-0" />
            <Label htmlFor={`${config.id}-${option.value}`} className={config.className?.optionLabel || "text-xs sm:text-sm cursor-pointer"}>
              {option.label}
            </Label>
          </motion.div>
        ))}
      </RadioGroup>
    </motion.div>
  );
};

// Checkbox Component
export const CheckboxQuestion = ({ config, value, onChange }: QuestionProps) => {
  const boolValue = typeof value === 'boolean' ? value : false;

  return (
    <motion.div 
      className={config.className?.container || "flex items-center space-x-2 py-2"}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Checkbox
        id={config.id}
        checked={boolValue}
        onCheckedChange={onChange}
        className="shrink-0"
      />
      <Label htmlFor={config.id} className={config.className?.label || "text-xs sm:text-sm cursor-pointer"}>
        {config.label}
      </Label>
    </motion.div>
  );
};

// Mental Health Scale Component
export const MentalHealthScaleQuestion = ({ config, value, onChange }: QuestionProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Initialize arrays if not present
  useEffect(() => {
    const arrayValue = Array.isArray(value) ? value : [];
    if (!arrayValue.length || arrayValue.length !== config.scale?.questions.length) {
      onChange(Array(config.scale?.questions.length || 0).fill(-1));
    }
  }, [config.scale?.questions.length, onChange, value]);

  const responses = useMemo(() => {
    const arrayValue = Array.isArray(value) ? value : [];
    return arrayValue.length > 0 ? arrayValue : Array(config.scale?.questions.length || 0).fill(-1);
  }, [value, config.scale?.questions.length]);

  const handleSelect = (responseValue: number) => {
    const updated = [...responses];
    updated[currentIndex] = responseValue;
    onChange(updated);

    const nextIndex = currentIndex + 1;
    if (nextIndex < (config.scale?.questions.length || 0)) {
      setCurrentIndex(nextIndex);
    }
  };

  const allDone = useMemo(() => {
    return Array.isArray(responses) && responses.every(v => v !== -1);
  }, [responses]);

  const renderAnsweredPairs = () => {
    return (
      <div className="space-y-3">
        {Array.from({ length: currentIndex }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="shrink-0">
                {i + 1}.
              </div>
              <div className={config.className?.question || "max-w-[85%] rounded-lg bg-muted border border-border px-3 py-2 text-sm"}>
                {config.scale?.questions[i]}
              </div>
            </div>
            {responses[i] !== -1 && (
              <div className="flex justify-end">
                <div className={config.className?.response || "max-w-[85%] w-fit rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm"}>
                  {config.scale?.responses.find(r => r.value === responses[i])?.label}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderCurrentQuestion = () => {
    if (allDone) return null;

    const questionText = config.scale?.questions[currentIndex];

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">
            {config.label}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="shrink-0">
            {currentIndex + 1}.
          </div>
          <div className={config.className?.question || "max-w-[85%] rounded-lg bg-muted border border-border px-3 py-2 text-sm"}>
            {questionText}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {config.scale?.responses.map(option => (
            <Button
              key={option.value}
              variant="outline"
              className="justify-center"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={config.className?.container || "space-y-6"}>
      <div className={config.className?.header || "bg-primary/10 border border-primary/20 rounded-lg p-4"}>
        <div className="flex items-center gap-2 mb-2">
          <p className="font-medium text-foreground">Mental Health Assessment</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {config.description}
        </p>
      </div>

      <div className="space-y-6">
        {renderAnsweredPairs()}
        {renderCurrentQuestion()}

        {allDone && (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-600">
            All mental health questions completed. You can proceed to the next step.
          </div>
        )}
      </div>
    </div>
  );
};

// Main Question Renderer
export const QuestionRenderer = ({ config, value, onChange }: QuestionProps) => {
  switch (config.type) {
    case "number":
      return <NumberQuestion config={config} value={value} onChange={onChange} />;
    case "radio":
      return <RadioQuestion config={config} value={value} onChange={onChange} />;
    case "checkbox":
      return <CheckboxQuestion config={config} value={value} onChange={onChange} />;
    case "mental_health_scale":
      return <MentalHealthScaleQuestion config={config} value={value} onChange={onChange} />;
    default:
      return <div>Unsupported question type: {config.type}</div>;
  }
};
