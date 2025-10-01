import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
}

interface MockStripeCheckoutProps {
  customerDetails: CustomerDetails;
  totalAmount: number;
  nights: number;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export const MockStripeCheckout = ({ 
  customerDetails, 
  totalAmount, 
  nights, 
  onPaymentSuccess,
  onBack 
}: MockStripeCheckoutProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setExpiryDate(formatted);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 4) {
      setCvc(value);
    }
  };

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvc) {
      toast({
        title: "Missing Information",
        description: "Please fill in all payment details",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed.",
      });
      onPaymentSuccess();
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div>
          <Card className="p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">Powered by Stripe</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    className="pl-12"
                  />
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    type="text"
                    value={cvc}
                    onChange={handleCvcChange}
                    placeholder="123"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Your payment information is encrypted and secure</span>
              </div>

              <Button 
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-gradient-accent hover:shadow-card-hover transition-all duration-300"
                size="lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing Payment...
                  </>
                 ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Pay €{totalAmount}
                  </>
                )}
              </Button>

              <Button 
                variant="outline" 
                onClick={onBack}
                className="w-full"
                disabled={processing}
              >
                Back to Details
              </Button>
            </div>
          </Card>
        </div>

        {/* Booking Summary */}
        <div>
          <Card className="p-6 shadow-card">
            <h3 className="text-xl font-semibold mb-6">Booking Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Guest</span>
                <span className="font-medium">{customerDetails.firstName} {customerDetails.lastName}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Email</span>
                <span className="font-medium">{customerDetails.email}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Country</span>
                <span className="font-medium">{customerDetails.country}</span>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span>Number of nights</span>
                <span className="font-medium">{nights}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Average per night</span>
                <span className="font-medium">€{Math.round(totalAmount / nights)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-primary">€{totalAmount}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-secondary rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-medium">Secure Payment</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Your payment is protected by bank-level security
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};