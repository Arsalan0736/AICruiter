'use client'
import React, { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSidebar";
import WelcomeContainer from "./dashboard/_components/WelcomeContainer";
import { useUser } from "@/app/provider";
import { useRouter } from "next/navigation";

function DashboardProvider({ children }) {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to auth
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="w-full p-10">
                <WelcomeContainer/>
                {children}
            </div>
        </SidebarProvider>
    )
}

export default DashboardProvider;
