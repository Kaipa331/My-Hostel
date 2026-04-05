import { Link, useLocation } from 'react-router';
import { useAllAuth } from '../context/AuthContext';
import { 
  Compass, 
  Heart, 
  MessageCircle, 
  User, 
  Building2,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '../utils/cn';

export function MobileNav() {
  const { pathname } = useLocation();
  const { user, student } = useAllAuth();

  const isLandlord = user?.role === 'landlord';
  const isStudent = !!student;
  const isLoggedIn = isLandlord || isStudent;

  const dashboardPath = isLandlord
    ? '/landlord/dashboard'
    : isStudent
      ? '/student/dashboard'
      : '/auth';

  const isExploreActive = pathname === '/' || pathname.startsWith('/hostel') || pathname.startsWith('/for-');
  const isAccountActive = pathname.includes('/dashboard') || pathname === '/auth';

  const navItems = [
    {
      id: 'explore',
      label: 'Explore',
      icon: Compass,
      path: '/',
      active: isExploreActive,
    },
    {
      id: 'saved',
      label: isLandlord ? 'My Hostels' : 'Saved',
      icon: isLandlord ? Building2 : Heart,
      path: dashboardPath,
      active: false,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageCircle,
      path: dashboardPath,
      active: false,
    },
    {
      id: 'account',
      label: 'Account',
      icon: isLoggedIn ? LayoutDashboard : User,
      path: dashboardPath,
      active: isAccountActive,
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <nav
        className="glass border border-accent/15 rounded-3xl shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.3)] flex items-center justify-around p-2"
        style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;

          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-2xl transition-all duration-300',
                isActive
                  ? 'bg-accent/10 text-accent scale-105'
                  : 'text-muted-foreground hover:text-foreground active:scale-95'
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    'h-5 w-5',
                    isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'
                  )}
                />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-accent rounded-full border border-background shadow-sm" />
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-bold uppercase tracking-tight',
                  isActive ? 'opacity-100' : 'opacity-60'
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
