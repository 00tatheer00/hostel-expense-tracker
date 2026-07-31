import * as React from "react";
import { Container } from "@/components/layout/container";

export interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <Container size="sm">{children}</Container>
    </div>
  );
}
