import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Globe, Phone, Users, Baby } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  adults: number;
  children: number;
  baby: number;
  babyCrib: boolean;
}

interface CustomerDetailsFormProps {
  onContinue: (details: CustomerDetails) => void;
}

const countries = [
  "United States", "Canada", "United Kingdom", "Germany", "France", "Spain", "Italy", 
  "Australia", "Japan", "Brazil", "Mexico", "Argentina", "Netherlands", "Belgium",
  "Sweden", "Norway", "Denmark", "Finland", "Switzerland", "Austria", "Portugal"
];

export const CustomerDetailsForm = ({ onContinue }: CustomerDetailsFormProps) => {
  const [formData, setFormData] = useState<CustomerDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    adults: 1,
    children: 0,
    baby: 0,
    babyCrib: false
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerDetails, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/[\s()-]/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.country) {
      newErrors.country = "Please select your country";
    }
    if (formData.adults < 1) {
      newErrors.adults = "At least 1 adult is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      toast({
        title: "Details Confirmed",
        description: "Proceeding to secure payment...",
      });
      onContinue(formData);
    }
  };

  const updateField = (field: keyof CustomerDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="p-8 shadow-card">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Your Details</h2>
          <p className="text-muted-foreground">
            Please provide your information to complete the booking
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className={errors.firstName ? "border-destructive" : ""}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className={errors.lastName ? "border-destructive" : ""}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={errors.email ? "border-destructive" : ""}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={errors.phone ? "border-destructive" : ""}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Country
            </Label>
            <Select value={formData.country} onValueChange={(value) => updateField("country", value)}>
              <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country}</p>
            )}
          </div>

          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Guests Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adults">Adults</Label>
                <Input
                  id="adults"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.adults}
                  onChange={(e) => setFormData(prev => ({ ...prev, adults: parseInt(e.target.value) || 1 }))}
                  className={errors.adults ? "border-destructive" : ""}
                />
                {errors.adults && (
                  <p className="text-sm text-destructive">{errors.adults}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="children">Children</Label>
                <Input
                  id="children"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.children}
                  onChange={(e) => setFormData(prev => ({ ...prev, children: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="baby" className="flex items-center gap-2">
                  <Baby className="h-4 w-4" />
                  Baby
                </Label>
                <Input
                  id="baby"
                  type="number"
                  min="0"
                  max="5"
                  value={formData.baby}
                  onChange={(e) => setFormData(prev => ({ ...prev, baby: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="babyCrib" className="text-base font-medium">
                  Baby Crib Required?
                </Label>
                <p className="text-sm text-muted-foreground">
                  We'll provide a baby crib for your stay
                </p>
              </div>
              <Switch
                id="babyCrib"
                checked={formData.babyCrib}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, babyCrib: checked }))}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit"
              className="w-full bg-gradient-accent hover:shadow-card-hover transition-all duration-300"
              size="lg"
            >
              Continue to Payment
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>🔒 Your information is secure and will be encrypted</p>
        </div>
      </Card>
    </div>
  );
};