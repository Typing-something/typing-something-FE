"use client"
import { ReactNode } from "react"
type Props = {
    children: ReactNode;
    ariaLabel: string;
    onClick?: () => void;
    disabled?: boolean; 
    variant?: "default" | "ghost";
}
export function IconButton({
    children, 
    ariaLabel, 
    onClick, 
    disabled = false,
    variant = "default"
}: Props){
    const variantStyle = variant === "default" ? "rounded-full border border-neutral-200 " : ""
    return (
        <button 
            type="button"
            aria-label={ariaLabel}
            onClick={onClick}
            disabled={disabled}
            className={[
                "h-7 w-7 grid place-items-center",
                "text-neutral-800",
                "hover:bg-neutral-50",
                "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent",
                variantStyle,
              ].join(" ")}
        >
            {children}
        </button>
    )
}