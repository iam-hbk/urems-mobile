"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function NavigationBar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={cn("flex w-full flex-1 flex-col overflow-hidden bg-background")}>
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
