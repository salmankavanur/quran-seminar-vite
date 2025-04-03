
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Upload } from 'lucide-react';

const PosterUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Only accept images
      if (!file.type.includes('image')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      // Create a preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setSelectedFile(file);
      
      toast({
        title: "File selected",
        description: "Your poster has been selected for upload.",
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a poster to upload first.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate upload
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Upload successful",
        description: "Your poster has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your poster. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Poster Upload</CardTitle>
        <CardDescription>Share your research poster for the seminar presentation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
          {previewUrl ? (
            <div className="space-y-4">
              <div className="aspect-video overflow-hidden rounded-md bg-muted">
                <img 
                  src={previewUrl} 
                  alt="Poster preview" 
                  className="h-full w-full object-contain"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedFile?.name}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 py-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Upload className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Drag & drop your poster here
                </p>
                <p className="text-xs text-muted-foreground">
                  SVG, PNG, JPG or PDF (max 10MB)
                </p>
              </div>
            </div>
          )}
          <Label htmlFor="poster-upload" className="cursor-pointer block mt-4">
            <span className="sr-only">Choose poster file</span>
            <Input
              id="poster-upload"
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button type="button" variant="outline" className="w-full">
              Select File
            </Button>
          </Label>
        </div>
        
        {previewUrl && (
          <Button onClick={handleUpload} className="w-full">
            Upload Poster
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PosterUpload;
