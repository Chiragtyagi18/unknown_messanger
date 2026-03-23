'use client'

import React from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Trash2, Calendar, MessageSquare } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import { ApiResponse } from '@/types/ApiResponse';

type rdProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: rdProps) {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success(
        String(response.data.message) || 'Message deleted successfully.'
      );
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || 'Failed to delete the message.'
      );
    } 
  };

  return (
    <Card className="glass group hover:border-indigo-500/30 transition-all duration-300 shadow-lg border-white/5 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-indigo-500/60 uppercase tracking-widest">
                Anonymous Message
              </span>
            </div>
            <p className="text-foreground/90 font-medium leading-relaxed">
              {message.content}
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 hover:text-red-400 text-muted-foreground"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glass border-white/10">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This message will be permanently removed from your inbox.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-3 bg-white/5 flex items-center gap-2">
        <Calendar className="w-3 h-3 text-muted-foreground" />
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">
          {dayjs(message.createdAt).format('MMM D, YYYY • h:mm A')}
        </span>
      </CardFooter>
    </Card>
  );
}

