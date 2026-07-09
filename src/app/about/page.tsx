import { StaticPage } from '@/components/travel/static-page';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <StaticPage kicker="Our story" title="About Travelable" lastUpdated="July 2026">
      <p>
        Travelable was founded with a simple belief: planning a trip should feel as
        exciting as taking one. Too many travelers lose hours comparing tabs,
        second-guessing prices, and piecing together spreadsheets. We built
        Travelable to bring everything — search, planning, booking — into one
        intelligent platform.
      </p>

      <h2>What we do</h2>
      <p>
        We combine AI-powered search with real-time pricing across hotels,
        flights, and experiences. Our planner builds day-by-day itineraries
        that respect your budget, your pace, and your taste. Our price engine
        flags the right moment to book — and the right moment to wait.
      </p>

      <h2>By the numbers</h2>
      <ul>
        <li><strong>2.4M+</strong> trips planned by travelers in 150+ countries</li>
        <li><strong>$340</strong> average savings per booking</li>
        <li><strong>4.8 / 5</strong> average rating across 200k+ reviews</li>
        <li><strong>98%</strong> of travelers say they'd book again</li>
      </ul>

      <h2>Our principles</h2>
      <h3>Honest pricing</h3>
      <p>
        No bait-and-switch, no surprise fees at checkout. The price you see is
        the price you pay. If you find it cheaper elsewhere, we'll match it
        and refund the difference — that's our best price guarantee.
      </p>

      <h3>Privacy first</h3>
      <p>
        Your data is yours. We never sell your search history to third parties,
        and you can delete your account at any time. Period.
      </p>

      <h3>Real humans</h3>
      <p>
        Our support team is staffed 24/7 by people who actually travel. No
        chatbots, no offshore call centers, no copy-paste responses.
      </p>

      <h2 id="investors">Investors</h2>
      <p>
        Travelable is privately held and growing on customer revenue. For
        investor inquiries, email <a href="mailto:investors@travelable.app">investors@travelable.app</a>.
      </p>
    </StaticPage>
  );
}