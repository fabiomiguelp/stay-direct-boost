import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, Car, Coffee, Users, Bed, Maximize } from "lucide-react";

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
  const [selectedPersons, setSelectedPersons] = useState<number>(2);

  const handlePersonSelect = (persons: number) => {
    setSelectedPersons(persons);
  };

  // Calculate price based on number of persons
  const calculatePrice = (persons: number) => {
    if (persons <= 2) return accommodation.basePrice;
    // Add extra charge for 3rd and 4th person
    return accommodation.basePrice + ((persons - 2) * 20);
  };

  const currentPrice = calculatePrice(selectedPersons);

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

      {/* Person Selection */}
      <Card className="p-6 shadow-card">
        <h3 className="text-xl font-semibold mb-4">Number of Guests</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((persons) => (
            <Card
              key={persons}
              className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-card-hover ${
                selectedPersons === persons 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-secondary/50'
              }`}
              onClick={() => handlePersonSelect(persons)}
            >
              <div className="text-center space-y-3">
                <Users className={`h-8 w-8 mx-auto ${selectedPersons === persons ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <p className="font-semibold text-lg">{persons} {persons === 1 ? 'Person' : 'Persons'}</p>
                  <p className="text-sm text-muted-foreground mt-1">€{calculatePrice(persons)}/night</p>
                  {persons > 2 && (
                    <p className="text-xs text-primary mt-1">+€{(persons - 2) * 20} extra</p>
                  )}
                </div>
                {selectedPersons === persons && (
                  <Badge className="bg-primary">Selected</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-secondary rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Price per night</p>
              <p className="text-sm text-muted-foreground">Based on {selectedPersons} {selectedPersons === 1 ? 'person' : 'persons'}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">€{currentPrice}</p>
              <p className="text-sm text-muted-foreground">per night</p>
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