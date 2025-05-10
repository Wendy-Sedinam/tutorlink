"use client";

import { useAuth } from '@/hooks/use-auth';
import { mockBookings, mockStudents, mockTutors } from '@/lib/mock-data';
import type { Student, Tutor } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Users, BookOpen, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

interface StudentDisplayInfo extends Student {
  lastBookingReasonForSession?: string; // Changed from lastBookingSubject
  lastBookingDate?: string;
}

export default function ManageStudentsPage() {
  const { user } = useAuth();

  if (!user || user.role !== 'tutor') {
    return <p className="text-center py-10">Access denied. This page is for tutors only.</p>;
  }

  const currentTutor = mockTutors.find(t => t.id === user.id);
  let students: StudentDisplayInfo[] = [];

  if (currentTutor && currentTutor.assignedStudentIds) {
    students = currentTutor.assignedStudentIds.map(studentId => {
      const studentDetails = mockStudents.find(s => s.id === studentId);
      if (!studentDetails) return null;

      // Find last booking specifically with this tutor
      const studentBookingsWithThisTutor = mockBookings
          .filter(b => b.studentId === studentId && b.tutorId === user.id)
          .sort((a,b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
      
      const lastBooking = studentBookingsWithThisTutor[0];

      return {
        ...studentDetails,
        lastBookingReasonForSession: lastBooking?.reasonForSession, // Changed from lastBooking?.subject
        lastBookingDate: lastBooking ? new Date(lastBooking.dateTime).toLocaleDateString() : undefined,
      };
    }).filter(Boolean) as StudentDisplayInfo[];
  }


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Students</h1>
        <p className="text-lg text-gray-600">View students who have been assigned to you.</p>
      </div>

      {students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map(student => (
            <StudentInfoCard key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16 shadow-sm">
          <CardHeader>
            <Users className="mx-auto h-20 w-20 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl">No Students Assigned Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg">
              Newly signed up students will be automatically assigned and will appear here.
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface StudentInfoCardProps {
  student: StudentDisplayInfo;
}

function StudentInfoCard({ student }: StudentInfoCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src={student.avatarUrl} alt={student.name} data-ai-hint="student avatar" />
            <AvatarFallback>{student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-semibold text-primary">{student.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" /> {student.email}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-4 space-y-3 flex-grow">
        {student.subjectInterests && student.subjectInterests.length > 0 && (
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1 flex items-center"><BookOpen className="h-4 w-4 mr-2 text-accent" />Interests:</p>
            <div className="flex flex-wrap gap-1">
              {student.subjectInterests.slice(0,4).map(interest => (
                <Badge key={interest} variant="secondary">{interest}</Badge>
              ))}
              {student.subjectInterests.length > 4 && <Badge variant="outline">+{student.subjectInterests.length - 4} more</Badge>}
            </div>
          </div>
        )}
         {student.lastBookingReasonForSession && student.lastBookingDate && ( // Changed from student.lastBookingSubject
          <div className="text-sm">
             <p className="font-medium text-foreground mb-1 flex items-center"><CalendarCheck className="h-4 w-4 mr-2 text-accent" />Last Session (with you):</p>
            <p className="text-muted-foreground">{student.lastBookingReasonForSession} on {student.lastBookingDate}</p>
          </div>
        )}
         {!student.lastBookingDate && (
             <div className="text-sm">
                <p className="font-medium text-foreground mb-1 flex items-center"><CalendarCheck className="h-4 w-4 mr-2 text-muted-foreground" />Last Session (with you):</p>
                <p className="text-muted-foreground">No booking history yet.</p>
            </div>
         )}
        {student.bio && (
             <div className="text-sm">
                <p className="font-medium text-foreground mb-1">Bio:</p>
                <p className="text-muted-foreground text-xs italic truncate">{student.bio}</p>
             </div>
        )}
      </CardContent>
      {/* Potential future actions:
      <CardFooter className="border-t pt-4">
        <Button variant="outline" size="sm" asChild>
           View Chat / Send Message (Not Implemented)
        </Button>
      </CardFooter> */}
    </Card>
  );
}
