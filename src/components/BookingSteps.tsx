import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Check, Calendar, Home, CheckCircle} from "lucide-react";
import {HeroSection} from "./HeroSection";
import {AvailabilityCalendar} from "./AvailabilityCalendar";
import {RoomSelection} from "./RoomSelection";
import {PaymentSuccess} from "./PaymentSuccess";
import {FloatingWhatsAppButton} from "./FloatingWhatsAppButton";
import {Footer} from "./Footer";

const steps = [
    {id: 1, name: "Select Dates", icon: Calendar, description: "Choose your stay dates"},
    {id: 2, name: "Choose Room", icon: Home, description: "Pick your perfect room"},
    {id: 3, name: "Confirmation", icon: CheckCircle, description: "Booking confirmed"}
];

export const BookingSteps = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [paymentStatus, setPaymentStatus] = useState<'success' | 'error' | null>(null);
    const [bookingData, setBookingData] = useState({
        totalAmount: 0,
        nights: 0,
        checkInDate: "",
        checkOutDate: "",
        roomType: "",
        customerEmail: ""
    });

    // Check for return from Stripe
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get('payment');
        if (status === 'success') {
            setPaymentStatus('success');
            setCurrentStep(3);
        } else if (status === 'error' || status === 'canceled') {
            setPaymentStatus('error');
            setCurrentStep(3);
        }
    }, []);

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-8">
                        <HeroSection/>
                        <AvailabilityCalendar
                            onContinue={(data) => {
                                setBookingData({
                                    totalAmount: data.totalPrice,
                                    nights: data.nights,
                                    checkInDate: data.checkInDate,
                                    checkOutDate: data.checkOutDate,
                                    roomType: "",
                                    customerEmail: ""
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
                            onContinue={async () => {
                                try {
                                    const response = await fetch('http://localhost:8000/api/create-checkout-session', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            totalAmount: bookingData.totalAmount,
                                            nights: bookingData.nights,
                                            checkInDate: bookingData.checkInDate,
                                            checkOutDate: bookingData.checkOutDate,
                                            roomType: "Deluxe Suite",
                                            customerEmail: "test@example.com"
                                        }),
                                    });

                                    if (!response.ok) {
                                        throw new Error(`HTTP error! status: ${response.status}`);
                                    }

                                    const {sessionUrl} = await response.json();


                                    // Redirect to Stripe Checkout
                                    window.location.href = sessionUrl;


                                } catch (error) {
                                    console.error('Error creating checkout session:', error);
                                }
                            }}
                        />
                    </div>
                );
            case 3:
                return (
                    <PaymentSuccess
                        paymentStatus={paymentStatus || 'success'}
                        totalAmount={bookingData.totalAmount}
                        nights={bookingData.nights}
                        checkInDate={bookingData.checkInDate}
                        checkOutDate={bookingData.checkOutDate}
                        onNewBooking={() => {
                            setCurrentStep(1);
                            setPaymentStatus(null);
                            window.history.replaceState({}, '', '/');
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Progress Steps */}
            <div className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
                    <div
                        className="flex items-center justify-center space-x-1 sm:space-x-4 md:space-x-8 overflow-x-auto md:overflow-x-visible">
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
                                            <Check className="h-4 w-4 sm:h-5 sm:w-5"/>
                                        ) : (
                                            <step.icon className="h-4 w-4 sm:h-5 sm:w-5"/>
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

            <FloatingWhatsAppButton/>
            <Footer/>
        </div>
    );
};