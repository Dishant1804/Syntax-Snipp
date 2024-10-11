"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";

import { cn } from "@/lib/utils";

interface HyperTextProps {
  text: string;
  duration?: number;
  framerProps?: Variants;
  className?: string;
  animateOnLoad?: boolean;
}

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const getRandomInt = (max: number) => Math.floor(Math.random() * max);

export default function HyperText({
  text,
  duration = 800,
  framerProps = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 3 },
  },
  className,
  animateOnLoad = true,
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState(text.split(""));
  const interations = useRef(0);
  const isFirstRender = useRef(true);


  useEffect(() => {
    const interval = setInterval(
      () => {
        if (!animateOnLoad && isFirstRender.current) {
          clearInterval(interval);
          isFirstRender.current = false;
          return;
        }
        if (interations.current < text.length) {
          setDisplayText((t) =>
            t.map((l, i) =>
              l === " "
                ? l
                : i <= interations.current
                  ? text[i]
                  : alphabets[getRandomInt(26)],
            ),
          );
          interations.current = interations.current + 0.2;
        } else {
          clearInterval(interval);
        }
      },
      duration / (text.length * 4),
    );

    return () => clearInterval(interval);
  }, [text, duration, animateOnLoad]);

  return (
    <div className="">
      <AnimatePresence mode="wait">
        {displayText.map((letter, i) => (
          <motion.h1
            key={i}
            className={cn("font-space-mono", letter === " " ? "w-3" : "", className)}
            {...framerProps}
          >
            {letter}
          </motion.h1>
        ))}
      </AnimatePresence>
    </div>
  );
}
