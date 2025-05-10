"use client";

import type { AppNotification } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNowStrict } from 'date-fns';
import { Bell, CalendarClock, CheckCircle2, Users, AlertCircle, MailCheck, Trash2, CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationListItemProps {
  notification: AppNotification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const typeIcons: { [key in AppNotification['type']]: React.ElementType } = {
  reminder: CalendarClock,
  confirmation: CheckCircle2, // General confirmation
  match_update: Users,
  generic: Bell,
  booking_request: CalendarPlus,
  booking_confirmed: CheckCircle2,
};

const typeColors: { [key in AppNotification['type']]: string } = {
  reminder: 'text-yellow-500 bg-yellow-500/10',
  confirmation: 'text-green-500 bg-green-500/10', // General confirmation
  match_update: 'text-blue-500 bg-blue-500/10',
  generic: 'text-gray-500 bg-gray-500/10',
  booking_request: 'text-blue-500 bg-blue-500/10', // Same as match_update for visual consistency
  booking_confirmed: 'text-green-500 bg-green-500/10', // Same as confirmation
}

export default function NotificationListItem({ notification, onMarkAsRead, onDelete }: NotificationListItemProps) {
  const Icon = typeIcons[notification.type] || AlertCircle;
  const colorClass = typeColors[notification.type] || typeColors.generic;

  const content = (
    <div className={cn("flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors", !notification.read && "bg-primary/5")}>
      <div className={cn("p-2 rounded-full", colorClass)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-0.5">
           <h3 className={cn("font-semibold text-foreground", !notification.read && "text-primary")}>{notification.title}</h3>
           <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNowStrict(new Date(notification.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
        <div className="flex items-center gap-2 mt-1">
          {!notification.read && (
            <Button variant="ghost" size="sm" onClick={() => onMarkAsRead(notification.id)} className="text-xs h-7 px-2 text-primary hover:bg-primary/10">
              <MailCheck className="mr-1 h-3 w-3" /> Mark as Read
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onDelete(notification.id)} className="text-xs h-7 px-2 text-destructive hover:bg-destructive/10">
             <Trash2 className="mr-1 h-3 w-3" /> Delete
          </Button>
        </div>
      </div>
      {!notification.read && (
        <div className="w-2.5 h-2.5 bg-accent rounded-full self-center shrink-0" aria-label="Unread notification"></div>
      )}
    </div>
  );

  return (
    <li className={cn(!notification.read && "font-semibold")}>
      {notification.link ? (
        <Link href={notification.link} className="block">
          {content}
        </Link>
      ) : (
        content
      )}
    </li>
  );
}
