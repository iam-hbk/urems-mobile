"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
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

export function NavigationBar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      href: "#",
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
                label: "Heritier Kaumbu",
                href: "#",
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
        className="whitespace-pre font-medium text-primary-foreground"
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
