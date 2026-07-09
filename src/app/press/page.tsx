import { StaticPage } from '@/components/travel/static-page';

export const metadata = { title: 'Press' };

export default function PressPage() {
  return (
    <StaticPage kicker="Company" title="Press & media" lastUpdated="July 2026">
      <p>
        For press inquiries, interviews, or media assets, email{' '}
        <a href="mailto:press@travelable.app">press@travelable.app</a>.
        We typically respond within 24 hours.
      </p>

      <h2>About Travelable</h2>
      <p>
        Travelable is an AI-powered travel platform that combines search,
        planning, and booking into one intelligent experience. Founded in 2024
        and headquartered in San Francisco, Travelable serves 2.4M+ travelers
        across 150+ countries.
      </p>

      <h2>Latest news</h2>
      <div className="not-prose space-y-3 my-4">
        <article className="bg-card border rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-1">May 2026</p>
          <h3 className="font-semibold text-base mb-2">Travelable launches AI Itinerary Builder</h3>
          <p className="text-sm text-muted-foreground">
            Day-by-day trip plans generated in under 60 seconds, with
            restaurant and activity recommendations based on traveler taste
            and pace.
          </p>
        </article>
        <article className="bg-card border rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-1">February 2026</p>
          <h3 className="font-semibold text-base mb-2">Series A: $30M to expand globally</h3>
          <p className="text-sm text-muted-foreground">
            Funding round led by Index Ventures, with participation from
            existing investors. Brings total raised to $45M.
          </p>
        </article>
        <article className="bg-card border rounded-xl p-5">
          <p className="text-xs text-muted-foreground mb-1">October 2025</p>
          <h3 className="font-semibold text-base mb-2">1 million trips planned</h3>
          <p className="text-sm text-muted-foreground">
            Travelable crosses the 1M-trips-planned milestone, with average
            savings of $340 per booking.
          </p>
        </article>
      </div>

      <h2>Brand assets</h2>
      <p>
        Need the Travelable logo, screenshots, or brand guidelines? Email{' '}
        <a href="mailto:press@travelable.app">press@travelable.app</a> with
        your publication and we'll send what you need.
      </p>

      <h2>Fast facts</h2>
      <ul>
        <li><strong>Founded:</strong> 2024</li>
        <li><strong>Headquarters:</strong> San Francisco, California</li>
        <li><strong>Team size:</strong> 47 (as of July 2026)</li>
        <li><strong>Funding:</strong> $45M total raised</li>
        <li><strong>Users:</strong> 2.4M+ travelers</li>
        <li><strong>Coverage:</strong> 150+ countries, 12 destination guides</li>
      </ul>
    </StaticPage>
  );
}