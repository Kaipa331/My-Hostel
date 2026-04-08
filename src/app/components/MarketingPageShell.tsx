import { ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';

interface MarketingPageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function MarketingPageShell({
  eyebrow,
  title,
  description,
  children,
  actions,
}: MarketingPageShellProps) {
  return (
    <div className="relative overflow-hidden bg-background py-8 sm:py-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-amber-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 sm:gap-16 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <section className="overflow-hidden rounded-[2rem] border border-border/60 bg-card/90 shadow-rich">
          <div className="grid gap-12 px-6 py-10 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-12">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
              <h1 className="mt-4 max-w-3xl font-display text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                {title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {description}
              </p>
            </div>

            <div className="flex flex-col justify-end gap-4 rounded-[1.75rem] bg-gradient-to-br from-primary/[0.1] via-background to-amber-100/60 p-5 lg:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Why it matters</p>
              <p className="text-sm leading-7 text-muted-foreground">
                Consistent design, clear hierarchy, and stronger spacing help the platform feel trustworthy before users ever click a listing.
              </p>
              {actions ? <div className="pt-2">{actions}</div> : null}
            </div>
          </div>
        </section>

        {children}
      </div>
    </div>
  );
}
