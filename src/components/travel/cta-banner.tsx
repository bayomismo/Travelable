'use client';

import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTABanner() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl border bg-gradient-brand text-primary-foreground p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-white/10 blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-medium mb-5">
              <Sparkles className="h-3.5 w-3.5" />
              Join 2.4M+ travelers
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Ready to travel smarter?
            </h2>
            <p className="text-lg text-primary-foreground/85 max-w-2xl mx-auto mb-8">
              Get personalized deals, AI itineraries, and instant price drops — straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 rounded-xl px-6 h-12 font-semibold"
                >
                  Create free account
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/search">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-xl px-6 h-12 font-medium bg-transparent"
                >
                  Browse deals
                </Button>
              </Link>
            </div>
            <p className="text-xs text-primary-foreground/70 mt-5">
              No credit card required · Free forever · Unsubscribe anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}