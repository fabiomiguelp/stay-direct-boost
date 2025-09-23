import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, DollarSign } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";

interface PriceData {
  date: Date;
  price: number;
  available: boolean;
  promotion?: string;
}

// Mock data - in real app this would come from API
const generateMockPrices = (): PriceData[] => {
  const prices: PriceData[] = [];
  const today = new Date();
  
  for (let i = 0; i < 90; i++) {
    const date = addDays(today, i);
    const basePrice = 150;
    const weekendMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 1.3 : 1;
    const randomMultiplier = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    
    prices.push({
      date,
      price: Math.round(basePrice * weekendMultiplier * randomMultiplier),
      available: Math.random() > 0.1, // 90% available
      promotion: Math.random() > 0.8 ? "Direct Booking Discount" : undefined
    });
  }
  
  return prices;
};

export const AvailabilityCalendar = () => {
  const [selectedDates, setSelectedDates] = useState<{
    checkIn?: Date;
    checkOut?: Date;
  }>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const priceData = generateMockPrices();

  const getPriceForDate = (date: Date) => {
    return priceData.find(p => isSameDay(p.date, date));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const priceInfo = getPriceForDate(date);
    if (!priceInfo?.available) return;

    if (!selectedDates.checkIn || (selectedDates.checkIn && selectedDates.checkOut)) {
      // First selection or reset
      setSelectedDates({ checkIn: date, checkOut: undefined });
    } else if (date > selectedDates.checkIn) {
      // Second selection
      setSelectedDates({ ...selectedDates, checkOut: date });
    } else {
      // Earlier date selected, reset
      setSelectedDates({ checkIn: date, checkOut: undefined });
    }
  };

  const isDateInRange = (date: Date) => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return false;
    return date >= selectedDates.checkIn && date <= selectedDates.checkOut;
  };

  const calculateTotalPrice = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return 0;
    
    let total = 0;
    let current = new Date(selectedDates.checkIn);
    
    while (current < selectedDates.checkOut) {
      const priceInfo = getPriceForDate(current);
      if (priceInfo) {
        total += priceInfo.price;
      }
      current = addDays(current, 1);
    }
    
    return total;
  };

  const calculateNights = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return 0;
    return Math.ceil((selectedDates.checkOut.getTime() - selectedDates.checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Dates</h2>
        <p className="text-muted-foreground">Select check-in and check-out dates to see availability and pricing</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(prev => addDays(prev, -30))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(prev => addDays(prev, 30))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDates.checkIn}
              onSelect={handleDateSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="w-full"
              components={{
                Day: ({ date, ...props }) => {
                  const priceInfo = getPriceForDate(date);
                  const isSelected = selectedDates.checkIn && isSameDay(date, selectedDates.checkIn) ||
                                   selectedDates.checkOut && isSameDay(date, selectedDates.checkOut);
                  const inRange = isDateInRange(date);
                  
                  return (
                    <div
                      className={`
                        relative p-2 text-center cursor-pointer transition-all duration-200 min-h-[60px] flex flex-col justify-between
                        ${!priceInfo?.available ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50' : ''}
                        ${isSelected ? 'bg-primary text-primary-foreground' : ''}
                        ${inRange && !isSelected ? 'bg-primary/20' : ''}
                        ${priceInfo?.available && !isSelected && !inRange ? 'hover:bg-primary/10' : ''}
                      `}
                      onClick={() => priceInfo?.available && handleDateSelect(date)}
                    >
                      <span className="text-sm font-medium">{date.getDate()}</span>
                      {priceInfo?.available && (
                        <div className="text-xs">
                          <div className="font-bold">${priceInfo.price}</div>
                          {priceInfo.promotion && (
                            <Badge variant="secondary" className="text-[8px] px-1 py-0">
                              Deal
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              }}
            />
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="space-y-6">
          <Card className="p-6 shadow-card sticky top-4">
            <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
            
            {selectedDates.checkIn ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Check-in</p>
                    <p className="text-sm text-muted-foreground">
                      {format(selectedDates.checkIn, "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                
                {selectedDates.checkOut && (
                  <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Check-out</p>
                      <p className="text-sm text-muted-foreground">
                        {format(selectedDates.checkOut, "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                )}
                
                {selectedDates.checkOut && (
                  <div className="border-t pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span>Nights</span>
                      <span className="font-medium">{calculateNights()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${calculateTotalPrice()}</span>
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
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary/20 rounded"></div>
                <span>In range</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-muted rounded"></div>
                <span>Unavailable</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};