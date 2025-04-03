import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RegistrationDetailsOverlay } from "./RegistrationDetailsOverlay";
import { toast } from "sonner";

interface Registration {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  institution?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
}

export function RegistrationList() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/registrations');
      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationClick = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsOverlayOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading registrations...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4">
              {registrations.length === 0 ? (
                <p className="text-center text-muted-foreground">No registrations found</p>
              ) : (
                registrations.map((registration) => (
                  <Card key={registration._id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardContent className="p-4" onClick={() => handleRegistrationClick(registration)}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{registration.fullName}</h3>
                          <p className="text-sm text-muted-foreground">{registration.email}</p>
                          <p className="text-sm text-muted-foreground">{registration.phone}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <RegistrationDetailsOverlay
        registration={selectedRegistration}
        isOpen={isOverlayOpen}
        onClose={() => {
          setIsOverlayOpen(false);
          setSelectedRegistration(null);
        }}
      />
    </>
  );
} 