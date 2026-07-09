import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold text-gradient-brand">404</p>
        <h1 className="text-2xl font-bold mt-4 mb-2">We couldn't find that</h1>
        <p className="text-muted-foreground mb-8">
          The page or trip you're looking for has either moved or never existed.
          Let's get you back on the road.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Back to home
            </Button>
          </Link>
          <Link href="/search">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Browse trips
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}