
"use client";

import { useParams } from 'next/navigation';
import { mockTutors, getMockUserById, generateChatId, mockChatMessages } from '@/lib/mock-data';
import type { Tutor, Student, CompatibilityScoreInfo } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MessageCircle, BookOpen, CalendarDays, Users, Zap, Loader2, Brain, Handshake, MessageSquare } from 'lucide-react'; 
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import BookingForm from '@/components/booking/booking-form';
import { useAuth } from '@/hooks/use-auth';
import { generateCompatibilityScore } from '@/ai/flows/generate-compatibility-score';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


export default function TutorProfilePage() {
  const params = useParams();
  const tutorId = params.tutorId as string;
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const [compatibility, setCompatibility] = useState<CompatibilityScoreInfo | null>(null);
  const [isLoadingCompatibility, setIsLoadingCompatibility] = useState(false);
  const [canChat, setCanChat] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    const foundTutor = getMockUserById(tutorId) as Tutor | undefined;
    if (foundTutor && foundTutor.role === 'tutor') {
      setTutor(foundTutor);
    }
    setIsLoading(false);
  }, [tutorId]);

  useEffect(() => {
    const fetchCompatibility = async () => {
      if (tutor && currentUser && currentUser.role === 'student' && (currentUser as Student).learningPreferences && (currentUser as Student).subjectInterests) {
        setIsLoadingCompatibility(true);
        try {
          const studentData = currentUser as Student;
          const scoreData = await generateCompatibilityScore({
            studentLearningPreferences: studentData.learningPreferences || "general learner",
            studentSubjectInterests: studentData.subjectInterests?.join(', ') || "various subjects",
            tutorSubjectMatterExpertise: tutor.subjectMatterExpertise?.join(', ') || "general subjects",
            tutorTeachingStyle: tutor.teachingStyle || "flexible",
          });
          setCompatibility({ score: scoreData.compatibilityScore, justification: scoreData.justification });
        } catch (error) {
          console.error("Failed to generate compatibility score:", error);
        } finally {
          setIsLoadingCompatibility(false);
        }
      }
    };

    if (tutor && currentUser?.role === 'student') {
      fetchCompatibility();
      const currentChatId = generateChatId(currentUser.id, tutor.id);
      setChatId(currentChatId);
      // Enable chat if student is assigned to this tutor or has prior chat history.
      // For mock, assignment check is simplified. A more robust check might be needed.
      const isAssigned = tutor.assignedStudentIds?.includes(currentUser.id);
      const hasChatHistory = mockChatMessages.some(msg => msg.chatId === currentChatId);
      setCanChat(!!isAssigned || hasChatHistory);
    } else {
      setCanChat(false);
      setChatId(null);
    }
  }, [tutor, currentUser]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Brain className="h-16 w-16 animate-pulse text-primary" /> <p className="ml-4 text-lg text-muted-foreground">Loading tutor profile...</p></div>;
  }

  if (!tutor) {
    return (
      <div className="text-center py-12">
        <Users className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-destructive">Tutor Not Found</h2>
        <p className="text-muted-foreground mt-2">The tutor you are looking for does not exist or the link is incorrect.</p>
        <Button asChild className="mt-6">
          <Link href="/tutors">Back to Tutors</Link>
        </Button>
      </div>
    );
  }
  
  const providesCounseling = tutor.subjectMatterExpertise?.includes('Counseling');

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Tutor Info & Booking */}
        <div className="md:col-span-2 space-y-8">
          <Card className="shadow-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/80 to-accent/80 p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-32 w-32 border-4 border-card shadow-lg">
                  <AvatarImage src={tutor.avatarUrl} alt={tutor.name} data-ai-hint="tutor avatar large" />
                  <AvatarFallback className="text-4xl">{tutor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <CardTitle className="text-4xl font-bold text-primary-foreground">{tutor.name}</CardTitle>
                  <CardDescription className="text-lg text-primary-foreground/90 mt-1">{tutor.headline}</CardDescription>
                  {tutor.overallRating && tutor.reviewsCount && (
                    <div className="flex items-center gap-1 mt-2 text-primary-foreground/90 justify-center sm:justify-start">
                      <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
                      <span className="font-semibold">{tutor.overallRating.toFixed(1)}</span>
                      <span>({tutor.reviewsCount} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <InfoSection title="About Me">
                <p className="text-muted-foreground whitespace-pre-wrap">{tutor.bio || "No bio provided."}</p>
              </InfoSection>

              <InfoSection title="Expertise & Teaching">
                 {providesCounseling && (
                    <InfoItem icon={Handshake} label="Services Offered">
                        <Badge variant="secondary" className="mr-1 mb-1 bg-green-100 text-green-700 border-green-300">Counseling Support</Badge>
                        In addition to academic tutoring.
                    </InfoItem>
                )}
                <InfoItem icon={BookOpen} label="Subjects">
                  {tutor.subjectMatterExpertise && tutor.subjectMatterExpertise.length > 0 
                    ? tutor.subjectMatterExpertise.map(subject => <Badge key={subject} variant="default" className="mr-1 mb-1 bg-primary/80 hover:bg-primary text-primary-foreground">{subject}</Badge>) 
                    : "Not specified"}
                </InfoItem>
                <InfoItem icon={Zap} label="Description of Expertise">
                  <p className="text-muted-foreground whitespace-pre-wrap">{tutor.descriptionOfExpertise || "Not specified."}</p>
                </InfoItem>
                <InfoItem icon={MessageCircle} label="Teaching Style">
                  {tutor.teachingStyle || "Not specified"}
                </InfoItem>
                {tutor.yearsOfExperience !== undefined && <InfoItem icon={CalendarDays} label="Years of Experience">{`${tutor.yearsOfExperience} years`}</InfoItem>}
              </InfoSection>
              
              {currentUser?.role === 'student' && (
                <InfoSection title="Compatibility with You">
                  {isLoadingCompatibility ? (
                     <div className="flex items-center space-x-2 py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span className="text-md text-muted-foreground">Calculating your compatibility score...</span>
                      </div>
                  ) : compatibility ? (
                    <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                       <div className="flex justify-between items-center mb-1">
                          <h4 className="text-lg font-semibold text-foreground flex items-center">
                            <Zap className="h-5 w-5 mr-2 text-green-500" />
                            Your Compatibility Score
                          </h4>
                          <Badge variant={compatibility.score > 0.7 ? "default" : compatibility.score > 0.4 ? "secondary" : "outline"} className={`text-lg px-3 py-1 ${compatibility.score > 0.7 ? "bg-green-500 hover:bg-green-600 text-white" : ""}`}>
                            {(compatibility.score * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <Progress value={compatibility.score * 100} className="h-3 rounded-full" indicatorClassName={compatibility.score > 0.7 ? "bg-green-500" : compatibility.score > 0.4 ? "bg-yellow-500" : "bg-red-500"}/>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1" className="border-b-0">
                            <AccordionTrigger className="text-sm hover:no-underline text-muted-foreground justify-start py-2">&nbsp;Why this score?</AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground">
                              {compatibility.justification}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                    </div>
                  ) : (
                     <p className="text-sm text-muted-foreground py-4">Compatibility score could not be determined. Ensure your student profile (learning preferences, subject interests) is complete.</p>
                  )}
                </InfoSection>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Right Column: Actions */}
        <div className="md:col-span-1 space-y-8">
          <Card className="shadow-xl sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Book a Session</CardTitle>
               <CardDescription className="text-center text-lg text-muted-foreground pt-2">
                  All sessions are free.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentUser?.role === 'student' ? (
                <BookingForm tutor={tutor} student={currentUser as Student} />
              ) : currentUser?.role === 'tutor' ? (
                <p className="text-center text-muted-foreground p-4 border rounded-md bg-background">This is your public profile view. Students will see booking options here.</p>
              ) : (
                 <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href={`/login?redirect=/tutors/${tutor.id}`}>Login to Book</Link>
                </Button>
              )}
              {currentUser?.role === 'student' && canChat && chatId && (
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/messages/${chatId}`}>
                    <MessageSquare className="mr-2 h-4 w-4" /> Message Tutor
                  </Link>
                </Button>
              )}
            </CardContent>
             <CardFooter className="text-xs text-muted-foreground text-center justify-center">
                Easy scheduling for tutoring and counseling.
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}


interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
}
const InfoSection = ({ title, children }: InfoSectionProps) => (
  <div className="space-y-1">
    <h3 className="text-xl font-semibold text-primary border-b pb-2 mb-4">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}
const InfoItem = ({ icon: Icon, label, children }: InfoItemProps) => (
  <div className="flex items-start">
    <Icon className="h-5 w-5 text-muted-foreground mr-3 mt-1 flex-shrink-0" />
    <div>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="text-muted-foreground text-sm">{children}</div>
    </div>
  </div>
);
