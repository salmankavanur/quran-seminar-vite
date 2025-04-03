# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/b21c385e-12e1-460d-9c2a-fe3729161e83

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b21c385e-12e1-460d-9c2a-fe3729161e83) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b21c385e-12e1-460d-9c2a-fe3729161e83) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)






import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from '../lib/db.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

let isConnected = false;

// Connect to MongoDB
async function startServer() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    isConnected = true;
    console.log('MongoDB connection successful');

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Test the API at http://localhost:${PORT}/api/test`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    console.error('Please make sure MongoDB is installed and running on your system');
    process.exit(1);
  }
}

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
  if (!isConnected) {
    return res.status(503).json({ error: 'Database not connected. Please try again later.' });
  }

  try {
    console.log('Received registration data:', req.body);
    const { name, email, password, phone } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !phone) {
      console.log('Missing required fields:', { name, email, phone });
      return res.status(400).json({ error: 'Name, email, password, and phone are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log('New user registered successfully:', userResponse);
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error registering user:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.message });
    }
    if (error.name === 'MongoError') {
      return res.status(500).json({ error: 'Database error', details: error.message });
    }
    res.status(500).json({ error: 'Failed to register user', details: error.message });
  }
});

// Create new message
app.post('/api/messages', async (req, res) => {
  if (!isConnected) {
    return res.status(503).json({ error: 'Database not connected. Please try again later.' });
  }

  try {
    console.log('Received message data:', req.body);
    const { name, email, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      console.log('Missing required fields:', { name, email, message });
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Create new message
    const newMessage = await Message.create({
      name,
      email,
      message
    });

    console.log('New message created successfully:', newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation error', details: error.message });
    }
    if (error.name === 'MongoError') {
      return res.status(500).json({ error: 'Database error', details: error.message });
    }
    res.status(500).json({ error: 'Failed to create message', details: error.message });
  }
});

// Routes
// Get all messages
app.get('/api/messages', async (req, res) => {
  try {
    console.log('Fetching messages...');
    const messages = await Message.find().sort({ createdAt: -1 });
    console.log(`Found ${messages.length} messages`);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
  }
});

// Mark message as read/unread
app.patch('/api/messages/:id/read', async (req, res) => {
  try {
    const { read } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message', details: error.message });
  }
});

// Delete message
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message', details: error.message });
  }
});

// Reply to message
app.post('/api/messages/:id/reply', async (req, res) => {
  try {
    const { reply } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { 
        reply,
        repliedAt: new Date(),
        read: true
      },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    console.error('Error replying to message:', error);
    res.status(500).json({ error: 'Failed to reply to message', details: error.message });
  }
});

// Start the server
startServer(); 






import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RegistrationDetailsOverlay } from "@/components/RegistrationDetailsOverlay";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/AdminLayout";

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
      <Card>
        <CardHeader>
          <CardTitle>All Registrations</CardTitle>
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
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{registration.fullName}</h3>
                            <Badge variant="secondary">
                              {format(new Date(registration.createdAt), 'MMM d, yyyy')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{registration.email}</p>
                          <p className="text-sm text-muted-foreground">{registration.phone}</p>
                          {registration.institution && (
                            <p className="text-sm text-muted-foreground">{registration.institution}</p>
                          )}
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
    </AdminLayout>
  );
}




import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Upload, Eye, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';

// Create schema for poster form
const posterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().optional(),
  image: z.any().optional()
});

type PosterFormValues = z.infer<typeof posterSchema>;

// Mock poster data - in a real app this would come from an API
const initialPosters = [
  { id: 1, title: "Mathematical Patterns Research Poster", author: "Dr. Ahmad Al-Farabi", description: "An exploration of mathematical patterns found in the Holy Quran.", uploadDate: "2024-03-15" },
  { id: 2, title: "Numerical Symmetry Findings", author: "Prof. Sarah Rahman", description: "Research into numerical symmetry found across verses and chapters.", uploadDate: "2024-03-16" },
  { id: 3, title: "Digital Roots Analysis", author: "Dr. Mohammed Hassan", description: "Analysis of digital roots and their significance in sacred texts.", uploadDate: "2024-03-17" },
  { id: 4, title: "Golden Ratio Research", author: "Dr. Layla Kareem", description: "Exploring the presence of the golden ratio in Quranic structure.", uploadDate: "2024-03-18" },
];

const AdminPosters = () => {
  const [posters, setPosters] = useState(initialPosters);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
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

  const handleView = (id: number) => {
    // In a real app, this would open a modal or navigate to a view page
    toast({
      title: "View poster",
      description: `Viewing poster with ID: ${id}`,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onSubmit = (data: PosterFormValues) => {
    // In a real app, this would be an API call
    const newPoster = {
      id: posters.length + 1,
      title: data.title,
      author: data.author,
      description: data.description || "",
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    setPosters([...posters, newPoster]);
    setShowUpload(false);
    toast({
      title: "Poster added",
      description: "Your poster has been uploaded successfully.",
    });
    form.reset();
    setSelectedFile(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <AdminLayout title="Manage Posters">
      {!showUpload ? (
        <>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search posters..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="flex items-center gap-2" onClick={() => setShowUpload(true)}>
              <Upload className="h-4 w-4" />
              Upload New Poster
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPosters.map(poster => (
                <Card key={poster.id} className="overflow-hidden">
                  <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                    <img 
                      src="/placeholder.svg" 
                      alt={poster.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-1" title={poster.title}>{poster.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{poster.author}</p>
                    {poster.description && (
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{poster.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mb-3">Uploaded on {formatDate(poster.uploadDate)}</p>
                    <div className="flex justify-between gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleView(poster.id)}>
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(poster.id)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredPosters.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posters found matching your search.</p>
              </div>
            )}
          </ScrollArea>
        </>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Button variant="outline" onClick={() => setShowUpload(false)}>
              Back to Posters
            </Button>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poster Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter poster title" {...field} />
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
                        placeholder="Enter poster description" 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Briefly describe what this poster is about
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel>Upload Poster Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </FormControl>
                <FormDescription>
                  Upload an image of your research poster
                </FormDescription>
              </FormItem>
              
              <Button type="submit" className="w-full">
                Upload Poster
              </Button>
            </form>
          </Form>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPosters;




import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Upload, Eye, Trash2, Grid, Map } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Create schema for poster form
const posterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().optional(),
  image: z.any().optional()
});

type PosterFormValues = z.infer<typeof posterSchema>;

// Mock poster data - in a real app this would come from an API
const initialPosters = [
  { 
    id: 1, 
    title: "Moderator", 
    author: "Suhail Hidaya Hudawi", 
    description: "Dean, Kulliyyah of Qur'an& Sunnah", 
    uploadDate: "2024-03-15",
    imageUrl: "/images/Suhail Hidaya Hudawi.jpeg"
  },
  { 
    id: 2, 
    title: "panelist", 
    author: "Shuhaibul Haitami", 
    description: "Professor of Nandhi darussalam", 
    uploadDate: "2024-03-16",
    imageUrl: "/images/shuhaibul haithami.jpeg"
  },
  { 
    id: 3, 
    title: "panelist", 
    author: "Dr. Abdul Qayoom", 
    description: "Ass. Professor PTM Govt College Perinthalmanna", 
    uploadDate: "2024-03-17",
    imageUrl: "/images/Dr. Abdul Qayoom.jpeg"
  },
  { 
    id: 4, 
    title: "panelist", 
    author: "Salam Faisy Olavattur", 
    description: "Iritaq academic senate member", 
    uploadDate: "2024-03-18",
    imageUrl: "/images/Salam Faisy Olavattur .jpeg"
  },
];

const AdminPosters = () => {
  const [posters, setPosters] = useState(initialPosters);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
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

  const handleView = (id: number) => {
    // In a real app, this would open a modal or navigate to a view page
    toast({
      title: "View poster",
      description: `Viewing poster with ID: ${id}`,
    });
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
          <Button variant="secondary" size="sm" onClick={() => handleView(poster.id)}>
            <Eye className="h-4 w-4 mr-2" /> View Details
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-1" title={poster.title}>{poster.title}</h3>
        <p className="text-sm text-muted-foreground mb-1">{poster.author}</p>
        {poster.description && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{poster.description}</p>
        )}
        <p className="text-xs text-muted-foreground mb-3">Uploaded on {formatDate(poster.uploadDate)}</p>
        <div className="flex justify-end">
          <Button size="sm" variant="destructive" onClick={() => handleDelete(poster.id)}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout title="Manage Posters">
      {!showUpload ? (
        <>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search posters..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Tabs defaultValue="grid" className="w-[200px]" onValueChange={(value) => setViewMode(value as 'grid' | 'map')}>
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
                Upload New Poster
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
                <p className="text-muted-foreground">No posters found matching your search.</p>
              </div>
            )}
          </ScrollArea>
        </>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Button variant="outline" onClick={() => setShowUpload(false)}>
              Back to Posters
            </Button>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poster Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter poster title" {...field} />
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
                        placeholder="Enter poster description" 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Briefly describe what this poster is about
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel>Upload Poster Image</FormLabel>
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
                          alt="Poster preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Upload an image of your research poster (JPEG, PNG)
                </FormDescription>
              </FormItem>
              
              <Button type="submit" className="w-full">
                Upload Poster
              </Button>
            </form>
          </Form>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPosters;





import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileImage, Calendar, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface Registration {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

interface DashboardData {
  totalRegistrations: number;
  totalMessages: number;
  latestRegistrations: Registration[];
}

// Dashboard widget component
const DashboardWidget = ({ title, value, icon, color }: { 
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full bg-${color}/10`}>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalRegistrations: 0,
    totalMessages: 0,
    latestRegistrations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch total registrations
        const registrationsResponse = await fetch('http://localhost:5001/api/registrations');
        const registrationsData = await registrationsResponse.json();
        
        // Fetch total messages
        const messagesResponse = await fetch('http://localhost:5001/api/messages');
        const messagesData = await messagesResponse.json();

        // Get latest 5 registrations
        const latestRegistrations = registrationsData
          .sort((a: Registration, b: Registration) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 9);

        setDashboardData({
          totalRegistrations: registrationsData.length,
          totalMessages: messagesData.length,
          latestRegistrations
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardWidget
          title="Total Registrations"
          value={dashboardData.totalRegistrations}
          icon={<Users className="h-6 w-6 text-blue-500" />}
          color="blue"
        />
        <DashboardWidget
          title="Total Messages"
          value={dashboardData.totalMessages}
          icon={<MessageSquare className="h-6 w-6 text-purple-500" />}
          color="purple"
        />
        <DashboardWidget
          title="panelist"
          value="4"
          icon={<FileImage className="h-6 w-6 text-emerald-500" />}
          color="emerald"
        />
        <DashboardWidget
          title="Days to Event"
          value="10"
          icon={<Calendar className="h-6 w-6 text-amber-500" />}
          color="amber"
        />
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.latestRegistrations.map((registration) => (
                <div key={registration._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div>
                    <p className="font-medium">{registration.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      Registered {format(new Date(registration.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">New</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Latest Posters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {/* Mock poster thumbnails */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden relative">
                  <img 
                    src="/" 
                    alt={`Poster ${i}`} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                    <p className="text-xs text-white truncate">Research Poster {i}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;




import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

// Mock contestant data - in a real app this would come from an API
const initialContestants = [
  {
    id: 1,
    name: "Dr. Ahmad Al-Farabi",
    institution: "International Islamic University",
    research: "Mathematical Patterns in Quranic Verses",
    image: "/images/model.jpg"
  },
  {
    id: 2,
    name: "Prof. Sarah Rahman",
    institution: "Middle East Technical University",
    research: "Numerical Symmetry in Quranic Structure",
    image: "/images/model.jpg"
  },
  {
    id: 3,
    name: "Dr. Mohammed Hassan",
    institution: "Al-Azhar University",
    research: "Digital Roots in Quranic Sequences",
    image: "/images/model.jpg"
  },
  {
    id: 4,
    name: "Dr. Layla Kareem",
    institution: "University of Jordan",
    research: "Golden Ratio in Quranic Architecture",
    image: "/images/model.jpg"
  },
  {
    id: 5,
    name: "Prof. Ibrahim Malik",
    institution: "King Fahd University",
    research: "Prime Numbers in Quranic Revelation Order",
    image: "/images/model.jpg"
  },
  {
    id: 6,
    name: "Dr. Fatima Al-Zahra",
    institution: "Qatar Foundation",
    research: "Statistical Analysis of Word Frequency",
    image: "/images/model.jpg"
  },
];

const AdminContestants = () => {
  const [contestants, setContestants] = useState(initialContestants);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContestants = contestants.filter(contestant =>
    contestant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contestant.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contestant.research.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    // In a real app, this would be an API call
    setContestants(contestants.filter(contestant => contestant.id !== id));
    toast({
      title: "Contestant deleted",
      description: "The contestant has been removed successfully.",
    });
  };

  const handleEdit = (id: number) => {
    // In a real app, this would open a modal or navigate to an edit page
    toast({
      title: "Edit contestant",
      description: `Editing contestant with ID: ${id}`,
    });
  };

  return (
    <AdminLayout title="Manage Contestants">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search contestants..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Contestant
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContestants.map(contestant => (
          <Card key={contestant.id} className="overflow-hidden">
            <div className="aspect-square relative overflow-hidden bg-muted">
              <img 
                src={contestant.image} 
                alt={contestant.name}
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-1">{contestant.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{contestant.institution}</p>
              <p className="text-sm mb-4">{contestant.research}</p>
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(contestant.id)}>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(contestant.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredContestants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No contestants found matching your search.</p>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminContestants;
