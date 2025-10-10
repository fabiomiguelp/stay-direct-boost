import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle } from "lucide-react";

const personSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  birthday: z.string().min(1, "Birthday is required"),
  nationality: z.string().min(2, "Nationality is required"),
  documentType: z.string().min(1, "Document type is required"),
  documentNumber: z.string().min(1, "Document number is required"),
  documentCountry: z.string().min(2, "Document issuing country is required"),
  checkInDate: z.string().min(1, "Check-in date is required"),
  checkOutDate: z.string().min(1, "Check-out date is required"),
});

const formSchema = z.object({
  persons: z.array(personSchema).min(1, "At least one person is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface GovernmentInformationFormProps {
  bookingId: string;
}

const documentTypes = [
  { value: "passport", label: "Passport" },
  { value: "citizen_card", label: "Citizen Card" },
  { value: "id_card", label: "ID Card" },
  { value: "drivers_license", label: "Driver's License" },
  { value: "other", label: "Other" },
];

const GovernmentInformationForm = ({ bookingId }: GovernmentInformationFormProps) => {
  const { toast } = useToast();
  const [persons, setPersons] = useState([
    {
      fullName: "",
      birthday: "",
      nationality: "",
      documentType: "",
      documentNumber: "",
      documentCountry: "",
      checkInDate: "",
      checkOutDate: "",
    },
  ]);

  const addPerson = () => {
    setPersons([
      ...persons,
      {
        fullName: "",
        birthday: "",
        nationality: "",
        documentType: "",
        documentNumber: "",
        documentCountry: "",
        checkInDate: "",
        checkOutDate: "",
      },
    ]);
  };

  const removePerson = (index: number) => {
    if (persons.length > 1) {
      setPersons(persons.filter((_, i) => i !== index));
    }
  };

  const updatePerson = (index: number, field: string, value: string) => {
    const updatedPersons = [...persons];
    updatedPersons[index] = { ...updatedPersons[index], [field]: value };
    setPersons(updatedPersons);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate all persons
      formSchema.parse({ persons });

      // Here you would send the data to your backend
      console.log("Submitting frontier control data:", { bookingId, persons });

      toast({
        title: "Form submitted successfully",
        description: "Your frontier control information has been recorded.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {persons.map((person, index) => (
        <div key={index} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Person {index + 1}
            </h3>
            {persons.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePerson(index)}
                className="text-destructive"
              >
                <MinusCircle className="w-4 h-4 mr-1" />
                Remove
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`fullName-${index}`}>Full Name *</Label>
              <Input
                id={`fullName-${index}`}
                value={person.fullName}
                onChange={(e) => updatePerson(index, "fullName", e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`birthday-${index}`}>Birthday *</Label>
              <Input
                id={`birthday-${index}`}
                type="date"
                value={person.birthday}
                onChange={(e) => updatePerson(index, "birthday", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`nationality-${index}`}>Nationality *</Label>
              <Input
                id={`nationality-${index}`}
                value={person.nationality}
                onChange={(e) => updatePerson(index, "nationality", e.target.value)}
                placeholder="Portuguese"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`documentType-${index}`}>Document Type *</Label>
              <Select
                value={person.documentType}
                onValueChange={(value) => updatePerson(index, "documentType", value)}
                required
              >
                <SelectTrigger id={`documentType-${index}`}>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`documentNumber-${index}`}>Document Number *</Label>
              <Input
                id={`documentNumber-${index}`}
                value={person.documentNumber}
                onChange={(e) => updatePerson(index, "documentNumber", e.target.value)}
                placeholder="AB123456"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`documentCountry-${index}`}>Document Issuing Country *</Label>
              <Input
                id={`documentCountry-${index}`}
                value={person.documentCountry}
                onChange={(e) => updatePerson(index, "documentCountry", e.target.value)}
                placeholder="Portugal"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`checkInDate-${index}`}>Check-in Date *</Label>
              <Input
                id={`checkInDate-${index}`}
                type="date"
                value={person.checkInDate}
                onChange={(e) => updatePerson(index, "checkInDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`checkOutDate-${index}`}>Check-out Date *</Label>
              <Input
                id={`checkOutDate-${index}`}
                type="date"
                value={person.checkOutDate}
                onChange={(e) => updatePerson(index, "checkOutDate", e.target.value)}
                required
              />
            </div>
          </div>

          {index < persons.length - 1 && <Separator className="my-4" />}
        </div>
      ))}

      <div className="flex items-center justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={addPerson}
          className="gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add Another Person
        </Button>

        <Button type="submit" size="lg">
          Submit Information
        </Button>
      </div>
    </form>
  );
};

export default GovernmentInformationForm;
