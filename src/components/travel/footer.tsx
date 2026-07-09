'use client'

import Link from 'next/link';
import { Logo } from './navigation';

const footerLinks = {
  Company: [
    { label: 'About', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Investors', href: '#' },
    { label: 'Sustainability', href: '#' },
  ],
  Explore: [
    { label: 'Hotels', href: '/search?type=hotel' },
    { label: 'Flights', href: '/search?type=flight' },
    { label: 'Packages', href: '/search?type=package' },
    { label: 'AI Planner', href: '/planner' },
    { label: 'Deals', href: '/search' },
  ],
  Support: [
    { label: 'Help center', href: '#' },
    { label: 'Safety resource center', href: '#' },
    { label: 'Cancellation options', href: '#' },
    { label: 'Contact customer service', href: '#' },
    { label: 'Status', href: '#' },
  ],
  Legal: [
    { label: 'Terms of service', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Cookie policy', href: '#' },
    { label: 'Modern Slavery Statement', href: '#' },
    { label: 'Human Rights Statement', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed mt-4 max-w-xs">
              The AI-powered travel platform. Find the best deals, plan perfect trips, and book with confidence.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-semibold text-sm mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Travelable. All rights reserved.</p>
          <p className="text-xs">
            Made with care for travelers · All hotel and flight data for demo purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}