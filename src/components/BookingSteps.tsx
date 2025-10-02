import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, Home, CreditCard, User, CheckCircle } from "lucide-react";
import { HeroSection } from "./HeroSection";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { RoomSelection } from "./RoomSelection";
import { CustomerDetailsForm } from "./CustomerDetailsForm";
import { MockStripeCheckout } from "./MockStripeCheckout";
import { PaymentSuccess } from "./PaymentSuccess";
import { FloatingWhatsAppButton } from "./FloatingWhatsAppButton";
import { Footer } from "./Footer";

const steps = [
  { id: 1, name: "Select Dates", icon: Calendar, description: "Choose your stay dates" },
  { id: 2, name: "Choose Room", icon: Home, description: "Pick your perfect room" },
  { id: 3, name: "Your Details", icon: User, description: "Enter your information" },
  { id: 4, name: "Secure Payment", icon: CreditCard, description: "Complete your booking" },
  { id: 5, name: "Confirmation", icon: CheckCircle, description: "Booking confirmed" }
];

interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
}

export const BookingSteps = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [bookingData, setBookingData] = useState({
    totalAmount: 0,
    nights: 0,
    checkInDate: "",
    checkOutDate: ""
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <HeroSection />
            <AvailabilityCalendar 
              onContinue={(data) => {
                setBookingData({
                  totalAmount: data.totalPrice,
                  nights: data.nights,
                  checkInDate: data.checkInDate,
                  checkOutDate: data.checkOutDate
                });
                setCurrentStep(2);
              }} 
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <RoomSelection 
              totalAmount={bookingData.totalAmount}
              nights={bookingData.nights}
              onContinue={() => setCurrentStep(3)} 
            />
          </div>
        );
      case 3:
        return (
          <CustomerDetailsForm 
            onContinue={(details) => {
              setCustomerDetails(details);
              setCurrentStep(4);
            }} 
          />
        );
      case 4:
        return customerDetails ? (
          <MockStripeCheckout 
            customerDetails={customerDetails}
            totalAmount={bookingData.totalAmount}
            nights={bookingData.nights}
            onPaymentSuccess={() => setCurrentStep(5)}
            onBack={() => setCurrentStep(3)}
          />
        ) : null;
      case 5:
        return customerDetails ? (
          <PaymentSuccess 
            customerDetails={customerDetails}
            totalAmount={bookingData.totalAmount}
            nights={bookingData.nights}
            checkInDate={bookingData.checkInDate}
            checkOutDate={bookingData.checkOutDate}
            onNewBooking={() => {
              setCurrentStep(1);
              setCustomerDetails(null);
            }}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Steps */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-center space-x-1 sm:space-x-4 md:space-x-8 overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                  disabled={step.id > currentStep}
                  className={`
                    flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 rounded-lg transition-all duration-300
                    ${step.id <= currentStep ? 'hover:bg-muted/50 cursor-pointer' : 'cursor-not-allowed'}
                  `}
                >
                  <div
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${currentStep > step.id
                        ? 'bg-success text-white'
                        : currentStep === step.id
                        ? 'bg-gradient-primary text-white'
                        : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className={`font-medium text-sm ${
                      currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      w-2 sm:w-4 md:w-8 h-px mx-1 sm:mx-2 md:mx-4 transition-all duration-300
                      ${currentStep > step.id ? 'bg-success' : 'bg-muted'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="pb-8">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      {currentStep > 1 && (
        <div className="fixed bottom-6 left-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="shadow-card-hover"
          >
            Back to {steps[currentStep - 2]?.name}
          </Button>
        </div>
      )}
      
      <FloatingWhatsAppButton />
      <Footer />
    </div>
  );
};