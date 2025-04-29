// src/app/profile/page.tsx
import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Import Table components
import { User, Mail, Phone, CalendarDays, MapPin, Edit, LogOut, History, Star, Clock, MapPinned, ShieldCheck } from 'lucide-react';

// Fake user data
const fakeUser = {
  name: 'Virat Sharma',
  email: 'virat.sharma@boxcricket.fake',
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
  { id: 'bh005', groundName: 'Beta Box Park', date: '2024-07-25', time: '18:00 - 19:00', status: 'Upcoming', price: 1000 }, // Example upcoming booking
];


export default function ProfilePage() {
  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen bg-secondary">
      <Card className="max-w-3xl mx-auto shadow-lg overflow-hidden"> {/* Increased max-width */}
        <CardHeader className="bg-gradient-to-r from-primary/10 via-card to-accent/10 p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border-2 border-primary shadow-md">
              <AvatarImage src={fakeUser.avatarUrl} alt={fakeUser.name} />
              <AvatarFallback className="text-xl bg-primary/20 text-primary">
                {fakeUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold text-primary">{fakeUser.name}</CardTitle>
              <CardDescription className="text-md flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {fakeUser.location}
              </CardDescription>
              <Badge variant="default" className="mt-2 bg-accent text-accent-foreground">
                 <Star className="mr-1 h-3 w-3" /> {fakeUser.membership}
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
                <span>{fakeUser.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{fakeUser.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Joined on {new Date(fakeUser.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
                    <p className="font-semibold text-foreground">{fakeUser.totalBookings}</p>
                    <p className="text-muted-foreground text-xs">Total Bookings</p>
                </div>
                 <div className="bg-muted p-3 rounded-lg text-center">
                    <p className="font-semibold text-foreground">{fakeUser.favoriteGround}</p>
                    <p className="text-muted-foreground text-xs">Favorite Ground</p>
                </div>
                 <div className="bg-muted p-3 rounded-lg text-center col-span-2">
                    <p className="font-semibold text-foreground">
                      {new Date(fakeUser.lastBookingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
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
                     <TableHead className="sm:hidden">Details</TableHead> {/* Combined column for mobile */}
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
                   {fakeBookingHistory.length > 0 ? (
                     fakeBookingHistory.map((booking) => (
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
              {/* Removed the "View Full Booking History" button */}
          </section>

          <Separator />

          {/* Actions */}
          <section className="flex flex-col sm:flex-row gap-3">
             <Button variant="outline" className="flex-1">
               <Edit className="mr-2 h-4 w-4" /> Edit Profile
             </Button>
              <Button variant="destructive" className="flex-1">
                 <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
          </section>

        </CardContent>

      </Card>
    </main>
  );
}
