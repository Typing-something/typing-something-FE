// components/organisms/AppFooter.tsx
import Link from "next/link";

export function AppFooter(){
    return(
        <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-500">
            <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 text-xs">
                <span>© 2025 Typing Something</span>
                <div>
                    <Link 
                    href="https://github.com/..."
                    className="hover:text-neutral-200 transition-colors underline-offset-4 hover:underline"                    
                    >
                        GitHub
                    </Link>
                </div>
            </div>

        </footer>
    )
}