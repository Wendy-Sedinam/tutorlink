
"use client";

import { useAuth } from '@/hooks/use-auth';
import type { User, Student, Tutor, Conversation, ChatMessage } from '@/types';
import { mockStudents, mockTutors, mockChatMessages, generateChatId, getMockUserById, mockBookings } from '@/lib/mock-data';
import { useEffect, useState, useMemo } from 'react';
import ConversationListItem from '@/components/chat/conversation-list-item';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MessagesPage() {
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && currentUser) {
      const getConversationsForUser = (user: User): Conversation[] => {
        const convos: Conversation[] = [];
        const potentialContacts: User[] = [];

        if (user.role === 'student') {
          const student = user as Student;
          // Student can chat with their assigned tutors
          // For simplicity, let's assume a student might be assigned to multiple tutors or find tutors.
          // Here, we'll consider all tutors as potential contacts for a student to simplify.
          // In a real app, this would be based on actual assignments or initiated chats.
           mockTutors.forEach(tutor => {
             // Check if there's an existing chat or if this tutor is explicitly assigned
             const isAssigned = mockBookings.some(b => b.studentId === student.id && b.tutorId === tutor.id) ||
                                (tutor.assignedStudentIds && tutor.assignedStudentIds.includes(student.id));
             if (isAssigned || mockChatMessages.some(msg => generateChatId(student.id, tutor.id) === msg.chatId)) {
                potentialContacts.push(tutor);
             }
           });

        } else if (user.role === 'tutor') {
          const tutor = user as Tutor;
          tutor.assignedStudentIds?.forEach(studentId => {
            const student = getMockUserById(studentId);
            if (student) potentialContacts.push(student);
          });
          // Also include students with whom the tutor has bookings or existing chats
          mockBookings.forEach(booking => {
            if (booking.tutorId === tutor.id && !potentialContacts.find(pc => pc.id === booking.studentId)) {
                 const student = getMockUserById(booking.studentId);
                 if(student) potentialContacts.push(student);
            }
          });
           mockChatMessages.forEach(msg => {
             if(msg.senderId === tutor.id || msg.receiverId === tutor.id) {
                const otherId = msg.senderId === tutor.id ? msg.receiverId : msg.senderId;
                if(!potentialContacts.find(pc => pc.id === otherId)) {
                     const otherUser = getMockUserById(otherId);
                     if(otherUser) potentialContacts.push(otherUser);
                }
             }
           })
        }
        
        // Deduplicate potential contacts
        const uniqueContacts = Array.from(new Set(potentialContacts.map(c => c.id)))
            .map(id => potentialContacts.find(c => c.id === id))
            .filter(Boolean) as User[];


        uniqueContacts.forEach(otherUser => {
          const chatId = generateChatId(user.id, otherUser.id);
          const chatMessages = mockChatMessages
            .filter(msg => msg.chatId === chatId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          
          const lastMessage = chatMessages[0];
          const unreadCount = chatMessages.filter(msg => msg.receiverId === user.id && !msg.read).length;

          convos.push({
            chatId,
            otherUserId: otherUser.id,
            otherUserName: otherUser.name,
            otherUserAvatar: otherUser.avatarUrl,
            otherUserRole: otherUser.role,
            lastMessage: lastMessage,
            unreadCount: unreadCount,
          });
        });
        
        return convos.sort((a,b) => {
            if (a.lastMessage && b.lastMessage) {
                return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
            }
            if(a.lastMessage) return -1;
            if(b.lastMessage) return 1;
            return 0;
        });
      };

      setConversations(getConversationsForUser(currentUser));
      setIsLoading(false);
    } else if (!authLoading && !currentUser) {
        setIsLoading(false); // Not logged in, stop loading
    }
  }, [currentUser, authLoading]);

  if (isLoading || authLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Card className="text-center py-16 shadow-sm">
        <CardHeader>
          <MessageSquare className="mx-auto h-20 w-20 text-muted-foreground mb-4" />
          <CardTitle className="text-2xl">Please Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-lg">
            Log in to view your messages and connect with others.
          </CardDescription>
          <Button asChild className="mt-6">
            <Link href="/login">Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">My Messages</h1>
        <p className="text-lg text-gray-600">Your recent conversations.</p>
      </div>

      {conversations.length > 0 ? (
        <Card className="shadow-md">
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {conversations.map(convo => (
                <li key={convo.chatId}>
                  <ConversationListItem conversation={convo} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-16 shadow-sm">
          <CardHeader>
            <MessageSquare className="mx-auto h-20 w-20 text-muted-foreground mb-4" />
            <CardTitle className="text-2xl">No Conversations Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg">
              {currentUser.role === 'student' 
                ? "Start a conversation by booking a session or finding a tutor."
                : "Your conversations with students will appear here once they are assigned or initiate contact."
              }
            </CardDescription>
            {currentUser.role === 'student' && (
                <Button asChild className="mt-6">
                    <Link href="/tutors">Find a Tutor</Link>
                </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

