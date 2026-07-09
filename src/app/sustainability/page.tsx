import { StaticPage } from '@/components/travel/static-page';

export const metadata = { title: 'Sustainability' };

export default function SustainabilityPage() {
  return (
    <StaticPage kicker="Company" title="Sustainable travel" lastUpdated="July 2026">
      <p>
        Travelable exists because we love to travel. But we also recognize
        that travel has a real environmental cost. Our mission is to help
        people see the world while leaving it better than we found it.
      </p>

      <h2>What we're doing</h2>
      <h3>Carbon visibility</h3>
      <p>
        Every flight search shows CO₂ emissions alongside price. Travelers can
        sort by lowest-emission options and see the difference between a direct
        flight and one with a layover.
      </p>

      <h3>Rail alternatives</h3>
      <p>
        For European routes under 6 hours, we surface high-speed rail options
        alongside flights. Train travel typically emits 5–10× less CO₂ than
        the equivalent flight.
      </p>

      <h3>Verified eco-properties</h3>
      <p>
        Hotels with credible sustainability certifications (LEED, BREEAM,
        Green Key, EarthCheck) get a "Eco-certified" badge in search results
        and are eligible for our eco-collection filters.
      </p>

      <h3>Carbon offset</h3>
      <p>
        When you book a flight through Travelable, we automatically contribute
        1% of the booking value to verified carbon-removal projects (Climeworks,
        Charm Industrial, Stripe Climate). The contribution is included in
        your booking — no extra checkout step.
      </p>

      <h2>Our commitments</h2>
      <ul>
        <li><strong>100% remote</strong> team since day one — no office commutes</li>
        <li><strong>Cloud infrastructure</strong> powered by renewable-energy providers (Vercel + Neon both carbon-neutral)</li>
        <li><strong>Annual sustainability report</strong> published every January</li>
        <li><strong>Science-Based Targets initiative</strong> commitment to halve operational emissions by 2030</li>
      </ul>

      <h2>Modern Slavery & Human Rights Statement</h2>
      <p>
        Travelable is committed to ensuring that no form of modern slavery or
        human trafficking exists in our business or supply chain. We expect
        all hotel and airline partners to adhere to internationally recognized
        labor standards, including the ILO Declaration on Fundamental Principles
        and Rights at Work.
      </p>
      <p>
        Our supplier code of conduct prohibits forced labor, child labor, and
        discrimination. We audit high-risk suppliers annually and reserve the
        right to terminate partnerships for non-compliance.
      </p>

      <h2>Report concerns</h2>
      <p>
        Suspect a violation in our supply chain? Email{' '}
        <a href="mailto:ethics@travelable.app">ethics@travelable.app</a>.
        Reports are confidential and investigated within 5 business days.
      </p>
    </StaticPage>
  );
}