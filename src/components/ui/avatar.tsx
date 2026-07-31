import * as React from "react";
import { cn } from "@/lib/utils";
import { generateAvatarColor, getInitials } from "@/utils/color-utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({
  name,
  src,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs font-semibold",
    md: "h-10 w-10 text-sm font-semibold",
    lg: "h-12 w-12 text-base font-bold",
  };

  const { bg, text, border } = generateAvatarColor(name);
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border shadow-subtle",
        sizeClasses[size],
        bg,
        text,
        border,
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
