'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { LogOut, User as UserIcon } from 'lucide-react';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/10 py-4 px-4 md:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-black tracking-tighter gradient-text hover:opacity-80 transition-opacity">
          The Anonymous Message
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <UserIcon className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium">
                  {user.username || user.email}
                </span>
              </div>
              <Button 
                onClick={() => signOut()} 
                variant="ghost" 
                className="hover:bg-red-500/10 hover:text-red-400 gap-2 border border-white/5"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 px-6">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
