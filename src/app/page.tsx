'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, DollarSign, Clock, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Ground, TimeSlot } from '@/services/ground-booking';
import { getGrounds, getTimeSlots, bookTimeSlot } from '@/services/ground-booking';

export default function Home() {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [selectedGround, setSelectedGround] = useState<Ground | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [loadingGrounds, setLoadingGrounds] = useState(true);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  // Fetch grounds on initial load
  useEffect(() => {
    async function fetchGrounds() {
      try {
        setLoadingGrounds(true);
        const fetchedGrounds = await getGrounds();
        setGrounds(fetchedGrounds);
      } catch (error) {
        console.error('Failed to fetch grounds:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch available grounds. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoadingGrounds(false);
      }
    }
    fetchGrounds();
  }, [toast]);

  // Fetch time slots when ground or date changes
  useEffect(() => {
    if (selectedGround && selectedDate) {
      async function fetchTimeSlots() {
        try {
          setLoadingTimeSlots(true);
          setTimeSlots([]); // Clear previous slots
          setSelectedTimeSlot(null); // Reset selected slot
          const dateString = format(selectedDate!, 'yyyy-MM-dd');
          const fetchedTimeSlots = await getTimeSlots(selectedGround!.id, dateString);
          setTimeSlots(fetchedTimeSlots);
        } catch (error) {
          console.error('Failed to fetch time slots:', error);
          toast({
            title: 'Error',
            description: 'Could not fetch time slots for the selected ground and date.',
            variant: 'destructive',
          });
        } finally {
          setLoadingTimeSlots(false);
        }
      }
      fetchTimeSlots();
    }
  }, [selectedGround, selectedDate, toast]);

  const handleSelectGround = (ground: Ground) => {
    setSelectedGround(ground);
    setSelectedTimeSlot(null); // Reset time slot when ground changes
  };

  const handleSelectTimeSlot = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedTimeSlot(slot);
    }
  };

  const handleBooking = async () => {
    if (!selectedGround || !selectedDate || !selectedTimeSlot) {
      toast({
        title: 'Booking Error',
        description: 'Please select a ground, date, and available time slot.',
        variant: 'destructive',
      });
      return;
    }

    setIsBooking(true);
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const success = await bookTimeSlot(
        selectedGround.id,
        dateString,
        selectedTimeSlot.startTime,
        selectedTimeSlot.endTime
      );

      if (success) {
        toast({
          title: 'Booking Confirmed!',
          description: `Successfully booked ${selectedGround.name} on ${dateString} from ${selectedTimeSlot.startTime} to ${selectedTimeSlot.endTime}.`,
          variant: 'default', // Use default variant which aligns with accent color for actions
        });
        // Re-fetch time slots to update availability
        const updatedTimeSlots = await getTimeSlots(selectedGround.id, dateString);
        setTimeSlots(updatedTimeSlots);
        setSelectedTimeSlot(null); // Reset selection
      } else {
        throw new Error('Booking failed on the server.');
      }
    } catch (error) {
      console.error('Booking failed:', error);
      toast({
        title: 'Booking Failed',
        description: 'Could not complete the booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen bg-secondary">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-swords"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="15" y2="19"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/></svg>
          Box Cricket Booker
        </h1>
        <p className="text-muted-foreground">Find and book your perfect box cricket ground</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Grounds Listing */}
        <section className="md:col-span-1 space-y-4">
          <h2 className="text-2xl font-semibold text-primary">Available Grounds</h2>
          {loadingGrounds ? (
            <div className="space-y-2">
               <Card><CardHeader><CardTitle><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading grounds...</CardTitle></CardHeader></Card>
               <Card><CardHeader><CardTitle><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading grounds...</CardTitle></CardHeader></Card>
            </div>
          ) : grounds.length > 0 ? (
            grounds.map((ground) => (
              <Card
                key={ground.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  selectedGround?.id === ground.id && 'ring-2 ring-primary border-primary'
                )}
                onClick={() => handleSelectGround(ground)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                    {ground.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 text-sm pt-1">
                    <MapPin className="h-4 w-4" /> {ground.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="flex items-center gap-1 font-semibold">
                    <DollarSign className="h-4 w-4" /> {ground.pricePerHour} / hour
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
             <Card><CardContent><p>No grounds available at the moment.</p></CardContent></Card>
          )}
        </section>

        {/* Booking Section */}
        <section className="md:col-span-2 space-y-6">
           <Card className={!selectedGround ? 'opacity-50 pointer-events-none' : ''}>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-primary">
                {selectedGround ? `Book ${selectedGround.name}` : 'Select a Ground to Book'}
              </CardTitle>
               <CardDescription>
                 {selectedGround ? 'Select a date and time slot below.' : 'Choose a ground from the list on the left.'}
               </CardDescription>
            </CardHeader>
            {selectedGround && (
              <>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Select Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !selectedDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
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

                  <div>
                    <label className="text-sm font-medium block mb-1">Available Time Slots</label>
                    {loadingTimeSlots ? (
                      <div className="flex items-center text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading time slots...
                      </div>
                    ) : timeSlots.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.startTime}
                            variant={selectedTimeSlot?.startTime === slot.startTime ? 'default' : 'outline'}
                            disabled={!slot.available || isBooking}
                            onClick={() => handleSelectTimeSlot(slot)}
                            className={cn(
                              "flex-col h-auto py-2",
                              slot.available ? 'cursor-pointer border-primary hover:bg-accent/10' : 'cursor-not-allowed bg-muted text-muted-foreground opacity-70',
                              selectedTimeSlot?.startTime === slot.startTime && 'bg-accent text-accent-foreground hover:bg-accent/90'
                            )}
                            size="sm"
                          >
                            <span className="font-semibold">{slot.startTime}</span>
                            <span className="text-xs">{slot.endTime}</span>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No time slots available for this date.</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleBooking}
                    disabled={!selectedTimeSlot || isBooking}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {isBooking ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Clock className="mr-2 h-4 w-4" />
                    )}
                    {isBooking ? 'Booking...' : `Book Now (${selectedTimeSlot?.startTime || '--:--'})`}
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
}
