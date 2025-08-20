"use client";

import * as React from "react";
import {
  Calendar,
  Home,
  FileText,
  Users,
  Settings,
  LogOut,
  HelpCircle,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { useLogoutMutation } from "@/hooks/auth/useLogout";

// This is our navigation data structure
const navigationData = {
mainMenu: [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: Home,
        },
        {
          title: "PRF Forms",
          url: "/forms",
          icon: FileText,
        },
        {
          title: "Calendar",
          url: "/calendar",
          icon: Calendar,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          title: "Crew",
          url: "/crew",
          icon: Users,
        },
        {
          title: "Profile",
          url: "/profile",
          icon: User2,
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          title: "Guides",
          url: "/guides",
          icon: HelpCircle,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const logoutMutation = useLogoutMutation();
  const { state, isMobile } = useSidebar();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Sidebar className="border-r" collapsible="icon" {...props}>
      <SidebarHeader
        className={cn(
          "flex h-[60px] flex-row items-center justify-between",
          state === "collapsed" && !isMobile && "justify-center",
        )}
      >
        <span
          className={cn(
            "ml-3 whitespace-nowrap font-semibold",
            state === "collapsed" && !isMobile && "hidden",
          )}
        >
          UREMS PRF
        </span>
      </SidebarHeader>
      <SidebarContent>
        {navigationData.mainMenu.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton variant={"destructive"} onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
