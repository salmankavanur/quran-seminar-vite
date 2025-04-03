import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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

interface RegistrationDetailsOverlayProps {
  registration: Registration | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RegistrationDetailsOverlay({ registration, isOpen, onClose }: RegistrationDetailsOverlayProps) {
  if (!registration) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registration Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                    <p className="text-sm">{registration.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-sm">{registration.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <p className="text-sm">{registration.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Institution</Label>
                    <p className="text-sm">{registration.institution || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                  <p className="text-sm">{registration.address}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">City</Label>
                    <p className="text-sm">{registration.city}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">State</Label>
                    <p className="text-sm">{registration.state}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">ZIP Code</Label>
                    <p className="text-sm">{registration.zipCode}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Registration Date</Label>
                  <p className="text-sm">{new Date(registration.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 