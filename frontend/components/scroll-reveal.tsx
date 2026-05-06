"use client";

// ScrollReveal - Componente para animaciones de entrada al hacer scroll
// Uso: <ScrollReveal>Tu contenido</ScrollReveal>

"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type ScrollRevealProps = {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
};

const directionVariants = {
  up: { x: 0, y: 0 },
  down: { x: 0, y: 0 },
  left: { x: 0, y: 0 },
  right: { x: 0, y: 0 },
  none: { x: 0, y: 0 },
};

const directionInitial = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
  none: { x: 0, y: 0 },
};

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  duration = 0.6,
  distance = 40,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directionInitial[direction],
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              x: directionVariants[direction].x,
              y: directionVariants[direction].y,
            }
          : {}
      }
      transition={{
        duration,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// StaggerChildren - Para animaciones secuenciales de hijos
type StaggerChildrenProps = {
  children: React.ReactNode;
  delay?: number;
  staggerChildren?: number;
  className?: string;
};

export function StaggerChildren({
  children,
  delay = 0,
  staggerChildren = 0.1,
  className = "",
}: StaggerChildrenProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// FadeScale - Para fade con escala sutil
type FadeScaleProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
};

export function FadeScale({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
}: FadeScaleProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}