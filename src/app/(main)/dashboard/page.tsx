"use client";

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BookOpen, CalendarCheck, Users, Bell } from 'lucide-react';
import { mockBookings, mockNotifications } from '@/lib/mock-data';
import Image from 'next/image';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null; // Should be handled by layout, but good practice

  const upcomingBookings = mockBookings.filter(b => (b.studentId === user.id || b.tutorId === user.id) && new Date(b.dateTime) > new Date() && b.status === 'confirmed').slice(0, 2);
  const unreadNotificationsCount = mockNotifications.filter(n => n.userId === user.id && !n.read).length;

  return (
    <div className="space-y-8">
      <Card className="bg-card shadow-xl border-primary/20 border">
        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
          <Image 
            src={user.avatarUrl || `https://picsum.photos/seed/${user.id}/120/120`} 
            alt={user.name} 
            width={120} 
            height={120} 
            className="rounded-full border-4 border-primary/50 shadow-md"
            data-ai-hint="profile avatar"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Welcome back, {user.name.split(' ')[0]}!</h1>
            <p className="text-lg text-muted-foreground mt-2">
              {user.role === 'student' 
                ? "Ready to learn something new today? Let's find your next session." 
                : "Ready to inspire your students? Manage your schedule and requests here."}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title={user.role === 'student' ? "Find a Tutor" : "Manage Students"}
          description={user.role === 'student' ? "Browse experts and get matched." : "View your student list and requests."}
          icon={Users}
          link={user.role === 'student' ? "/tutors" : "/manage/students"} // Placeholder link for tutors
          linkLabel={user.role === 'student' ? "Browse Tutors" : "View Students"}
          color="primary"
        />
        <DashboardCard
          title="My Bookings"
          description={`You have ${upcomingBookings.length} upcoming session(s).`}
          icon={CalendarCheck}
          link="/bookings"
          linkLabel="View Bookings"
          color="accent"
        />
        <DashboardCard
          title="Notifications"
          description={unreadNotificationsCount > 0 ? `You have ${unreadNotificationsCount} unread notification(s).` : "No new notifications."}
          icon={Bell}
          link="/notifications"
          linkLabel="Check Notifications"
          color="secondary"
          badgeCount={unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined}
        />
      </div>

      {upcomingBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Here are your next couple of scheduled sessions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingBookings.map(booking => (
              <div key={booking.id} className="p-4 border rounded-lg flex justify-between items-center bg-background hover:bg-muted/30 transition-colors">
                <div>
                  <h3 className="font-semibold text-foreground">{booking.subject}</h3>
                  <p className="text-sm text-muted-foreground">
                    With {user.role === 'student' ? booking.tutorName : booking.studentName} on {new Date(booking.dateTime).toLocaleDateString()} at {new Date(booking.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/bookings#${booking.id}`}>View Details</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {user.role === 'student' && (
         <Card className="mt-6">
          <CardHeader>
            <CardTitle>Explore Subjects</CardTitle>
            <CardDescription>Discover tutors in subjects you're interested in.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(user as any).subjectInterests?.map((interest: string) => (
              <Button variant="outline" className="justify-start" asChild key={interest}>
                <Link href={`/tutors?subject=${encodeURIComponent(interest)}`}>
                  <BookOpen className="mr-2 h-4 w-4 text-primary" />
                  {interest}
                </Link>
              </Button>
            )) || <p className="text-muted-foreground col-span-full">Add subject interests to your profile to see suggestions here.</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  link: string;
  linkLabel: string;
  color: 'primary' | 'accent' | 'secondary';
  badgeCount?: number;
}

function DashboardCard({ title, description, icon: Icon, link, linkLabel, color, badgeCount }: DashboardCardProps) {
  const colorClasses = {
    primary: "border-primary/30 hover:border-primary/50 text-primary",
    accent: "border-accent/30 hover:border-accent/50 text-accent",
    secondary: "border-secondary/30 hover:border-secondary/50 text-secondary-foreground",
  }
  const buttonColorClasses = {
    primary: "bg-primary hover:bg-primary/90 text-primary-foreground",
    accent: "bg-accent hover:bg-accent/90 text-accent-foreground",
    secondary: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
  }

  return (
    <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 border ${colorClasses[color]}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <div className={`p-2 rounded-full bg-${color}/10`}>
          <Icon className={`h-6 w-6 text-${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button asChild className={`${buttonColorClasses[color]} w-full relative`}>
          <Link href={link}>
            {linkLabel} <ArrowRight className="ml-2 h-4 w-4" />
            {badgeCount && badgeCount > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {badgeCount}
              </span>
            )}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
