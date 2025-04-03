import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare, Trash2, Reply } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import MessageDetailsOverlay from '@/components/MessageDetailsOverlay';
import { toast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  reply: string | null;
  repliedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch messages. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    setIsOverlayOpen(true);

    if (!message.read) {
      try {
        const response = await fetch(`http://localhost:5001/api/messages/${message._id}/read`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ read: true })
        });
        
        if (response.ok) {
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg._id === message._id ? { ...msg, read: true } : msg
            )
          );
          setSelectedMessage(prev => prev ? { ...prev, read: true } : prev);
          toast({
            title: "Message marked as read",
            description: "The message has been marked as read successfully.",
          });
        } else {
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg._id === message._id ? { ...msg, read: false } : msg
            )
          );
          setSelectedMessage(prev => prev ? { ...prev, read: false } : prev);
          
          throw new Error('Failed to mark message as read');
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to mark message as read. Please try again.",
        });
      }
    }
  };

  const handleDeleteClick = (message: Message) => {
    setMessageToDelete(message);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) return;

    try {
      const response = await fetch(`http://localhost:5001/api/messages/${messageToDelete._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter(m => m._id !== messageToDelete._id));
        toast({
          title: "Success",
          description: "Message deleted successfully",
        });
      } else {
        throw new Error('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
    }
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedMessage(null);
  };

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.read).length;

  if (isLoading) {
    return (
      <AdminLayout title="Messages">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Messages">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-x-2">
            <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">
              Unread: {unreadCount}
            </Badge>
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
              Total: {messages.length}
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">Message</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((message) => (
                    <TableRow
                      key={message._id}
                      onClick={() => handleViewMessage(message)}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        !message.read 
                          ? 'bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/50 dark:hover:bg-blue-950/30' 
                          : ''
                      }`}
                    >
                      <TableCell>
                        <div 
                          className={`h-2.5 w-2.5 rounded-full transition-colors duration-200 ${
                            message.read 
                              ? 'bg-gray-300 dark:bg-gray-600' 
                              : 'bg-seminar-blue animate-pulse'
                          }`}
                        ></div>
                      </TableCell>
                      <TableCell className="font-medium">{message.name}</TableCell>
                      <TableCell>{message.email}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">
                        {message.message}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(new Date(message.createdAt), 'yyyy-MM-dd')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="icon" variant="ghost">
                            <Reply className="h-4 w-4" />
                            <span className="sr-only">Reply</span>
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(message);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <MessageDetailsOverlay
        message={selectedMessage}
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminMessages;
