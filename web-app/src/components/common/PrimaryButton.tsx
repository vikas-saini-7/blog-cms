import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps {
  value: string;
  className?: string;
  variant?: "default" | "outline";
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  value,
  className = "",
  variant = "default",
}) => {
  const variantClasses = {
    default: "bg-orange-500 hover:bg-orange-600 text-white",
    outline:
      "border border-orange-500 text-orange-500 hover:bg-orange-100 hover:text-orange-600",
  };

  return (
    <Button className={cn("px-8 py-6 font-semibold rounded-xl", variantClasses[variant], className)}>
      {value}
    </Button>
  );
};

export default PrimaryButton;
