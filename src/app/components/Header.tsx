import { Link, useNavigate } from 'react-router';
import { useEffect, useState, useCallback } from 'react';
import { useAllAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import {
  LogOut,
  LayoutDashboard,
  Moon,
  Sun,
} from 'lucide-react';

type Theme = 'light' | 'dark';

export function Header() {
  const { user, student, logout } = useAllAuth();
  const navigate = useNavigate();

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
      
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 lg:py-4">

        {/* Branding with New Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group transition-all duration-500"
          aria-label="Go to homepage"
        >
          <div className="relative h-11 w-11 overflow-hidden rounded-2xl shadow-rich transition-transform group-hover:scale-105">
            <img 
              src="/logo.png" 
              alt="MyHostel Logo" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent mix-blend-overlay" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-display font-black leading-none tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-2xl">
              MyHostel
            </span>
          </div>
        </Link>

        {/* Nav Actions */}
        <nav className="flex items-center gap-2 sm:gap-3">
          
          {/* Main Nav Links (Desktop) */}
          <div className="mr-4 hidden items-center gap-6 lg:flex">
             <Link to="/">
              <Button variant="ghost" className="relative h-auto px-0 text-xs font-bold uppercase tracking-[0.22em] text-foreground/80 transition-colors hover:text-accent group/link">
                Find Hostels
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover/link:w-full" />
              </Button>
            </Link>
            <Link to="/for-students">
              <Button variant="ghost" className="relative h-auto px-0 text-xs font-bold uppercase tracking-[0.22em] text-foreground/80 transition-colors hover:text-accent group/link">
                Students
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover/link:w-full" />
              </Button>
            </Link>
            <Link to="/for-landlords">
              <Button variant="ghost" className="relative h-auto px-0 text-xs font-bold uppercase tracking-[0.22em] text-foreground/80 transition-colors hover:text-accent group/link">
                Landlords
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover/link:w-full" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" className="relative h-auto px-0 text-xs font-bold uppercase tracking-[0.22em] text-foreground/80 transition-colors hover:text-accent group/link">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-accent transition-all duration-300 group-hover/link:w-full" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/80 p-1.5 shadow-sm">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-9 w-9 rounded-xl transition-all hover:bg-background"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-yellow-500" />
              ) : (
                <Moon className="h-4 w-4 text-blue-600" />
              )}
            </Button>

            <div className="w-px h-4 bg-border/50 mx-1" />

            {/* Auth Sections */}
            {isLandlord || isStudent ? (
              <div className="flex items-center gap-1">
                <Link to={isLandlord ? '/landlord/dashboard' : '/student/dashboard'}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 rounded-xl px-4 text-xs font-bold hover:bg-background"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-9 w-9 rounded-xl text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/student/auth">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl px-4 text-[10px] font-black uppercase tracking-[0.18em] hover:bg-background sm:px-5"
                  >
                    Student Login
                  </Button>
                </Link>

                <Link to="/landlord/auth">
                  <Button 
                    size="sm"
                    className="rounded-xl bg-accent px-4 text-[10px] font-black uppercase tracking-[0.18em] text-accent-foreground shadow-lg shadow-accent/20 transition-all hover:scale-105 hover:bg-accent/90 active:scale-95 sm:px-5"
                  >
                    Landlord Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
