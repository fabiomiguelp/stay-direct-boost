import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar, Home, CreditCard } from "lucide-react";
import { HeroSection } from "./HeroSection";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { RoomSelection } from "./RoomSelection";

const steps = [
  { id: 1, name: "Select Dates", icon: Calendar, description: "Choose your stay dates" },
  { id: 2, name: "Choose Room", icon: Home, description: "Pick your perfect room" },
  { id: 3, name: "Secure Payment", icon: CreditCard, description: "Complete your booking" }
];

export const BookingSteps = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <HeroSection />
            <AvailabilityCalendar onContinue={() => setCurrentStep(2)} />
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <RoomSelection />
          </div>
        );
      case 3:
        return (
          <div className="max-w-4xl mx-auto p-4">
            <Card className="p-8 shadow-card text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Secure Payment</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Complete your booking with our secure payment system. For the full payment integration with Stripe, 
                you'll need to connect to Supabase to handle backend processing.
              </p>
              <div className="bg-muted/50 rounded-lg p-6 mb-6">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Backend Integration Required:</strong> To process real payments and sync with your Channel Manager, 
                  connect this project to Supabase for secure payment processing and API integrations.
                </p>
              </div>
              <Button 
                className="bg-gradient-accent hover:shadow-card-hover transition-all duration-300"
                size="lg"
              >
                Connect Payment System
              </Button>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Steps */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => step.id <= currentStep && setCurrentStep(step.id)}
                  disabled={step.id > currentStep}
                  className={`
                    flex items-center space-x-3 p-2 rounded-lg transition-all duration-300
                    ${step.id <= currentStep ? 'hover:bg-muted/50 cursor-pointer' : 'cursor-not-allowed'}
                  `}
                >
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${currentStep > step.id
                        ? 'bg-success text-white'
                        : currentStep === step.id
                        ? 'bg-gradient-primary text-white'
                        : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`font-medium ${
                      currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      w-8 h-px mx-4 transition-all duration-300
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
    </div>
  );
};