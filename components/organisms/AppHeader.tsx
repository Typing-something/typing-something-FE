import { HeaderNav } from "../molecules/HeaderNav";

export function AppHeader(){
    return(
        <header className="fixed inset-x-0 top-0 z-20 bg-transparent text-neutral-900">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
                <HeaderNav />
            </div>
        </header>
    )
}