"use client";

import { useAuth } from '@/hooks/use-auth';
import { mockBookings } from '@/lib/mock-data';
import type { Booking } from '@/types';
import BookingCard from '@/components/booking/booking-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarClock, CheckCircle2, History, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export default function BookingsPage() {
  const { user } = useAuth();

  if (!user) {
    // This should ideally be handled by the layout, but as a fallback:
    return <p className="text-center py-10">Please log in to view your bookings.</p>;
  }

  const userBookings = mockBookings.filter(
    booking => booking.studentId === user.id || booking.tutorId === user.id
  );

  const upcomingBookings = userBookings
    .filter(b => new Date(b.dateTime) >= new Date() && (b.status === 'confirmed' || b.status === 'pending'))
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const pastBookings = userBookings
    .filter(b => new Date(b.dateTime) < new Date() || b.status === 'completed' || b.status === 'cancelled')
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Bookings</h1>
        <p className="text-lg text-muted-foreground">Manage your scheduled sessions and view your booking history.</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
          <TabsTrigger value="upcoming" className="text-base py-2.5">
            <CalendarClock className="mr-2 h-5 w-5"/> Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="text-base py-2.5">
            <History className="mr-2 h-5 w-5"/> Past ({pastBookings.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} currentUserRole={user.role} />
              ))}
            </div>
          ) : (
            <Card className="py-12 text-center shadow-sm">
              <CardHeader>
                <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <CardTitle className="text-2xl">No Upcoming Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  You have no sessions scheduled. Time to book one?
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="past" className="mt-6">
          {pastBookings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pastBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} currentUserRole={user.role} />
              ))}
            </div>
          ) : (
             <Card className="py-12 text-center shadow-sm">
               <CardHeader>
                <AlertTriangle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <CardTitle className="text-2xl">No Past Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Your booking history will appear here once you've had sessions.
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
