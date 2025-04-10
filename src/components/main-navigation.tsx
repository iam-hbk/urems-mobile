"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconUserCircle,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Settings,
  User2,
} from "lucide-react";
import { useZuStandEmployeeStore } from "@/lib/zuStand/employee";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function NavigationBar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { zsEmployee, zsClearemployee } = useZuStandEmployeeStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to logout');
      }

      // Clear employee data from Zustand
      zsClearemployee();
      toast.success("Logged out successfully");
      router.push('/login');
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <LayoutDashboard className="h-5 w-5 flex-shrink-0 text-primary-foreground" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <User2 className="h-5 w-5 flex-shrink-0 text-primary-foreground" />,
    },
    {
      label: "Guides",
      href: "#",
      icon: (
        <HelpCircle className="h-5 w-5 flex-shrink-0 text-primary-foreground" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <Settings className="h-5 w-5 flex-shrink-0 text-primary-foreground" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <LogOut className="h-5 w-5 flex-shrink-0 scale-x-[-1] transform text-primary-foreground" />
      ),
      onClick: handleLogout,
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden bg-background md:flex-row",
        "h-screen",
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="overflow-y flex flex-1 flex-col overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: `${zsEmployee?.person.firstName} ${zsEmployee?.person.lastName}`,
                href: "/profile",
                icon: (
                  <span>
                    <IconUserCircle />
                  </span>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-primary"
    >
      <div className="h-5 w-6 flex-shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-secondary" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      // className="whitespace-pre font-medium text-primary-foreground"
      >
        Patient Report Form
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 items-center rounded-sm border border-primary-foreground px-1 text-center text-sm font-normal text-primary-foreground"
    >
      PRF
    </Link>
  );
};
