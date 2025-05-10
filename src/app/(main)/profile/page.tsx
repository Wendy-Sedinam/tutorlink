"use client";

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit3, Mail, Briefcase, BookOpen, GraduationCap, Users, DollarSign, CalendarDays, Brain, Zap, MessageCircle } from 'lucide-react';
import React, { useState } from 'react';
import EditProfileForm from '@/components/user/edit-profile-form'; // Will create this next
import type { Student, Tutor } from '@/types';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Brain className="h-12 w-12 animate-pulse text-primary" /></div>;
  }

  if (!user) {
    return <p>User not found. Please log in.</p>;
  }

  const student = user.role === 'student' ? (user as Student) : null;
  const tutor = user.role === 'tutor' ? (user as Tutor) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/80 to-accent/80 p-8 relative">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-card shadow-lg">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="profile avatar large" />
              <AvatarFallback className="text-4xl">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <CardTitle className="text-4xl font-bold text-primary-foreground">{user.name}</CardTitle>
              <CardDescription className="text-lg text-primary-foreground/80 capitalize flex items-center justify-center md:justify-start mt-1">
                {user.role === 'student' ? <GraduationCap className="h-5 w-5 mr-2" /> : <Briefcase className="h-5 w-5 mr-2" />}
                {user.role}
              </CardDescription>
            </div>
          </div>
          {!isEditing && (
             <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)} 
                className="absolute top-6 right-6 bg-card/80 hover:bg-card text-card-foreground backdrop-blur-sm"
             >
                <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          {isEditing ? (
            <EditProfileForm user={user} onSave={() => setIsEditing(false)} onCancel={() => setIsEditing(false)} />
          ) : (
            <>
              <InfoSection title="Contact Information">
                <InfoItem icon={Mail} label="Email" value={user.email} />
              </InfoSection>

              <InfoSection title="About Me">
                <p className="text-muted-foreground whitespace-pre-wrap">{user.bio || "No bio provided."}</p>
              </InfoSection>

              {student && (
                <>
                  <InfoSection title="Student Details">
                    <InfoItem icon={BookOpen} label="Subject Interests" value={
                      student.subjectInterests && student.subjectInterests.length > 0
                        ? student.subjectInterests.map(interest => <Badge key={interest} variant="secondary" className="mr-1 mb-1">{interest}</Badge>)
                        : "Not specified"
                    } />
                    <InfoItem icon={Zap} label="Learning Preferences" value={student.learningPreferences || "Not specified"} />
                  </InfoSection>
                </>
              )}

              {tutor && (
                <>
                  <InfoSection title="Tutor Details">
                    {tutor.headline && <InfoItem icon={Users} label="Headline" value={tutor.headline} />}
                     <InfoItem icon={BookOpen} label="Subject Expertise" value={
                      tutor.subjectMatterExpertise && tutor.subjectMatterExpertise.length > 0
                        ? tutor.subjectMatterExpertise.map(subject => <Badge key={subject} variant="default" className="mr-1 mb-1 bg-primary/80 hover:bg-primary text-primary-foreground">{subject}</Badge>)
                        : "Not specified"
                    } />
                    {tutor.descriptionOfExpertise && <InfoItem icon={Zap} label="Description of Expertise" value={tutor.descriptionOfExpertise} />}
                    {tutor.teachingStyle && <InfoItem icon={MessageCircle} label="Teaching Style" value={tutor.teachingStyle} />}
                    {tutor.hourlyRate && <InfoItem icon={DollarSign} label="Hourly Rate" value={`$${tutor.hourlyRate}/hr`} />}
                    {tutor.yearsOfExperience !== undefined && <InfoItem icon={CalendarDays} label="Years of Experience" value={`${tutor.yearsOfExperience} years`} />}
                     {/* Display availability if structured */}
                  </InfoSection>
                </>
              )}
            </>
          )}
        </CardContent>
        {isEditing && (
          <CardFooter className="p-6 border-t">
            {/* Save/Cancel buttons are inside EditProfileForm */}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
}
const InfoSection = ({ title, children }: InfoSectionProps) => (
  <div className="space-y-3">
    <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-3">{title}</h3>
    {children}
  </div>
);

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}
const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
  <div className="flex items-start">
    <Icon className="h-5 w-5 text-muted-foreground mr-3 mt-1 flex-shrink-0" />
    <div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="text-muted-foreground text-sm">{value}</div>
    </div>
  </div>
);

