import { Variants } from "framer-motion";

// Base animation variants
export const fadeInUp: Variants = {
  initial: { y: 10, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -10, opacity: 0 },
//   transition: { duration: 0.2 }
};

// Staggered animations for lists
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  }
};

// Individual item animation
export const staggerItem: Variants = {
  initial: { y: 10, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  },
  exit: { 
    y: -10, 
    opacity: 0,
    transition: { duration: 0.15 }
  }
};

// Form field animations
export const formField: Variants = {
  initial: { y: 10, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

// Button animations
export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 }
};

// Card animations
export const cardVariants: Variants = {
  initial: { y: 10, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" }
  },
  exit: { 
    y: -10, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Progress bar animation
export const progressVariants: Variants = {
  initial: { scaleX: 0 },
  animate: { 
    scaleX: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Step indicator animations
export const stepVariants: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// Mental health question animations
export const questionVariants: Variants = {
  initial: { y: 10, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" }
  },
  exit: { 
    y: -10, 
    opacity: 0,
    transition: { duration: 0.15 }
  }
};

// Response bubble animations
export const responseVariants: Variants = {
  initial: { y: 8, opacity: 0 },
  animate: { 
    y: 0,
    opacity: 1,
    transition: { 
      duration: 0.2, 
      ease: "easeOut"
    }
  }
};

// Option animations for special layouts
export const optionVariants: Variants = {
  initial: { y: 5, opacity: 0 },
  animate: { 
    y: 0,
    opacity: 1,
    transition: { 
      duration: 0.15, 
      ease: "easeOut"
    }
  }
};

// Footer/info box animations
export const infoBoxVariants: Variants = {
  initial: { y: 10, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.3, delay: 0.2 }
  }
};

// Page transition animations
export const pageVariants: Variants = {
  initial: { y: 10, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" }
  },
  exit: { 
    y: -10, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Animation presets for different components
export const animationPresets = {
  // Form stages
  formStage: {
    container: staggerContainer,
    item: staggerItem,
    field: formField,
    card: cardVariants,
    footer: infoBoxVariants
  },
  
  // Mental health specific
  mentalHealth: {
    container: staggerContainer,
    question: questionVariants,
    response: responseVariants,
    options: optionVariants,
    infoBox: infoBoxVariants
  },
  
  // Navigation elements
  navigation: {
    container: staggerContainer,
    step: stepVariants,
    progress: progressVariants,
    button: {
      hover: buttonHover,
      tap: buttonTap
    }
  },
  
  // Page transitions
  page: pageVariants
};
