// src/app/page.tsx
'use client';

import * as React from 'react';
import Image from 'next/image'; // Import next/image
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, DollarSign, Clock, Loader2, CreditCard, Image as ImageIcon, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'; // Import ScrollBar
import { useToast } from '@/hooks/use-toast';
import type { Ground, TimeSlot } from '@/services/ground-booking';
import { getGrounds, getTimeSlots, bookTimeSlot } from '@/services/ground-booking';
import InitialLoadingSpinner from '@/components/layout/InitialLoadingSpinner'; // Import the new spinner

// Custom Cricket Logo SVG
const CricketLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5" // Slightly thinner stroke
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-primary" // Use primary color
  >
    {/* Cricket Bat (More stylized) */}
    <path d="M14.5 13.5L9.5 18.5" /> {/* Handle */}
    <path d="M10.94 10.94L6.44 15.44A2.5 2.5 0 0 0 6.44 19L10 22.56A2.5 2.5 0 0 0 13.56 22.56l4.5-4.5" /> {/* Blade */}
    <path d="M17.5 9.5L14.5 6.5" /> {/* Top of handle/grip */}
    {/* Cricket Ball */}
    <circle cx="18" cy="6" r="3" fill="hsl(var(--accent))" stroke="none" /> {/* Filled ball */}
  </svg>
);

// Define Sport Types
const sportTypes = ['All', 'Cricket', 'Pickleball', 'Volleyball', 'Basketball', 'Badminton'];
const SESSION_STORAGE_KEY = 'hasVisitedCreaseKingsHome';

export default function Home() {
  const [showInitialLoader, setShowInitialLoader] = useState(true); // Start with loader potentially showing
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false); // Track if initial animation is done

  const [allGrounds, setAllGrounds] = useState<Ground[]>([]);
  const [filteredGrounds, setFilteredGrounds] = useState<Ground[]>([]);
  const [selectedGround, setSelectedGround] = useState<Ground | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [loadingGrounds, setLoadingGrounds] = useState(true); // Start loading initially
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('All'); // Default to 'All'
  const { toast } = useToast();

  // Effect for initial loading animation
  useEffect(() => {
    const hasVisited = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!hasVisited) {
      setShowInitialLoader(true);
      // Show loader for 2.5 seconds on first visit
      const timer = setTimeout(() => {
        setShowInitialLoader(false);
        setIsInitialLoadComplete(true);
        sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
      }, 2500);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    } else {
      setShowInitialLoader(false); // Don't show loader if already visited
      setIsInitialLoadComplete(true); // Mark as complete immediately
      setLoadingGrounds(true); // Set loading true here if not showing initial spinner
    }
  }, []);

  // Fetch grounds only after initial load animation is potentially complete
  useEffect(() => {
    // Do not fetch if initial load isn't complete OR if we are still showing the initial loader
    if (!isInitialLoadComplete || showInitialLoader) return;

    async function fetchGrounds() {
      console.log("Fetching grounds...");
      setLoadingGrounds(true); // Set loading true BEFORE fetch starts
      try {
        const fetchedGrounds = await getGrounds();
        console.log("Grounds fetched:", fetchedGrounds);
        setAllGrounds(fetchedGrounds);
        // Filtering will happen in the next effect, which will set loadingGrounds = false
      } catch (error) {
        console.error('Failed to fetch grounds:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch available grounds. Please try again later.',
          variant: 'destructive',
        });
        setLoadingGrounds(false); // Set loading false on error
        setFilteredGrounds([]); // Clear grounds on error
      }
    }
    fetchGrounds();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialLoadComplete, showInitialLoader, toast]); // Depend on initial load completion and loader state

  // Filter grounds when selectedSport or allGrounds change (after initial load)
  useEffect(() => {
    if (!isInitialLoadComplete || showInitialLoader) return; // Don't filter if initial load isn't done

    console.log("Filtering grounds based on:", selectedSport, "All grounds:", allGrounds);
    const groundsToFilter = allGrounds;

    let newlyFilteredGrounds: Ground[] = [];
    if (selectedSport === 'All') {
      newlyFilteredGrounds = groundsToFilter;
    } else {
      newlyFilteredGrounds = groundsToFilter.filter(ground => ground.sportType === selectedSport);
    }
    console.log("Filtered grounds:", newlyFilteredGrounds);
    setFilteredGrounds(newlyFilteredGrounds);

    // Reset selections when filter changes
    if (selectedGround && !newlyFilteredGrounds.find(g => g.id === selectedGround.id)) {
      setSelectedGround(null);
    }
    setSelectedTimeSlot(null);

    // Set loadingGrounds to false *after* filtering is done *and* the initial fetch has completed (indicated by allGrounds having data or explicitly not loading)
    // This check ensures we don't set loading to false prematurely.
    if (allGrounds.length > 0 || !loadingGrounds || selectedSport) { // Check if data arrived or loading state was already false
        setLoadingGrounds(false);
        console.log("Set loadingGrounds to false after filtering.");
    } else if (allGrounds.length === 0 && !loadingGrounds) {
        // Handle the case where the fetch completed but returned zero grounds
         setLoadingGrounds(false);
         console.log("Set loadingGrounds to false after filtering (no grounds found).");
    }


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSport, allGrounds, isInitialLoadComplete, showInitialLoader]); // Removed loadingGrounds dependency


  // Fetch time slots when ground or date changes (after initial load)
  useEffect(() => {
    if (!isInitialLoadComplete || !selectedGround || !selectedDate) {
        setTimeSlots([]); // Clear timeslots if no ground/date
        setSelectedTimeSlot(null);
        setLoadingTimeSlots(false);
        return;
    };

    async function fetchTimeSlots() {
      try {
        setLoadingTimeSlots(true);
        setTimeSlots([]);
        setSelectedTimeSlot(null);
        const dateString = format(selectedDate!, 'yyyy-MM-dd');
        console.log(`Fetching time slots for ground ${selectedGround!.id} on ${dateString}`);
        const fetchedTimeSlots = await getTimeSlots(selectedGround!.id, dateString);
        console.log("Time slots fetched:", fetchedTimeSlots);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGround, selectedDate, isInitialLoadComplete, toast]);

  const handleSelectGround = (ground: Ground) => {
    setSelectedGround(ground);
    setSelectedTimeSlot(null); // Clear selected time slot when ground changes
  };

  const handleSelectTimeSlot = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedTimeSlot(slot);
    }
  };

  const handleBooking = async () => {
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
      const paymentDetails = { cardNumber, expiryDate, cvc };

      console.log("Attempting booking:", { groundId: selectedGround.id, date: dateString, startTime: selectedTimeSlot.startTime, endTime: selectedTimeSlot.endTime });
      const success = await bookTimeSlot(
        selectedGround.id,
        dateString,
        selectedTimeSlot.startTime,
        selectedTimeSlot.endTime,
        paymentDetails
      );

      if (success) {
        toast({
          title: 'Booking Confirmed!',
          description: `Successfully booked ${selectedGround.name} on ${dateString} from ${selectedTimeSlot.startTime} to ${selectedTimeSlot.endTime}. Payment processed.`,
          variant: 'default',
          duration: 5000, // Show for 5 seconds
        });
        // Refetch time slots to show updated availability
        const updatedTimeSlots = await getTimeSlots(selectedGround.id, dateString);
        setTimeSlots(updatedTimeSlots);
        setSelectedTimeSlot(null);
        setCardNumber('');
        setExpiryDate('');
        setCvc('');
      } else {
         toast({
           title: 'Booking Failed',
           description: 'Could not complete the booking. The slot might be unavailable or payment failed. Please try again.',
           variant: 'destructive',
           duration: 5000,
         });
         // Optionally refetch time slots even on failure to ensure UI consistency
         const updatedTimeSlots = await getTimeSlots(selectedGround.id, dateString);
         setTimeSlots(updatedTimeSlots);
         setSelectedTimeSlot(null); // Clear selection if booking failed
      }
    } catch (error) {
      console.error('Booking failed:', error);
      toast({
        title: 'Booking Failed',
        description: 'An unexpected error occurred during booking. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
      // Optionally refetch time slots on error
       if (selectedGround && selectedDate) {
         const dateString = format(selectedDate, 'yyyy-MM-dd');
         const updatedTimeSlots = await getTimeSlots(selectedGround.id, dateString);
         setTimeSlots(updatedTimeSlots);
         setSelectedTimeSlot(null);
       }
    } finally {
      setIsBooking(false);
    }
  };

   const isPaymentInfoValid = cardNumber.length >= 15 && expiryDate.match(/^\d{2}\/\d{2}$/) && cvc.length >= 3;

   // Render initial loader if needed
   if (showInitialLoader) {
    return <InitialLoadingSpinner />;
  }

  // Render main content only after initial load animation is complete
  if (!isInitialLoadComplete) {
    console.log("Initial load not complete, rendering null.");
    return null; // Or a minimal placeholder if preferred
  }


  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen bg-secondary">
      {/* Header Section */}
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
           <CricketLogo />
           Crease Kings
        </h1>
        <p className="text-muted-foreground">Find and book your perfect game spot</p>
      </header>

      {/* Sport Type Filter Tabs */}
      <section className="mb-8 flex flex-col items-center">
         <Tabs defaultValue={selectedSport} onValueChange={setSelectedSport} className="w-full max-w-lg">
            <ScrollArea className="whitespace-nowrap rounded-md border max-w-full">
                <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-1 h-auto p-1 ">
                    {sportTypes.map((sport) => (
                        <TabsTrigger key={sport} value={sport} className="text-xs sm:text-sm px-2 py-1.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground flex-shrink-0">
                        {sport}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
         </Tabs>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grounds Listing (Modified for less scrolling) */}
        <section className="lg:col-span-1 space-y-4">
          <h2 className="text-2xl font-semibold text-primary flex items-center justify-between flex-shrink-0">
            <span>Available Grounds</span>
            {selectedSport !== 'All' && (
                <Badge variant="secondary" className="text-sm font-normal ml-2"> {/* Added margin */}
                 {selectedSport}
                 <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0 text-muted-foreground hover:text-foreground" onClick={() => setSelectedSport('All')}>
                    <X className="h-3 w-3" />
                 </Button>
                </Badge>
            )}
          </h2>
           {/* Use ScrollArea on larger screens, simple div on smaller */}
           <ScrollArea className="lg:h-[65vh] pr-3"> {/* Adjusted height for larger screens */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4"> {/* Grid layout within scroll area */}
              {loadingGrounds ? (
                <>
                 { console.log("Rendering Skeleton Loaders") }
                  {[1, 2, 3, 4].map((_, index) => ( // Skeleton Loaders
                    <Card key={index} className="overflow-hidden">
                      <div className="relative w-full aspect-[4/3] bg-muted animate-pulse">
                        <ImageIcon className="absolute inset-0 m-auto h-12 w-12 text-muted-foreground opacity-50" />
                      </div>
                      <CardHeader>
                        <CardTitle className="h-6 w-3/4 bg-muted rounded animate-pulse"></CardTitle>
                        <CardDescription className="h-4 w-1/2 bg-muted rounded animate-pulse mt-1"></CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="h-5 w-1/3 bg-muted rounded animate-pulse"></p>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : filteredGrounds.length > 0 ? (
                 <>
                 { console.log("Rendering Filtered Grounds:", filteredGrounds) }
                    {filteredGrounds.map((ground) => (
                    <Card
                        key={ground.id}
                        className={cn(
                        'cursor-pointer transition-all hover:shadow-lg overflow-hidden group',
                        selectedGround?.id === ground.id && 'ring-2 ring-primary border-primary'
                        )}
                        onClick={() => handleSelectGround(ground)}
                    >
                        {ground.imageUrl && (
                        <div className="relative w-full aspect-[4/3] overflow-hidden">
                            <Image
                            src={ground.imageUrl}
                            alt={`Image of ${ground.name}`}
                            fill // Use fill instead of layout="fill"
                            style={{objectFit:"cover"}} // Use style prop for objectFit
                            className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                            priority={filteredGrounds.indexOf(ground) < 4} // Prioritize loading images for the first few grounds
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1200px) 25vw, 20vw" // Adjust sizes for grid layout
                            />
                        </div>
                        )}
                        <CardHeader className={!ground.imageUrl ? 'pt-6' : 'pb-2 pt-4'}> {/* Adjusted padding */}
                        <CardTitle className="flex items-center gap-2 text-lg"> {/* Smaller title */}
                            {/* Simple icon placeholder - replace if specific icons per sport are needed */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pinned"><path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0"/><circle cx="12" cy="8" r="2"/><path d="M8.83 15.17A2 2 0 0 0 12 17h0a2 2 0 0 0 3.17-1.83"/></svg>
                            {ground.name}
                        </CardTitle>
                         <CardDescription className="flex items-center gap-1 text-xs pt-1"> {/* Smaller description */}
                            <MapPin className="h-3 w-3" /> {ground.location}
                        </CardDescription>

                        </CardHeader>
                        <CardContent className="flex justify-between items-center pt-0 pb-3 px-4"> {/* Adjusted padding */}
                            {ground.sportType && (
                            <Badge variant="outline" className="text-xs">{ground.sportType}</Badge>
                            )}
                        <p className="flex items-center gap-1 font-semibold text-sm"> {/* Adjusted size */}
                            <DollarSign className="h-3 w-3" /> {ground.pricePerHour} / hr
                        </p>
                        </CardContent>
                    </Card>
                    ))}
                 </>
              ) : (
                 <>
                  { console.log("Rendering No Grounds Message") }
                 <Card className="md:col-span-2 lg:col-span-1"><CardContent className="pt-6"><p className="text-muted-foreground">No {selectedSport !== 'All' ? selectedSport : ''} grounds available matching your selection.</p></CardContent></Card>
                 </>
              )}
            </div>
           </ScrollArea>
        </section>

        {/* Booking Section */}
        <section className="lg:col-span-2 space-y-6">
           <Card className={cn('shadow-md sticky top-4', !selectedGround && 'opacity-50 pointer-events-none')}> {/* Added sticky top */}
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
                              slot.available ? 'cursor-pointer border-primary/50 hover:bg-accent/10 hover:border-primary' : 'cursor-not-allowed bg-muted text-muted-foreground opacity-70',
                              selectedTimeSlot?.startTime === slot.startTime && 'bg-accent text-accent-foreground hover:bg-accent/90 border-accent'
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
                         onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19))}
                         disabled={isBooking}
                         required
                         maxLength={19}
                         inputMode="numeric"
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
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length > 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2);
                              }
                              setExpiryDate(value.slice(0, 5));
                            }}
                           disabled={isBooking}
                           required
                           maxLength={5}
                            inputMode="numeric"
                         />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="cvc">CVC</Label>
                         <Input
                           id="cvc"
                           type="text"
                           placeholder="123"
                           value={cvc}
                           onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                           disabled={isBooking}
                           required
                           maxLength={4}
                           inputMode="numeric"
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
