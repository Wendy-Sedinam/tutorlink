
"use client";

import type { ChatMessage, User, AppNotification } from '@/types';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { mockChatMessages, getMockUserById, mockNotifications, generateChatId } from '@/lib/mock-data';
import ChatMessageItem from './chat-message-item';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

interface ChatInterfaceProps {
  chatId: string;
  initialOtherUserId: string; // Pass otherUserId to avoid re-deriving if currentUser is not loaded yet
}

export default function ChatInterface({ chatId, initialOtherUserId }: ChatInterfaceProps) {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
      const userDetails = getMockUserById(initialOtherUserId);
      if (userDetails) {
        setOtherUser(userDetails);
      }

      const loadedMessages = mockChatMessages
        .filter(msg => msg.chatId === chatId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setMessages(loadedMessages);
      
      // Mark messages as read
      mockChatMessages.forEach(msg => {
        if (msg.chatId === chatId && msg.receiverId === currentUser.id && !msg.read) {
          msg.read = true;
        }
      });

      setIsLoading(false);
    }
  }, [chatId, currentUser, initialOtherUserId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);


  const handleSendMessage = () => {
    if (!newMessageText.trim() || !currentUser || !otherUser) return;

    const newMsg: ChatMessage = {
      id: `msg${Date.now()}`,
      chatId: chatId,
      senderId: currentUser.id,
      receiverId: otherUser.id,
      text: newMessageText.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    mockChatMessages.push(newMsg);
    setMessages(prev => [...prev, newMsg]);
    setNewMessageText("");

    // Create notification for the receiver
    const notification: AppNotification = {
      id: `notif-chat-${Date.now()}`,
      userId: otherUser.id,
      title: `New message from ${currentUser.name}`,
      message: newMsg.text.substring(0, 50) + (newMsg.text.length > 50 ? "..." : ""),
      type: 'generic', // Or a new 'chat_message' type
      createdAt: new Date().toISOString(),
      read: false,
      link: `/messages/${chatId}`,
    };
    mockNotifications.push(notification);
  };

  if (isLoading || !currentUser || !otherUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    );
  }
  
  return (
    <Card className="h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] flex flex-col shadow-xl">
      <CardHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} data-ai-hint="chat partner avatar" />
            <AvatarFallback>{otherUser.name.substring(0,1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg text-foreground">{otherUser.name}</CardTitle>
            <p className="text-xs text-muted-foreground capitalize">{otherUser.role}</p>
          </div>
        </div>
      </CardHeader>
      <ScrollArea className="flex-grow p-4 bg-muted/10" ref={scrollAreaRef}>
        <CardContent className="space-y-1 p-0">
          {messages.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              No messages yet. Start the conversation!
            </div>
          )}
          {messages.map(msg => (
            <ChatMessageItem
              key={msg.id}
              message={msg}
              isCurrentUserSender={msg.senderId === currentUser.id}
              senderAvatarUrl={msg.senderId === currentUser.id ? currentUser.avatarUrl : otherUser.avatarUrl}
              senderName={msg.senderId === currentUser.id ? currentUser.name : otherUser.name}
            />
          ))}
        </CardContent>
      </ScrollArea>
      <CardFooter className="p-4 border-t">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="flex items-center w-full gap-2"
        >
          <Textarea
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
            placeholder={`Message ${otherUser.name}...`}
            className="flex-grow resize-none min-h-[40px] max-h-[120px]"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={!newMessageText.trim()}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
