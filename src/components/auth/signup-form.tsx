
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { mockStudents, mockTutors } from "@/lib/mock-data";
import type { Student, Tutor, User } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["student", "tutor"], { required_error: "You must select a role."}),
});

export default function SignupForm() {
  const { login } = useAuth(); 
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    // Simulate API call for registration
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create a new mock user
    const newUserId = `user${Date.now()}`;
    const newUserBase = {
      id: newUserId,
      name: values.name,
      email: values.email,
      // Password is not stored in mock user object for simplicity
      avatarUrl: `https://picsum.photos/seed/${newUserId}/200/200`,
    };

    let newUser: User;

    if (values.role === 'student') {
      newUser = {
        ...newUserBase,
        role: 'student',
        bio: "New student, eager to learn!",
        learningPreferences: "Not specified yet.",
        subjectInterests: [],
      } as Student;
      mockStudents.push(newUser as Student);
      // Assign student to the first tutor for simplicity
      if (mockTutors.length > 0) {
        const tutorToAssign = mockTutors[0];
        if (!tutorToAssign.assignedStudentIds) {
          tutorToAssign.assignedStudentIds = [];
        }
        // Ensure no duplicates if this logic runs multiple times for the same user (though unlikely with newUserId)
        if (!tutorToAssign.assignedStudentIds.includes(newUser.id)) {
            tutorToAssign.assignedStudentIds.push(newUser.id);
        }
      }
    } else {
      newUser = {
        ...newUserBase,
        role: 'tutor',
        bio: "New tutor, ready to teach!",
        headline: "Enthusiastic new tutor",
        subjectMatterExpertise: [],
        descriptionOfExpertise: "Looking forward to helping students!",
        teachingStyle: "Flexible and adaptive",
        yearsOfExperience: 0,
        assignedStudentIds: [],
      } as Tutor;
      mockTutors.push(newUser as Tutor);
    }
    
    try {
      // Log in the newly created user by passing the full user object
      login(newUser); 
      router.push("/dashboard"); 
    } catch (e) {
      setError("Signup failed. Please try again.");
      // remove user from mock data if login fails
      if (values.role === 'student') {
        const index = mockStudents.findIndex(s => s.id === newUserId);
        if (index > -1) mockStudents.splice(index, 1);
         // Also remove from tutor's assigned list if assignment happened
        if (mockTutors.length > 0 && mockTutors[0].assignedStudentIds?.includes(newUserId)) {
            mockTutors[0].assignedStudentIds = mockTutors[0].assignedStudentIds.filter(id => id !== newUserId);
        }
      } else {
        const index = mockTutors.findIndex(t => t.id === newUserId);
        if (index > -1) mockTutors.splice(index, 1);
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (!isClient) {
     // Render nothing or a placeholder on the server and during initial client render
    // to prevent hydration mismatch. The actual form will render after useEffect.
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>I am a</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="student" id="role-student-signup"/>
                    </FormControl>
                    <Label htmlFor="role-student-signup" className="font-normal">Student</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="tutor" id="role-tutor-signup"/>
                    </FormControl>
                    <Label htmlFor="role-tutor-signup" className="font-normal">Tutor</Label>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          Create Account
        </Button>
      </form>
    </Form>
  );
}

