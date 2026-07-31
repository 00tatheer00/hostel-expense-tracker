"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { scaleIn } from "@/lib/motion";

export interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isDeleting?: boolean;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Expense delete karein?",
  description = "Kya aap is expense ko delete karna chahte hain? Isse sabhi roommates ka net balance automatic recalculate ho jayega.",
  isDeleting = false,
}: DeleteDialogProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={scaleIn}
          className="w-full max-w-sm"
        >
          <Card className="border border-border/80 bg-card shadow-card">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-2">
                <Icons.alertCircle className="h-6 w-6" />
              </div>
              <CardTitle className="font-heading text-lg font-bold">{title}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                {description}
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex items-center space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 text-xs font-semibold"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center space-x-1">
                    <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </span>
                ) : (
                  <span>Delete Expense</span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
