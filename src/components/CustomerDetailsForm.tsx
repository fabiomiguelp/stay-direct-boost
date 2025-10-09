import {useState} from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {User, Mail, Globe, Phone} from "lucide-react";
import {useToast} from "@/hooks/use-toast";

interface CustomerDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
}

interface CustomerDetailsFormProps {
    onContinue: (details: CustomerDetails) => void;
}

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)",
    "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
    "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
    "Oman",
    "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar",
    "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
    "Yemen",
    "Zambia", "Zimbabwe", "Other"
];

export const CustomerDetailsForm = ({onContinue}: CustomerDetailsFormProps) => {
    const [formData, setFormData] = useState<CustomerDetails>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: ""
    });
    const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});
    const {toast} = useToast();

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
        setFormData(prev => ({...prev, [field]: value}));
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: undefined}));
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <Card className="p-8 shadow-card">
                <div className="text-center mb-8">
                    <div
                        className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="h-8 w-8 text-white"/>
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
                            <Mail className="h-4 w-4"/>
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
                            <Phone className="h-4 w-4"/>
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
                            <Globe className="h-4 w-4"/>
                            Country
                        </Label>
                        <Select value={formData.country} onValueChange={(value) => updateField("country", value)}>
                            <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                                <SelectValue placeholder="Select your country"/>
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