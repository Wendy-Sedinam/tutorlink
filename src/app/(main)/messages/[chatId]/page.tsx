
"use client";

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import ChatInterface from '@/components/chat/chat-interface';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, isLoading: authLoading } = useAuth();
  const [chatId, setChatId] = useState<string | null>(null);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);

  useEffect(() => {
    if (params.chatId && typeof params.chatId === 'string') {
      setChatId(params.chatId);
    }
  }, [params.chatId]);

  useEffect(() => {
    if (chatId && currentUser) {
      const ids = chatId.split('_');
      const oId = ids.find(id => id !== currentUser.id);
      if (oId) {
        setOtherUserId(oId);
      } else {
        // Invalid chatId or user not part of this chat
        router.push('/messages'); 
      }
    }
  }, [chatId, currentUser, router]);

  if (authLoading || !chatId || !otherUserId && !authLoading && currentUser) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser && !authLoading) {
     // Redirect to login if not authenticated
     router.push('/login?redirect=/messages');
     return (
        <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-2">Redirecting to login...</p>
        </div>
     );
  }


  if (!otherUserId && currentUser && !authLoading) { // Should have been caught by router.push above but as a fallback
    return (
        <div className="text-center py-10">
            <h2 className="text-xl font-semibold text-destructive">Chat not found or invalid.</h2>
            <Button asChild className="mt-4">
                <Link href="/messages">Back to Messages</Link>
            </Button>
        </div>
    );
  }
  
  // Ensure otherUserId is non-null before rendering ChatInterface
  return otherUserId && chatId ? (
    <ChatInterface chatId={chatId} initialOtherUserId={otherUserId} />
  ) : (
    <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
       <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  ); // Fallback loading, should be brief
}
