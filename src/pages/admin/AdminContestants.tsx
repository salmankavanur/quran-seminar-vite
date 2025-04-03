import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  const [selectedContestant, setSelectedContestant] = useState<typeof initialContestants[0] | null>(null);

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

  const handleView = (contestant: typeof initialContestants[0]) => {
    setSelectedContestant(contestant);
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
          <Card 
            key={contestant.id} 
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => handleView(contestant)}
          >
            <div className="aspect-square relative overflow-hidden bg-muted">
              <img 
                src={contestant.image} 
                alt={contestant.name}
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-1">{contestant.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{contestant.institution}</p>
              <p className="text-sm mb-4">{contestant.research}</p>
              <div className="flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(contestant.id);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(contestant.id);
                  }}
                >
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

      <Dialog open={!!selectedContestant} onOpenChange={() => setSelectedContestant(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedContestant?.name}</DialogTitle>
            <DialogDescription>
              {selectedContestant?.institution}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <img 
                src={selectedContestant?.image} 
                alt={selectedContestant?.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Research Topic</h3>
                <p className="text-muted-foreground">{selectedContestant?.research}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminContestants;
