import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import GovernmentInformationForm from "@/components/GovernmentInformationForm";

const InformationForm = () => {
  const { bookingId } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Government Frontier Control Form
            </h1>
            <p className="text-muted-foreground">
              Booking Reference: <span className="font-semibold">{bookingId}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Please fill in the required information for all guests. This form is mandatory for frontier control purposes.
            </p>
          </div>

          <GovernmentInformationForm bookingId={bookingId || ""} />
        </Card>
      </div>
    </div>
  );
};

export default InformationForm;
