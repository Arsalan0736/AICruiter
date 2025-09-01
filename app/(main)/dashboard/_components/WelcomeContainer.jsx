"use client";
import { useUser } from "@/app/provider";
import Image from "next/image";
import React from "react";

function WelcomeContainer(){
    const {user} = useUser();
    return (
        // <div className="bg-white p-5 rounded-xl">
        //     <h2 className="text-lg font-bold">Welcome Back, {user?.name}</h2>
        //     <h2 className="text-gray-500">AI_Driven Interviews, Hassel-free Hiring</h2>
        // </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-5 rounded-xl flex justify-between items-center shadow-lg">
            <div>
                <h2 className="text-lg font-bold text-white">Welcome Back, {user?.name}</h2>
                <h2 className="text-gray-300">AI_Driven Interviews, Hassel-free Hiring</h2>
            </div>
            {user?.picture && (
                <Image src={user.picture} alt="user avatar" width={40} height={40}
                className="rounded-full border-2 border-white/30" />
            )}
        </div>
        
        
    )
}

export default WelcomeContainer;






