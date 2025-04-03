import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RegistrationDetailsOverlay } from "@/components/RegistrationDetailsOverlay";
import { toast } from "sonner";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";
import { Search, Download, Eye } from "lucide-react";

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

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/registrations`);
      
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

  const handleExportCSV = () => {
    try {
      const headers = ['ID', 'Name', 'Email', 'Institution', 'Phone', 'Date'];
      const csvData = registrations.map(reg => [
        reg._id,
        reg.fullName,
        reg.email,
        reg.institution || '',
        reg.phone,
        format(new Date(reg.createdAt), 'MMM d, yyyy')
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `registrations_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      link.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export registrations');
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (reg.institution && reg.institution.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <AdminLayout title="Registrations">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Loading registrations...</p>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Registrations">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search registrations..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <Download className="h-4 w-4" /> Export to CSV
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegistrations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                        No registrations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRegistrations.map((registration) => (
                      <TableRow 
                        key={registration._id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleRegistrationClick(registration)}
                      >
                        <TableCell className="font-medium">{registration._id.slice(-6)}</TableCell>
                        <TableCell>{registration.fullName}</TableCell>
                        <TableCell>{registration.email}</TableCell>
                        <TableCell>{registration.institution || '-'}</TableCell>
                        <TableCell className="hidden md:table-cell">{registration.phone}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {format(new Date(registration.createdAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRegistrationClick(registration);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <RegistrationDetailsOverlay
        registration={selectedRegistration}
        isOpen={isOverlayOpen}
        onClose={() => {
          setIsOverlayOpen(false);
          setSelectedRegistration(null);
        }}
      />
    </AdminLayout>
  );
}