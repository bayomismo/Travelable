import Link from 'next/link';
import { StaticPage } from '@/components/travel/static-page';
import { Briefcase, Heart, MapPin, Users } from 'lucide-react';

export const metadata = { title: 'Careers' };

const benefits = [
  { icon: MapPin, label: 'Work from anywhere', detail: 'Fully remote across the Americas, Europe, and Asia' },
  { icon: Heart, label: 'Health & wellness', detail: 'Comprehensive health, dental, and vision' },
  { icon: Briefcase, label: 'Equity & 401(k)', detail: 'Meaningful equity and retirement matching' },
  { icon: Users, label: 'Unlimited PTO', detail: 'Take the time you need — minimum 20 days' },
];

const roles = [
  { title: 'Senior Full-Stack Engineer', team: 'Engineering', location: 'Remote (Americas, EU)' },
  { title: 'Senior Product Designer', team: 'Design', location: 'Remote (Americas, EU)' },
  { title: 'Travel Partnerships Lead', team: 'Business', location: 'San Francisco / Remote' },
  { title: 'Data Scientist, Pricing', team: 'Data', location: 'Remote (Global)' },
];

export default function CareersPage() {
  return (
    <StaticPage kicker="Company" title="Build the future of travel" lastUpdated="July 2026">
      <p>
        We're a small team of engineers, designers, and travel obsessives
        rebuilding how the world plans trips. If you want to work on problems
        that touch billions of travelers, you'll fit right in.
      </p>

      <h2>Why Travelable</h2>
      <ul>
        <li>Small team, big ownership — your work ships to millions</li>
        <li>Real problems — search ranking, payments at scale, AI personalization</li>
        <li>Mission-driven — make travel more accessible and less stressful</li>
        <li>Profitable — growing 100% YoY on customer revenue, no VC pressure</li>
      </ul>

      <h2>Benefits</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {benefits.map((b) => (
          <div key={b.label} className="flex items-start gap-3 bg-card border rounded-xl p-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <b.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">{b.label}</p>
              <p className="text-xs text-muted-foreground">{b.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Open roles</h2>
      <div className="not-prose space-y-2 my-4">
        {roles.map((r) => (
          <a
            key={r.title}
            href={`mailto:careers@travelable.app?subject=Application: ${encodeURIComponent(r.title)}`}
            className="flex items-center justify-between gap-3 bg-card border rounded-xl p-4 hover:border-primary transition-colors"
          >
            <div>
              <p className="font-semibold text-sm">{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.team} · {r.location}</p>
            </div>
            <span className="text-xs text-primary">Apply →</span>
          </a>
        ))}
      </div>

      <h2>Don't see your role?</h2>
      <p>
        We hire for exceptional people, not just open headcount. If you'd be a
        great addition to the team, send us a note at{' '}
        <a href="mailto:careers@travelable.app">careers@travelable.app</a>{' '}
        with what you'd want to work on.
      </p>
    </StaticPage>
  );
}