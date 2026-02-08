import type { LucideIcon } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
  icon?: LucideIcon;
}

const variants = {
  primary:
    "bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg shadow-stone-900/10",
  secondary:
    "bg-white text-stone-700 border border-stone-200 hover:bg-stone-50 hover:border-stone-300 shadow-sm",
  ghost: "text-stone-500 hover:bg-stone-100 hover:text-stone-900",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
};

export function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  icon: Icon,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 active:scale-95 ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
}
