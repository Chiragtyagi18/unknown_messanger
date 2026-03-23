'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { KeyRound, Mail, ArrowRight } from 'lucide-react';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
      callbackUrl: '/dashboard',   
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.error('Invalid username or password');
      } else {
        toast.error('Sign-in failed. Please try again.');
      }
      return;
    }

    router.replace(result?.url ?? '/dashboard');
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 relative">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-md p-8 glass rounded-2xl shadow-2xl border border-white/10 animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tight mb-2">
            Welcome <span className="gradient-text">Back</span>
          </h1>
          <p className="text-muted-foreground">Sign in to continue your secret conversations</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-400" />
                    Email or Username
                  </FormLabel>
                  <Input 
                    {...field} 
                    placeholder="Enter email or username" 
                    className="bg-white/5 border-white/10 focus:border-indigo-500/50 transition-all h-11"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-indigo-400" />
                    Password
                  </FormLabel>
                  <Input 
                    type="password" 
                    {...field} 
                    placeholder="Enter password" 
                    className="bg-white/5 border-white/10 focus:border-indigo-500/50 transition-all h-11"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/25 gap-2" type="submit">
              Sign In
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </Form>

        <div className="text-center mt-8 pt-6 border-t border-white/5">
          <p className="text-sm text-muted-foreground">
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-indigo-400 hover:text-indigo-300 font-bold underline underline-offset-4 transition-colors">
              Join the adventure
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
