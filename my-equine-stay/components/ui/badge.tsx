"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "forest" | "success" | "warning" | "danger" | "muted";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  const base = "inline-flex items-center gap-1 rounded-full font-semibold tracking-wide";

  const variants = {
    default: "bg-[var(--color-sand-light)] text-[var(--color-charcoal)]",
    gold: "bg-[var(--color-gold-pale)] text-[var(--color-gold)] border border-[var(--color-gold)]/30",
    forest: "bg-[var(--color-forest)]/10 text-[var(--color-forest)]",
    success: "bg-green-50 text-green-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
    muted: "bg-gray-100 text-gray-500",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-[10px] uppercase",
    md: "px-3.5 py-1 text-xs",
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton", className)}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-[var(--radius-card)] overflow-hidden">
      <Skeleton className="w-full h-56" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-3 pt-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-[var(--radius-card)] p-6">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}
