import SignupForm from '@/components/auth/signup-form';
import Logo from '@/components/shared/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="mb-8">
        <Logo size="large" />
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Create Your Account</CardTitle>
          <CardDescription>Join TutorLink and start connecting with tutors or students today.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Button variant="link" asChild className="text-primary p-0 h-auto font-semibold">
              <Link href="/login">Log in</Link>
            </Button>
          </p>
        </CardContent>
      </Card>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">← Back to Home</Link>
      </p>
    </div>
  );
}