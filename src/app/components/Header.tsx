import { Link, useNavigate } from 'react-router';
import { useEffect, useState, useCallback } from 'react';
import { useAllAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import {
  LogOut,
  LayoutDashboard,
  Moon,
  Sun,
  Menu,
  X,
} from 'lucide-react';

type Theme = 'light' | 'dark';

export function Header() {
  const { user, student, logout } = useAllAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Apply theme on mount + change
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    navigate('/');
  }, [logout, navigate]);

  const isLandlord = user?.role === 'landlord';
  const isStudent = !!student;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-accent/15 bg-background/80 backdrop-blur-xl">
      {/* Subtle top gold line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8 lg:py-4">

        {/* Branding */}
        <Link
          to="/"
          className="group flex items-center gap-2 transition-all duration-500 sm:gap-3"
          aria-label="Go to homepage"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="relative h-9 w-9 overflow-hidden rounded-xl shadow-rich transition-transform group-hover:scale-105 sm:h-11 sm:w-11 sm:rounded-2xl">
            <img 
              src="/logo.png" 
              alt="MyHostel Logo" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent mix-blend-overlay" />
          </div>
          <span className="text-xl font-display font-black leading-none tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-2xl">
            MyHostel
          </span>
        </Link>

        {/* Desktop Nav Actions */}
        <div className="hidden items-center gap-6 lg:flex">
          <nav className="flex items-center gap-6">
            <NavLink to="/">Find Hostels</NavLink>
            <NavLink to="/for-students">Students</NavLink>
            <NavLink to="/for-landlords">Landlords</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>

          <div className="w-px h-6 bg-border/50 mx-2" />
          
          <div className="flex items-center gap-3">
             {/* Theme Toggle */}
             <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

             {/* Auth Sections (Desktop) */}
             <AuthSection 
                user={user} 
                student={student} 
                isLandlord={isLandlord} 
                isStudent={isStudent} 
                handleLogout={handleLogout} 
             />
          </div>
        </div>

        {/* Mobile Actions Container */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-10 w-10 rounded-xl bg-card border border-border/60 shadow-sm"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out border-b border-accent/10 bg-background/95 backdrop-blur-xl overflow-hidden ${isMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <nav className="flex flex-col p-4 gap-2">
          <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>Find Hostels</MobileNavLink>
          <MobileNavLink to="/for-students" onClick={() => setIsMenuOpen(false)}>For Students</MobileNavLink>
          <MobileNavLink to="/for-landlords" onClick={() => setIsMenuOpen(false)}>For Landlords</MobileNavLink>
          <MobileNavLink to="/about" onClick={() => setIsMenuOpen(false)}>About Us</MobileNavLink>
          
          <div className="h-px bg-border/50 my-2" />
          
          <div className="flex flex-col gap-3">
            <AuthSection 
                user={user} 
                student={student} 
                isLandlord={isLandlord} 
                isStudent={isStudent} 
                handleLogout={handleLogout} 
                isMobile
                onAction={() => setIsMenuOpen(false)}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}

/* ================= SMALL HELPER COMPONENTS ================= */

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to}>
      <Button variant="ghost" className="relative h-auto px-0 text-xs font-bold uppercase tracking-[0.22em] text-foreground/80 transition-colors hover:text-accent group/link">
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover/link:w-full" />
      </Button>
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-2xl bg-card/50 border border-border/40 text-sm font-bold uppercase tracking-widest text-foreground/80 hover:bg-accent/5 hover:text-accent transition-all"
    >
      {children}
    </Link>
  );
}

function ThemeToggle({ theme, toggleTheme }: { theme: Theme; toggleTheme: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="h-9 w-9 rounded-xl transition-all hover:bg-background border border-border/40 lg:border-none"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-yellow-500" />
      ) : (
        <Moon className="h-4 w-4 text-blue-600" />
      )}
    </Button>
  );
}

function AuthSection({ 
    user, student, isLandlord, isStudent, handleLogout, isMobile, onAction 
}: any) {
  if (isLandlord || isStudent) {
    return (
      <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} gap-2`}>
        <Link to={isLandlord ? '/landlord/dashboard' : '/student/dashboard'} onClick={onAction} className={isMobile ? 'w-full' : ''}>
          <Button
            variant={isMobile ? 'outline' : 'ghost'}
            size="sm"
            className={`flex w-full items-center gap-2 rounded-xl px-4 text-[11px] font-bold hover:bg-muted sm:text-xs ${!isMobile && 'h-9 px-3'}`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Button>
        </Link>

        <Button
          variant="ghost"
          size={isMobile ? 'sm' : 'icon'}
          onClick={() => { handleLogout(); onAction?.(); }}
          className={`rounded-xl text-destructive transition-colors hover:bg-destructive/10 ${isMobile ? 'w-full justify-start gap-2 h-11 px-4' : 'h-9 w-9'}`}
        >
          <LogOut className="h-4 w-4" />
          {isMobile && <span>Sign Out</span>}
        </Button>
      </div>
    );
  }

  return (
    <div className={isMobile ? 'w-full' : ''}>
      <Link to="/auth" onClick={onAction} className={isMobile ? 'w-full' : ''}>
        <Button 
          size="sm"
          className={`w-full rounded-xl bg-accent text-[10px] font-black uppercase tracking-[0.14em] text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:scale-105 hover:bg-accent/90 active:scale-95 sm:px-5 sm:tracking-[0.18em] ${!isMobile && 'h-9 px-6'}`}
        >
          {isMobile ? 'Sign In to Account' : 'Sign In'}
        </Button>
      </Link>
    </div>
  );
}
