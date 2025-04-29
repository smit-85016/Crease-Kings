// src/app/settings/page.tsx
'use client'; // Add use client for stateful settings like toggles

import * as React from 'react';
import { useState, useEffect } from 'react'; // Import useEffect
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, CreditCard, Moon, Sun, Lock, Shield, HelpCircle, Info, FileText, ChevronRight, Palette } from 'lucide-react'; // Import relevant icons

export default function SettingsPage() {
  // Example state for toggles (in a real app, this would be fetched/persisted)
  const [bookingNotifications, setBookingNotifications] = useState(true);
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const [promoNotifications, setPromoNotifications] = useState(false);
  // Default dark mode state to false (light mode)
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeChange = (checked: boolean) => {
    setDarkMode(checked);
    // Apply/remove the dark class to the root HTML element
    if (checked) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark'); // Persist theme preference
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light'); // Persist theme preference
    }
     console.log("Dark mode toggled:", checked);
  };

  // Effect to set initial theme on mount based on localStorage, defaulting to light
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    // If theme is saved as 'dark', enable dark mode
    if (savedTheme === 'dark') {
        handleThemeChange(true);
    } else {
        // Otherwise, ensure light mode is active (default or saved as 'light')
        handleThemeChange(false);
        // Ensure the class is removed if it was somehow added previously (e.g., by browser extensions)
        document.documentElement.classList.remove('dark');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen bg-secondary">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Settings</CardTitle>
          <CardDescription>Manage your account, notifications, and app preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

          {/* Notifications Section */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md border bg-card">
                <Label htmlFor="booking-notifications" className="flex flex-col space-y-1 cursor-pointer">
                  <span>Booking Confirmations</span>
                  <span className="font-normal leading-snug text-muted-foreground text-xs">
                    Receive email/push notifications upon successful bookings.
                  </span>
                </Label>
                <Switch
                  id="booking-notifications"
                  checked={bookingNotifications}
                  onCheckedChange={setBookingNotifications}
                  aria-label="Toggle booking confirmation notifications"
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-md border bg-card">
                 <Label htmlFor="reminder-notifications" className="flex flex-col space-y-1 cursor-pointer">
                  <span>Booking Reminders</span>
                   <span className="font-normal leading-snug text-muted-foreground text-xs">
                     Get reminders before your scheduled game time.
                   </span>
                 </Label>
                <Switch
                  id="reminder-notifications"
                  checked={reminderNotifications}
                  onCheckedChange={setReminderNotifications}
                  aria-label="Toggle booking reminder notifications"
                />
              </div>
               <div className="flex items-center justify-between p-3 rounded-md border bg-card">
                 <Label htmlFor="promo-notifications" className="flex flex-col space-y-1 cursor-pointer">
                  <span>Promotional Offers</span>
                   <span className="font-normal leading-snug text-muted-foreground text-xs">
                     Receive news about special discounts and offers.
                   </span>
                 </Label>
                <Switch
                  id="promo-notifications"
                  checked={promoNotifications}
                  onCheckedChange={setPromoNotifications}
                  aria-label="Toggle promotional offer notifications"
                />
              </div>
            </div>
          </section>

          <Separator />

           {/* Preferences Section */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" /> Preferences
            </h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-3 rounded-md border bg-card">
                 <Label htmlFor="theme-toggle" className="flex flex-col space-y-1 cursor-pointer">
                  <span>Appearance</span>
                   <span className="font-normal leading-snug text-muted-foreground text-xs">
                     Switch between light and dark mode.
                   </span>
                 </Label>
                 <div className="flex items-center gap-2">
                    <Sun className={`h-5 w-5 transition-colors ${!darkMode ? 'text-primary' : 'text-muted-foreground'}`} />
                    <Switch
                      id="theme-toggle"
                      checked={darkMode} // Reflects the state, initially false
                      onCheckedChange={handleThemeChange}
                      aria-label="Toggle dark mode"
                    />
                    <Moon className={`h-5 w-5 transition-colors ${darkMode ? 'text-primary' : 'text-muted-foreground'}`} />
                 </div>
              </div>
              {/* Add other preferences like language, default sorting etc. if needed */}
             </div>
          </section>

          <Separator />

          {/* Account & Security Section */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Account & Security
            </h3>
            <div className="space-y-3">
               <Button variant="outline" className="w-full justify-between text-left">
                 <div className="flex items-center gap-2">
                   <CreditCard className="h-4 w-4 text-muted-foreground" />
                   <span>Manage Payment Methods</span>
                 </div>
                 <ChevronRight className="h-4 w-4 text-muted-foreground" />
               </Button>
               <Button variant="outline" className="w-full justify-between text-left">
                 <div className="flex items-center gap-2">
                   <Lock className="h-4 w-4 text-muted-foreground" />
                   <span>Change Password</span>
                 </div>
                 <ChevronRight className="h-4 w-4 text-muted-foreground" />
               </Button>
               {/* Add options like Two-Factor Authentication placeholder if relevant */}
            </div>
          </section>

          <Separator />

          {/* Help & About Section */}
          <section>
             <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" /> Help & About
            </h3>
             <div className="space-y-3">
               <Button variant="outline" className="w-full justify-between text-left">
                 <div className="flex items-center gap-2">
                   <HelpCircle className="h-4 w-4 text-muted-foreground" />
                   <span>Help & Support (FAQ)</span>
                 </div>
                 <ChevronRight className="h-4 w-4 text-muted-foreground" />
               </Button>
               <Button variant="outline" className="w-full justify-between text-left">
                 <div className="flex items-center gap-2">
                   <FileText className="h-4 w-4 text-muted-foreground" />
                   <span>Terms of Service</span>
                 </div>
                 <ChevronRight className="h-4 w-4 text-muted-foreground" />
               </Button>
                <Button variant="outline" className="w-full justify-between text-left">
                 <div className="flex items-center gap-2">
                   <Shield className="h-4 w-4 text-muted-foreground" />
                   <span>Privacy Policy</span>
                 </div>
                 <ChevronRight className="h-4 w-4 text-muted-foreground" />
               </Button>
                <div className="text-center text-muted-foreground text-xs pt-4">
                    Crease Kings App Version 1.0.0 (Build 20240726) {/* Updated App Name */}
                 </div>
             </div>
          </section>

        </CardContent>
      </Card>
    </main>
  );
}
