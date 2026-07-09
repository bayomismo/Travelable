import { StaticPage } from '@/components/travel/static-page';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const metadata = { title: 'Status' };

const services = [
  { name: 'Website & search', status: 'operational' as const },
  { name: 'Hotel & flight booking', status: 'operational' as const },
  { name: 'Payments', status: 'operational' as const },
  { name: 'AI Planner', status: 'operational' as const },
  { name: 'Email & confirmations', status: 'operational' as const },
  { name: 'Account & sign-in', status: 'operational' as const },
];

const incidents = [
  {
    date: 'June 18, 2026',
    title: 'Brief payment processing delay',
    status: 'resolved',
    description:
      'For 12 minutes between 14:32 and 14:44 UTC, some payment confirmations were delayed. All bookings were processed successfully and no customers were charged twice.',
  },
  {
    date: 'May 2, 2026',
    title: 'AI Planner elevated latency',
    status: 'resolved',
    description:
      'Itinerary generation took longer than usual for ~40 minutes due to upstream model provider issues. Fully resolved.',
  },
];

const upcoming = [
  {
    date: 'July 16, 2026',
    title: 'Scheduled database maintenance',
    description:
      'Brief read-only mode (5 min) starting at 03:00 UTC. Bookings in progress will be queued and completed automatically.',
  },
];

export default function StatusPage() {
  return (
    <StaticPage kicker="Support" title="System status" lastUpdated="July 2026">
      <p>
        Real-time status of Travelable's services. Subscribe via{' '}
        <a href="mailto:status@travelable.app?subject=Subscribe">email</a> to
        get notified about incidents.
      </p>

      <h2>All systems operational</h2>
      <div className="not-prose grid sm:grid-cols-2 gap-2 my-6">
        {services.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between gap-2 bg-card border rounded-xl px-4 py-3"
          >
            <span className="text-sm font-medium">{s.name}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Operational
            </span>
          </div>
        ))}
      </div>

      <h2>Upcoming maintenance</h2>
      <div className="not-prose space-y-2 my-4">
        {upcoming.map((u) => (
          <div key={u.title} className="bg-card border rounded-xl p-4 flex items-start gap-3">
            <Clock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">{u.date}</p>
              <p className="font-semibold text-sm">{u.title}</p>
              <p className="text-sm text-muted-foreground">{u.description}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Recent incidents</h2>
      <div className="not-prose space-y-2 my-4">
        {incidents.map((i) => (
          <div key={i.title} className="bg-card border rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">{i.date}</p>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Resolved
                </span>
              </div>
              <p className="font-semibold text-sm">{i.title}</p>
              <p className="text-sm text-muted-foreground">{i.description}</p>
            </div>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}