import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, User, Mail, Globe, Home } from "lucide-react";

interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
}

interface PaymentSuccessProps {
  customerDetails: CustomerDetails;
  totalAmount: number;
  nights: number;
  checkInDate?: string;
  checkOutDate?: string;
  onNewBooking: () => void;
}

export const PaymentSuccess = ({ 
  customerDetails, 
  totalAmount, 
  nights,
  checkInDate,
  checkOutDate,
  onNewBooking 
}: PaymentSuccessProps) => {
  const bookingReference = `BK${Date.now().toString().slice(-6)}`;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="p-8 shadow-card text-center">
        <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold text-foreground mb-2">Payment Successful!</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Thank you for your booking. Your reservation has been confirmed.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Booking Details */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Booking Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking Reference:</span>
                <span className="font-mono font-semibold">{bookingReference}</span>
              </div>
              {checkInDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-in:</span>
                  <span className="font-medium">{checkInDate}</span>
                </div>
              )}
              {checkOutDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Check-out:</span>
                  <span className="font-medium">{checkOutDate}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nights:</span>
                <span className="font-medium">{nights}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="font-semibold">Total Paid:</span>
                <span className="font-bold text-primary">${totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="text-left">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Guest Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{customerDetails.firstName} {customerDetails.lastName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customerDetails.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{customerDetails.country}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-secondary rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">What's Next?</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col items-center text-center">
              <Mail className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium">Confirmation Email</p>
              <p className="text-muted-foreground">Check your inbox for booking details</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium">Add to Calendar</p>
              <p className="text-muted-foreground">Don't forget your travel dates</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Home className="h-8 w-8 text-primary mb-2" />
              <p className="font-medium">Prepare for Stay</p>
              <p className="text-muted-foreground">Pack and get ready for your trip</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={onNewBooking}
            className="bg-gradient-accent hover:shadow-card-hover transition-all duration-300"
            size="lg"
          >
            Make Another Booking
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Need assistance? Contact our support team at support@example.com
          </p>
        </div>
      </Card>
    </div>
  );
};