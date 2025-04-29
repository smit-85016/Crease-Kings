// src/app/profile/page.tsx
'use client'; // Add use client directive for state management

import * as React from 'react';
import { useState } from 'react'; // Import useState
import { useRouter } from 'next/navigation'; // Import useRouter
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Import form components
import { useToast } from '@/hooks/use-toast'; // Import useToast

import { User, Mail, Phone, CalendarDays, MapPin, Edit, LogOut, History, Star, Clock, MapPinned, ShieldCheck, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'; // Added ChevronDown, ChevronUp, Loader2

// Define Zod schema for profile editing
const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits.' }).regex(/^\+?[0-9\s\-()]+$/, { message: 'Invalid phone number format.'}), // Allow digits, spaces, hyphens, parentheses, optional leading +
  location: z.string().min(3, { message: 'Location must be at least 3 characters.' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;


// Fake user data (initial)
const initialFakeUser = {
  name: 'Virat Sharma',
  email: 'virat.sharma@creasekings.fake', // Updated email domain
  phone: '+91 98765 43210',
  joinedDate: '2023-05-15',
  avatarUrl: 'https://picsum.photos/seed/virat/100/100', // Placeholder avatar
  membership: 'Gold Member',
  location: 'Mumbai, India',
  totalBookings: 25,
  lastBookingDate: '2024-07-10',
  favoriteGround: 'Alpha Arena',
};

// Fake booking history data
const fakeBookingHistory = [
  { id: 'bh001', groundName: 'Alpha Arena', date: '2024-07-10', time: '18:00 - 19:00', status: 'Completed', price: 1200 },
  { id: 'bh002', groundName: 'Beta Box Park', date: '2024-06-25', time: '19:00 - 20:00', status: 'Completed', price: 1000 },
  { id: 'bh003', groundName: 'Gamma Cricket Hub', date: '2024-06-10', time: '17:00 - 18:00', status: 'Completed', price: 1150 },
  { id: 'bh004', groundName: 'Alpha Arena', date: '2024-05-20', time: '20:00 - 21:00', status: 'Completed', price: 1200 },
  { id: 'bh005', groundName: 'Beta Box Park', date: '2024-07-25', time: '18:00 - 19:00', status: 'Upcoming', price: 1000 },
  { id: 'bh006', groundName: 'Gamma Cricket Hub', date: '2024-04-15', time: '16:00 - 17:00', status: 'Completed', price: 1150 },
  { id: 'bh007', groundName: 'Alpha Arena', date: '2024-03-30', time: '19:00 - 20:00', status: 'Completed', price: 1200 },
];

const INITIAL_HISTORY_COUNT = 3;

export default function ProfilePage() {
  const [userData, setUserData] = useState(initialFakeUser); // State for user data
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // State for saving indicator
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for dialog open/close
  const { toast } = useToast();
  const router = useRouter(); // Initialize useRouter for logout redirection

  const displayedHistory = showFullHistory ? fakeBookingHistory : fakeBookingHistory.slice(0, INITIAL_HISTORY_COUNT);

   // Initialize react-hook-form
   const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      location: userData.location,
    },
     // Re-initialize form when userData changes (e.g., after saving) or dialog opens
     values: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        location: userData.location,
      },
  });

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    console.log('Updating profile:', data);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update the user data state
    setUserData((prevData) => ({
      ...prevData, // Keep existing non-editable data
      ...data, // Update with new form data
    }));

    setIsSaving(false);
    setIsEditDialogOpen(false); // Close the dialog on successful save
    form.reset(data); // Reset form with new values

    toast({
        title: 'Profile Updated',
        description: 'Your profile details have been saved.',
    });
  };

    // Handle Logout
    const handleLogout = () => {
        console.log('Logging out...');
        // Remove the login flag from sessionStorage
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('tempUserEmail'); // Also clear temp creds if they exist
            sessionStorage.removeItem('tempUserPassword');
            // Trigger storage event to update other tabs/components like BottomNavBar
             window.dispatchEvent(new Event('storage'));
        }
        toast({
            title: 'Logged Out',
            description: 'You have been successfully logged out.',
        });
        // Redirect to login page
        router.push('/login');
    };


  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen bg-secondary">
      <Card className="max-w-3xl mx-auto shadow-lg overflow-hidden"> {/* Increased max-width */}
        <CardHeader className="bg-gradient-to-r from-primary/10 via-card to-accent/10 p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border-2 border-primary shadow-md">
              <AvatarImage src={userData.avatarUrl} alt={userData.name} />
              <AvatarFallback className="text-xl bg-primary/20 text-primary">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold text-primary">{userData.name}</CardTitle>
              <CardDescription className="text-md flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {userData.location}
              </CardDescription>
              <Badge variant="default" className="mt-2 bg-accent text-accent-foreground">
                 <Star className="mr-1 h-3 w-3" /> {userData.membership}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Personal Details */}
          <section>
            <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Personal Information
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{userData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Joined on {new Date(userData.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </section>

          <Separator />

          {/* Booking Activity */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
              <History className="h-5 w-5 text-primary" /> Booking Activity
            </h3>
             {/* Summary Boxes */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div className="bg-muted p-3 rounded-lg text-center">
                    <p className="font-semibold text-foreground">{userData.totalBookings}</p>
                    <p className="text-muted-foreground text-xs">Total Bookings</p>
                </div>
                 <div className="bg-muted p-3 rounded-lg text-center">
                    <p className="font-semibold text-foreground">{userData.favoriteGround}</p>
                    <p className="text-muted-foreground text-xs">Favorite Ground</p>
                </div>
                 <div className="bg-muted p-3 rounded-lg text-center col-span-2">
                    <p className="font-semibold text-foreground">
                      {new Date(userData.lastBookingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-muted-foreground text-xs">Last Game Played</p>
                </div>
            </div>

            {/* Booking History Table */}
            <h4 className="text-md font-semibold mb-2 text-foreground">Booking History</h4>
            <div className="rounded-md border overflow-hidden">
               <Table>
                 <TableHeader className="bg-muted/50">
                   <TableRow>
                     <TableHead className="w-[150px] hidden sm:table-cell">
                        <MapPinned className="inline-block h-4 w-4 mr-1" /> Ground
                     </TableHead>
                     <TableHead className="sm:hidden">Details</TableHead>{/* Combined column for mobile */}
                     <TableHead className="w-[100px] text-center hidden sm:table-cell">
                        <CalendarDays className="inline-block h-4 w-4 mr-1" /> Date
                      </TableHead>
                     <TableHead className="w-[120px] text-center hidden sm:table-cell">
                        <Clock className="inline-block h-4 w-4 mr-1" /> Time
                      </TableHead>
                     <TableHead className="w-[100px] text-right hidden sm:table-cell">Status</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {displayedHistory.length > 0 ? (
                     displayedHistory.map((booking) => (
                       <TableRow key={booking.id}>
                         {/* Desktop View */}
                         <TableCell className="font-medium hidden sm:table-cell">{booking.groundName}</TableCell>
                         <TableCell className="text-center hidden sm:table-cell">{new Date(booking.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                         <TableCell className="text-center hidden sm:table-cell">{booking.time}</TableCell>
                         <TableCell className="text-right hidden sm:table-cell">
                            <Badge variant={booking.status === 'Completed' ? 'secondary' : 'default'} className={booking.status === 'Upcoming' ? 'bg-primary/80 text-primary-foreground' : ''}>
                              {booking.status}
                            </Badge>
                         </TableCell>
                         {/* Mobile View */}
                         <TableCell className="sm:hidden">
                            <div className="font-medium">{booking.groundName}</div>
                            <div className="text-xs text-muted-foreground">
                               {new Date(booking.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} @ {booking.time}
                             </div>
                             <Badge variant={booking.status === 'Completed' ? 'secondary' : 'default'} className={`mt-1 text-xs ${booking.status === 'Upcoming' ? 'bg-primary/80 text-primary-foreground' : ''}`}>
                               {booking.status}
                             </Badge>
                          </TableCell>
                       </TableRow>
                     ))
                   ) : (
                     <TableRow>
                       <TableCell colSpan={4} className="text-center text-muted-foreground py-4">No booking history found.</TableCell>
                     </TableRow>
                   )}
                 </TableBody>
               </Table>
            </div>
             {/* See More / See Less Button */}
             {fakeBookingHistory.length > INITIAL_HISTORY_COUNT && (
                <div className="mt-4 text-center">
                  <Button
                    variant="link"
                    onClick={() => setShowFullHistory(!showFullHistory)}
                    className="text-primary hover:text-primary/80"
                  >
                    {showFullHistory ? (
                       <>
                         <ChevronUp className="mr-1 h-4 w-4" /> See Less
                       </>
                    ) : (
                       <>
                         <ChevronDown className="mr-1 h-4 w-4" /> See More ({fakeBookingHistory.length - INITIAL_HISTORY_COUNT} more)
                       </>
                    )}
                  </Button>
                </div>
             )}
          </section>

          <Separator />

          {/* Actions */}
            <section className="flex flex-col sm:flex-row gap-3">
                 {/* Edit Profile Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                   <DialogTrigger asChild>
                     <Button variant="outline" className="flex-1">
                       <Edit className="mr-2 h-4 w-4" /> Edit Profile
                     </Button>
                   </DialogTrigger>
                   <DialogContent className="sm:max-w-[425px]">
                     <DialogHeader>
                       <DialogTitle>Edit Profile</DialogTitle>
                       <DialogDescription>
                         Make changes to your profile here. Click save when you're done.
                       </DialogDescription>
                     </DialogHeader>
                     <Form {...form}>
                       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                         <FormField
                           control={form.control}
                           name="name"
                           render={({ field }) => (
                             <FormItem>
                               <FormLabel>Name</FormLabel>
                               <FormControl>
                                 <Input placeholder="Your Name" {...field} disabled={isSaving} />
                               </FormControl>
                               <FormMessage />
                             </FormItem>
                           )}
                         />
                          <FormField
                           control={form.control}
                           name="email"
                           render={({ field }) => (
                             <FormItem>
                               <FormLabel>Email</FormLabel>
                               <FormControl>
                                 <Input type="email" placeholder="your.email@example.com" {...field} disabled={isSaving} />
                               </FormControl>
                               <FormMessage />
                             </FormItem>
                           )}
                         />
                          <FormField
                           control={form.control}
                           name="phone"
                           render={({ field }) => (
                             <FormItem>
                               <FormLabel>Phone</FormLabel>
                               <FormControl>
                                 <Input type="tel" placeholder="+91 12345 67890" {...field} disabled={isSaving} />
                               </FormControl>
                               <FormMessage />
                             </FormItem>
                           )}
                         />
                         <FormField
                           control={form.control}
                           name="location"
                           render={({ field }) => (
                             <FormItem>
                               <FormLabel>Location</FormLabel>
                               <FormControl>
                                 <Input placeholder="City, Country" {...field} disabled={isSaving} />
                               </FormControl>
                               <FormMessage />
                             </FormItem>
                           )}
                         />
                         <DialogFooter>
                           <DialogClose asChild>
                             <Button type="button" variant="secondary" disabled={isSaving}>
                               Cancel
                             </Button>
                           </DialogClose>
                           <Button type="submit" disabled={isSaving}>
                             {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             Save Changes
                           </Button>
                         </DialogFooter>
                       </form>
                     </Form>
                   </DialogContent>
                </Dialog>

               {/* Logout Button */}
               <Button variant="destructive" className="flex-1" onClick={handleLogout}>
                 <LogOut className="mr-2 h-4 w-4" /> Logout
               </Button>
           </section>
        </CardContent>
      </Card>
    </main>
  );
}
