
"use client";

import { useAuth } from '@/hooks/use-auth';
import { mockNotifications } from '@/lib/mock-data';
import type { AppNotification } from '@/types';
import NotificationListItem from '@/components/notification/notification-list-item';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (user) {
      const updatedNotifications = mockNotifications
        .filter(n => n.userId === user.id)
        .map(n => {
          if (!n.read) {
            // Update mockNotifications directly for persistence during session
            const mockIndex = mockNotifications.findIndex(mockN => mockN.id === n.id);
            if (mockIndex !== -1) {
              mockNotifications[mockIndex].read = true;
            }
            return { ...n, read: true }; // Return the updated notification for local state
          }
          return n;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotifications(updatedNotifications);
    }
  }, [user]);
  
  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    // In real app, also update mockNotifications or backend
    const mockIndex = mockNotifications.findIndex(n => n.id === notificationId);
    if (mockIndex !== -1) mockNotifications.splice(mockIndex, 1);
  };


  if (!user) {
    return <p className="text-center py-10">Please log in to view your notifications.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Notifications</h1>
          <p className="text-lg text-gray-600">Stay updated with important alerts and messages.</p>
        </div>
      </div>

      {notifications.length > 0 ? (
        <Card className="shadow-md">
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {notifications.map(notification => (
                <NotificationListItem 
                  key={notification.id} 
                  notification={notification} 
                  onDelete={handleDeleteNotification}
                />
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Card className="py-16 text-center shadow-sm">
          <CardHeader>
             <BellRing className="mx-auto h-20 w-20 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl">No Notifications Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg">
              Important updates and reminders will appear here.
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

