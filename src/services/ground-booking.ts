/**
 * Represents a box cricket ground.
 */
export interface Ground {
  /**
   * The ID of the ground.
   */
  id: string;
  /**
   * The name of the ground.
   */
  name: string;
  /**
   * The location of the ground.
   */
  location: string;
  /**
   * The pricing per hour.
   */
  pricePerHour: number;
  /**
   * Optional URL for the ground's image.
   */
  imageUrl?: string;
}

/**
 * Represents a time slot.
 */
export interface TimeSlot {
  /**
   * The start time of the time slot.
   */
  startTime: string;
  /**
   * The end time of the time slot.
   */
  endTime: string;
  /**
   * Whether the time slot is available.
   */
  available: boolean;
}

/**
 * Represents payment details.
 */
export interface PaymentDetails {
  /**
   * Sanitized card number (e.g., only last 4 digits).
   * In a real app, you wouldn't pass the full number like this.
   * This is just for demonstration.
   */
  cardNumber: string;
  /**
   * Card expiry date (e.g., "MM/YY").
   */
  expiryDate: string;
  /**
   * Card Verification Code (CVC).
   */
  cvc: string;
}


// Simulate API call delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate a simple in-memory database for bookings
const bookings = new Map<string, Set<string>>(); // Key: groundId-date, Value: Set of startTime

/**
 * Asynchronously retrieves a list of available box cricket grounds.
 * Simulates an API call.
 * @returns A promise that resolves to an array of Ground objects.
 */
export async function getGrounds(): Promise<Ground[]> {
  await delay(500); // Simulate network latency
  console.log('API Call: getGrounds');
  // In a real app, fetch this from your backend API
  return [
    {
      id: 'ground-alpha',
      name: 'Alpha Arena',
      location: 'Downtown Core',
      pricePerHour: 1200, // Example price in local currency unit (e.g., INR)
      imageUrl: 'https://picsum.photos/seed/alpha/400/300', // Placeholder image
    },
    {
      id: 'ground-beta',
      name: 'Beta Box Park',
      location: 'West Suburbs',
      pricePerHour: 1000,
      imageUrl: 'https://picsum.photos/seed/beta/400/300', // Placeholder image
    },
     {
      id: 'ground-gamma',
      name: 'Gamma Cricket Hub',
      location: 'East Industrial',
      pricePerHour: 1150,
      imageUrl: 'https://picsum.photos/seed/gamma/400/300', // Placeholder image
    },
  ];
}

/**
 * Asynchronously retrieves available time slots for a given ground and date.
 * Simulates an API call and checks against mock bookings.
 *
 * @param groundId The ID of the ground.
 * @param date The date for which to retrieve time slots (YYYY-MM-DD).
 * @returns A promise that resolves to an array of TimeSlot objects.
 */
export async function getTimeSlots(groundId: string, date: string): Promise<TimeSlot[]> {
   await delay(700); // Simulate network latency
   console.log(`API Call: getTimeSlots for ground ${groundId} on ${date}`);

   const bookingKey = `${groundId}-${date}`;
   const bookedSlots = bookings.get(bookingKey) || new Set<string>();

   // Define potential slots for any ground (example)
   const potentialSlots: Omit<TimeSlot, 'available'>[] = [];
   for (let hour = 8; hour < 22; hour++) { // Example: 8 AM to 10 PM
     const startHour = hour.toString().padStart(2, '0');
     const endHour = (hour + 1).toString().padStart(2, '0');
     potentialSlots.push({ startTime: `${startHour}:00`, endTime: `${endHour}:00` });
   }

   // In a real app, fetch available slots from your backend, considering existing bookings
   const timeSlots = potentialSlots.map(slot => ({
     ...slot,
     // Mark as unavailable if it's in our mock bookings or randomly make some unavailable
     available: !bookedSlots.has(slot.startTime) && Math.random() > 0.2, // 80% chance available if not booked
   }));


   return timeSlots;
}

/**
 * Asynchronously books a time slot for a given ground, date, and time.
 * Simulates an API call, including payment processing and booking confirmation.
 *
 * @param groundId The ID of the ground.
 * @param date The date for which to book the time slot (YYYY-MM-DD).
 * @param startTime The start time of the time slot.
 * * @param endTime The end time of the time slot.
 * @param paymentDetails Optional payment details for processing.
 * @returns A promise that resolves to a boolean indicating whether the booking was successful.
 */
export async function bookTimeSlot(
  groundId: string,
  date: string,
  startTime: string,
  endTime: string,
  paymentDetails?: PaymentDetails // Optional payment details
): Promise<boolean> {
  await delay(1500); // Simulate longer latency for booking/payment
  console.log(`API Call: bookTimeSlot for ${groundId} on ${date} at ${startTime}-${endTime}`);
  if (paymentDetails) {
    console.log(` > Processing payment: Card ending ${paymentDetails.cardNumber.slice(-4)}, Expiry: ${paymentDetails.expiryDate}, CVC: ***`);
    // Simulate payment success/failure (e.g., based on card number or randomly)
    const paymentSuccess = Math.random() > 0.1; // 90% success rate
    if (!paymentSuccess) {
      console.error(' > Payment Failed');
      return false; // Payment failed
    }
    console.log(' > Payment Successful');
  } else {
    console.warn(' > Booking attempted without payment details.');
    // Decide if booking without payment is allowed? For this example, let's fail it.
    // return false;
  }


  // Check availability again (race condition simulation)
   const bookingKey = `${groundId}-${date}`;
   const bookedSlots = bookings.get(bookingKey) || new Set<string>();

   if (bookedSlots.has(startTime) || Math.random() < 0.05) { // 5% chance slot got taken
     console.error(` > Booking Failed: Slot ${startTime} on ${bookingKey} is already booked or became unavailable.`);
     return false;
   }

   // Add to bookings if successful
   bookedSlots.add(startTime);
   bookings.set(bookingKey, bookedSlots);
   console.log(` > Booking Confirmed: Slot ${startTime} on ${bookingKey}`);

  // In a real app, send the booking request to your backend API
  // The backend would handle payment processing (via Stripe, etc.) and database updates atomically.
  return true; // Simulate successful booking
}
