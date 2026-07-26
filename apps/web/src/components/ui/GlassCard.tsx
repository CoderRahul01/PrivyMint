'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  gradientBorder?: boolean;
  className?: string;
}

export function GlassCard({
  children,
  hoverEffect = false,
  gradientBorder = false,
  className,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        hoverEffect ? 'glass-card-hover' : 'glass-card',
        gradientBorder && 'gradient-border',
        'p-6 text-white',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
