import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAllAuth } from '../context/AuthContext';
import { useData } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  GraduationCap, Heart, Mail, User, Phone, 
  Building, Home, MapPin, Receipt, Clock, 
  CheckCircle2, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { student, toggleSaveHostel } = useAllAuth();
  const { hostels, inquiries, getBookingsByStudent } = useData();

  useEffect(() => {
    if (!student) {
      navigate('/student/auth');
    }
  }, [student, navigate]);

  if (!student) return null;

  const savedHostels = hostels.filter(h => student.savedHostels.includes(h.id));
  const studentInquiries = inquiries.filter(i => i.studentEmail === student.email);
  const studentBookings = getBookingsByStudent(student.id);

  const getDeadlineStatus = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${mins}m remaining`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      
      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-40 glass border-b border-border/50 bg-card/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-premium rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold tracking-tight">Student Dashboard</h1>
                <p className="text-sm text-muted-foreground font-medium">{student.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/')} className="rounded-xl border-border/50 hover:bg-muted/50 transition-all">
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Browse Hostels</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-slide-up">
        
        {/* ================= QUICK STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label="Saved Hostels" 
            value={savedHostels.length} 
            icon={<Heart className="h-6 w-6 text-destructive" />} 
          />
          <StatCard 
            label="Inquiries Sent" 
            value={studentInquiries.length} 
            icon={<Mail className="h-6 w-6 text-primary" />} 
          />
          <StatCard 
            label="Active Bookings" 
            value={studentBookings.filter(b => b.status !== 'cancelled').length} 
            icon={<Receipt className="h-6 w-6 text-success" />} 
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-10">
            
            {/* ================= ACTIVE BOOKINGS ================= */}
            <section>
              <SectionHeader title="My Bookings" count={studentBookings.length} icon={<Receipt className="h-5 w-5 text-success" />} />
              
              {studentBookings.length === 0 ? (
                <EmptyState 
                  icon={<Receipt className="h-12 w-12" />} 
                  message="No bookings yet" 
                  actionLabel="Find a hostel to book" 
                  onAction={() => navigate('/')} 
                />
              ) : (
                <div className="space-y-6">
                  {studentBookings.map(booking => {
                    const hostel = hostels.find(h => h.id === booking.hostelId);
                    return (
                      <Card key={booking.id} className="glass border-border/50 shadow-rich overflow-hidden group hover:scale-[1.01] transition-all duration-300">
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div className="space-y-2">
                              <h3 className="font-display font-bold text-xl group-hover:text-primary transition-colors">{hostel?.name || 'Loading...'}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{hostel?.address}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                              <Badge 
                                variant={booking.status === 'confirmed' ? 'outline' : booking.status === 'pending' ? 'outline' : booking.status === 'deposit_paid' ? 'secondary' : 'destructive'}
                                className={`px-3 py-1 rounded-full uppercase tracking-wider text-[10px] ${
                                  booking.status === 'confirmed' ? 'bg-success/10 text-success border-success/20' : 
                                  booking.status === 'pending' ? 'bg-warning/10 text-warning border-warning/20' : ''
                                }`}
                              >
                                {booking.status.replace('_', ' ')}
                              </Badge>
                              {booking.status === 'pending' && (
                                <div className="flex items-center gap-1.5 text-xs text-warning font-bold animate-pulse">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>Deadline: {getDeadlineStatus(booking.depositDeadline)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-2xl text-sm mb-6 border border-border/20">
                            <div>
                              <p className="text-muted-foreground mb-1 uppercase tracking-tighter font-bold text-[10px]">Monthly Rent</p>
                              <p className="font-display font-bold text-lg">MK {booking.totalRent.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1 uppercase tracking-tighter font-bold text-[10px]">Booking Fee (5%)</p>
                              <p className="font-display font-bold text-lg">MK {booking.bookingFee.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1 uppercase tracking-tighter font-bold text-[10px]">Deposit (50%)</p>
                              <p className="font-display font-bold text-lg">MK {booking.depositAmount.toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-end">
                            {booking.status === 'pending' ? (
                              <Button 
                                className="bg-gradient-premium shadow-lg shadow-primary/20 hover:scale-105 transition-all rounded-xl" 
                                onClick={() => navigate(`/hostel/${booking.hostelId}`)}
                              >
                                Complete Payment <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            ) : (
                              <div className={`flex items-center gap-3 text-sm px-4 py-3 rounded-xl border ${
                                booking.status === 'confirmed' 
                                ? 'text-success bg-success/10 border-success/20' 
                                : 'text-primary bg-primary/10 border-primary/20 animate-pulse'
                              }`}>
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-medium">
                                  {booking.status === 'confirmed' 
                                    ? 'Your booking is confirmed! You can now move in.' 
                                    : 'Deposit receipt submitted. Waiting for landlord to verify.'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>

            {/* ================= SAVED HOSTELS ================= */}
            <section>
              <SectionHeader title="Saved Hostels" count={savedHostels.length} icon={<Heart className="h-5 w-5 text-destructive" />} />
              
              {savedHostels.length === 0 ? (
                <EmptyState 
                  icon={<Heart className="h-12 w-12" />} 
                  message="No saved hostels yet" 
                  actionLabel="Browse hostels to save" 
                  onAction={() => navigate('/')} 
                />
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {savedHostels.map(hostel => {
                    const minRent = Math.min(...hostel.rooms.map(r => r.rent));
                    return (
                      <Card key={hostel.id} className="glass border-border/50 shadow-rich rounded-3xl overflow-hidden hover:scale-[1.02] transition-all group">
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="space-y-1">
                              <h3 className="font-display font-bold text-lg leading-tight group-hover:text-primary transition-colors">{hostel.name}</h3>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-tight font-medium">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{hostel.university}</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
                              onClick={() => {
                                toggleSaveHostel(hostel.id);
                                toast.success('Removed from saved hostels');
                              }}
                            >
                              <Heart className="h-4 w-4 fill-current" />
                            </Button>
                          </div>
                          
                          <div className="mb-6">
                            <span className="text-2xl font-bold font-display text-gradient">MK {minRent.toLocaleString()}</span>
                            <span className="text-muted-foreground text-xs font-medium ml-1">/month</span>
                          </div>

                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => navigate(`/hostel/${hostel.id}`)}
                            className="w-full rounded-xl bg-muted/50 border hover:bg-primary hover:text-white transition-all"
                          >
                            View Details
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-10">
            {/* ================= PROFILE CARD ================= */}
            <Card className="glass border-border/50 shadow-rich rounded-3xl overflow-hidden sticky top-28">
              <div className="h-2 bg-gradient-premium w-full" />
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center border-4 border-background shadow-lg mb-4">
                  <User className="h-10 w-10 text-muted-foreground" />
                </div>
                <CardTitle className="font-display font-bold">My Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ProfileItem icon={<User />} label="Name" value={student.name} />
                <ProfileItem icon={<Mail />} label="Email" value={student.email} />
                <ProfileItem icon={<Phone />} label="Phone" value={student.phone} />
                <ProfileItem icon={<Building />} label="University" value={student.university} />
                <ProfileItem icon={<GraduationCap />} label="Student ID" value={student.studentId} />
                
                <Button variant="outline" className="w-full rounded-xl border-border/50 hover:bg-muted/50">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* ================= RECENT INQUIRIES ================= */}
            <section>
              <SectionHeader title="Recent Inquiries" count={studentInquiries.length} icon={<Mail className="h-5 w-5 text-primary" />} />
              
              {studentInquiries.length === 0 ? (
                <EmptyState 
                  icon={<Mail className="h-10 w-10" />} 
                  message="No inquiries sent yet" 
                />
              ) : (
                <div className="space-y-4">
                  {studentInquiries.slice(0, 3).map(inquiry => (
                    <Card key={inquiry.id} className="glass border-border/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm leading-tight text-primary">{inquiry.hostelName}</h4>
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                            {new Date(inquiry.date).toLocaleDateString()}
                          </span>
                        </div>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 rounded-md text-[10px] py-0">{inquiry.roomType}</Badge>
                        <p className="text-xs text-muted-foreground line-clamp-2 italic bg-muted/30 p-2 rounded-lg">"{inquiry.message}"</p>
                      </div>
                    </Card>
                  ))}
                  {studentInquiries.length > 3 && (
                    <Button variant="link" className="w-full text-xs text-muted-foreground font-bold">
                      View All Inquiries
                    </Button>
                  )}
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function StatCard({ label, value, icon }: any) {
  return (
    <Card className="glass border-border/50 shadow-rich rounded-3xl overflow-hidden hover:scale-105 transition-all group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{label}</p>
            <p className="text-4xl font-display font-black text-gradient leading-none group-hover:scale-110 transition-transform origin-left">{value}</p>
          </div>
          <div className="w-14 h-14 bg-muted/50 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-card transition-colors duration-500">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionHeader({ title, count, icon }: any) {
  return (
    <div className="flex items-center justify-between mb-6 group">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-muted rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        <h2 className="text-2xl font-display font-bold tracking-tight">{title}</h2>
      </div>
      <Badge variant="secondary" className="px-3 rounded-full font-bold text-muted-foreground">
        {count}
      </Badge>
    </div>
  );
}

function ProfileItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4 group/item">
      <div className="w-9 h-9 bg-muted/40 rounded-xl flex items-center justify-center text-muted-foreground shadow-sm group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300">
        {icon && <div className="h-4 w-4">{icon}</div>}
      </div>
      <div className="flex-1">
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">{label}</p>
        <p className="text-sm font-semibold truncate text-foreground">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ icon, message, actionLabel, onAction }: any) {
  return (
    <Card className="border-2 border-dashed border-border/50 bg-muted/20 rounded-3xl">
      <CardContent className="py-16 text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground/30 shadow-inner">
          {icon}
        </div>
        <div>
          <p className="text-muted-foreground font-medium">{message}</p>
          {actionLabel && (
            <Button variant="link" onClick={onAction} className="text-primary font-bold hover:scale-105 transition-transform">
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
