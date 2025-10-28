import {useLocation, useParams} from "react-router-dom";
import {Card} from "@/components/ui/card";
import logoBlack from "@/assets/logo-black.png";
import GovernmentInformationForm from "@/components/GovernmentInformationForm";

const InformationForm = () => {
    const {bookingId} = useParams();
    const location = useLocation();

    // Get token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
                <div className="text-center mb-6 md:mb-8">
                    <img src={logoBlack} alt="Hotel Logo" className="mx-auto h-24 md:h-32 lg:h-48"/>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mt-3 md:mt-4">Welcome
                        Central Charm Azores</h2>
                    <p className="text-sm md:text-base text-muted-foreground mt-2 px-2">Please complete the form below
                        for frontier control
                        purposes.</p>
                </div>
                <Card className="p-4 md:p-6 lg:p-8">
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                            Government Frontier Control Form
                        </h1>
                        <p className="text-muted-foreground">
                            Booking Reference: <span className="font-semibold">{bookingId}</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Please fill in the required information for all guests. This form is mandatory for frontier
                            control purposes.
                        </p>
                    </div>

                    <GovernmentInformationForm bookingId={bookingId || ''}
                                               xApiToken={token || ''}/>
                </Card>
            </div>
        </div>
    );
};

export default InformationForm;
