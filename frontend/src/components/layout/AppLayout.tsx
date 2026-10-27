import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        return localStorage.getItem("sidebar_collapsed") === "true";
    });
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed((prev) => {
            const next = !prev;
            localStorage.setItem("sidebar_collapsed", String(next));
            return next;
        });
    };

    return (
        <div className="flex min-h-screen w-full bg-muted/30">
            <Sidebar
                isCollapsed={isCollapsed}
                onToggleCollapse={toggleCollapse}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
            />

            <div className="flex flex-1 flex-col min-w-0">
                <Header onOpenMobileMenu={() => setMobileOpen(true)} />

                <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
