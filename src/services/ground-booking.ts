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
   * The type of sport the ground is primarily for.
   * Example values: 'Cricket', 'Pickleball', 'Volleyball', 'Basketball', 'Badminton'
   */
  sportType: string;
  /**
   * Optional URL for the ground's image.
   */
  imageUrl?: string;
  /**
  * Optional detailed description of the ground.
  */
  description?: string;
  /**
   * Optional list of amenities offered at the ground.
   */
  amenities?: string[];
  /**
   * Optional gallery of additional image URLs.
   */
  galleryUrls?: string[];
  /**
   * Optional name of the ground owner.
   */
  ownerName?: string;
  /**
   * Optional contact phone number for the ground.
   */
  contactPhone?: string;
  /**
   * Optional rating for the ground (e.g., out of 5).
   */
  rating?: number;
}

/**
 * Represents a time slot.
 * Note: This is currently unused in the home page after changes but kept for potential future use.
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
 * Note: This is currently unused in the home page after changes but kept for potential future use.
 */
/* // Removed as booking section is removed from home page
export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}
*/


// Simulate API call delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate a simple in-memory database for bookings
// Note: This is currently unused in the home page after changes but kept for potential future use.
const bookings = new Map<string, Set<string>>(); // Key: groundId-date, Value: Set of startTime

// Updated Mock Grounds Data with sportType, descriptions, amenities, etc.
const mockGrounds: Ground[] = [
    {
      id: 'ground-alpha-cricket',
      name: 'Alpha Cricket Arena',
      location: 'Downtown Core',
      pricePerHour: 1200,
      sportType: 'Cricket',
      imageUrl: 'https://picsum.photos/seed/alpha_cricket/400/300',
      description: 'State-of-the-art indoor cricket facility with professional-grade turf and lighting. Perfect for competitive matches and practice sessions.',
      amenities: ['Indoor Turf', 'Floodlights', 'Seating Area', 'Washrooms', 'Parking'],
      galleryUrls: [
        'https://picsum.photos/seed/alpha_cricket_gallery1/600/400',
        'https://picsum.photos/seed/alpha_cricket_gallery2/600/400',
        'https://picsum.photos/seed/alpha_cricket_gallery3/600/400',
      ],
      ownerName: 'Mr. Anil Mehta',
      contactPhone: '+1 555-0101',
      rating: 4.8,
    },
    {
      id: 'ground-beta-cricket',
      name: 'Beta Box Park (Cricket)',
      location: 'West Suburbs',
      pricePerHour: 1000,
      sportType: 'Cricket',
      imageUrl: 'https://picsum.photos/seed/beta_cricket/400/300',
      description: 'Spacious outdoor box cricket ground with nets on all sides. Ideal for casual games and evening play.',
      amenities: ['Outdoor AstroTurf', 'Netting', 'Night Lights', 'Parking', 'Drinking Water'],
      galleryUrls: ['https://picsum.photos/seed/beta_cricket_gallery1/600/400'],
      ownerName: 'Ms. Priya Singh',
      contactPhone: '+1 555-0102',
      rating: 4.5,
    },
     {
      id: 'ground-gamma-cricket',
      name: 'Gamma Cricket Hub',
      location: 'East Industrial',
      pricePerHour: 1150,
      sportType: 'Cricket',
      imageUrl: 'https://picsum.photos/seed/gamma_cricket/400/300',
      description: 'Well-maintained cricket pitch suitable for practice and smaller matches. Features electronic scoring.',
      amenities: ['Natural Grass', 'Electronic Scoring', 'Practice Nets', 'Washrooms'],
      galleryUrls: [
        'https://picsum.photos/seed/gamma_cricket_gallery1/600/400',
        'https://picsum.photos/seed/gamma_cricket_gallery2/600/400',
      ],
      ownerName: 'Gamma Sports Group',
      contactPhone: '+1 555-0103',
      rating: 4.6,
    },
    {
      id: 'ground-delta-pickle',
      name: 'Delta Pickleball Courts',
      location: 'North Valley',
      pricePerHour: 800,
      sportType: 'Pickleball',
      imageUrl: 'https://picsum.photos/seed/delta_pickle/400/300',
      description: 'Dedicated pickleball courts with high-quality surface. Paddles and balls available for rent.',
      amenities: ['Hard Courts', 'Equipment Rental', 'Seating', 'Parking'],
       galleryUrls: ['https://picsum.photos/seed/delta_pickle_gallery1/600/400'],
       ownerName: 'Mr. David Chen',
      contactPhone: '+1 555-0104',
      rating: 4.7,
    },
    {
      id: 'ground-epsilon-volley',
      name: 'Epsilon Beach Volleyball',
      location: 'South Beach',
      pricePerHour: 950,
      sportType: 'Volleyball',
      imageUrl: 'https://picsum.photos/seed/epsilon_volley/400/300',
      description: 'Authentic beach volleyball experience right by the water. Perfect for sunny days.',
      amenities: ['Sand Court', 'Beach Access', 'Showers', 'Cafe Nearby'],
       galleryUrls: ['https://picsum.photos/seed/epsilon_volley_gallery1/600/400'],
       ownerName: 'South Beach Rentals',
      contactPhone: '+1 555-0105',
      rating: 4.4,
    },
    {
      id: 'ground-zeta-basket',
      name: 'Zeta Basketball Court',
      location: 'City Center',
      pricePerHour: 1100,
      sportType: 'Basketball',
      imageUrl: 'https://picsum.photos/seed/zeta_basket/400/300',
      description: 'Full-size indoor basketball court with adjustable hoops. Great for practice and pickup games.',
      amenities: ['Indoor Hardwood', 'Adjustable Hoops', 'Scoreboard', 'Changing Rooms'],
       galleryUrls: ['https://picsum.photos/seed/zeta_basket_gallery1/600/400'],
       ownerName: 'City Hoops Inc.',
      contactPhone: '+1 555-0106',
      rating: 4.9,
    },
     {
      id: 'ground-eta-badminton',
      name: 'Eta Badminton Hall',
      location: 'Green Meadows',
      pricePerHour: 750,
      sportType: 'Badminton',
      imageUrl: 'https://picsum.photos/seed/eta_badminton/400/300',
      description: 'Multiple badminton courts with excellent lighting and non-slip flooring.',
      amenities: ['Wooden Courts', 'Good Lighting', 'Rental Rackets', 'Seating'],
       galleryUrls: ['https://picsum.photos/seed/eta_badminton_gallery1/600/400'],
       ownerName: 'Mr. Ramesh Patel',
      contactPhone: '+1 555-0107',
      rating: 4.3,
    },
     {
      id: 'ground-theta-multi', // Example of a multi-sport venue if needed
      name: 'Theta Sports Complex',
      location: 'Airport Zone',
      pricePerHour: 1500, // Higher price reflecting multi-sport nature
      sportType: 'Cricket', // Primary type or needs better handling
      imageUrl: 'https://picsum.photos/seed/theta_multi/400/300',
      description: 'Large complex offering facilities for cricket, football, and more. Book specific areas as needed.',
      amenities: ['Multiple Pitches', 'Changing Rooms', 'Large Parking', 'Snack Bar'],
       galleryUrls: [
          'https://picsum.photos/seed/theta_multi_gallery1/600/400',
          'https://picsum.photos/seed/theta_multi_gallery2/600/400'
        ],
        ownerName: 'Theta Holdings',
      contactPhone: '+1 555-0108',
      rating: 4.7,
    },
];


/**
 * Asynchronously retrieves a list of available box cricket grounds.
 * Simulates an API call returning diverse ground types.
 * @returns A promise that resolves to an array of Ground objects.
 */
export async function getGrounds(): Promise<Ground[]> {
  await delay(500); // Simulate network latency
  console.log('API Call: getGrounds');
  // In a real app, fetch this from your backend API, possibly with filtering options
  return mockGrounds;
}

/**
 * Asynchronously retrieves details for a single ground by its ID.
 * Simulates an API call.
 * @param groundId The ID of the ground to retrieve.
 * @returns A promise that resolves to the Ground object or null if not found.
 */
export async function getGroundById(groundId: string): Promise<Ground | null> {
    await delay(300); // Simulate network latency for fetching details
    console.log(`API Call: getGroundById for ${groundId}`);
    const ground = mockGrounds.find(g => g.id === groundId);
    return ground || null;
}


/**
 * Asynchronously retrieves available time slots for a given ground and date.
 * Simulates an API call and checks against mock bookings.
 * Note: This is currently unused in the home page after changes but kept for potential future use.
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
   // Adjust hours based on potential ground type or just use a standard range
   const startHourRange = 8;
   const endHourRange = 22;
   for (let hour = startHourRange; hour < endHourRange; hour++) {
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
 * Note: This is currently unused in the home page after changes but kept for potential future use.
 *
 * @param groundId The ID of the ground.
 * @param date The date for which to book the time slot (YYYY-MM-DD).
 * @param startTime The start time of the time slot.
 * @param endTime The end time of the time slot.
 * @param paymentDetails Optional payment details for processing.
 * @returns A promise that resolves to a boolean indicating whether the booking was successful.
 */
 /* // Removed as booking section is removed from home page
export async function bookTimeSlot(
  groundId: string,
  date: string,
  startTime: string,
  endTime: string,
  paymentDetails?: PaymentDetails
): Promise<boolean> {
  await delay(1500); // Simulate longer latency for booking/payment
  console.log(`API Call: bookTimeSlot for ${groundId} on ${date} at ${startTime}-${endTime}`);
  if (paymentDetails) {
    console.log(` > Processing payment: Card ending ${paymentDetails.cardNumber.slice(-4)}, Expiry: ${paymentDetails.expiryDate}, CVC: ***`);
    const paymentSuccess = Math.random() > 0.1; // 90% success rate
    if (!paymentSuccess) {
      console.error(' > Payment Failed');
      return false;
    }
    console.log(' > Payment Successful');
  } else {
    console.warn(' > Booking attempted without payment details.');
    // return false; // Assuming payment is mandatory
  }


   const bookingKey = `${groundId}-${date}`;
   const bookedSlots = bookings.get(bookingKey) || new Set<string>();

   if (bookedSlots.has(startTime) || Math.random() < 0.05) { // 5% chance slot got taken
     console.error(` > Booking Failed: Slot ${startTime} on ${bookingKey} is already booked or became unavailable.`);
     return false;
   }

   bookedSlots.add(startTime);
   bookings.set(bookingKey, bookedSlots);
   console.log(` > Booking Confirmed: Slot ${startTime} on ${bookingKey}`);

  return true;
}
*/
