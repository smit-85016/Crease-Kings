'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, DollarSign, Clock, Loader2, CreditCard } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
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
    // Basic validation for payment details
    if (!cardNumber || !expiryDate || !cvc) {
       toast({
         title: 'Payment Error',
         description: 'Please enter valid card details.',
         variant: 'destructive',
       });
       return;
     }

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
      // In a real app, payment processing would happen here before confirming the booking
      console.log('Processing payment with card:', cardNumber, expiryDate, cvc);

      const success = await bookTimeSlot(
        selectedGround.id,
        dateString,
        selectedTimeSlot.startTime,
        selectedTimeSlot.endTime
      );

      if (success) {
        toast({
          title: 'Booking Confirmed!',
          description: `Successfully booked ${selectedGround.name} on ${dateString} from ${selectedTimeSlot.startTime} to ${selectedTimeSlot.endTime}. Payment processed.`,
          variant: 'default',
        });
        // Re-fetch time slots to update availability
        const updatedTimeSlots = await getTimeSlots(selectedGround.id, dateString);
        setTimeSlots(updatedTimeSlots);
        setSelectedTimeSlot(null); // Reset selection
        // Clear payment fields after successful booking
        setCardNumber('');
        setExpiryDate('');
        setCvc('');
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

   // Basic validation for enabling the book button
   const isPaymentInfoValid = cardNumber.length >= 15 && expiryDate.match(/^\d{2}\/\d{2}$/) && cvc.length >= 3;

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
                 {selectedGround ? 'Select a date, time slot, and enter payment details below.' : 'Choose a ground from the list on the left.'}
               </CardDescription>
            </CardHeader>
            {selectedGround && (
              <>
                <CardContent className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <Label htmlFor="date-picker" className="text-sm font-medium block mb-1">Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date-picker"
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

                  {/* Time Slot Selection */}
                  <div>
                    <Label className="text-sm font-medium block mb-1">Available Time Slots</Label>
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

                  {/* Payment Method Section */}
                  <div className="space-y-4 border-t pt-6">
                     <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                        <CreditCard className="h-5 w-5" /> Payment Details
                     </h3>
                     <div className="space-y-2">
                       <Label htmlFor="cardNumber">Card Number</Label>
                       <Input
                         id="cardNumber"
                         type="text"
                         placeholder="0000 0000 0000 0000"
                         value={cardNumber}
                         onChange={(e) => setCardNumber(e.target.value)}
                         disabled={isBooking}
                         required
                         maxLength={19} // Allow for spaces
                       />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label htmlFor="expiryDate">Expiry Date</Label>
                         <Input
                           id="expiryDate"
                           type="text"
                           placeholder="MM/YY"
                           value={expiryDate}
                           onChange={(e) => setExpiryDate(e.target.value)}
                           disabled={isBooking}
                           required
                           maxLength={5}
                         />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="cvc">CVC</Label>
                         <Input
                           id="cvc"
                           type="text"
                           placeholder="123"
                           value={cvc}
                           onChange={(e) => setCvc(e.target.value)}
                           disabled={isBooking}
                           required
                           maxLength={4}
                         />
                       </div>
                     </div>
                   </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleBooking}
                    disabled={!selectedTimeSlot || !isPaymentInfoValid || isBooking}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    {isBooking ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Clock className="mr-2 h-4 w-4" />
                    )}
                    {isBooking ? 'Processing...' : `Book Now (${selectedGround.pricePerHour} for ${selectedTimeSlot?.startTime || '--:--'})`}
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
