'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/travel/navigation';
import { Footer } from '@/components/travel/footer';

interface Props {
  title: string;
  kicker?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function StaticPage({ title, kicker, lastUpdated, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 pt-20 pb-12">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {kicker && (
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                {kicker}
              </p>
            )}
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">{title}</h1>
            {lastUpdated && (
              <p className="text-sm text-muted-foreground mb-8">Last updated {lastUpdated}</p>
            )}

            <div className="prose prose-slate max-w-none text-foreground/90 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_li]:mb-1 [&_a]:text-primary [&_a]:underline">
              {children}
            </div>
          </motion.div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

export function ContactBlock() {
  return (
    <div className="bg-card border rounded-2xl p-6 mt-8">
      <h3 className="font-semibold mb-3">Still need help?</h3>
      <div className="grid sm:grid-cols-3 gap-4 text-sm">
        <a href="mailto:support@travelable.app" className="flex items-center gap-2 hover:text-primary">
          <Mail className="h-4 w-4" /> support@travelable.app
        </a>
        <a href="#" className="flex items-center gap-2 hover:text-primary">
          <MessageCircle className="h-4 w-4" /> Live chat (24/7)
        </a>
        <a href="tel:+18005551234" className="flex items-center gap-2 hover:text-primary">
          <Phone className="h-4 w-4" /> +1 (800) 555-1234
        </a>
      </div>
    </div>
  );
}