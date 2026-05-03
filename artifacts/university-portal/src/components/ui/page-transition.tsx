import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const [location] = useLocation();

  return (
    <motion.div
      key={location}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Staggered list container — wraps items that should animate in sequence */
export function StaggerList({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.07 } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Individual stagger item */
export function StaggerItem({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden:  { opacity: 0, y: 14 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Fade-in for inline elements (e.g. badge updates, error alerts) */
export function FadeIn({ children, className, delay = 0 }: PageTransitionProps & { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.18, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
