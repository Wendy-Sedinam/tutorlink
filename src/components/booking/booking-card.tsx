
"use client";

import type { Booking, AppNotification } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, BookOpen, Video, XCircle, CheckCircle, AlertCircle, Check, LinkIcon } from 'lucide-react';
import { format, formatDistanceToNowStrict } from 'date-fns';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { mockBookings, mockNotifications } from '@/lib/mock-data'; 
import { useState } from 'react';
import AddMeetingLinkDialog from './add-meeting-link-dialog';

interface BookingCardProps {
  booking: Booking;
  currentUserRole: 'student' | 'tutor';
}

const statusStyles: { [key in Booking['status']]: string } = {
  pending: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  confirmed: 'bg-green-500 hover:bg-green-600 text-white',
  cancelled: 'bg-red-500 hover:bg-red-600 text-white',
  completed: 'bg-blue-500 hover:bg-blue-600 text-white',
};

const statusIcons: { [key in Booking['status']]: React.ElementType } = {
  pending: AlertCircle,
  confirmed: CheckCircle,
  cancelled: XCircle,
  completed: CheckCircle,
};


export default function BookingCard({ booking: initialBooking, currentUserRole }: BookingCardProps) {
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking>(initialBooking);
  const [isAddLinkDialogOpen, setIsAddLinkDialogOpen] = useState(false);

  // Update local booking state if initialBooking prop changes
  useState(() => {
    setBooking(initialBooking);
  }, [initialBooking]);


  const handleCancelBooking = () => {
    const bookingIndex = mockBookings.findIndex(b => b.id === booking.id);
    if (bookingIndex !== -1) {
      mockBookings[bookingIndex].status = 'cancelled';
      setBooking(prev => ({...prev, status: 'cancelled'})); 
      toast({
        title: 'Booking Cancelled',
        description: `Your session for "${booking.reasonForSession}" has been cancelled.`,
        variant: 'destructive'
      });
    }
  };

  const handleConfirmBooking = () => {
    const bookingIndex = mockBookings.findIndex(b => b.id === booking.id);
    if (bookingIndex !== -1 && booking.status === 'pending') {
      mockBookings[bookingIndex].status = 'confirmed';
      setBooking(prev => ({...prev, status: 'confirmed'}));

      const studentNotification: AppNotification = {
        id: `notif-student-${Date.now()}`,
        userId: booking.studentId,
        title: "Session Confirmed!",
        message: `Your session for "${booking.reasonForSession}" with ${booking.tutorName} on ${format(new Date(booking.dateTime), "MMM d, yyyy 'at' p")} has been confirmed.`,
        type: 'booking_confirmed',
        createdAt: new Date().toISOString(),
        read: false,
        link: `/bookings#${booking.id}`,
      };
      mockNotifications.push(studentNotification);
      
      toast({
        title: 'Booking Confirmed',
        description: `Session for "${booking.reasonForSession}" confirmed. Student ${booking.studentName} will be notified.`,
        variant: 'default'
      });
    }
  };

  const handleSaveMeetingLink = async (link: string) => {
    const bookingIndex = mockBookings.findIndex(b => b.id === booking.id);
    if (bookingIndex !== -1) {
      mockBookings[bookingIndex].meetingLink = link;
      setBooking(prev => ({...prev, meetingLink: link}));
      toast({
        title: "Meeting Link Saved",
        description: "The meeting link has been updated for this session.",
      });
      // Notification to student about meeting link update could be added here
      const studentNotification: AppNotification = {
        id: `notif-link-${Date.now()}`,
        userId: booking.studentId,
        title: "Session Link Updated",
        message: `The meeting link for your session "${booking.reasonForSession}" with ${booking.tutorName} has been updated.`,
        type: 'confirmation',
        createdAt: new Date().toISOString(),
        read: false,
        link: `/bookings#${booking.id}`,
      };
      mockNotifications.push(studentNotification);
    }
  };
  
  const otherPartyName = currentUserRole === 'student' ? booking.tutorName : booking.studentName;
  const otherPartyRole = currentUserRole === 'student' ? 'Tutor' : 'Student';
  const otherPartyId = currentUserRole === 'student' ? booking.tutorId : booking.studentId;

  const bookingDate = new Date(booking.dateTime);
  const isPast = bookingDate < new Date();
  const StatusIcon = statusIcons[booking.status];


  return (
    <>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card" id={booking.id}>
        <CardHeader className="pb-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-semibold text-primary">{booking.reasonForSession}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                With <Link href={`/${otherPartyRole.toLowerCase()}s/${otherPartyId}`} className="text-accent hover:underline font-medium">{otherPartyName}</Link> ({otherPartyRole})
              </CardDescription>
            </div>
            <Badge className={`${statusStyles[booking.status]} text-xs font-semibold`}>
              <StatusIcon className="h-3 w-3 mr-1.5" />{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="py-4 space-y-3 flex-grow">
          <div className="flex items-center text-sm">
            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium text-foreground mr-1">Reason:</span> {booking.reasonForSession}
          </div>
          <div className="flex items-center text-sm">
            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium text-foreground mr-1">Date:</span> {format(bookingDate, "EEE, MMM d, yyyy")}
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium text-foreground mr-1">Time:</span> {format(bookingDate, "p")} ({booking.durationMinutes} mins)
          </div>
          {!isPast && booking.status === 'confirmed' && booking.meetingLink && (
            <div className="flex items-center text-sm">
              <Video className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="font-medium text-foreground mr-1">Meeting:</span> 
              <Button variant="link" asChild className="p-0 h-auto text-accent">
                <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer">Join Session</a>
              </Button>
            </div>
          )}
          {booking.notes && (
            <div className="text-sm">
              <p className="font-medium text-foreground">Notes:</p>
              <p className="text-muted-foreground bg-muted/30 p-2 rounded-md text-xs">{booking.notes}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-muted-foreground">
            {isPast ? 'Session was' : 'Session is'} {formatDistanceToNowStrict(bookingDate, { addSuffix: true })}
          </p>
          <div className="flex gap-2 flex-wrap justify-end">
            {currentUserRole === 'tutor' && booking.status === 'pending' && !isPast && (
              <Button variant="default" size="sm" onClick={handleConfirmBooking} className="bg-green-600 hover:bg-green-700 text-white">
                <Check className="h-3 w-3 mr-1.5" /> Confirm
              </Button>
            )}
            {(booking.status === 'pending' || booking.status === 'confirmed') && !isPast && (
              <>
                <Button variant="destructive" size="sm" onClick={handleCancelBooking} className="bg-red-600 hover:bg-red-700">
                  <XCircle className="h-3 w-3 mr-1.5" /> Cancel
                </Button>
              </>
            )}
            {currentUserRole === 'tutor' && booking.status === 'confirmed' && !isPast && (
              <Button variant="outline" size="sm" onClick={() => setIsAddLinkDialogOpen(true)}>
                  <LinkIcon className="h-3 w-3 mr-1.5" /> {booking.meetingLink ? "Edit Link" : "Add Link"}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      {currentUserRole === 'tutor' && (
        <AddMeetingLinkDialog
          isOpen={isAddLinkDialogOpen}
          onClose={() => setIsAddLinkDialogOpen(false)}
          onSave={handleSaveMeetingLink}
          bookingId={booking.id}
          currentLink={booking.meetingLink}
        />
      )}
    </>
  );
}
