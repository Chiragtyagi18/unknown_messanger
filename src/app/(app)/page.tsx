'use client';

import { Mail, MessageSquare, Shield, Zap } from 'lucide-react'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-indigo-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[10%] w-72 h-72 bg-fuchsia-500 rounded-full blur-[120px]" />
        </div>

        {/* Hero Section */}
        <section className="text-center px-4 pt-20 pb-12 md:pt-32 md:pb-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6 animate-fade-in">
            <Shield className="w-4 h-4" />
            <span>100% Anonymous & Secure</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            The Future of <span className="gradient-text">Anonymous</span> Feedback
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            True Feedback empowers you to have honest conversations without fear. 
            Share your thoughts, receive insights, and maintain your privacy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 h-12 text-base shadow-xl shadow-primary/20">
                Create Your Profile
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="glass hover:bg-white/5 border-white/10 px-8 h-12 text-base">
                View Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="w-full px-4 pb-20 md:pb-32">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-500" />
                See what others are saying
              </h2>
            </div>

            <Carousel
              plugins={[Autoplay({ delay: 3000 })]}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {messages.map((message, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <Card className="glass h-full hover:border-indigo-500/50 transition-all duration-300 group">
                      <CardHeader>
                        <CardTitle className="text-lg group-hover:text-indigo-400 transition-colors">
                          {message.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                              <Mail className="w-4 h-4" />
                            </div>
                            <p className="text-muted-foreground leading-relaxed italic">
                              &quot;{message.content}&quot;
                            </p>
                          </div>
                          <p className="text-xs font-medium text-indigo-500/60 uppercase tracking-wider">
                            Received {message.received}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full glass-dark border-y border-white/5 py-20 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto text-indigo-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Real-time Delivery</h3>
              <p className="text-muted-foreground">Messages are delivered instantly to your dashboard as soon as they are sent.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-fuchsia-500/10 rounded-2xl flex items-center justify-center mx-auto text-fuchsia-400">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Total Privacy</h3>
              <p className="text-muted-foreground">We never reveal the identity of the sender. Your secrets are safe with us.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Smart Suggestions</h3>
              <p className="text-muted-foreground">Stuck on what to ask? Use our AI-powered message suggestions to get started.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-4 border-t border-white/5 text-center bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-sm italic">
            © 2026 <span className="font-bold text-foreground">True Feedback</span>. Built for honest conversations.
          </p>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-indigo-400 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-indigo-400 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-indigo-400 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
