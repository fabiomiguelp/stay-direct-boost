import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {CalendarDays, MapPin, Users} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import logo from "@/assets/logo.png";
import logoBlack from "@/assets/logo-black.png";

export const HeroSection = () => {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState("2");

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{backgroundImage: `url(${heroImage})`}}
            >
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-6xl mx-auto px-4 text-center">
                <img src={logoBlack} alt="Hotel Logo" className="mx-auto mb-6 h-48"/>
                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-white">
                    <div className="text-center">
                        <div
                            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="h-8 w-8"/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Prime Location</h3>
                        <p className="text-white/80">Perfect location in the heart of the city</p>
                    </div>
                    <div className="text-center">
                        <div
                            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CalendarDays className="h-8 w-8"/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Real-time Availability</h3>
                        <p className="text-white/80">Instant booking with live availability updates</p>
                    </div>
                    <div className="text-center">
                        <div
                            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8"/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Direct Booking Benefits</h3>
                        <p className="text-white/80">Exclusive rates and personalized service</p>
                    </div>
                </div>
            </div>
        </div>
    );
};