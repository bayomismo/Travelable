import Link from 'next/link';
import { StaticPage, ContactBlock } from '@/components/travel/static-page';

export const metadata = { title: 'Help Center' };

const sections = [
  { id: 'account', title: 'Account & sign-in' },
  { id: 'booking', title: 'Making a booking' },
  { id: 'payment', title: 'Payments' },
  { id: 'cancellation', title: 'Cancellation & refunds' },
  { id: 'safety', title: 'Safety' },
  { id: 'loyalty', title: 'Loyalty & rewards' },
];

export default function HelpPage() {
  return (
    <StaticPage kicker="Support" title="Help Center" lastUpdated="July 2026">
      <p>
        How can we help? Browse the topics below or{' '}
        <Link href="/contact" className="text-primary underline">contact us</Link>.
      </p>

      <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="block bg-card border rounded-xl px-4 py-3 text-sm font-medium hover:border-primary hover:bg-accent transition-colors"
          >
            → {s.title}
          </a>
        ))}
      </div>

      <h2 id="account">Account & sign-in</h2>
      <p>
        Create a Travelable account with your email and a password. We use
        industry-standard encryption to keep your credentials safe. If you
        forget your password, use the "Forgot password" link on the sign-in
        page to receive a reset link by email.
      </p>

      <h2 id="booking">Making a booking</h2>
      <p>
        Search by destination, dates, and travelers. Filter by star rating,
        price, amenities, or guest rating. Click a hotel to see rooms and
        photos. Pick a room, choose your dates, and confirm your booking in
        under a minute. Your confirmation is emailed immediately.
      </p>

      <h2 id="payment">Payments</h2>
      <p>
        We accept all major credit and debit cards. Your card is charged at
        the time of booking; the hotel collects any incidentals (minibar,
        room service, etc.) at check-out. We never store your full card
        number — payment processing is handled by PCI-compliant partners.
      </p>

      <h2 id="cancellation">Cancellation & refunds</h2>
      <p>
        Most hotels offer free cancellation up to 48 hours before check-in.
        This is shown clearly on the booking page. To cancel, go to{' '}
        <Link href="/dashboard" className="text-primary underline">Dashboard → My trips</Link>{' '}
        and click "Cancel booking". Refunds typically appear on your card
        within 5–10 business days.
      </p>

      <h2 id="safety">Safety</h2>
      <p>
        Every property on Travelable is verified by our team before listing.
        Look for the "Verified" badge on search results. If something feels
        wrong at your hotel, contact our 24/7 support team immediately and
        we'll help.
      </p>

      <h2 id="loyalty">Loyalty & rewards</h2>
      <p>
        Every booking earns loyalty points. Climb tiers (Bronze → Silver →
        Gold → Platinum) to unlock perks like free upgrades and priority
        support. Your tier is visible on your{' '}
        <Link href="/dashboard" className="text-primary underline">dashboard</Link>.
      </p>

      <ContactBlock />
    </StaticPage>
  );
}