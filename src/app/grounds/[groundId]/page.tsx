// src/app/grounds/[groundId]/page.tsx
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation'; // Use useParams to get groundId
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Import Select components
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin, DollarSign, Users, Star, Phone, CheckCircle, XCircle, Loader2, Sparkles, Trees, Sun, Wifi, ParkingCircle, ShowerHead } from 'lucide-react'; // Added more icons
import { cn } from '@/lib/utils';
import type { Ground, TimeSlot } from '@/services/ground-booking'; // Import TimeSlot
import { getGroundById, getTimeSlots } from '@/services/ground-booking'; // Import new functions
import { useToast } from '@/hooks/use-toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'; // For image gallery
import { Label } from '@/components/ui/label'; // Import Label component

// Helper to map amenity string to icon
const AmenityIcon = ({ amenity }: { amenity: string }) => {
    switch (amenity.toLowerCase()) {
        case 'indoor turf': return <Trees className="h-4 w-4 text-primary" />;
        case 'floodlights':
        case 'night lights':
        case 'good lighting': return <Sun className="h-4 w-4 text-primary" />; // Using Sun for lights
        case 'seating area':
        case 'seating': return <Users className="h-4 w-4 text-primary" />;
        case 'washrooms': return <ShowerHead className="h-4 w-4 text-primary" />; // Placeholder icon
        case 'parking':
        case 'large parking': return <ParkingCircle className="h-4 w-4 text-primary" />;
        case 'outdoor astroturf':
        case 'hard courts':
        case 'wooden courts':
        case 'natural grass': return <Sparkles className="h-4 w-4 text-primary" />; // Placeholder icon for surface
        case 'netting': return <Wifi className="h-4 w-4 text-primary rotate-90" />; // Wifi icon rotated for netting :D
        case 'drinking water': return <CheckCircle className="h-4 w-4 text-primary" />; // Placeholder
        case 'electronic scoring':
        case 'scoreboard': return <Clock className="h-4 w-4 text-primary" />; // Clock for scoring
        case 'practice nets': return <Trees className="h-4 w-4 text-primary" />; // Placeholder
        case 'equipment rental':
        case 'rental rackets': return <DollarSign className="h-4 w-4 text-primary" />; // Placeholder
        case 'beach access': return <Sun className="h-4 w-4 text-primary" />; // Placeholder
        case 'showers': return <ShowerHead className="h-4 w-4 text-primary" />;
        case 'cafe nearby':
        case 'snack bar': return <Sparkles className="h-4 w-4 text-primary" />; // Placeholder
        case 'adjustable hoops': return <CheckCircle className="h-4 w-4 text-primary" />; // Placeholder
        case 'changing rooms': return <Users className="h-4 w-4 text-primary" />; // Placeholder
        case 'multiple pitches': return <MapPin className="h-4 w-4 text-primary" />; // Placeholder
        default: return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
};


export default function GroundDetailPage() {
  const params = useParams();
  const groundId = params.groundId as string;
  const { toast } = useToast();

  const [ground, setGround] = useState<Ground | null>(null);
  const [loadingGround, setLoadingGround] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isBooking, setIsBooking] = useState(false); // State for booking process
  const [error, setError] = useState<string | null>(null);

  // Fetch ground details
  useEffect(() => {
    if (!groundId) return;
    setLoadingGround(true);
    setError(null); // Reset error state

    getGroundById(groundId)
      .then(data => {
        if (data) {
          setGround(data);
        } else {
          setError(`Ground with ID ${groundId} not found.`);
           toast({
              title: 'Error',
              description: `Ground not found.`,
              variant: 'destructive',
            });
        }
        setLoadingGround(false);
      })
      .catch(err => {
        console.error("Failed to fetch ground details:", err);
        setError("Failed to load ground details. Please try again.");
        toast({
          title: 'Error',
          description: 'Could not fetch ground details.',
          variant: 'destructive',
        });
        setLoadingGround(false);
      });
  }, [groundId, toast]);

  // Fetch time slots when ground or selectedDate changes
  useEffect(() => {
    if (!ground || !selectedDate) {
        setTimeSlots([]); // Clear time slots if no ground or date
        return;
    }

    setLoadingTimeSlots(true);
    setSelectedTimeSlot(null); // Reset selected time slot

    const dateString = format(selectedDate, 'yyyy-MM-dd');
    getTimeSlots(ground.id, dateString)
      .then(slots => {
        setTimeSlots(slots);
        setLoadingTimeSlots(false);
      })
      .catch(err => {
        console.error("Failed to fetch time slots:", err);
        toast({
          title: 'Error',
          description: `Could not fetch time slots for ${format(selectedDate, 'PPP')}.`,
          variant: 'destructive',
        });
        setLoadingTimeSlots(false);
        setTimeSlots([]); // Clear slots on error
      });
  }, [ground, selectedDate, toast]);

  // Handle booking action (placeholder)
  const handleBooking = async () => {
    if (!ground || !selectedDate || !selectedTimeSlot) return;

    setIsBooking(true);
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate success/failure
    const success = Math.random() > 0.2; // 80% success rate

    if (success) {
      toast({
        title: 'Booking Successful!',
        description: `Booked ${ground.name} on ${format(selectedDate, 'PPP')} from ${selectedTimeSlot.startTime} to ${selectedTimeSlot.endTime}.`,

      });
      // Update the specific time slot to unavailable (optimistic update)
      setTimeSlots(prevSlots =>
        prevSlots.map(slot =>
          slot.startTime === selectedTimeSlot.startTime
            ? { ...slot, available: false }
            : slot
        )
      );
      setSelectedTimeSlot(null); // Reset selection
    } else {
      toast({
        title: 'Booking Failed',
        description: 'Could not complete the booking. The slot might have become unavailable or there was a payment issue.',
        variant: 'destructive',
      });
    }
    setIsBooking(false);
  };

  if (loadingGround) {
    return (
      <div className="container mx-auto p-4 md:p-8 min-h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
       <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center justify-center text-center">
         <XCircle className="h-16 w-16 text-destructive mb-4" />
         <h1 className="text-2xl font-bold text-destructive mb-2">Loading Error</h1>
         <p className="text-muted-foreground">{error}</p>
         <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
           Go Back
         </Button>
       </div>
    );
  }

  if (!ground) {
    // This case might be redundant due to the error handling above, but good for safety
     return (
       <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col items-center justify-center text-center">
         <XCircle className="h-16 w-16 text-destructive mb-4" />
         <h1 className="text-2xl font-bold text-destructive mb-2">Ground Not Found</h1>
          <p className="text-muted-foreground">The requested ground could not be located.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
           Go Back
         </Button>
       </div>
     );
  }

  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen bg-secondary">
       <Card className="overflow-hidden shadow-lg">
         {/* Image Header / Gallery */}
         {ground.imageUrl && (
           <div className="relative w-full h-48 md:h-64 lg:h-80 bg-muted">
             <Image
               src={ground.imageUrl}
               alt={`Image of ${ground.name}`}
               fill
               style={{ objectFit: 'cover' }}
               priority
             />
             {/* Optional overlay for title */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 md:p-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-white shadow-text">{ground.name}</h1>
                  <p className="text-sm md:text-md text-gray-200 flex items-center gap-1 mt-1 shadow-text">
                      <MapPin className="h-4 w-4" /> {ground.location}
                   </p>
               </div>
              {/* Rating Badge */}
              {ground.rating && (
                <Badge variant="default" className="absolute top-4 right-4 bg-accent text-accent-foreground text-sm shadow-md">
                  <Star className="h-4 w-4 mr-1" /> {ground.rating.toFixed(1)}
                </Badge>
              )}
           </div>
         )}

         <div className="grid md:grid-cols-3 gap-6 p-4 md:p-6">
           {/* Left Column (Details & Gallery) */}
           <div className="md:col-span-2 space-y-6">
              {/* Description */}
             <section>
               <h2 className="text-xl font-semibold text-primary mb-2">About {ground.name}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {ground.description || 'No description available.'}
                </p>
             </section>

             {/* Amenities */}
             {ground.amenities && ground.amenities.length > 0 && (
               <section>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    {ground.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded-md">
                        <AmenityIcon amenity={amenity} />
                        <span className="text-muted-foreground">{amenity}</span>
                      </div>
                    ))}
                  </div>
               </section>
             )}

              {/* Gallery */}
              {ground.galleryUrls && ground.galleryUrls.length > 0 && (
                <section>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Gallery</h3>
                     <ScrollArea className="w-full whitespace-nowrap rounded-md border">
                       <div className="flex space-x-4 p-4">
                         {ground.galleryUrls.map((url, index) => (
                           <div key={index} className="relative h-40 w-60 flex-shrink-0 overflow-hidden rounded-md shadow-md">
                             <Image
                               src={url}
                               alt={`Gallery image ${index + 1} for ${ground.name}`}
                               fill
                               style={{ objectFit: 'cover' }}
                               className="hover:scale-105 transition-transform duration-200"
                               sizes="(max-width: 768px) 50vw, 240px"
                              />
                           </div>
                         ))}
                       </div>
                       <ScrollBar orientation="horizontal" />
                     </ScrollArea>
                 </section>
              )}

             {/* Contact Info */}
             {ground.contactPhone && (
                <section>
                   <h3 className="text-lg font-semibold text-foreground mb-3">Contact</h3>
                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                     <Phone className="h-4 w-4 text-primary" />
                     <a href={`tel:${ground.contactPhone}`} className="hover:text-primary">{ground.contactPhone}</a>
                    </p>
                </section>
             )}

           </div>

           {/* Right Column (Booking) */}
            <div className="md:col-span-1 space-y-6">
               <Card className="shadow-md">
                 <CardHeader>
                   <CardTitle className="text-xl flex items-center justify-between">
                     <span>Book Your Slot</span>
                     <Badge variant="secondary" className="text-base">
                       <DollarSign className="h-4 w-4 mr-1" />{ground.pricePerHour} / hr
                     </Badge>
                   </CardTitle>
                   <CardDescription>Select a date and time to reserve your spot.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    {/* Date Picker */}
                    <div>
                        <Label htmlFor="booking-date" className="mb-2 block text-sm font-medium">Select Date</Label>
                         <Popover>
                           <PopoverTrigger asChild>
                             <Button
                               id="booking-date"
                               variant={"outline"}
                               className={cn(
                                 "w-full justify-start text-left font-normal",
                                 !selectedDate && "text-muted-foreground"
                               )}
                             >
                               <CalendarIcon className="mr-2 h-4 w-4" />
                               {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                             </Button>
                           </PopoverTrigger>
                           <PopoverContent className="w-auto p-0">
                             <Calendar
                               mode="single"
                               selected={selectedDate}
                               onSelect={setSelectedDate}
                               initialFocus
                               disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} // Disable past dates
                             />
                           </PopoverContent>
                         </Popover>
                    </div>

                   {/* Time Slot Selector */}
                   <div>
                     <Label className="mb-2 block text-sm font-medium">Select Time Slot</Label>
                     {loadingTimeSlots ? (
                       <div className="flex items-center justify-center h-24">
                         <Loader2 className="h-6 w-6 animate-spin text-primary" />
                       </div>
                     ) : timeSlots.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.map((slot) => (
                            <Button
                              key={slot.startTime}
                              variant={selectedTimeSlot?.startTime === slot.startTime ? 'default' : 'outline'}
                              size="sm"
                              disabled={!slot.available || isBooking}
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={cn(
                                  "text-xs h-9",
                                  !slot.available && "text-muted-foreground line-through bg-muted/50 cursor-not-allowed",
                                  slot.available && selectedTimeSlot?.startTime === slot.startTime && "bg-primary text-primary-foreground",
                                  slot.available && selectedTimeSlot?.startTime !== slot.startTime && "hover:bg-accent/50"
                               )}
                            >
                              {slot.startTime} - {slot.endTime}
                             </Button>
                          ))}
                        </div>
                     ) : (
                       <p className="text-sm text-muted-foreground text-center py-4">No available slots for this date.</p>
                     )}
                   </div>

                   {/* Booking Button */}
                   <Button
                      className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
                      disabled={!selectedTimeSlot || !selectedTimeSlot.available || isBooking}
                      onClick={handleBooking}
                    >
                      {isBooking ? (
                        <>
                         <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...
                       </>
                      ) : (
                         'Confirm Booking'
                      )}
                   </Button>

                 </CardContent>
               </Card>
            </div>
         </div>
       </Card>
     </main>
  );
}
