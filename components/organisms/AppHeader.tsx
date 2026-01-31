import { HeaderNav } from "../molecules/HeaderNav";

export function AppHeader(){
    return(
        <header className="fixed inset-x-0 top-0 z-50 bg-neutral-100 text-neutral-900 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
                <HeaderNav />
            </div>
        </header>
    )
}