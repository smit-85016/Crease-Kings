// src/app/page.tsx
'use client';

import * as React from 'react';
import Image from 'next/image'; // Import next/image
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, DollarSign, Clock, Loader2, CreditCard, Image as ImageIcon, Filter, X } from 'lucide-react'; // Added Filter, X

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Import Tabs components
import { Badge } from '@/components/ui/badge'; // Import Badge component
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea
import { useToast } from '@/hooks/use-toast';
import type { Ground, TimeSlot } from '@/services/ground-booking';
import { getGrounds, getTimeSlots, bookTimeSlot } from '@/services/ground-booking';

// Updated Custom Cricket Logo SVG
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
    <circle cx="18" cy="6" r="3" fill="currentColor" stroke="none" /> {/* Filled ball */}
  </svg>
);

// Define Sport Types
const sportTypes = ['All', 'Cricket', 'Pickleball', 'Volleyball', 'Basketball', 'Badminton'];

export default function Home() {
  const [allGrounds, setAllGrounds] = useState<Ground[]>([]); // Store all fetched grounds
  const [filteredGrounds, setFilteredGrounds] = useState<Ground[]>([]); // Grounds currently displayed
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
  const [selectedSport, setSelectedSport] = useState<string>('Cricket'); // Default to Cricket as per current data
  const { toast } = useToast();

  // Fetch grounds on initial load
  useEffect(() => {
    async function fetchGrounds() {
      try {
        setLoadingGrounds(true);
        const fetchedGrounds = await getGrounds();
        setAllGrounds(fetchedGrounds);
        // Initial filter based on default selected sport
        if (selectedSport === 'All') {
             setFilteredGrounds(fetchedGrounds);
        } else {
             // Filter grounds by the selected sport type
             setFilteredGrounds(fetchedGrounds.filter(g => g.sportType === selectedSport));
        }
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
  }, [toast]); // Run only once initially

  // Filter grounds when selectedSport changes
  useEffect(() => {
    setLoadingGrounds(true); // Show loading state while filtering
    if (selectedSport === 'All') {
      setFilteredGrounds(allGrounds);
    } else {
        setFilteredGrounds(allGrounds.filter(ground => ground.sportType === selectedSport));
    }
     setSelectedGround(null); // Reset selected ground when filtering changes
     setSelectedTimeSlot(null); // Reset selected time slot
    // Simulate filtering delay if needed
    setTimeout(() => setLoadingGrounds(false), 100); // Short delay for visual feedback
  }, [selectedSport, allGrounds]);

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

      // Pass payment details to the booking function (optional, as per service function)
      const paymentDetails = { cardNumber, expiryDate, cvc };

      const success = await bookTimeSlot(
        selectedGround.id,
        dateString,
        selectedTimeSlot.startTime,
        selectedTimeSlot.endTime,
        paymentDetails // Pass payment details here
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
         toast({
           title: 'Booking Failed',
           description: 'Could not complete the booking. The slot might be unavailable or payment failed. Please try again.',
           variant: 'destructive',
         });
      }
    } catch (error) {
      console.error('Booking failed:', error);
      toast({
        title: 'Booking Failed',
        description: 'An unexpected error occurred during booking. Please try again.',
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
      {/* Header Section */}
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
           <CricketLogo /> {/* Use the custom logo component */}
           Crease Kings {/* Updated App Name */}
        </h1>
        <p className="text-muted-foreground">Find and book your perfect game spot</p> {/* Updated Quote */}
      </header>

      {/* Sport Type Filter Tabs */}
      <section className="mb-8 flex flex-col items-center">
         <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" /> Select Sport Type
         </h2>
         <Tabs defaultValue={selectedSport} onValueChange={setSelectedSport} className="w-full max-w-lg">
             <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-1 h-auto p-1">
                 {sportTypes.map((sport) => (
                     <TabsTrigger key={sport} value={sport} className="text-xs sm:text-sm px-2 py-1.5 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
                     {sport}
                     </TabsTrigger>
                 ))}
             </TabsList>
         </Tabs>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Grounds Listing */}
        <section className="md:col-span-1 space-y-4 flex flex-col">
          <h2 className="text-2xl font-semibold text-primary flex items-center justify-between flex-shrink-0">
            <span>Available Grounds</span>
            {selectedSport !== 'All' && (
                <Badge variant="secondary" className="text-sm font-normal">
                 {selectedSport}
                 <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0 text-muted-foreground hover:text-foreground" onClick={() => setSelectedSport('All')}>
                    <X className="h-3 w-3" />
                 </Button>
                </Badge>
            )}
          </h2>
           {/* Scrollable Area for Grounds */}
           <ScrollArea className="h-[60vh] md:h-auto md:flex-grow pr-3"> {/* Added ScrollArea */}
             <div className="space-y-4"> {/* Added inner div */}
              {loadingGrounds ? (
                <>
                  {[1, 2].map((_, index) => ( // Skeleton Loaders
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
                filteredGrounds.map((ground) => (
                  <Card
                    key={ground.id}
                    className={cn(
                      'cursor-pointer transition-all hover:shadow-lg overflow-hidden group', // Added group for hover effect
                      selectedGround?.id === ground.id && 'ring-2 ring-primary border-primary'
                    )}
                    onClick={() => handleSelectGround(ground)}
                  >
                    {ground.imageUrl && (
                      <div className="relative w-full aspect-[4/3] overflow-hidden"> {/* Added overflow-hidden */}
                        <Image
                          src={ground.imageUrl}
                          alt={`Image of ${ground.name}`}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader className={!ground.imageUrl ? 'pt-6' : ''}>
                      <CardTitle className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                        {ground.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 text-sm pt-1">
                        <MapPin className="h-4 w-4" /> {ground.location}
                      </CardDescription>
                       {/* Display Sport Type Badge if relevant */}
                       {ground.sportType && (
                           <Badge variant="outline" className="mt-2 w-fit text-xs">{ground.sportType}</Badge>
                        )}
                    </CardHeader>
                    <CardContent>
                      <p className="flex items-center gap-1 font-semibold">
                        <DollarSign className="h-4 w-4" /> {ground.pricePerHour} / hour
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                 <Card><CardContent className="pt-6"><p className="text-muted-foreground">No {selectedSport !== 'All' ? selectedSport : ''} grounds available matching your selection.</p></CardContent></Card>
              )}
            </div>
           </ScrollArea>
        </section>

        {/* Booking Section */}
        <section className="md:col-span-2 space-y-6">
           <Card className={!selectedGround ? 'opacity-50 pointer-events-none' : 'shadow-md'}> {/* Added shadow */}
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
                              slot.available ? 'cursor-pointer border-primary/50 hover:bg-accent/10 hover:border-primary' : 'cursor-not-allowed bg-muted text-muted-foreground opacity-70', // Adjusted styles
                              selectedTimeSlot?.startTime === slot.startTime && 'bg-accent text-accent-foreground hover:bg-accent/90 border-accent' // Explicit border for selected
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
                         onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19))} // Format card number
                         disabled={isBooking}
                         required
                         maxLength={19} // 16 digits + 3 spaces
                         inputMode="numeric" // Hint for numeric keyboard on mobile
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
                              let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                              if (value.length > 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2); // Add slash after MM
                              }
                              setExpiryDate(value.slice(0, 5)); // Limit to MM/YY format
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
                           onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))} // Allow only digits
                           disabled={isBooking}
                           required
                           maxLength={4} // CVC can be 3 or 4 digits
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
