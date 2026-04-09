import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Compass, Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-200px)] items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 px-4 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-80 w-80 rounded-full bg-amber-300/20 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-xl rounded-[2rem] border border-border/70 bg-card/85 p-10 text-center shadow-rich">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Compass className="h-10 w-10 text-primary" />
        </div>
        <h1 className="mb-2 text-6xl font-black tracking-tighter text-foreground">404</h1>
        <h2 className="mb-4 text-2xl font-bold text-foreground">Page Not Found</h2>
        <p className="mb-8 leading-relaxed text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. Let's get you back to safety.
        </p>
        <Link to="/">
          <Button className="w-full gap-2 sm:w-auto" size="lg">
            <Home className="h-4 w-4" />
            Go to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
