import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wifi, Car, Coffee, Utensils, Users, Bed, Bath, Maximize } from "lucide-react";

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  maxGuests: number;
  size: string;
  beds: string;
  amenities: string[];
  images: string[];
  promotion?: string;
  available: number;
}

interface RoomSelectionProps {
  onContinue?: () => void;
}

// Mock room data
const rooms: Room[] = [
  {
    id: "deluxe-king",
    name: "Deluxe King Room",
    description: "Spacious room with king bed and city view. Perfect for business travelers.",
    price: 185,
    originalPrice: 220,
    maxGuests: 2,
    size: "32 m²",
    beds: "1 King Bed",
    amenities: ["Free WiFi", "Air Condition", "Coffee Machine", "City View", "Work Desk"],
    images: ["/api/placeholder/400/300"],
    promotion: "Direct Booking Discount",
    available: 3
  },
  {
    id: "deluxe-twin",
    name: "Deluxe Twin Room",
    description: "Comfortable twin bed setup ideal for friends or colleagues traveling together.",
    price: 165,
    maxGuests: 2,
    size: "30 m²",
    beds: "2 Twin Beds",
    amenities: ["Free WiFi", "Air Condition", "Coffee Machine", "Garden View"],
    images: ["/api/placeholder/400/300"],
    available: 5
  },
  {
    id: "suite-family",
    name: "Family Suite",
    description: "Large suite with separate living area, perfect for families with children.",
    price: 280,
    originalPrice: 320,
    maxGuests: 4,
    size: "55 m²",
    beds: "1 King + 1 Sofa Bed",
    amenities: ["Free WiFi", "Air Condition", "Kitchenette", "Living Area", "Balcony", "Parking"],
    images: ["/api/placeholder/400/300"],
    promotion: "Family Package",
    available: 2
  },
  {
    id: "executive-suite",
    name: "Executive Suite",
    description: "Premium suite with panoramic views and exclusive amenities for the ultimate luxury experience.",
    price: 450,
    maxGuests: 2,
    size: "75 m²",
    beds: "1 King Bed",
    amenities: ["Free WiFi", "Air Condition", "Premium Minibar", "Ocean View", "Jacuzzi", "Room Service", "Concierge"],
    images: ["/api/placeholder/400/300"],
    available: 1
  }
];

const amenityIcons: { [key: string]: React.ReactNode } = {
  "Free WiFi": <Wifi className="h-4 w-4" />,
  "Air Condition": <Bath className="h-4 w-4" />,
  "Coffee Machine": <Coffee className="h-4 w-4" />,
  "Room Service": <Utensils className="h-4 w-4" />,
  "Parking": <Car className="h-4 w-4" />,
};

export const RoomSelection = ({ onContinue }: RoomSelectionProps) => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Room</h2>
        <p className="text-muted-foreground">All rooms include complimentary WiFi and daily housekeeping</p>
      </div>

      <div className="grid gap-6">
        {rooms.map((room) => (
          <Card 
            key={room.id} 
            className={`p-6 shadow-card hover:shadow-card-hover transition-all duration-300 ${
              selectedRoom === room.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="grid md:grid-cols-3 gap-6">
              {/* Room Image */}
              <div className="md:col-span-1">
                <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={room.images[0]} 
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Room Details */}
              <div className="md:col-span-1 space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{room.name}</h3>
                    {room.promotion && (
                      <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                        {room.promotion}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3">{room.description}</p>
                </div>

                {/* Room Specs */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{room.maxGuests} Guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize className="h-4 w-4 text-primary" />
                    <span>{room.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="h-4 w-4 text-primary" />
                    <span>{room.beds}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {room.available} left
                    </Badge>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h4 className="font-medium mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity) => (
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

              {/* Pricing & Booking */}
              <div className="md:col-span-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2 mb-1">
                      {room.originalPrice && (
                        <span className="text-muted-foreground line-through text-lg">
                          ${room.originalPrice}
                        </span>
                      )}
                      <span className="text-3xl font-bold text-primary">
                        ${room.price}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">per night</p>
                    {room.originalPrice && (
                      <p className="text-sm text-success font-medium">
                        Save ${room.originalPrice - room.price}
                      </p>
                    )}
                  </div>

                  {room.available <= 3 && (
                    <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 text-center">
                      <p className="text-sm font-medium text-accent">
                        Only {room.available} room{room.available > 1 ? 's' : ''} left!
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mt-4">
                  <Button
                    onClick={() => handleRoomSelect(room.id)}
                    variant={selectedRoom === room.id ? "default" : "outline"}
                    className={`w-full transition-all duration-300 ${
                      selectedRoom === room.id 
                        ? 'bg-gradient-primary hover:shadow-card-hover' 
                        : 'hover:bg-primary hover:text-primary-foreground'
                    }`}
                  >
                    {selectedRoom === room.id ? 'Selected' : 'Select Room'}
                  </Button>
                  
                  {selectedRoom === room.id && (
                    <Button 
                      className="w-full bg-gradient-accent hover:shadow-card-hover transition-all duration-300"
                      size="lg"
                      onClick={onContinue}
                    >
                      Continue to Your Details
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {!selectedRoom && (
        <div className="text-center mt-8 p-6 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">Select a room to continue with your booking</p>
        </div>
      )}
    </div>
  );
};