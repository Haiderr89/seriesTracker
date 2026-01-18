import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function Layout() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            <main className="mx-auto max-w-md min-h-screen pb-20 px-4 pt-6">
                <Outlet />
            </main>
            <BottomNav />
        </div>
    );
}
