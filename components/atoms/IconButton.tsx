"use client"
import { ReactNode } from "react"
type Props = {
    children: ReactNode;
    ariaLabel: string;
    onClick?: () => void;
    variant?: "default" | "ghost";
}
export function IconButton({children, ariaLabel, onClick, variant = "default"}: Props){
    const variantStyle = variant === "default" ? "rounded-full border border-neutral-200 " : ""
    return (
        <button 
            type="button"
            aria-label="ariaLabel"
            onClick={onClick}
            className={`h-7 w-7 grid place-items-center text-neutral-800 hover:bg-neutral-50 ${variantStyle}`} 
            >
            {children}
        </button>
    )
}