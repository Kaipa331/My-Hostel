import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AppContext';
import { Button } from './ui/button';
import { Building2, LogOut, LayoutDashboard } from 'lucide-react';

export function Header() {
  const { landlord, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-blue-600" />
          <span className="text-2xl text-blue-600">HostelFinder</span>
        </Link>

        <nav className="flex items-center gap-4">
          {landlord ? (
            <>
              <Link to="/landlord/dashboard">
                <Button variant="ghost" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/">
                <Button variant="ghost">Find Hostels</Button>
              </Link>
              <Link to="/landlord/auth">
                <Button>Landlord Login</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
