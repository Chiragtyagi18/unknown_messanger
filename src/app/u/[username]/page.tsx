'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, Sparkles, User, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCompletion } from "@ai-sdk/react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast.success(response.data.message);
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || 'Failed to send message. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in relative">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[100px] -z-10" />

      <header className="text-center mb-12">
        <div className="inline-flex p-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
          Send a <span className="gradient-text">Secret</span> Message
        </h1>
        <p className="text-muted-foreground text-lg">
          to <span className="font-bold text-foreground">@{username}</span>
        </p>
      </header>

      <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl mb-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-bold uppercase tracking-widest text-indigo-400">
                    Your Anonymous Message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts honestly and kindly..."
                      className="min-h-[160px] bg-white/5 border-white/10 focus:border-indigo-500/50 transition-all text-lg leading-relaxed p-6 rounded-2xl resize-none shadow-inner"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center px-1">
                    <FormMessage className="text-xs" />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase">
                      {field.value?.length || 0} characters
                    </span>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex justify-center pt-2">
              <Button 
                type="submit" 
                disabled={isLoading || !messageContent}
                className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/25 gap-3 group transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-2xl font-black tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              Need Inspiration?
            </h2>
            <p className="text-sm text-muted-foreground">Pick a suggested question to get the conversation started.</p>
          </div>
          <Button
            onClick={fetchSuggestedMessages}
            disabled={isSuggestLoading}
            variant="outline"
            className="glass hover:bg-white/5 border-white/10 h-11 px-6 rounded-xl font-bold gap-2"
          >
            {isSuggestLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Refresh Suggestions
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {error ? (
            <div className="md:col-span-3 p-4 glass border-red-500/20 text-red-400 text-sm rounded-xl">
              {error.message}
            </div>
          ) : (
            parseStringMessages(completion).map((message, index) => (
              <button
                key={index}
                onClick={() => handleMessageClick(message)}
                className="glass p-4 rounded-2xl border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 text-left text-sm font-medium transition-all group active:scale-95 h-full flex items-center"
              >
                <span className="group-hover:text-indigo-400 transition-colors">
                  &quot;{message}&quot;
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      <Separator className="my-16 bg-white/5" />

      <footer className="text-center space-y-8 pb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/5 text-sm font-medium text-muted-foreground">
          <Info className="w-4 h-4" />
          Want to receive anonymous messages too?
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <Link href="/sign-up">
            <Button size="lg" className="bg-white text-black hover:bg-white/90 font-black px-8 h-14 rounded-2xl shadow-2xl">
              Create Your Board Free
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
            Join 10,000+ users worldwide
          </p>
        </div>
      </footer>
    </div>
  );
}
