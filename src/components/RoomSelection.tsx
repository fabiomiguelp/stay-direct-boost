import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Wifi, Car, Coffee, Users, Bed, Maximize, Baby, Minus, Plus } from "lucide-react";

interface RoomSelectionProps {
  onContinue?: () => void;
}

// Accommodation data for T1 house
const accommodation = {
  name: "T1 House with Sofa Bed",
  description: "Cozy one-bedroom house perfect for couples or small families, featuring a comfortable bedroom and a sofa bed in the living area.",
  basePrice: 148,
  size: "50 m²",
  beds: "1 Double Bed + 1 Sofa Bed",
  amenities: ["Free WiFi", "Air Condition", "Coffee Machine", "Kitchen", "Garden View", "Parking"],
  images: ["/api/placeholder/400/300"],
  maxGuests: 4
};

const amenityIcons: { [key: string]: React.ReactNode } = {
  "Free WiFi": <Wifi className="h-4 w-4" />,
  "Coffee Machine": <Coffee className="h-4 w-4" />,
  "Parking": <Car className="h-4 w-4" />,
};

export const RoomSelection = ({ onContinue }: RoomSelectionProps) => {
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [needsBabyCrib, setNeedsBabyCrib] = useState<boolean>(false);

  const totalGuests = adults + children;
  const maxGuests = 4;

  const handleAdultsChange = (increment: boolean) => {
    if (increment && totalGuests < maxGuests) {
      setAdults(prev => Math.min(prev + 1, maxGuests));
    } else if (!increment && adults > 1) {
      setAdults(prev => prev - 1);
    }
  };

  const handleChildrenChange = (increment: boolean) => {
    if (increment && totalGuests < maxGuests) {
      setChildren(prev => Math.min(prev + 1, maxGuests - adults));
    } else if (!increment && children > 0) {
      setChildren(prev => prev - 1);
    }
  };

  // Calculate price based on number of adults and children
  const calculatePrice = () => {
    let price = accommodation.basePrice;
    
    // Base price covers up to 2 adults
    if (adults > 2) {
      price += (adults - 2) * 20; // €20 per additional adult
    }
    
    // Children pricing: €15 per child
    if (children > 0) {
      price += children * 15;
    }
    
    // Baby crib: €10 per night
    if (needsBabyCrib) {
      price += 10;
    }
    
    return price;
  };

  const currentPrice = calculatePrice();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Choose the number of persons</h2>
        <p className="text-muted-foreground">Select how many guests will be staying</p>
      </div>

      {/* Accommodation Card */}
      <Card className="p-6 shadow-card">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Image */}
          <div className="md:col-span-1">
            <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
              <img 
                src={accommodation.images[0]} 
                alt={accommodation.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">{accommodation.name}</h3>
              <p className="text-muted-foreground mb-4">{accommodation.description}</p>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Up to {accommodation.maxGuests} Guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize className="h-4 w-4 text-primary" />
                <span>{accommodation.size}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <Bed className="h-4 w-4 text-primary" />
                <span>{accommodation.beds}</span>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-medium mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {accommodation.amenities.map((amenity) => (
                  <div 
                    key={amenity} 
                    className="flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded-md"
                  >
                    {amenityIcons[amenity] || <Coffee className="h-3 w-3" />}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Guest Selection */}
      <Card className="p-6 shadow-card">
        <h3 className="text-xl font-semibold mb-6">Select Guests</h3>
        
        <div className="space-y-6">
          {/* Adults Selection */}
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
            <div>
              <p className="font-semibold text-lg">Adults</p>
              <p className="text-sm text-muted-foreground">Age 13 or above</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleAdultsChange(false)}
                disabled={adults <= 1}
                className="h-10 w-10 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold w-8 text-center">{adults}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleAdultsChange(true)}
                disabled={totalGuests >= maxGuests}
                className="h-10 w-10 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Children Selection */}
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
            <div>
              <p className="font-semibold text-lg">Children</p>
              <p className="text-sm text-muted-foreground">Age 2-12</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleChildrenChange(false)}
                disabled={children <= 0}
                className="h-10 w-10 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold w-8 text-center">{children}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleChildrenChange(true)}
                disabled={totalGuests >= maxGuests}
                className="h-10 w-10 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Baby Crib Option */}
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <Baby className="h-5 w-5 text-primary" />
              <div>
                <Label htmlFor="baby-crib" className="font-semibold text-base cursor-pointer">
                  Baby Crib
                </Label>
                <p className="text-sm text-muted-foreground">For infants (0-2 years) - €10/night</p>
              </div>
            </div>
            <Checkbox
              id="baby-crib"
              checked={needsBabyCrib}
              onCheckedChange={(checked) => setNeedsBabyCrib(checked as boolean)}
              className="h-5 w-5"
            />
          </div>

          {/* Summary */}
          <div className="pt-4 border-t">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base price (up to 2 adults):</span>
                <span>€{accommodation.basePrice}</span>
              </div>
              {adults > 2 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Extra adults ({adults - 2} × €20):</span>
                  <span>€{(adults - 2) * 20}</span>
                </div>
              )}
              {children > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Children ({children} × €15):</span>
                  <span>€{children * 15}</span>
                </div>
              )}
              {needsBabyCrib && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Baby crib:</span>
                  <span>€10</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
              <div>
                <p className="font-medium">Total per night</p>
                <p className="text-sm text-muted-foreground">
                  {adults} {adults === 1 ? 'adult' : 'adults'}
                  {children > 0 && `, ${children} ${children === 1 ? 'child' : 'children'}`}
                  {needsBabyCrib && ', with baby crib'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">€{currentPrice}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Continue Button */}
      <div className="text-center mt-8">
        <Button 
          className="bg-gradient-primary hover:shadow-card-hover transition-all duration-300 text-lg font-semibold px-12 py-4 h-auto"
          size="lg"
          onClick={onContinue}
        >
          Continue to Your Details
        </Button>
      </div>
    </div>
  );
};