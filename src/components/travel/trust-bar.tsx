'use client';

import { Shield, Lock, BadgeCheck, Sparkles, Phone, CreditCard } from 'lucide-react';

const trustItems = [
  { icon: BadgeCheck, label: 'Verified hotels', sub: 'Every property vetted' },
  { icon: Lock, label: 'Secure payments', sub: '256-bit SSL encryption' },
  { icon: Shield, label: 'Best price guarantee', sub: 'See it cheaper? We refund' },
  { icon: CreditCard, label: 'No booking fees', sub: 'Free cancellation on most stays' },
  { icon: Sparkles, label: 'AI-powered deals', sub: 'Smart pricing, always' },
  { icon: Phone, label: '24/7 support', sub: 'Real humans, any time zone' },
];

export function TrustBar() {
  return (
    <section className="py-10 sm:py-14 border-y bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <item.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-tight">{item.label}</p>
                <p className="text-xs text-muted-foreground leading-tight">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}