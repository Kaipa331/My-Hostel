import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AppContext';
import { useAllAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Building2, LogOut, LayoutDashboard } from 'lucide-react';

export function Header() {
  const { landlord, logout } = useAuth();
  const { student, studentLogout } = useAllAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStudentLogout = () => {
    studentLogout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-y-4">
        <Link to="/" className="flex items-center gap-2">
          <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <span className="text-xl sm:text-2xl text-blue-600">HostelFinder</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
          {landlord ? (
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
              <Button variant="ghost" onClick={handleStudentLogout} className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10">
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
