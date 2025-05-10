import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/shared/logo";
import { ArrowRight, BookOpen, Users, Zap } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/30">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 items-center justify-between max-w-screen-xl px-4 md:px-8">
          <Logo size="default" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transition-shadow">
              <Link href="/signup">Get Started <ArrowRight className="ml-2 h-4 w-4"/></Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-screen-xl px-4 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
              Unlock Your Potential with <span className="text-primary">TutorLink</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Connect with expert tutors, get personalized guidance, and achieve your learning goals. Our AI-powered matching ensures you find the perfect mentor.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href="/signup">
                  Find Your Tutor Now <ArrowRight className="ml-2 h-5 w-5"/>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href="/#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Placeholder for Image/Illustration */}
        <section className="container max-w-screen-lg px-4 md:px-8 mx-auto -mt-8 md:-mt-12 mb-16">
          <div className="bg-card p-2 rounded-xl shadow-2xl overflow-hidden">
            <Image 
              src="https://picsum.photos/seed/tutorlink-hero/1200/600"
              alt="Diverse group of students and tutors collaborating"
              width={1200}
              height={600}
              className="rounded-lg object-cover"
              data-ai-hint="collaboration learning"
              priority
            />
          </div>
        </section>


        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-card">
          <div className="container max-w-screen-xl px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">Why Choose TutorLink?</h2>
            <p className="text-lg text-muted-foreground text-center max-w-xl mx-auto mb-12">
              We provide the tools and connections you need to succeed.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Intelligent Matching</h3>
                <p className="text-muted-foreground">Our AI finds the best tutor for your learning style and subject needs, complete with a compatibility score.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-4 bg-accent/10 rounded-full mb-4">
                 <Users className="h-10 w-10 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Expert Tutors</h3>
                <p className="text-muted-foreground">Access a wide network of verified tutors across various subjects and expertise levels.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-4 bg-secondary/20 rounded-full mb-4">
                  <BookOpen className="h-10 w-10 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Flexible Learning</h3>
                <p className="text-muted-foreground">Book sessions that fit your schedule and learn at your own pace with easy calendar integration.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-screen-md px-4 md:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Elevate Your Learning?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join TutorLink today and take the next step in your educational journey.
            </p>
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link href="/signup">
                Sign Up for Free <ArrowRight className="ml-2 h-5 w-5"/>
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/40 bg-background">
        &copy; {new Date().getFullYear()} TutorLink. All rights reserved.
      </footer>
    </div>
  );
}