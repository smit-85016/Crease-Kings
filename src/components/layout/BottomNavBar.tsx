// src/components/layout/BottomNavBar.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Mail, User, Settings, LogIn } from 'lucide-react'; // Added LogIn
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Placeholder for authentication status (replace with real auth check)
const useAuth = () => ({ isAuthenticated: false }); // Assume not logged in for now

export default function BottomNavBar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth(); // Check authentication status

  const baseNavItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/contact', label: 'Contact Us', icon: Mail },
  ];

  const authNavItems = [
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const unauthNavItems = [
     { href: '/login', label: 'Login', icon: LogIn }, // Add login icon/link
     // Optionally add signup link too, or handle via login page
  ];


  // Determine which set of navigation items to show
   const navItems = isAuthenticated
     ? [...baseNavItems, ...authNavItems]
     : [...baseNavItems, ...unauthNavItems];


  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border shadow-md flex items-center justify-around z-50">
      {navItems.map((item) => {
        // Handle nested paths for active state (e.g., /profile/*) if needed
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

        return (
          <Link href={item.href} key={item.label} passHref legacyBehavior>
            <Button
              variant="ghost"
              className={cn(
                'flex flex-col items-center justify-center h-full px-2 text-muted-foreground hover:text-primary hover:bg-transparent',
                 isActive && 'text-primary',
                 // Adjust width distribution if more items are added
                 navItems.length > 4 ? 'w-1/5' : 'w-1/4' // Simple width adjustment
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
