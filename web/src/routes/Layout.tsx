import { Outlet } from "react-router";

export function Layout() {
    return (
        <div className="min-h-screen flex justify-center py-4">
            <div className="w-full max-w-3xl px-4">
                <Outlet />
            </div>
        </div>
    );
}