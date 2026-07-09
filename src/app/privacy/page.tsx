import { StaticPage } from '@/components/travel/static-page';

export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <StaticPage kicker="Legal" title="Privacy Policy" lastUpdated="July 2026">
      <p>
        Travelable respects your privacy. This policy explains what data we
        collect, why we collect it, and what you can do to control it.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Account data:</strong> name, email, hashed password (we never see your password in plaintext)</li>
        <li><strong>Booking data:</strong> dates, destinations, preferences, payment receipts (we don't store full card numbers)</li>
        <li><strong>Usage data:</strong> pages visited, search queries, clicked results</li>
        <li><strong>Device data:</strong> IP address, browser type, screen size</li>
      </ul>

      <h2>Why we collect it</h2>
      <p>To:</p>
      <ul>
        <li>Process and confirm your bookings</li>
        <li>Provide personalized recommendations and itineraries</li>
        <li>Send you booking confirmations, updates, and price alerts</li>
        <li>Detect fraud and keep your account secure</li>
        <li>Improve Travelable for everyone</li>
      </ul>

      <h2>What we do NOT do</h2>
      <ul>
        <li>We do not sell your personal data to third parties.</li>
        <li>We do not share your search history with advertisers.</li>
        <li>We do not store full credit card numbers (handled by our PCI-compliant payment processor).</li>
      </ul>

      <h2>Your rights</h2>
      <p>You can:</p>
      <ul>
        <li>Access a copy of all data we hold about you (Settings → Export data)</li>
        <li>Delete your account and all associated data (Settings → Delete account)</li>
        <li>Opt out of marketing emails at any time via the unsubscribe link</li>
        <li>Disable analytics tracking in Settings</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We use cookies and similar technologies to keep you signed in, remember
        your preferences, and measure site performance. You can disable
        non-essential cookies in your browser settings, though some features
        may not work as expected.
      </p>

      <h2>How long we keep your data</h2>
      <p>
        Account data is kept while your account is active. Booking records are
        kept for 7 years for tax and legal compliance. Search history older
        than 18 months is automatically anonymized.
      </p>

      <h2>International transfers</h2>
      <p>
        Travelable is hosted in the United States. If you're visiting from
        outside the US, your data will be transferred to and processed in the
        US. We use Standard Contractual Clauses to protect your data when
        transferring it internationally.
      </p>

      <h2>Children's privacy</h2>
      <p>
        Travelable is not directed at children under 13. We do not knowingly
        collect data from children under 13. If you believe a child has
        created an account, contact us at{' '}
        <a href="mailto:privacy@travelable.app">privacy@travelable.app</a> and
        we'll delete it.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions? Email{' '}
        <a href="mailto:privacy@travelable.app">privacy@travelable.app</a> or
        write to us at Travelable, 1 Market Street, San Francisco, CA 94105.
      </p>
    </StaticPage>
  );
}