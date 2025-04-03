import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Reply } from "lucide-react";

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

interface MessageDetailsOverlayProps {
  message: Message | null;
  isOpen: boolean;
  onClose: () => void;
}

const MessageDetailsOverlay: React.FC<MessageDetailsOverlayProps> = ({
  message,
  isOpen,
  onClose,
}) => {
  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Message Details</DialogTitle>
            <Badge variant={message.read ? "secondary" : "destructive"}>
              {message.read ? "Read" : "Unread"}
            </Badge>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(85vh-8rem)] pr-4">
          <div className="space-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">From</h3>
                <div>
                  <p className="font-medium">{message.name}</p>
                  <p className="text-sm text-muted-foreground">{message.email}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Received</h3>
                <p className="text-sm">{format(new Date(message.createdAt), 'PPpp')}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Message</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{message.message}</p>
              </div>
            </div>

            {message.reply ? (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Your Reply</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{message.reply}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Replied on {format(new Date(message.repliedAt!), 'PPpp')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-end pt-4 border-t">
                <Button className="flex items-center gap-2">
                  <Reply className="h-4 w-4" />
                  Reply to Message
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDetailsOverlay; 