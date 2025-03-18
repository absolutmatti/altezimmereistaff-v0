"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Calendar, Users, Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface NavItem {
  href: string
  icon: React.ElementType
  label: string
  pattern: RegExp
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Feed",
    pattern: /^\/dashboard/,
  },
  {
    href: "/schedule",
    icon: Clock,
    label: "Dienstplan",
    pattern: /^\/schedule/,
  },
  {
    href: "/meetings",
    icon: Users,
    label: "Besprechungen",
    pattern: /^\/meetings/,
  },
  {
    href: "/calendar",
    icon: Calendar,
    label: "Kalender",
    pattern: /^\/calendar/,
  },
  {
    href: "/profile",
    icon: User,
    label: "Profil",
    pattern: /^\/profile/,
  },
]

export default function NavigationBar() {
  const pathname = usePathname()
  const [activeIndex, setActiveIndex] = useState(0)

  // Update active index based on current path
  useEffect(() => {
    const index = navItems.findIndex((item) => item.pattern.test(pathname))
    if (index !== -1) {
      setActiveIndex(index)
    }
  }, [pathname])

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <nav className="flex justify-around items-center h-16 px-2 max-w-3xl mx-auto">
        {navItems.map((item, index) => {
          const isActive = index === activeIndex

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full relative",
                "transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-md"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center">
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

