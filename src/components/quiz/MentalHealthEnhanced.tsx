import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Heart, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { animationPresets } from "../../config/motion-config";

interface MentalHealthEnhancedProps {
  data: {
    [key: string]: any;
  };
  onUpdate: (data: { [key: string]: any }) => void;
  config: {
    id: string;
    scale: {
      name: string;
      questions: string[];
      responses: Array<{ value: number; label: string }>;
    };
    className?: {
      container?: string;
      header?: string;
      question?: string;
      response?: string;
      input?: string;
    };
  };
}

export const MentalHealthEnhanced = ({ data, onUpdate, config }: MentalHealthEnhancedProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [textInput, setTextInput] = useState<string>("");
  const [userResponses, setUserResponses] = useState<Array<{ type: 'option' | 'text', value: any, text?: string }>>([]);

  // Initialize arrays if not present
  useEffect(() => {
    const responsesKey = config.id;
    if (!data[responsesKey] || data[responsesKey].length !== config.scale.questions.length) {
      onUpdate({ [responsesKey]: Array(config.scale.questions.length).fill(-1) });
    }
  }, [data, onUpdate, config.id, config.scale.questions.length]);

  const responses = useMemo(() => data[config.id] || Array(config.scale.questions.length).fill(-1), [data, config.id, config.scale.questions.length]);

  const handleSelect = (value: number) => {
    const response = { type: 'option' as const, value };
    const updatedResponses = [...userResponses, response];
    setUserResponses(updatedResponses);
    
    const updated = [...responses];
    updated[currentIndex] = value;
    onUpdate({ [config.id]: updated });

    const nextIndex = currentIndex + 1;
    if (nextIndex < config.scale.questions.length) {
      setCurrentIndex(nextIndex);
      setTextInput("");
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      const response = { type: 'text' as const, value: -1, text: textInput.trim() };
      const updatedResponses = [...userResponses, response];
      setUserResponses(updatedResponses);
      
      const updated = [...responses];
      updated[currentIndex] = -2; // Use -2 to mark as custom response (different from -1 which means unanswered)
      onUpdate({ [config.id]: updated });

      const nextIndex = currentIndex + 1;
      if (nextIndex < config.scale.questions.length) {
        setCurrentIndex(nextIndex);
        setTextInput("");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  const allDone = useMemo(() => {
    return userResponses.length === config.scale.questions.length;
  }, [userResponses.length, config.scale.questions.length]);

  const renderChatHistory = () => {
    return (
      <motion.div 
        className="space-y-3 sm:space-y-4"
        variants={animationPresets.mentalHealth.container}
      >
        {userResponses.map((response, i) => (
          <motion.div 
            key={i} 
            className="space-y-2 sm:space-y-3"
            variants={animationPresets.mentalHealth.question}
            initial="initial"
            animate="animate"
          >
            {/* Question */}
            <div className="flex items-start gap-2 sm:gap-3">
              {/* <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                {i + 1}
              </div> */}
              <motion.div 
                className="bg-muted/50 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm max-w-[85%] sm:max-w-[80%] hover:bg-muted/70 hover:border-primary/20 transition-all duration-200"
                whileHover={{ scale: 1.01 }}
              >
                {config.scale.questions[i]}
              </motion.div>
            </div>
            
            {/* User Response */}
            <AnimatePresence>
              <motion.div 
                className="flex justify-end"
                variants={animationPresets.mentalHealth.response}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <motion.div 
                  className="bg-primary text-primary-foreground rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm max-w-[85%] sm:max-w-[80%] hover:bg-primary/90 hover:shadow-sm transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                >
                  {response.type === 'option' 
                    ? config.scale.responses.find(r => r.value === response.value)?.label
                    : response.text
                  }
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderCurrentQuestion = () => {
    if (allDone) return null;

    const questionText = config.scale.questions[currentIndex];

    return (
      <motion.div 
        className="space-y-3 sm:space-y-4"
        variants={animationPresets.mentalHealth.question}
        initial="initial"
        animate="animate"
        exit="exit"
        key={currentIndex}
      >
        {/* Current Question */}
        <div className="flex items-start gap-2 sm:gap-3">
          {/* <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
            {currentIndex + 1}
          </div> */}
          <motion.div 
            className="bg-muted/50 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm max-w-[85%] sm:max-w-[80%] hover:bg-muted/70 hover:border-primary/20 transition-all duration-200"
            whileHover={{ scale: 1.01 }}
          >
            {questionText}
          </motion.div>
        </div>

        {/* Suggested Options */}
        <motion.div 
          className="flex flex-wrap gap-1 sm:gap-2 justify-end"
          variants={animationPresets.mentalHealth.container}
        >
          {config.scale.responses.map((option, index) => (
            <motion.div
              key={option.value}
              variants={animationPresets.mentalHealth.options}
              custom={index}
            >
              <Button
                variant="outline"
                size="sm"
                className="text-xs px-2 py-1 sm:px-3 sm:py-2 hover:bg-primary/5 hover:border-primary/50 hover:shadow-sm transition-all duration-200"
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

  const renderInputArea = () => {
    if (allDone) return null;

    return (
      <motion.div 
        className="flex gap-2 py-4 px-2 border-t"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Input
          placeholder="Type your response here..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 text-sm hover:border-primary/50 hover:shadow-sm hover:shadow-primary/10 focus:border-primary focus:shadow-md focus:shadow-primary/20 transition-all duration-200"
        />
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleTextSubmit}
            disabled={!textInput.trim()}
            size="sm"
            className="shrink-0 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
          >
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </motion.div>
      </motion.div>
    );
  };

  const getIcon = () => {
    return config.scale.name === "PHQ-9" ? 
      <Heart className="h-5 w-5 text-primary" /> : 
      <Brain className="h-5 w-5 text-primary" />;
  };

  const getTitle = () => {
    return config.scale.name === "PHQ-9" ? 
      "Depression Assessment" : 
      "Anxiety Assessment";
  };

  return (
    <motion.div 
      className="flex flex-col h-[500px] sm:h-[600px]"
      variants={animationPresets.mentalHealth.container}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Header */}
      {/* <motion.div 
        className="p-3 sm:p-4 border-b bg-muted/30"
        variants={animationPresets.mentalHealth.infoBox}
      >
        <div className="flex items-center gap-2 mb-1">
          {getIcon()}
          <p className="font-medium text-foreground text-sm sm:text-base">{getTitle()}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          You can select suggested options or type your own response for each question.
        </p>
      </motion.div> */}

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto pb-4 space-y-3 sm:space-y-4">
          {renderChatHistory()}
          
          <AnimatePresence mode="wait">
            {renderCurrentQuestion()}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        {renderInputArea()}
      </div>

      {/* Completion Message */}
      <AnimatePresence>
        {allDone && (
          <motion.div 
            className="p-3 sm:p-4 border-t bg-green-500/10 border-green-500/30 hover:bg-green-500/15 hover:border-green-500/40 transition-all duration-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-center text-xs sm:text-sm text-green-600 font-medium">
              All {config.scale.name} questions completed. You can proceed to the next step.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
