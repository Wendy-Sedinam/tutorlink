"use client";

import type { Tutor, Student, CompatibilityScoreInfo } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Star, Zap, MessageCircle, BookOpen, Loader2 } from 'lucide-react'; 
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { generateCompatibilityScore } from '@/ai/flows/generate-compatibility-score';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { buttonVariants } from "@/components/ui/button"; // Added import
import { cn } from "@/lib/utils"; // Added import for cn if not already present

interface TutorCardProps {
  tutor: Tutor;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const { user } = useAuth();
  const [compatibility, setCompatibility] = useState<CompatibilityScoreInfo | null>(null);
  const [isLoadingCompatibility, setIsLoadingCompatibility] = useState(false);

  useEffect(() => {
    const fetchCompatibility = async () => {
      if (user && user.role === 'student' && (user as Student).learningPreferences && (user as Student).subjectInterests) {
        setIsLoadingCompatibility(true);
        try {
          const studentData = user as Student;
          const scoreData = await generateCompatibilityScore({
            studentLearningPreferences: studentData.learningPreferences || "general learner",
            studentSubjectInterests: studentData.subjectInterests?.join(', ') || "various subjects",
            tutorSubjectMatterExpertise: tutor.subjectMatterExpertise?.join(', ') || "general subjects",
            tutorTeachingStyle: tutor.teachingStyle || "flexible",
          });
          setCompatibility({ score: scoreData.compatibilityScore, justification: scoreData.justification });
        } catch (error) {
          console.error("Failed to generate compatibility score:", error);
          setCompatibility(null); // Or set a default/error state
        } finally {
          setIsLoadingCompatibility(false);
        }
      }
    };

    fetchCompatibility();
  }, [tutor, user]);

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden bg-card">
      <CardHeader className="flex flex-row items-start gap-4 p-4 bg-muted/20">
        <Avatar className="h-20 w-20 border-2 border-primary shadow-sm">
          <AvatarImage src={tutor.avatarUrl} alt={tutor.name} data-ai-hint="tutor avatar" />
          <AvatarFallback>{tutor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-xl font-bold text-primary group-hover:text-accent transition-colors">
            <Link href={`/tutors/${tutor.id}`} className="hover:underline">{tutor.name}</Link>
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{tutor.headline}</CardDescription>
          {tutor.overallRating && tutor.reviewsCount && (
            <div className="flex items-center gap-1 mt-1 text-sm">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">{tutor.overallRating.toFixed(1)}</span>
              <span className="text-muted-foreground">({tutor.reviewsCount} reviews)</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3 flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4 mr-2 text-primary" />
          <span className="font-medium text-foreground mr-1">Expertise:</span> 
          <span className="truncate">
            {tutor.subjectMatterExpertise?.slice(0, 3).join(', ')}
            {tutor.subjectMatterExpertise && tutor.subjectMatterExpertise.length > 3 ? '...' : ''}
          </span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MessageCircle className="h-4 w-4 mr-2 text-primary" />
           <span className="font-medium text-foreground mr-1">Style:</span> {tutor.teachingStyle}
        </div>
        
        {user?.role === 'student' && (
          <div className="pt-2">
            {isLoadingCompatibility ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Calculating compatibility...</span>
              </div>
            ) : compatibility ? (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-semibold text-foreground flex items-center">
                    <Zap className="h-4 w-4 mr-1 text-green-500" />
                    Compatibility Score
                  </h4>
                  <Badge variant={compatibility.score > 0.7 ? "default" : compatibility.score > 0.4 ? "secondary" : "outline"} className={compatibility.score > 0.7 ? "bg-green-500 hover:bg-green-600 text-white" : ""}>
                    {(compatibility.score * 100).toFixed(0)}%
                  </Badge>
                </div>
                <Progress value={compatibility.score * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1 truncate" title={compatibility.justification}>{compatibility.justification}</p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Update your profile for compatibility scores.</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t bg-muted/20 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Services are free</span>
        <Link 
          href={`/tutors/${tutor.id}`} 
          className={cn(buttonVariants({ variant: "default" }))}
        >
          View Profile
        </Link>
      </CardFooter>
    </Card>
  );
}
