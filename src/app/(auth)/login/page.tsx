import LoginForm from '@/components/auth/login-form';
import Logo from '@/components/shared/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="mb-8">
        <Logo size="large" />
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Sign in to continue your learning journey with MentorLink.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Button variant="link" asChild className="text-primary p-0 h-auto font-semibold">
              <Link href="/signup">Sign up</Link>
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
