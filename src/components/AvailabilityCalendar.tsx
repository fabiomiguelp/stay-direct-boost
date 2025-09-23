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
  minimum_stay?: number;
}

interface ApiResponse {
  data: AvailabilityData[];
  success: boolean;
  message?: string;
}

export const AvailabilityCalendar = () => {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { toast } = useToast();

  // Fetch availability data from Hostex API
  const fetchAvailability = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startDate = format(new Date(), 'yyyy-MM-dd');
      const endDate = format(addYears(new Date(), 1), 'yyyy-MM-dd');
      
      const response = await fetch(
        `https://api.hostex.io/v3/availabilities?property_ids=12098462&start_date=${startDate}&end_date=${endDate}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Note: In production, API keys should be handled via backend/Supabase
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle different possible response formats
      let availabilities: AvailabilityData[] = [];
      
      if (data.data && Array.isArray(data.data)) {
        availabilities = data.data;
      } else if (Array.isArray(data)) {
        availabilities = data;
      } else if (data.availabilities && Array.isArray(data.availabilities)) {
        availabilities = data.availabilities;
      }

      setAvailabilityData(availabilities);
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
        minimum_stay: available ? (Math.random() > 0.8 ? 2 : 1) : undefined,
      });
    }
    
    setAvailabilityData(fallbackData);
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

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

    // If both dates are selected and the range includes unavailable dates, reset
    if (range.from && range.to) {
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <Card className="p-8 shadow-card">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading real-time availability...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Dates</h2>
        <p className="text-muted-foreground">Select check-in and check-out dates to see availability and pricing</p>
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
          <Card className="p-4 lg:p-6 shadow-card border-0 lg:border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                Select Your Stay
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAvailability}
                className="flex items-center gap-2"
              >
                <CalendarDays className="h-4 w-4" />
                Refresh
              </Button>
            </div>
            
            <Calendar
              mode="range"
              selected={selectedRange}
              onSelect={handleSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              numberOfMonths={window.innerWidth < 1024 ? 1 : 2}
              disabled={isDateDisabled}
              className="w-full pointer-events-auto"
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
                day: "h-12 w-full p-0 font-normal aria-selected:opacity-100 rounded-lg hover:bg-primary/10 transition-all duration-200 flex flex-col items-center justify-center gap-1",
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
                      <span className="font-medium">${Math.round(totalPrice / nights)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${totalPrice}</span>
                    </div>
                    <Button className="w-full bg-gradient-accent hover:shadow-card-hover transition-all duration-300">
                      Continue to Rooms
                    </Button>
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