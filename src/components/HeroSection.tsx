import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, MapPin, Users } from "lucide-react";
import heroImage from "@/assets/hero-hotel.jpg";

export const HeroSection = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 text-center">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your Perfect Stay
            <span className="block text-accent">Awaits</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Experience luxury and comfort with our direct booking platform. 
            Skip the fees, enjoy exclusive rates.
          </p>
        </div>

        {/* Booking Search Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-card-hover p-6 md:p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
            {/* Check-in */}
            <div className="space-y-2">
              <Label htmlFor="checkin" className="flex items-center gap-2 text-foreground font-medium">
                <CalendarDays className="h-4 w-4 text-primary" />
                Check-in
              </Label>
              <Input
                id="checkin"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="border-input focus:ring-primary h-12"
              />
            </div>

            {/* Check-out */}
            <div className="space-y-2">
              <Label htmlFor="checkout" className="flex items-center gap-2 text-foreground font-medium">
                <CalendarDays className="h-4 w-4 text-primary" />
                Check-out
              </Label>
              <Input
                id="checkout"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="border-input focus:ring-primary h-12"
              />
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center gap-2 text-foreground font-medium">
                <Users className="h-4 w-4 text-primary" />
                Guests
              </Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max="10"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="border-input focus:ring-primary h-12"
              />
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <Button 
                className="w-full h-12 bg-gradient-accent hover:shadow-card-hover transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
                size="lg"
              >
                Search Rooms
              </Button>
            </div>
          </div>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-white">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Prime Location</h3>
            <p className="text-white/80">Perfect location in the heart of the city</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarDays className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Availability</h3>
            <p className="text-white/80">Instant booking with live availability updates</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Direct Booking Benefits</h3>
            <p className="text-white/80">Exclusive rates and personalized service</p>
          </div>
        </div>
      </div>
    </div>
  );
};