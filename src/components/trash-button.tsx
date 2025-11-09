"use client"

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick: () => void;
}

export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="icon"
      className="relative text-muted-foreground transition-colors"
      aria-label="Delete bookmark"
    >
      <Trash2 className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all" />
    </Button>
  );
}
