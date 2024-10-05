import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const SidebarButton = ({
  Icon,
  label,
  onClick,
  isActive,
}: {
  Icon: React.ComponentType<any>;
  label: string;
  onClick?: () => void;
  isActive: boolean;
}) => (
  <Button
    variant={isActive ? "secondary" : "ghost"}
    className={cn(
      "w-full justify-start text-lg",
      isActive && "bg-secondary text-secondary-foreground"
    )}
    onClick={onClick}
  >
    <Icon className="mr-2 h-4 w-4" />
    {label}
  </Button>
);
