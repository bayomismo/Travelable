import { StaticPage } from '@/components/travel/static-page';

export const metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <StaticPage kicker="Legal" title="Terms of Service" lastUpdated="July 2026">
      <p>
        These Terms of Service govern your use of Travelable. By creating an
        account or making a booking, you agree to be bound by these terms.
      </p>

      <h2>1. Your account</h2>
      <p>
        You must provide accurate, current information when creating your
        account. You're responsible for keeping your password secure and for
        all activity under your account. Notify us immediately at{' '}
        <a href="mailto:security@travelable.app">security@travelable.app</a> if
        you suspect unauthorized access.
      </p>

      <h2>2. Bookings</h2>
      <p>
        When you book a hotel or flight through Travelable, you enter into a
        contract with the travel provider (the hotel or airline), not with
        Travelable. We act as your booking agent. The provider's own terms
        (check-in times, cancellation policies, baggage allowances, etc.)
        apply to your booking.
      </p>

      <h2>3. Cancellations and refunds</h2>
      <p>
        Cancellation policies vary by booking. The specific policy for your
        booking is shown on the checkout page before you pay. Most hotels
        offer free cancellation up to 48 hours before check-in; this is
        indicated clearly on the booking.
      </p>

      <h2>4. Best price guarantee</h2>
      <p>
        If you find a lower publicly available price for the same hotel, room
        type, and dates within 24 hours of booking through Travelable, contact
        us and we'll refund the difference.
      </p>

      <h2>5. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, Travelable is not liable for
        indirect, incidental, or consequential damages arising from your use
        of the service. Our total liability for any claim is limited to the
        amount you paid us in the 12 months preceding the claim.
      </p>

      <h2>6. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. We'll notify you of
        material changes by email at least 30 days before they take effect.
        Continued use of Travelable after changes take effect constitutes
        acceptance of the new terms.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about these terms? Email{' '}
        <a href="mailto:legal@travelable.app">legal@travelable.app</a>.
      </p>
    </StaticPage>
  );
}