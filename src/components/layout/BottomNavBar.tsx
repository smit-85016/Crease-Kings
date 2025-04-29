// src/components/layout/BottomNavBar.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Mail, User, Settings, LogIn } from 'lucide-react'; // Added LogIn
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Simulated authentication hook checking sessionStorage
const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    React.useEffect(() => {
        // Check if the user is logged in based on sessionStorage flag
        const loggedIn = typeof window !== 'undefined' ? sessionStorage.getItem('isLoggedIn') === 'true' : false;
        setIsAuthenticated(loggedIn);

        // Optional: Add event listener for storage changes if needed for cross-tab sync
        const handleStorageChange = () => {
             const loggedIn = typeof window !== 'undefined' ? sessionStorage.getItem('isLoggedIn') === 'true' : false;
             setIsAuthenticated(loggedIn);
        };

        window.addEventListener('storage', handleStorageChange);
        // Also check on focus in case login happened in another tab
        window.addEventListener('focus', handleStorageChange);

        // Simulate initial check if needed (sometimes useEffect runs after initial paint)
        handleStorageChange();


        return () => {
             window.removeEventListener('storage', handleStorageChange);
             window.removeEventListener('focus', handleStorageChange);
        };
    }, []); // Empty dependency array ensures this runs once on mount and cleans up

    return { isAuthenticated };
};

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
  ];


  // Determine which set of navigation items to show based on authentication
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
