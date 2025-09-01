import React from "react";
import DashboardProvider from "./provider";

function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <DashboardProvider>
                <div className="p-10">
                    {children}
                </div>
            </DashboardProvider>
        </div>
    )
}

export default DashboardLayout;
