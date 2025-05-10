
"use client";

import type { ChatMessage } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { cn } from '@/lib/utils';

interface ChatMessageItemProps {
  message: ChatMessage;
  isCurrentUserSender: boolean;
  senderAvatarUrl?: string;
  senderName: string;
}

function formatTimestamp(isoTimestamp: string): string {
  const date = parseISO(isoTimestamp);
  if (isToday(date)) {
    return format(date, 'p'); // e.g., 2:30 PM
  }
  if (isYesterday(date)) {
    return `Yesterday ${format(date, 'p')}`; // e.g., Yesterday 2:30 PM
  }
  return format(date, 'MMM d, p'); // e.g., Mar 10, 2:30 PM
}

export default function ChatMessageItem({ message, isCurrentUserSender, senderAvatarUrl, senderName }: ChatMessageItemProps) {
  return (
    <div className={cn("flex items-end gap-2.5 my-2", isCurrentUserSender ? "justify-end" : "justify-start")}>
      {!isCurrentUserSender && (
        <Avatar className="h-8 w-8 self-start border">
          <AvatarImage src={senderAvatarUrl} alt={senderName} data-ai-hint="chat avatar" />
          <AvatarFallback>{senderName.substring(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      <div 
        className={cn(
          "max-w-[70%] p-3 rounded-xl shadow-md",
          isCurrentUserSender 
            ? "bg-primary text-primary-foreground rounded-br-none" 
            : "bg-card text-card-foreground rounded-bl-none border"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
        <p className={cn(
            "text-xs mt-1",
            isCurrentUserSender ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-left"
          )}>
          {formatTimestamp(message.timestamp)}
        </p>
      </div>
       {isCurrentUserSender && (
        <Avatar className="h-8 w-8 self-start border">
          <AvatarImage src={senderAvatarUrl} alt={senderName} data-ai-hint="chat avatar current" />
          <AvatarFallback>{senderName.substring(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
