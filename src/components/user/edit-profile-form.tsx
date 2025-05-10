"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import type { User, Student, Tutor } from "@/types";
import { useState } from "react";
import { Loader2, Save, Sparkles, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { suggestTags } from "@/ai/flows/suggest-tags-for-profile";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// Define separate schemas for student and tutor specific fields
const studentSchemaExtensions = {
  learningPreferences: z.string().optional(),
  subjectInterests: z.array(z.string()).optional(),
};

const tutorSchemaExtensions = {
  headline: z.string().optional(),
  subjectMatterExpertise: z.array(z.string()).optional(),
  descriptionOfExpertise: z.string().optional(),
  teachingStyle: z.string().optional(),
  hourlyRate: z.coerce.number().positive().optional(),
  yearsOfExperience: z.coerce.number().int().nonnegative().optional(),
};

// Base schema for common fields
const baseFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  bio: z.string().optional(),
  avatarUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

// Combine schemas based on role
const createFinalSchema = (role: 'student' | 'tutor') => {
  if (role === 'student') {
    return baseFormSchema.extend(studentSchemaExtensions);
  }
  return baseFormSchema.extend(tutorSchemaExtensions);
};

// Available subjects for multiselect (can be fetched from backend in real app)
const availableSubjects = ["Mathematics", "Calculus", "Algebra", "Physics", "Chemistry", "Biology", "Computer Science", "Python", "JavaScript", "React", "History", "Literature", "Creative Writing", "Essay Writing", "Grammar", "Statistics"];

interface EditProfileFormProps {
  user: User;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditProfileForm({ user, onSave, onCancel }: EditProfileFormProps) {
  const { updateUser: updateAuthUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);

  const finalSchema = createFinalSchema(user.role);
  type FormValues = z.infer<typeof finalSchema>;

  const student = user.role === 'student' ? (user as Student) : null;
  const tutor = user.role === 'tutor' ? (user as Tutor) : null;

  const form = useForm<FormValues>({
    resolver: zodResolver(finalSchema),
    defaultValues: {
      name: user.name || "",
      bio: user.bio || "",
      avatarUrl: user.avatarUrl || "",
      ...(student && {
        learningPreferences: student.learningPreferences || "",
        subjectInterests: student.subjectInterests || [],
      }),
      ...(tutor && {
        headline: tutor.headline || "",
        subjectMatterExpertise: tutor.subjectMatterExpertise || [],
        descriptionOfExpertise: tutor.descriptionOfExpertise || "",
        teachingStyle: tutor.teachingStyle || "",
        hourlyRate: tutor.hourlyRate || undefined,
        yearsOfExperience: tutor.yearsOfExperience || undefined,
      }),
    },
  });

  const handleSuggestTags = async () => {
    if (user.role === 'tutor') {
      const description = form.getValues("descriptionOfExpertise" as keyof FormValues) as string | undefined;
      if (!description || description.trim() === "") {
        toast({
          title: "Description Needed",
          description: "Please provide a description of your expertise to suggest tags.",
          variant: "destructive",
        });
        return;
      }
      setIsSuggestingTags(true);
      try {
        const result = await suggestTags({ expertiseDescription: description });
        const currentTags = form.getValues("subjectMatterExpertise" as keyof FormValues) as string[] || [];
        const newSuggestedTags = result.suggestedTags.filter(tag => !currentTags.includes(tag));
        
        if(newSuggestedTags.length > 0) {
             // Filter suggested tags to only include those from availableSubjects or add them if not present
            const validNewTags = newSuggestedTags.filter(tag => {
                if (!availableSubjects.includes(tag)) {
                    // This logic is simplified. In a real app, you might allow adding new tags
                    // or have a more robust tag management system.
                    // For now, we'll just log it or you could add it to availableSubjects dynamically (not recommended for mock)
                    console.warn(`Suggested tag "${tag}" is not in the predefined list and will be ignored for selection.`)
                    return false;
                }
                return true;
            });
            form.setValue("subjectMatterExpertise" as keyof FormValues, [...currentTags, ...validNewTags] as any);
            toast({
                title: "Tags Suggested!",
                description: `${validNewTags.length} new tags added based on your expertise description.`,
            });
        } else if (result.suggestedTags.length > 0) {
             toast({
                title: "Tags Already Present",
                description: "Suggested tags are already in your expertise list or not in predefined list.",
            });
        } else {
             toast({
                title: "No New Tags Suggested",
                description: "Could not find new relevant tags.",
            });
        }


      } catch (error) {
        console.error("Error suggesting tags:", error);
        toast({
          title: "Error",
          description: "Could not suggest tags at this time.",
          variant: "destructive",
        });
      } finally {
        setIsSuggestingTags(false);
      }
    }
  };


  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    updateAuthUser(values as Partial<User>); // Update mock auth context

    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully saved.",
    });
    setIsLoading(false);
    onSave(); // Close edit mode
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/avatar.png" {...field} />
              </FormControl>
              <FormDescription>Enter a URL for your profile picture.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Tell us a little about yourself..." {...field} />
              </FormControl>
              <FormDescription>A short introduction about you.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Student Specific Fields */}
        {user.role === 'student' && (
          <>
            <FormField
              control={form.control}
              name="learningPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Preferences</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Visual learner, prefer hands-on examples..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subjectInterests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Interests</FormLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableSubjects.map((subject) => (
                      <FormField
                        key={subject}
                        control={form.control}
                        name="subjectInterests"
                        render={({ field: interestField }) => {
                          return (
                            <FormItem
                              key={subject}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={interestField.value?.includes(subject)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? interestField.onChange([...(interestField.value || []), subject])
                                      : interestField.onChange(
                                          (interestField.value || []).filter(
                                            (value) => value !== subject
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {subject}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormDescription>Select subjects you are interested in.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Tutor Specific Fields */}
        {user.role === 'tutor' && (
          <>
            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headline</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Expert Math Tutor for High School" {...field} />
                  </FormControl>
                  <FormDescription>A catchy title for your tutor profile.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descriptionOfExpertise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description of Expertise</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Describe your skills, experience, and what you teach." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button type="button" variant="outline" onClick={handleSuggestTags} disabled={isSuggestingTags} className="text-sm">
              {isSuggestingTags ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-accent" />}
              Suggest Skill Tags (AI)
            </Button>
            <FormField
              control={form.control}
              name="subjectMatterExpertise"
              render={() => (
                <FormItem>
                  <FormLabel>Subject Matter Expertise (Tags)</FormLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableSubjects.map((subject) => (
                      <FormField
                        key={subject}
                        control={form.control}
                        name="subjectMatterExpertise"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={subject}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(subject)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), subject])
                                      : field.onChange(
                                          (field.value || []).filter(
                                            (value) => value !== subject
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {subject}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormDescription>Select your areas of expertise. Use AI suggestion for help!</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teachingStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teaching Style</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Patient and visual, Interactive problem solving" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Rate ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="50" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
          </>
        )}

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            <XCircle className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
