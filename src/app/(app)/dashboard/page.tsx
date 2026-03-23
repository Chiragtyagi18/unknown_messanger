'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, ExternalLink, Inbox, Settings } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.filter((message) => message._id !== messageId)
    );
  };

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      try {
        setIsLoading(true);
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.success('Messages refreshed successfully.');
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message ||
            'Failed to fetch messages.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchAcceptMessages = useCallback(async () => {
    try {
      setIsSwitchLoading(true);
      const response = await axios.get<ApiResponse>(
        '/api/accept-messages'
      );
      setValue(
        'acceptMessages',
        response.data.isAcceptingMessages ?? false
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          'Failed to fetch message settings.'
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchMessages();
      fetchAcceptMessages();
    }
  }, [status, fetchMessages, fetchAcceptMessages]);

  const handleSwitchChange = async () => {
    const newValue = !acceptMessages;
    try {
      setIsSwitchLoading(true);
      const response = await axios.post<ApiResponse>(
        '/api/accept-messages',
        {
          acceptMessages: newValue,
        }
      );
      setValue('acceptMessages', newValue);
      toast.success(
        response.data.message ||
          'Message settings updated successfully.'
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          'Failed to update message settings.'
      );
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const visitProfileByUsername = () => {
    const targetUsername = searchUsername.trim().replace(/^@+/, '');

    if (!targetUsername) {
      toast.error('Please enter a username first.');
      return;
    }

    router.push(`/u/${encodeURIComponent(targetUsername)}`);
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  if (!session?.user) return null;

  const { username } = session.user as User;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            User <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">Manage your anonymous feedback and profile settings</p>
        </div>

        <div className="flex w-full md:w-auto flex-col sm:flex-row gap-3 md:min-w-[26rem]">
          <Input
            value={searchUsername}
            onChange={(event) => setSearchUsername(event.target.value)}
            placeholder="Enter username to message (e.g. @john)"
            className="glass border-white/10 focus-visible:ring-indigo-500/30"
          />
          <Button
            type="button"
            onClick={visitProfileByUsername}
            className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 gap-2 group"
          >
            <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            Visit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-2xl border border-white/10">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-indigo-400" />
              Profile Settings
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block uppercase tracking-wider">
                  Your Unique Username
                </label>
                <div className="glass text-sm p-3 rounded-lg border border-white/10 font-semibold">
                  @{username}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 glass rounded-xl border-white/5">
                <div className="space-y-0.5">
                  <span className="font-bold text-sm block">Accept Messages</span>
                  <span className="text-xs text-muted-foreground">
                    {acceptMessages ? 'Your profile is active' : 'Your profile is hidden'}
                  </span>
                </div>
                <Switch
                  checked={acceptMessages ?? false}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                  className="data-[state=checked]:bg-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border border-white/10 bg-indigo-500/5">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Pro Tip</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Share your username on social media to get more honest feedback from your friends and followers!
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Inbox className="w-6 h-6 text-indigo-400" />
              Inbox
              <span className="ml-2 px-2 py-0.5 text-xs bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                {messages.length}
              </span>
            </h2>
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchMessages(true)}
              className="glass hover:bg-white/5 border-white/10"
              disabled={isLoading}
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin text-primary' : ''}`} />
            </Button>
          </div>

          <Separator className="bg-white/5" />

          {messages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messages.map((message) => (
                <MessageCard
                  key={message._id as string}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="glass flex flex-col items-center justify-center py-20 rounded-2xl border-white/5 border-dashed border-2">
              <Inbox className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">No messages yet.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Share your username to start receiving feedback!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
