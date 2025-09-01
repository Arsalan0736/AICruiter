'use client'
import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import { SideBarOptions } from "@/services/Constants"
import { Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import CreditDisplay from './CreditDisplay'
import UserProfile from './UserProfile'
  
  export function AppSidebar() {

    const path = usePathname();
    console.log(path);
    

    return (
      <Sidebar>
        <SidebarHeader className="flex items-center mt-5">
            <Image src="/logo.png" alt="logo" 
            width={200} height={100} 
            className="w-[150px]"/>
            <Link href="/dashboard/create-interview" className="w-full mt-5">
                <Button className="w-full"><Plus/> Create New Interview</Button>
            </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarContent>
                <SidebarMenu>
                    {SideBarOptions.map((option,index)=>(
                        <SidebarMenuItem key={index} className='p-1'>
                            <SidebarMenuButton asChild className={`p-5 ${path==option.path && 'bg-blue-50'}`}>
                                <Link href={option.path}>
                                    <option.Icon className={`${path==option.path && 'text-primary'}`} />
                                    <span className={`text-[16px] font-medium ${path==option.path && 'text-primary'}`}>{option.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
          </SidebarGroup>
          <SidebarGroup>
            <CreditDisplay />
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <UserProfile />
        </SidebarFooter>
      </Sidebar>
    )
  }

