"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface MotionGridProps {
  speed?: string;
  opacity?: number;
  direction?: "left" | "right";
  lineColor?: string;
  lineWidth?: string;
  gridSpacing?: string;
  backgroundColor?: string;
  glowGradient?: string;
  enableGlow?: boolean;
  className?: string;
  childrenClassName?: string;
  children?: React.ReactNode;
}

export function MotionGrid({
  speed = "30s",
  opacity = 0.14,
  direction = "right",
  lineColor = "110, 134, 4",
  lineWidth = "1px",
  gridSpacing = "20px",
  backgroundColor,
  glowGradient,
  enableGlow = true,
  className,
  childrenClassName,
  children,
}: MotionGridProps) {
  const id = React.useId().replace(/:/g, "");
  const directionValue = direction === "right" ? "40px" : "-40px";

  return (
    <div
      className={cn("relative overflow-hidden bg-background", className)}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <style jsx>{`
        @keyframes diagonalGridMove-${id} {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: ${directionValue} ${directionValue};
          }
        }
      `}</style>

      {enableGlow && (
        <div
          className={cn(
            "absolute inset-0 z-0 pointer-events-none",
            glowGradient ||
            "bg-[radial-gradient(125%_125%_at_50%_10%,#F7F5EF_40%,#315CFF_100%)] dark:bg-[radial-gradient(125%_125%_at_50%_10%,#0B0F17_50%,#e2fa6b_100%)]"
          )}
        />
      )}

      <motion.div
        style={
          {
            "--speed": speed,
            "--line-color": lineColor,
            "--opacity": opacity,
            "--line-width": lineWidth,
            "--grid-spacing": gridSpacing,
            backgroundImage: `
              repeating-linear-gradient(45deg, rgba(var(--line-color), var(--opacity)) 0, rgba(var(--line-color), var(--opacity)) var(--line-width), transparent var(--line-width), transparent var(--grid-spacing)),
              repeating-linear-gradient(-45deg, rgba(var(--line-color), var(--opacity)) 0, rgba(var(--line-color), var(--opacity)) var(--line-width), transparent var(--line-width), transparent var(--grid-spacing))
            `,
            backgroundSize: "40px 40px",
            animation: `diagonalGridMove-${id} var(--speed) linear infinite`,
          } as React.CSSProperties
        }
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {children && (
        <div className={cn("relative z-20 w-full flex flex-col items-center justify-center", childrenClassName)}>
          {children}
        </div>
      )}
    </div>
  );
}

export default MotionGrid;
