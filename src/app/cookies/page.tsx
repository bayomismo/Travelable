import { StaticPage } from '@/components/travel/static-page';

export const metadata = { title: 'Cookie Policy' };

export default function CookiePage() {
  return (
    <StaticPage kicker="Legal" title="Cookie Policy" lastUpdated="July 2026">
      <p>
        Cookies are small text files placed on your device when you visit a
        website. Travelable uses them to keep you signed in, remember your
        preferences, and understand how the site is used.
      </p>

      <h2>Cookies we use</h2>

      <h3>Essential cookies</h3>
      <p>
        Required for the site to function. They keep you signed in, remember
        your search filters, and protect against fraud. These cannot be
        disabled.
      </p>
      <ul>
        <li><code>tv_session</code> — authentication cookie, 30-day expiry</li>
        <li><code>tv_theme</code> — your light/dark preference, 1-year expiry</li>
      </ul>

      <h3>Analytics cookies</h3>
      <p>
        Help us understand which features are most popular and where people
        get stuck. We use anonymized data only — no personally identifying
        information. You can disable these in your browser settings without
        affecting site functionality.
      </p>

      <h3>Marketing cookies</h3>
      <p>
        We don't use third-party marketing or advertising cookies on
        Travelable. We never sell your data, and we never share your search
        history with external advertisers.
      </p>

      <h2>How to manage cookies</h2>
      <p>You can:</p>
      <ul>
        <li>Disable non-essential cookies in your browser settings</li>
        <li>Delete Travelable's cookies via your browser's privacy controls</li>
        <li>Use a private/incognito browsing window</li>
      </ul>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The "Last updated" date
        at the top of this page reflects the most recent change.
      </p>
    </StaticPage>
  );
}