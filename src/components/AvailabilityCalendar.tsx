import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Loader2, AlertCircle } from "lucide-react";
import { format, addDays, isSameDay, parseISO, differenceInCalendarDays, addYears, startOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";

interface AvailabilityData {
  date: string;
  available: boolean;
  price?: number;
  inventory?: number;
  restrictions?: {
    min_stay_on_arrival?: number | null;
    max_stay_on_arrival?: number | null;
    closed_on_arrival?: boolean | null;
    closed_on_departure?: boolean | null;
  };
}

interface ApiResponse {
  data: AvailabilityData[];
  success: boolean;
  message?: string;
}

interface AvailabilityCalendarProps {
  onContinue?: (bookingData: {
    totalPrice: number;
    nights: number;
    checkInDate: string;
    checkOutDate: string;
  }) => void;
}

export const AvailabilityCalendar = ({ onContinue }: AvailabilityCalendarProps) => {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const { toast } = useToast();

  // Fetch availability data from API
  const fetchAvailability = async (monthDate: Date = currentMonth) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get start of current month and end of 2 months later to cover both displayed months
      const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const endOfNextMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 2, 0); // Last day of next month
      
      const startDate = format(startOfMonth, 'yyyy-MM-dd');
      const endDate = format(endOfNextMonth, 'yyyy-MM-dd');
      
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      
      const response = await fetch(
        `${apiBaseUrl}/api/calendar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            listing_id: "106063-11881",
            channel_type: "booking_site",
            start_date: startDate,
            end_date: endDate
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Parse the API response format
      let availabilities: AvailabilityData[] = [];
      
      if (data.data?.listings?.[0]?.calendar && Array.isArray(data.data.listings[0].calendar)) {
        // Map the availability data - determine availability from inventory
        availabilities = data.data.listings[0].calendar.map((day: any) => ({
          date: day.date,
          available: day.inventory > 0, // Available if inventory > 0
          price: day.price,
          inventory: day.inventory,
          restrictions: day.restrictions
        }));
        
        console.log('Loaded availability data:', {
          totalDays: availabilities.length,
          firstDate: availabilities[0]?.date,
          lastDate: availabilities[availabilities.length - 1]?.date,
          sample: availabilities.slice(0, 5)
        });
      }

      setAvailabilityData(availabilities);
      setUsingFallbackData(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch availability';
      setError(errorMessage);
      console.error('Availability fetch error:', err);
      
      toast({
        title: "Connection Error",
        description: "Unable to fetch real-time availability. Using demo data.",
        variant: "destructive",
      });

      // Fallback to demo data
      generateFallbackData();
      setUsingFallbackData(true);
    } finally {
      setLoading(false);
    }
  };

  // Generate fallback demo data when API is unavailable
  const generateFallbackData = () => {
    const fallbackData: AvailabilityData[] = [];
    const today = startOfDay(new Date());
    
    for (let i = 0; i < 365; i++) {
      const date = addDays(today, i);
      const available = Math.random() > 0.15; // 85% availability
      const basePrice = 150;
      const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 1.3 : 1;
      const randomMultiplier = 0.8 + Math.random() * 0.4;
      
      fallbackData.push({
        date: format(date, 'yyyy-MM-dd'),
        available,
        price: available ? Math.round(basePrice * weekendMultiplier * randomMultiplier) : undefined,
        inventory: available ? 1 : 0,
      });
    }
    
    setAvailabilityData(fallbackData);
  };

  useEffect(() => {
    fetchAvailability(currentMonth);
  }, []);

  // Handle month change
  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
    fetchAvailability(newMonth);
  };

  // Get availability data for a specific date
  const getAvailabilityForDate = (date: Date): AvailabilityData | undefined => {
    const dateStr = format(startOfDay(date), 'yyyy-MM-dd');
    return availabilityData.find(item => item.date === dateStr);
  };

  // Check if a date is available
  const isDateAvailable = (date: Date): boolean => {
    const availability = getAvailabilityForDate(date);
    return availability?.available ?? false;
  };

  // Check if a date should be disabled
  const isDateDisabled = (date: Date): boolean => {
    const today = startOfDay(new Date());
    const targetDate = startOfDay(date);
    
    // Disable past dates
    if (targetDate < today) return true;
    
    // Disable unavailable dates
    return !isDateAvailable(date);
  };

  // Handle date selection
  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      setSelectedRange(undefined);
      return;
    }

    // If both dates are selected, validate the selection
    if (range.from && range.to) {
      const nights = differenceInCalendarDays(range.to, range.from);
      
      // Check minimum 3 nights requirement
      if (nights < 3) {
        toast({
          title: "Minimum Stay Required",
          description: "Please select at least 3 nights for your stay.",
          variant: "destructive",
        });
        setSelectedRange({ from: range.from, to: undefined });
        return;
      }
      
      // Check if range includes unavailable dates
      let current = startOfDay(range.from);
      const end = startOfDay(range.to);
      
      while (current <= end) {
        if (!isDateAvailable(current)) {
          toast({
            title: "Invalid Selection",
            description: "Selected range includes unavailable dates. Please select different dates.",
            variant: "destructive",
          });
          setSelectedRange({ from: range.from, to: undefined });
          return;
        }
        current = addDays(current, 1);
      }
    }

    setSelectedRange(range);
  };

  // Calculate total price and nights
  const calculateBookingDetails = () => {
    if (!selectedRange?.from || !selectedRange?.to) {
      return { nights: 0, totalPrice: 0 };
    }

    const nights = differenceInCalendarDays(selectedRange.to, selectedRange.from);
    let totalPrice = 0;
    
    let current = startOfDay(selectedRange.from);
    const end = startOfDay(selectedRange.to);
    
    while (current < end) {
      const availability = getAvailabilityForDate(current);
      if (availability?.price) {
        totalPrice += availability.price;
      }
      current = addDays(current, 1);
    }

    return { nights, totalPrice };
  };

  const { nights, totalPrice } = calculateBookingDetails();

  // Custom day content to show prices
  const DayContent = (props: any) => {
    const date = props.date;
    const availability = getAvailabilityForDate(date);
    const showPrice = !usingFallbackData && availability?.available && availability?.price !== undefined;
    
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <span>{format(date, 'd')}</span>
        {showPrice && (
          <span className="text-[10px] font-medium text-muted-foreground mt-0.5">
            €{availability.price}
          </span>
        )}
      </div>
    );
  };

  // Remove the full-page loader - we'll show inline loading instead

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Dates</h2>
        <p className="text-muted-foreground">Select check-in and check-out dates to see availability and pricing</p>
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-800">Minimum stay: 3 nights required</p>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">Using demo data - API connection unavailable</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="p-4 lg:p-6 shadow-card border-0 lg:border relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                Select Your Stay
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchAvailability(currentMonth)}
                className="flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CalendarDays className="h-4 w-4" />
                )}
                Refresh
              </Button>
            </div>
            
            {/* Loading Overlay for Calendar Only */}
            {loading && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading availability...</p>
                </div>
              </div>
            )}
            
            <Calendar
              mode="range"
              selected={selectedRange}
              onSelect={handleSelect}
              month={currentMonth}
              onMonthChange={handleMonthChange}
              numberOfMonths={window.innerWidth < 1024 ? 1 : 2}
              disabled={isDateDisabled}
              className="w-full pointer-events-auto"
              components={{
                DayContent: DayContent
              }}
              classNames={{
                months: "flex flex-col lg:flex-row space-y-4 lg:space-x-4 lg:space-y-0",
                month: "space-y-4 w-full",
                caption: "flex justify-center pt-1 relative items-center mb-4",
                caption_label: "text-lg font-semibold",
                nav: "space-x-1 flex items-center",
                nav_button: "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-primary/10 rounded-full transition-all",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse",
                head_row: "flex mb-2",
                head_cell: "text-muted-foreground rounded-md w-full font-medium text-xs uppercase tracking-wider flex-1 text-center py-2",
                row: "flex w-full",
                cell: "relative flex-1 text-center text-sm p-1 focus-within:relative focus-within:z-20",
                day: "h-16 w-full p-0 font-normal aria-selected:opacity-100 rounded-lg hover:bg-primary/10 transition-all duration-200 flex flex-col items-center justify-center gap-0.5",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground font-semibold",
                day_range_middle: "bg-primary/15 text-primary font-medium rounded-none",
                day_range_end: "bg-primary text-primary-foreground font-semibold rounded-r-lg",
                day_range_start: "bg-primary text-primary-foreground font-semibold rounded-l-lg",
                day_today: "bg-accent text-accent-foreground font-semibold border border-primary/30",
                day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed hover:bg-transparent",
                day_outside: "text-muted-foreground opacity-40",
              }}
              modifiers={{
                available: (date) => isDateAvailable(date),
                unavailable: (date) => !isDateAvailable(date),
                booked: (date) => !isDateAvailable(date)
              }}
              modifiersClassNames={{
                available: "hover:bg-primary/10 transition-colors",
                unavailable: "opacity-50 cursor-not-allowed line-through",
                booked: "bg-muted/50 text-muted-foreground"
              }}
            />
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="space-y-6">
          <Card className="p-6 shadow-card sticky top-4">
            <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
            
            {selectedRange?.from ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Check-in</p>
                    <p className="text-sm text-muted-foreground">
                      {format(selectedRange.from, "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                
                {selectedRange.to && (
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Check-out</p>
                      <p className="text-sm text-muted-foreground">
                        {format(selectedRange.to, "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                )}
                
                {selectedRange.to && nights > 0 && (
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span>Nights</span>
                      <span className="font-medium">{nights}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average per night</span>
                      <span className="font-medium">€{Math.round(totalPrice / nights)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">€{totalPrice}</span>
                    </div>
                    
                    {nights >= 3 ? (
                      <Button 
                        className="w-full bg-gradient-accent hover:shadow-card-hover transition-all duration-300"
                        onClick={() => {
                          if (onContinue && selectedRange?.from && selectedRange?.to) {
                            onContinue({
                              totalPrice,
                              nights,
                              checkInDate: format(selectedRange.from, "MMM dd, yyyy"),
                              checkOutDate: format(selectedRange.to, "MMM dd, yyyy")
                            });
                          }
                        }}
                      >
                        Continue to Rooms
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button 
                          disabled
                          className="w-full opacity-50 cursor-not-allowed"
                        >
                          Continue to Rooms
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          Minimum 3 nights required ({3 - nights} more night{3 - nights > 1 ? 's' : ''} needed)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Select your check-in date to get started</p>
              </div>
            )}
          </Card>

          {/* Legend */}
          <Card className="p-4 shadow-card">
            <h4 className="font-medium mb-3">Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary rounded"></div>
                <span>Selected dates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary/20 rounded"></div>
                <span>Date range</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-muted rounded"></div>
                <span>Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary rounded"></div>
                <span>Available with pricing</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};