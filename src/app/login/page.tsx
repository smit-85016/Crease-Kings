// src/app/login/page.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Loader2, Mail, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

// Custom Cricket Logo SVG
const CricketLogo = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    >
      {/* Cricket Bat */}
      <path d="M14.5 13.5L9.5 18.5" /> {/* Handle */}
      <path d="M10.94 10.94L6.44 15.44A2.5 2.5 0 0 0 6.44 19L10 22.56A2.5 2.5 0 0 0 13.56 22.56l4.5-4.5" /> {/* Blade */}
      <path d="M17.5 9.5L14.5 6.5" /> {/* Top of handle/grip */}
      {/* Cricket Ball */}
      <circle cx="18" cy="6" r="3" fill="hsl(var(--accent))" stroke="none" /> {/* Filled ball */}
    </svg>
);

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    console.log('Login attempt:', data);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate login success/failure
    // In a real app, you'd verify credentials against a backend
    if (data.email === 'user@creasekings.fake' && data.password === 'password') {
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      // Redirect user to home or dashboard (using next/navigation)
      // router.push('/');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
         form.setError('email', { type: 'manual', message: ' ' }); // Add error to field for styling
         form.setError('password', { type: 'manual', message: 'Invalid email or password.' });
    }

    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
           <div className="flex justify-center mb-2">
             <CricketLogo />
           </div>
          <CardTitle className="text-2xl font-bold text-primary">Welcome Back!</CardTitle>
          <CardDescription>Log in to your Crease Kings account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1"><Mail className="h-4 w-4 text-muted-foreground"/>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} disabled={isLoading} />
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
                     <div className="flex items-center justify-between">
                        <FormLabel className="flex items-center gap-1"><Lock className="h-4 w-4 text-muted-foreground"/>Password</FormLabel>
                        <Link href="#" className="text-xs text-primary hover:underline">
                             Forgot password?
                        </Link>
                     </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Logging In...' : 'Log In'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm text-center">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
