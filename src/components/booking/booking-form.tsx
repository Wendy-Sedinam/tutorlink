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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Send } from "lucide-react";
import type { Tutor, Student, Booking, AppNotification } from "@/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockBookings, mockNotifications } from "@/lib/mock-data"; // To add the new booking and notification
import { useRouter } from "next/navigation";

const bookingFormSchema = z.object({
  date: z.date({ required_error: "Please select a date for the session." }),
  timeSlot: z.string({ required_error: "Please select a time slot."}),
  durationMinutes: z.coerce.number().min(30, "Duration must be at least 30 minutes.").max(240, "Duration cannot exceed 4 hours."),
  notes: z.string().max(500, "Notes cannot exceed 500 characters.").optional(),
});

interface BookingFormProps {
  tutor: Tutor;
  student: Student;
}

// Dummy time slots for demonstration
const availableTimeSlots = (day?: Date): string[] => {
    if (!day) return [];
    // Simulate different slots for different days for variety
    const dayOfWeek = day.getDay();
    if (dayOfWeek % 2 === 0) { // Even days (Sun, Tue, Thu, Sat)
        return ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];
    } else { // Odd days (Mon, Wed, Fri)
        return ["09:30 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:30 PM"];
    }
};


export default function BookingForm({ tutor, student }: BookingFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlotsForSelectedDate, setTimeSlotsForSelectedDate] = useState<string[]>([]);

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      durationMinutes: 60,
      notes: "",
    },
  });

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    form.setValue("date", date as Date); // Set value for validation
    if (date) {
      setTimeSlotsForSelectedDate(availableTimeSlots(date));
      form.resetField("timeSlot"); // Reset time slot when date changes
    } else {
      setTimeSlotsForSelectedDate([]);
    }
  };

  async function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Combine date and time
    const [hours, minutesPart] = values.timeSlot.split(':');
    const [minutes, ampm] = minutesPart.split(' ');
    let numericHours = parseInt(hours, 10);
    if (ampm === 'PM' && numericHours < 12) numericHours += 12;
    if (ampm === 'AM' && numericHours === 12) numericHours = 0; // Midnight case

    const bookingDateTime = new Date(values.date);
    bookingDateTime.setHours(numericHours, parseInt(minutes, 10), 0, 0);

    const newBooking: Booking = {
      id: `booking${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      tutorId: tutor.id,
      tutorName: tutor.name,
      dateTime: bookingDateTime.toISOString(),
      durationMinutes: values.durationMinutes,
      status: "pending", 
      notes: values.notes,
    };

    mockBookings.push(newBooking); 

    // Notify Tutor
    const tutorNotification: AppNotification = {
      id: `notif-tutor-${Date.now()}`,
      userId: tutor.id,
      title: "New Session Request",
      message: `${student.name} requested a session.`,
      type: 'booking_request',
      createdAt: new Date().toISOString(),
      read: false,
      link: `/bookings#${newBooking.id}`,
    };
    mockNotifications.push(tutorNotification);

    toast({
      title: "Booking Request Sent!",
      description: `Your request for a session with ${tutor.name} has been sent. The tutor will be notified.`,
      variant: "default"
    });
    setIsLoading(false);
    form.reset();
    setSelectedDate(undefined);
    setTimeSlotsForSelectedDate([]);
    router.push('/bookings'); 
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {field.onChange(date); handleDateChange(date);}}
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {selectedDate && (
        <FormField
          control={form.control}
          name="timeSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Time Slots</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={timeSlotsForSelectedDate.length === 0}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={timeSlotsForSelectedDate.length > 0 ? "Select a time slot" : "No slots available for this date"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {timeSlotsForSelectedDate.map(slot => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {timeSlotsForSelectedDate.length === 0 && <FormDescription>Please select another date.</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        )}

        <FormField
          control={form.control}
          name="durationMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
               <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[30, 45, 60, 90, 120].map(duration => (
                    <SelectItem key={duration} value={String(duration)}>{duration} minutes</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any specific topics or questions you want to cover?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Request Session
        </Button>
      </form>
    </Form>
  );
}
