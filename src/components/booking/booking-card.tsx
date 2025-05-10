"use client";

import type { Booking } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, User, BookOpen, Video, Edit, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { format, formatDistanceToNowStrict } from 'date-fns';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { mockBookings } from '@/lib/mock-data'; // for cancel action
import { useState } from 'react';

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


export default function BookingCard({ booking, currentUserRole }: BookingCardProps) {
  const { toast } = useToast();
  // Local state to reflect changes immediately, though mockBookings is mutated directly for demo.
  const [currentBookingStatus, setCurrentBookingStatus] = useState(booking.status);


  const handleCancelBooking = () => {
    // In a real app, this would be an API call.
    const bookingIndex = mockBookings.findIndex(b => b.id === booking.id);
    if (bookingIndex !== -1) {
      mockBookings[bookingIndex].status = 'cancelled';
      setCurrentBookingStatus('cancelled'); // Update local state for UI
      toast({
        title: 'Booking Cancelled',
        description: `Your session for ${booking.subject} has been cancelled.`,
        variant: 'destructive'
      });
    }
  };
  
  const otherPartyName = currentUserRole === 'student' ? booking.tutorName : booking.studentName;
  const otherPartyRole = currentUserRole === 'student' ? 'Tutor' : 'Student';
  const otherPartyId = currentUserRole === 'student' ? booking.tutorId : booking.studentId;

  const bookingDate = new Date(booking.dateTime);
  const isPast = bookingDate < new Date();
  const StatusIcon = statusIcons[currentBookingStatus];


  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card" id={booking.id}>
      <CardHeader className="pb-4 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-semibold text-primary">{booking.subject}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              With <Link href={`/${otherPartyRole.toLowerCase()}s/${otherPartyId}`} className="text-accent hover:underline font-medium">{otherPartyName}</Link> ({otherPartyRole})
            </CardDescription>
          </div>
          <Badge className={`${statusStyles[currentBookingStatus]} text-xs font-semibold`}>
             <StatusIcon className="h-3 w-3 mr-1.5" />{currentBookingStatus.charAt(0).toUpperCase() + currentBookingStatus.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="py-4 space-y-3 flex-grow">
        <div className="flex items-center text-sm">
          <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="font-medium text-foreground mr-1">Date:</span> {format(bookingDate, "EEE, MMM d, yyyy")}
        </div>
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="font-medium text-foreground mr-1">Time:</span> {format(bookingDate, "p")} ({booking.durationMinutes} mins)
        </div>
        {!isPast && currentBookingStatus === 'confirmed' && booking.meetingLink && (
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
        <div className="flex gap-2">
          {(currentBookingStatus === 'pending' || currentBookingStatus === 'confirmed') && !isPast && (
            <>
              {/* <Button variant="outline" size="sm" disabled> <Edit className="h-3 w-3 mr-1.5" /> Reschedule</Button> */}
              <Button variant="destructive" size="sm" onClick={handleCancelBooking} className="bg-red-600 hover:bg-red-700">
                <XCircle className="h-3 w-3 mr-1.5" /> Cancel
              </Button>
            </>
          )}
          {currentBookingStatus === 'confirmed' && !isPast && !booking.meetingLink && currentUserRole === 'tutor' && (
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Feature not implemented", description: "Adding meeting link."})}>
                Add Meeting Link
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
