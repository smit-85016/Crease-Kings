// src/app/page.tsx
'use client';

import * as React from 'react';
import Image from 'next/image'; // Import next/image
import Link from 'next/link'; // Import Link for navigation
import { useState, useEffect } from 'react';
import { MapPin, DollarSign, Loader2, Image as ImageIcon, X } from 'lucide-react'; // Removed CalendarIcon, Clock, CreditCard

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
// Removed Calendar import
// Removed Popover imports
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// Removed Input, Label imports related to payment
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'; // Import ScrollBar
import { useToast } from '@/hooks/use-toast';
import type { Ground } from '@/services/ground-booking'; // Removed TimeSlot import
import { getGrounds } from '@/services/ground-booking'; // Removed getTimeSlots, bookTimeSlot imports
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
  // Removed booking-related state: selectedGround, selectedDate, timeSlots, selectedTimeSlot, loadingTimeSlots, isBooking, payment details
  const [loadingGrounds, setLoadingGrounds] = useState(true); // Start loading initially
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

    // Removed selection reset logic as booking section is removed

    // Set loadingGrounds to false *after* filtering is done *and* the initial fetch has completed (indicated by allGrounds having data or explicitly not loading)
    if (allGrounds.length > 0 || !loadingGrounds || selectedSport) { // Check if data arrived or loading state was already false
        setLoadingGrounds(false);
        console.log("Set loadingGrounds to false after filtering.");
    } else if (allGrounds.length === 0 && !loadingGrounds) {
        // Handle the case where the fetch completed but returned zero grounds
         setLoadingGrounds(false);
         console.log("Set loadingGrounds to false after filtering (no grounds found).");
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSport, allGrounds, isInitialLoadComplete, showInitialLoader]);


  // Removed effect for fetching time slots

  // Removed handleSelectGround, handleSelectTimeSlot, handleBooking functions

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
        <p className="text-muted-foreground">Find your perfect game spot</p> {/* Updated description */}
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

      {/* Main Content - Grounds Listing Only */}
      <div className="w-full"> {/* Changed grid to full width container */}
        {/* Grounds Listing */}
        <section className="space-y-4"> {/* Removed lg:col-span-1 */}
          <h2 className="text-2xl font-semibold text-primary flex items-center justify-between flex-shrink-0">
            <span>Available Grounds</span>
            {selectedSport !== 'All' && (
                <Badge variant="secondary" className="text-sm font-normal ml-2">
                 {selectedSport}
                 <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0 text-muted-foreground hover:text-foreground" onClick={() => setSelectedSport('All')}>
                    <X className="h-3 w-3" />
                 </Button>
                </Badge>
            )}
          </h2>
           {/* Use ScrollArea (optional for long lists) or just display grid */}
           {/* Removed height constraint from ScrollArea to show all grounds */}
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> {/* Grid layout */}
              {loadingGrounds ? (
                <>
                 { console.log("Rendering Skeleton Loaders") }
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => ( // More Skeleton Loaders for wider layout
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
                    <Link key={ground.id} href={`/grounds/${ground.id}`} passHref>
                      <Card
                        className={cn(
                          'transition-all hover:shadow-lg overflow-hidden group cursor-pointer h-full flex flex-col' // Added cursor-pointer, h-full, flex, flex-col
                        )}
                      >
                        {ground.imageUrl && (
                          <div className="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0"> {/* Added flex-shrink-0 */}
                            <Image
                              src={ground.imageUrl}
                              alt={`Image of ${ground.name}`}
                              fill
                              style={{objectFit:"cover"}}
                              className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                              priority={filteredGrounds.indexOf(ground) < 8} // Prioritize loading more images
                              sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, (max-width: 1280px) 22vw, 18vw" // Adjusted sizes
                            />
                          </div>
                        )}
                        <div className="flex flex-col flex-grow"> {/* Added flex container */}
                          <CardHeader className={cn(
                              'pb-2 pt-4 flex-grow', // Added flex-grow
                              !ground.imageUrl ? 'pt-6' : ''
                          )}>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pinned flex-shrink-0"><path d="M18 8c0 4.5-6 9-6 9s-6-4.5-6-9a6 6 0 0 1 12 0"/><circle cx="12" cy="8" r="2"/><path d="M8.83 15.17A2 2 0 0 0 12 17h0a2 2 0 0 0 3.17-1.83"/></svg>
                              <span>{ground.name}</span> {/* Wrap name in span for potential ellipsis */}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 text-xs pt-1">
                              <MapPin className="h-3 w-3 flex-shrink-0" /> <span>{ground.location}</span>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex justify-between items-center pt-0 pb-3 px-4 mt-auto flex-shrink-0"> {/* Added mt-auto, flex-shrink-0 */}
                            {ground.sportType && (
                              <Badge variant="outline" className="text-xs">{ground.sportType}</Badge>
                            )}
                            <p className="flex items-center gap-1 font-semibold text-sm">
                              <DollarSign className="h-3 w-3" /> {ground.pricePerHour} / hr
                            </p>
                          </CardContent>
                        </div>
                      </Card>
                    </Link>
                    ))}
                 </>
              ) : (
                 <>
                  { console.log("Rendering No Grounds Message") }
                 {/* Ensure message spans across grid columns if needed */}
                 <Card className="col-span-full"><CardContent className="pt-6"><p className="text-muted-foreground">No {selectedSport !== 'All' ? selectedSport : ''} grounds available matching your selection.</p></CardContent></Card>
                 </>
              )}
            </div>
           {/* </ScrollArea> */} {/* Removed ScrollArea or adjust usage */}
        </section>

        {/* Booking Section - Removed */}
      </div>
    </main>
  );
}
