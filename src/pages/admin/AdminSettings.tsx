
import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const AdminSettings = () => {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <AdminLayout title="Settings">
      <div className="max-w-3xl">
        <form onSubmit={handleSave}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure the seminar details and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seminarTitle">Seminar Title</Label>
                <Input 
                  id="seminarTitle" 
                  defaultValue="National Seminar on Numerical Inimitability in the Holy Quran" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seminarDate">Seminar Date</Label>
                <Input 
                  id="seminarDate" 
                  type="date" 
                  defaultValue="2025-04-10" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seminarDescription">Description</Label>
                <Textarea 
                  id="seminarDescription" 
                  rows={4}
                  defaultValue="Evidence of Divine Precision through mathematical patterns and numerical structures, revealing the miraculous nature of the sacred text."
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update the contact details for the seminar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input 
                  id="contactEmail" 
                  type="email"
                  defaultValue="contact@quranseminar.org" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input 
                  id="contactPhone" 
                  defaultValue="+123 456 7890" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venueAddress">Venue Address</Label>
                <Textarea 
                  id="venueAddress" 
                  rows={3}
                  defaultValue="International Islamic Conference Center, Kuala Lumpur, Malaysia"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit">Save Settings</Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
