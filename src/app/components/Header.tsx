import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useAllAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Building2, LogOut, LayoutDashboard, Moon, Sun } from 'lucide-react';

export function Header() {
  const { user, student, logout } = useAllAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark' | null);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ?? (systemPrefersDark ? 'dark' : 'light');

    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    setTheme(initialTheme);
  }, []);

  const applyTheme = (nextTheme: 'light' | 'dark') => {
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    localStorage.setItem('theme', nextTheme);
    setTheme(nextTheme);
  };

  const toggleTheme = () => {
    applyTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-y-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="MyHostel.com Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">MyHostel.com</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
          <Button variant="outline" onClick={toggleTheme} className="text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10">
            {theme === 'dark' ? <Sun className="h-3 w-3 sm:h-4 sm:w-4" /> : <Moon className="h-3 w-3 sm:h-4 sm:w-4" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
          {user?.role === 'landlord' ? (
            <>
              <Link to="/landlord/dashboard">
                <Button variant="ghost" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10">
                  <LayoutDashboard className="h-3 w-3 sm:h-4 sm:w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout} className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                Logout
              </Button>
            </>
          ) : student ? (
            <>
              <Link to="/student/dashboard">
                <Button variant="ghost" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10">
                  <LayoutDashboard className="h-3 w-3 sm:h-4 sm:w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout} className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/">
                <Button variant="ghost" className="text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10">Find Hostels</Button>
              </Link>
              <Link to="/student/auth">
                <Button variant="outline" className="text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10">Student Login</Button>
              </Link>
              <Link to="/landlord/auth">
                <Button className="text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10">Landlord Login</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
