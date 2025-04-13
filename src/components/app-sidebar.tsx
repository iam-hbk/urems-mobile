"use client";

import * as React from "react";
import {
  Calendar,
  Home,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
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
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
          url: "/prf",
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
  const { zsEmployee, zsClearemployee } = useZuStandEmployeeStore();
  const router = useRouter();
  const { state } = useSidebar();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      zsClearemployee();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <Sidebar className="border-r" collapsible="icon" {...props}>
      <SidebarHeader
        className={cn(
          "flex h-[60px] flex-row items-center justify-between",
          state === "collapsed" && "justify-center"
        )}
      >
        <span
          className={cn(
            "ml-3 font-semibold",
            state === "collapsed" && "hidden"
          )}
        >
          UREMS PRF
        </span>
        <SidebarTrigger>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SidebarTrigger>
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
      <SidebarFooter className="px-4 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
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
