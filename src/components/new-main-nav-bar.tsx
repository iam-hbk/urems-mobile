'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  FileTextIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  Settings2Icon,
  UserIcon,
  MenuIcon,
} from "lucide-react"

const navItems = [
  { name: "Patient Report Form", href: "/", icon: FileTextIcon },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { name: "Profile", href: "/profile", icon: UserIcon },
  { name: "Settings", href: "/settings", icon: Settings2Icon },
]

export function NavigationBar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const Sidebar = () => (
    <div className="flex h-full flex-col bg-primary text-primary-foreground">
      <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4">
        <span className="text-lg font-semibold">EMS</span>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "flex w-full items-center justify-start gap-2",
                  pathname === item.href
                    ? "bg-primary-foreground/10"
                    : "hover:bg-primary-foreground/10"
                )}
                asChild
              >
                <Link href={item.href} onClick={() => setOpen(false)}>
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </Button>
            )
          })}
        </nav>
      </ScrollArea>
      <div className="border-t border-primary-foreground/10 p-4">
        <Button
          variant="ghost"
          className="flex w-full items-center justify-start gap-2"
          asChild
        >
          <Link href="/logout" onClick={() => setOpen(false)}>
            <LogOutIcon className="h-5 w-5" />
            <span>Logout</span>
          </Link>
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 md:block">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b px-4 md:hidden">
          {/* <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger> */}
          <span className="ml-2 text-lg font-semibold">EMS</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  )
}