
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LayoutDashboard, Users, CalendarDays, Bell, UserCircle, LogOut, LogIn, UserPlus, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tutors', label: 'Find Tutors', icon: Users },
  { href: '/bookings', label: 'My Bookings', icon: CalendarDays },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/notifications', label: 'Notifications', icon: Bell },
];

const NavLinkItem = ({ href, label, icon: Icon, onClick }: { href: string, label: string, icon: React.ElementType, onClick?: () => void }) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  return (
    <Button
      variant="ghost"
      asChild
      className={cn(
        "justify-start w-full text-md",
        isActive ? "bg-primary/10 text-primary hover:text-primary" : "hover:bg-muted/50",
      )}
      onClick={onClick}
    >
      <Link href={href}>
        <Icon className="mr-2 h-5 w-5" />
        {label}
      </Link>
    </Button>
  );
};

const AuthButtons = () => {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-10 w-24 animate-pulse rounded-md bg-muted/50"></div>;
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatarUrl || `https://picsum.photos/seed/${user.id}/40/40`} alt={user.name} data-ai-hint="profile avatar" />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" asChild>
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" /> Login
        </Link>
      </Button>
      <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
        <Link href="/signup">
         <UserPlus className="mr-2 h-4 w-4" /> Sign Up
        </Link>
      </Button>
    </div>
  );
};


const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-screen-2xl px-4 md:px-8">
        <Logo />
        <nav className="hidden md:flex items-center gap-2 lg:gap-4">
          {user && navLinks.map(link => (
            <Button variant="ghost" asChild key={link.href} className={cn(usePathname() === link.href ? "text-primary hover:text-primary" : "text-foreground/70 hover:text-foreground/90")}>
              <Link href={link.href} className="text-sm font-medium">
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <AuthButtons />
          </div>
          {user && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-card p-4">
              <div className="mb-6">
                <Logo />
              </div>
              <div className="flex flex-col gap-2">
                {navLinks.map(link => (
                  <NavLinkItem key={link.href} {...link} onClick={() => setMobileMenuOpen(false)} />
                ))}
                <NavLinkItem href="/profile" label="Profile" icon={UserCircle} onClick={() => setMobileMenuOpen(false)} />
              </div>
              <div className="mt-auto pt-6">
                <AuthButtons />
              </div>
            </SheetContent>
          </Sheet>
          )}
           {!user && ( <div className="md:hidden"><AuthButtons /></div>)}
        </div>
      </div>
    </header>
  );
};

export default Header;
