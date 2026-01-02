"use client"
import { signOut } from "next-auth/react"
export function LogoutButton({ 
        callbackUrl = "/",
        className = "",
        children = "로그아웃",
    }: {
        callbackUrl?: string;
        className?: string;
        children?: React.ReactNode;
    }){
    return(  
    <button
        onClick={() => signOut({callbackUrl})}
        className={className}>
         {children}
    </button>
       )
}