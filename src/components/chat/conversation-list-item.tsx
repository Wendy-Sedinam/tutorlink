
"use client";

import type { Conversation } from '@/types';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface ConversationListItemProps {
  conversation: Conversation;
}

export default function ConversationListItem({ conversation }: ConversationListItemProps) {
  const lastMessageText = conversation.lastMessage?.text || "No messages yet.";
  const lastMessageTimestamp = conversation.lastMessage?.timestamp 
    ? formatDistanceToNowStrict(parseISO(conversation.lastMessage.timestamp), { addSuffix: true })
    : "";

  return (
    <Link href={`/messages/${conversation.chatId}`} className="block hover:bg-muted/50 transition-colors rounded-lg">
      <div className="flex items-center p-4 space-x-4">
        <Avatar className="h-12 w-12 border-2 border-primary">
          <AvatarImage src={conversation.otherUserAvatar} alt={conversation.otherUserName} data-ai-hint="user avatar" />
          <AvatarFallback>{conversation.otherUserName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <p className="text-md font-semibold text-foreground truncate">
              {conversation.otherUserName}
              <span className="text-xs text-muted-foreground ml-2 capitalize">({conversation.otherUserRole})</span>
            </p>
            {lastMessageTimestamp && (
              <p className="text-xs text-muted-foreground whitespace-nowrap">{lastMessageTimestamp}</p>
            )}
          </div>
          <div className="flex justify-between items-center mt-1">
            <p className={cn("text-sm text-muted-foreground truncate", conversation.unreadCount > 0 && "font-bold text-primary")}>
              {conversation.lastMessage?.senderId === conversation.otherUserId ? "" : "You: "}
              {lastMessageText}
            </p>
            {conversation.unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs px-2 py-0.5">{conversation.unreadCount}</Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
