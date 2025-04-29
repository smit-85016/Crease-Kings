// src/components/layout/BottomNavBar.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Mail, User, Settings } from 'lucide-react'; // Removed LogIn
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Removed the useAuth hook as login/signup is temporarily disabled

export default function BottomNavBar() {
  const pathname = usePathname();
  // const { isAuthenticated } = useAuth(); // Removed auth check

  // Always show these items now
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/contact', label: 'Contact Us', icon: Mail },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];


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
                 // Adjust width distribution based on number of items
                 'flex-1 max-w-[25%]' // Ensure items distribute somewhat evenly
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-xs text-center">{item.label}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
