import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Missing required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting registration data:', formData);
    
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(formData),
      });
    

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Server error response:', data);
        throw new Error(data.error || data.details || `HTTP error! status: ${response.status}`);
      }

      console.log('Server success response:', data);
      
      toast({
        title: "Success!",
        description: data.message || "Your registration has been submitted successfully.",
      });
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        institution: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
      });
    } catch (error) {
      console.error('Error submitting registration:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit registration. Please try again.';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Please fill out all required fields to complete your registration.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="institution">Institution/Organization</Label>
            <Input 
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              placeholder="Enter your institution or organization (optional)"
            />
          </div>

          {/* Address Fields */}
          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-2">Address Information</h3>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Textarea 
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your street address"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="city">City</Label>
              <Input 
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="state">State/Province</Label>
              <Input 
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State/Province"
                required
              />
            </div>
            
            <div className="space-y-2 md:col-span-1">
              <Label htmlFor="zipCode">Postal/Zip Code</Label>
              <Input 
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="Postal/Zip Code"
                required
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Registration"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
