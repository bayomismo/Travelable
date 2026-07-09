'use client'

import { Star } from 'lucide-react'

const testimonials = [
  {
    quote:
      'Travelable saved me $400 on my Tokyo trip. The AI found a flight deal I\'d never have found myself.',
    name: 'Sarah Chen',
    role: 'Digital Nomad',
    initials: 'SC',
    avatarColor: 'bg-rose-500',
  },
  {
    quote:
      'The itinerary was perfect. Every restaurant, every activity. It felt like having a personal travel agent.',
    name: 'Marcus Rivera',
    role: 'Family Traveler',
    initials: 'MR',
    avatarColor: 'bg-primary',
  },
  {
    quote:
      'I just said "honeymoon, beach, $2000" and Travelable planned everything. Magical experience.',
    name: 'Emma & James',
    role: 'Couple',
    initials: 'EJ',
    avatarColor: 'bg-accent-brand',
  },
]

function StarRow() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-accent-brand text-accent-brand" />
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Loved by travelers worldwide</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            2.4M+ trips planned · 4.8 average rating · 98% would book again
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`p-6 rounded-2xl bg-card border shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 duration-300 ${i === 0 ? 'md:mt-0' : i === 1 ? 'md:mt-6' : 'md:mt-0'}`}
            >
              <StarRow />
              <p className="mt-4 text-foreground/90 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className={`${t.avatarColor} size-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}