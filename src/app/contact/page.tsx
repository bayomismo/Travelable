'use client';

import { useState } from 'react';
import { Mail, MessageCircle, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { StaticPage } from '@/components/travel/static-page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? 'Failed to send');
      }
      setSent(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setBusy(false);
    }
  };

  return (
    <StaticPage kicker="Support" title="Contact us" lastUpdated="July 2026">
      <p>
        We typically respond within 4 hours during business days and within
        24 hours on weekends. For urgent issues with an active booking, call
        us directly.
      </p>

      <div className="not-prose grid sm:grid-cols-3 gap-4 my-6">
        <div className="bg-card border rounded-2xl p-5">
          <Mail className="h-5 w-5 text-primary mb-2" />
          <p className="font-semibold text-sm">Email</p>
          <a href="mailto:support@travelable.app" className="text-sm text-muted-foreground hover:text-primary">
            support@travelable.app
          </a>
        </div>
        <div className="bg-card border rounded-2xl p-5">
          <Phone className="h-5 w-5 text-primary mb-2" />
          <p className="font-semibold text-sm">Phone</p>
          <a href="tel:+18005551234" className="text-sm text-muted-foreground hover:text-primary">
            +1 (800) 555-1234
          </a>
          <p className="text-xs text-muted-foreground mt-1">24/7 support</p>
        </div>
        <div className="bg-card border rounded-2xl p-5">
          <MapPin className="h-5 w-5 text-primary mb-2" />
          <p className="font-semibold text-sm">HQ</p>
          <p className="text-sm text-muted-foreground">
            1 Market Street<br />
            San Francisco, CA 94105
          </p>
        </div>
      </div>

      <h2>Send us a message</h2>

      {sent ? (
        <div className="not-prose bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-emerald-900">Message sent!</h3>
            <p className="text-sm text-emerald-800 mt-1">
              We'll get back to you within 24 hours. For urgent issues, call our 24/7 line at +1 (800) 555-1234.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="not-prose bg-card border rounded-2xl p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cn" className="text-xs mb-1.5 block">Name</Label>
              <Input id="cn" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="ce" className="text-xs mb-1.5 block">Email</Label>
              <Input id="ce" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="cs" className="text-xs mb-1.5 block">Subject</Label>
            <Input id="cs" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="How can we help?" />
          </div>
          <div>
            <Label htmlFor="cm" className="text-xs mb-1.5 block">Message</Label>
            <textarea
              id="cm"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what's going on…"
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={busy}
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send message
              </>
            )}
          </Button>
        </form>
      )}
    </StaticPage>
  );
}