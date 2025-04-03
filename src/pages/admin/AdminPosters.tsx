import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Upload, Eye, Trash2, Grid, Map, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Create schema for poster form
const posterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().optional(),
  image: z.any().optional()
});

type PosterFormValues = z.infer<typeof posterSchema>;

// Panelists data
const initialPosters = [
  { 
    id: 1, 
    title: "Moderator", 
    author: "Suhail Hidaya Hudawi", 
    description: "Dean, Kulliyyah of Qur'an & Sunnah", 
    imageUrl: "/images/Suhail Hidaya Hudawi.jpeg"
  },
  { 
    id: 2, 
    title: "Panelist", 
    author: "Shuhaibul Haitami", 
    description: "Professor of Nandhi Darussalam", 
    imageUrl: "https://skssf.in/wp-content/uploads/2022/11/haithami.jpeg"
  },
  { 
    id: 3, 
    title: "Panelist", 
    author: "Dr. Abdul Qayoom", 
    description: "Assistant Professor, PTM Govt College Perinthalmanna", 
    imageUrl: "/images/Dr. Abdul Qayoom.jpeg"
  },
  { 
    id: 4, 
    title: "Panelist", 
    author: "Salam Faisy Olavattur", 
    description: "Iritaq Academic Senate Member", 
    imageUrl: "/images/Salam Faisy Olavattur.jpeg"
  }
];

const AdminPosters = () => {
  const [posters, setPosters] = useState(initialPosters);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('map');
  const [selectedPoster, setSelectedPoster] = useState<typeof initialPosters[0] | null>(null);
  
  const form = useForm<PosterFormValues>({
    resolver: zodResolver(posterSchema),
    defaultValues: {
      title: "",
      author: "",
      description: ""
    }
  });

  const filteredPosters = posters.filter(poster =>
    poster.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    poster.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    // In a real app, this would be an API call
    setPosters(posters.filter(poster => poster.id !== id));
    toast({
      title: "Poster deleted",
      description: "The poster has been removed successfully.",
    });
  };

  const handleView = (poster: typeof initialPosters[0]) => {
    setSelectedPoster(poster);
  };

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
    }
  };

  const onSubmit = async (data: PosterFormValues) => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select an image for the poster.",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, this would upload to a server
      // For now, we'll simulate it with a local URL
      const imageUrl = `/images/posters/poster${posters.length + 1}.jpg`;
      
      const newPoster = {
        id: posters.length + 1,
        title: data.title,
        author: data.author,
        description: data.description || "",
        uploadDate: new Date().toISOString().split('T')[0],
        imageUrl
      };
      
      setPosters([...posters, newPoster]);
      setShowUpload(false);
      toast({
        title: "Poster added",
        description: "Your poster has been uploaded successfully.",
      });
      form.reset();
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your poster. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const renderPosterCard = (poster: typeof initialPosters[0]) => (
    <Card key={poster.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden bg-muted">
        <img 
          src={poster.imageUrl} 
          alt={poster.title}
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            viewMode === 'grid' ? 'aspect-[3/4] w-full h-full' : 'aspect-[16/9] w-full'
          }`}
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button variant="secondary" size="sm" onClick={() => handleView(poster)}>
            <Eye className="h-4 w-4 mr-2" /> View Details
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold line-clamp-1" title={poster.title}>{poster.title}</h3>
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
            {poster.title === "Moderator" ? "Moderator" : "Panelist"}
          </span>
        </div>
        <p className="text-sm font-medium mb-1">{poster.author}</p>
        {poster.description && (
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{poster.description}</p>
        )}
        <div className="flex justify-end">
          <Button size="sm" variant="destructive" onClick={() => handleDelete(poster.id)}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout title="Manage Panelists">
      {!showUpload ? (
        <>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search panelists..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Tabs defaultValue="map" className="w-[200px]" onValueChange={(value) => setViewMode(value as 'grid' | 'map')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="grid" className="flex items-center gap-2">
                    <Grid className="h-4 w-4" /> Grid
                  </TabsTrigger>
                  <TabsTrigger value="map" className="flex items-center gap-2">
                    <Map className="h-4 w-4" /> Map
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button className="flex items-center gap-2" onClick={() => setShowUpload(true)}>
                <Upload className="h-4 w-4" />
                Add New Panelist
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1 md:grid-cols-2'
            }`}>
              {filteredPosters.map(renderPosterCard)}
            </div>
            
            {filteredPosters.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No panelists found matching your search.</p>
              </div>
            )}
          </ScrollArea>

          <Dialog open={!!selectedPoster} onOpenChange={() => setSelectedPoster(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedPoster?.title}</DialogTitle>
                <DialogDescription>
                  {selectedPoster?.author}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                  <img 
                    src={selectedPoster?.imageUrl} 
                    alt={selectedPoster?.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{selectedPoster?.description}</p>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setSelectedPoster(null)}>
                      <X className="h-4 w-4 mr-2" /> Close
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Button variant="outline" onClick={() => setShowUpload(false)}>
              Back to Panelists
            </Button>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Panelist Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter panelist name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter panelist description" 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Briefly describe what this panelist is about
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel>Upload Panelist Image</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {previewUrl && (
                      <div className="aspect-[3/4] overflow-hidden rounded-md bg-muted">
                        <img 
                          src={previewUrl} 
                          alt="Panelist preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Upload an image of your panelist (JPEG, PNG)
                </FormDescription>
              </FormItem>
              
              <Button type="submit" className="w-full">
                Upload Panelist
              </Button>
            </form>
          </Form>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPosters;
