import { Outlet, Link } from 'react-router-dom';
import { Header } from './Header';
import { useEffect } from 'react';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { MobileNav } from './MobileNav';

export function MainLayout() {
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 text-foreground transition-colors duration-500">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 w-full animate-slide-up pt-20 lg:pt-32 pb-24 lg:pb-12">
        <Outlet />
      </main>

      {/* Bottom Mobile Navigation */}
      <MobileNav />

      {/* ================= FOOTER ================= */}
      <footer className="relative mt-24 overflow-hidden border-t border-accent/10 bg-neutral-950 pt-16 pb-12 text-neutral-400 sm:mt-32 sm:pt-24 sm:pb-16">
        {/* Abstract background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="mb-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mb-16 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1fr] lg:gap-12">
            {/* Brand Section */}
            <div className="space-y-5 sm:space-y-6">
              <Link to="/" className="flex items-center gap-3 group w-fit">
                <div className="h-12 w-12 rounded-2xl overflow-hidden shadow-2xl shadow-accent/10 border border-white/5">
                  <img src="/logo.png" alt="MyHostel" className="w-full h-full object-cover" />
                </div>
                <span className="text-2xl font-display font-black tracking-tight text-white group-hover:text-accent transition-colors">
                  MyHostel
                </span>
              </Link>

              <p className="max-w-sm text-sm leading-7 text-neutral-400">
                Elevating the student living experience in Malawi through verified, high-quality housing solutions and seamless management for landlords.
              </p>

              <div className="flex gap-3">
                <SocialIcon icon={<Facebook className="h-5 w-5" />} />
                <SocialIcon icon={<Instagram className="h-5 w-5" />} />
                <SocialIcon icon={<Twitter className="h-5 w-5" />} />
              </div>
            </div>

            {/* Find a Room */}
            <div className="sm:pl-2 lg:pl-4">
              <h4 className="mb-6 text-xs font-display font-bold uppercase tracking-[0.2em] text-white">
                Find a Room
              </h4>
              <ul className="space-y-3.5">
                <FooterLink to="/">Hostels in Zomba</FooterLink>
                <FooterLink to="/">Blantyre Accommodation</FooterLink>
                <FooterLink to="/">Lilongwe Student Housing</FooterLink>
                <FooterLink to="/">Mzuzu Varsity Rooms</FooterLink>
              </ul>
            </div>

            {/* Landlord Solutions */}
            <div>
              <h4 className="mb-6 text-xs font-display font-bold uppercase tracking-[0.2em] text-white">
                Landlord Solutions
              </h4>
              <ul className="space-y-3.5">
                <FooterLink to="/list-property">List Your Property</FooterLink>
                <FooterLink to="/landlord/dashboard">Management Dashboard</FooterLink>
                <FooterLink to="/for-landlords">Pricing & Plans</FooterLink>
                <FooterLink to="/contact">Support for Owners</FooterLink>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-6">
              <h4 className="text-xs font-display font-bold uppercase tracking-[0.2em] text-white">
                Newsletter
              </h4>
              <p className="text-sm leading-7 text-neutral-400">
                Get the latest property listings and student guides delivered to your inbox.
              </p>

              <div className="flex flex-col gap-3">
                <div className="flex-1 flex gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl focus-within:border-accent/50 focus-within:bg-white/10 transition-all">
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full border-0 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-500"
                  />
                </div>
                <button className="whitespace-nowrap rounded-2xl bg-accent px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:scale-105 active:scale-95">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-8 text-center sm:pt-10 lg:flex-row lg:text-left">
            <div className="flex flex-wrap justify-center gap-4 text-[11px] font-black uppercase tracking-[0.16em] text-neutral-600 sm:gap-6 lg:justify-start lg:gap-8">
              <Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
              <Link to="/about" className="hover:text-accent transition-colors">About Us</Link>
              <Link to="/help" className="hover:text-accent transition-colors">Help Center</Link>
              <Link to="/contact" className="hover:text-accent transition-colors">Contact</Link>
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-7">
              <div className="flex items-center gap-3 text-neutral-400">
                <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.18em]">hello@myhostel.com</span>
              </div>

              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-700">
                © {new Date().getFullYear()} MyHostel. Excellence in Living.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */
function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl bg-white/5 text-white shadow-sm transition-all hover:scale-105 hover:bg-accent hover:text-accent-foreground hover:shadow-md active:scale-95">
      {icon}
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        to={to}
        className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-white"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-accent transition-all duration-300" />
        {children}
      </Link>
    </li>
  );
}
