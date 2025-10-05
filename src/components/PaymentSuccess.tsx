import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {CheckCircle, Calendar, User, Mail, Globe, Home} from "lucide-react";

interface PaymentSuccessProps {
    paymentStatus: 'success' | 'error';
    totalAmount: number;
    nights: number;
    checkInDate?: string;
    checkOutDate?: string;
    bookingReference?: string;
    onNewBooking: () => void;
}

export const PaymentSuccess = ({
                                   paymentStatus,
                                   totalAmount,
                                   nights,
                                   checkInDate,
                                   checkOutDate,
                                   bookingReference: bookingReferenceProp,
                                   onNewBooking
                               }: PaymentSuccessProps) => {
    const bookingReference = bookingReferenceProp || `PRR-${Date.now().toString().slice(-8)}`;

    if (paymentStatus === 'error') {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16">
                <Card className="p-8">
                    <div className="text-center space-y-6">
                        <div
                            className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Payment Failed</h1>
                            <p className="text-muted-foreground">
                                Your payment was not processed. Please try again or contact support.
                            </p>
                        </div>
                        <Button onClick={onNewBooking} size="lg">
                            Try Again
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Card className="p-8 shadow-card text-center">
                <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-12 w-12 text-white"/>
                </div>

                <h1 className="text-4xl font-bold text-foreground mb-2">Payment Successful!</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Thank you for your booking. Your reservation has been confirmed.
                </p>

                {/* Booking Details */}
                <Card className="p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 justify-center">
                        <Calendar className="h-5 w-5 text-primary"/>
                        Booking Details
                    </h2>
                    <div className="space-y-4 text-left max-w-md mx-auto">
                        <div className="flex justify-between items-center py-3 border-b">
                            <span className="text-muted-foreground">Booking Reference</span>
                            <span className="font-mono font-semibold text-primary">{bookingReference}</span>
                        </div>
                        {checkInDate && checkOutDate && (
                            <>
                                <div className="flex justify-between items-center py-3 border-b">
                                    <span className="text-muted-foreground">Check-in Date</span>
                                    <span className="font-semibold">{checkInDate}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b">
                                    <span className="text-muted-foreground">Check-out Date</span>
                                    <span className="font-semibold">{checkOutDate}</span>
                                </div>
                            </>
                        )}
                        <div className="flex justify-between items-center py-3 border-b">
                            <span className="text-muted-foreground">Number of Nights</span>
                            <span className="font-semibold">{nights}</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-muted-foreground">Total Amount</span>
                            <span className="text-2xl font-bold text-primary">€{totalAmount}</span>
                        </div>
                    </div>
                </Card>

                {/* Next Steps */}
                <div className="bg-secondary rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4">What's Next?</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="flex flex-col items-center text-center">
                            <Mail className="h-8 w-8 text-primary mb-2"/>
                            <p className="font-medium">Confirmation Email</p>
                            <p className="text-muted-foreground">Check your inbox for booking details</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <Calendar className="h-8 w-8 text-primary mb-2"/>
                            <p className="font-medium">Add to Calendar</p>
                            <p className="text-muted-foreground">Don't forget your travel dates</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <Home className="h-8 w-8 text-primary mb-2"/>
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