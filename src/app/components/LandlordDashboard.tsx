import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAllAuth } from '../context/AuthContext';
import { useData } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Building2, Plus, Edit, Trash2, Mail, 
  Phone, Star, MapPin, Receipt, CheckCircle2, 
  XCircle, Eye, ArrowRight, Home
} from 'lucide-react';
import { toast } from 'sonner';

export function LandlordDashboard() {
  const { user } = useAllAuth();
  const { hostels, inquiries, deleteHostel, getInquiriesByLandlord, getBookingsByLandlord, updateBooking } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'landlord') {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const myHostels = hostels.filter(h => h.landlordId === user.id);
  const myInquiries = getInquiriesByLandlord(user.id);
  const myBookings = getBookingsByLandlord(user.id);

  const handleVerifyPayment = async (bookingId: string) => {
    try {
      await updateBooking(bookingId, { status: 'confirmed' });
      toast.success('Payment verified! Booking confirmed.');
    } catch (error) {
      toast.error('Failed to verify payment.');
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to reject this booking?')) {
      try {
        await updateBooking(bookingId, { status: 'cancelled' });
        toast.info('Booking rejected.');
      } catch (error) {
        toast.error('Failed to reject booking.');
      }
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteHostel(id);
      toast.success('Hostel deleted successfully');
    }
  };

  const totalRooms = myHostels.reduce((acc, hostel) => acc + hostel.rooms.length, 0);
  const totalAvailableRooms = myHostels.reduce((acc, hostel) => 
    acc + hostel.rooms.reduce((sum, room) => sum + room.available, 0), 0
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      
      {/* ================= HEADER ================= */}
      <div className="sticky top-[64px] lg:top-[80px] z-40 glass border-b border-border/50 bg-card/50 backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-premium rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold tracking-tight text-foreground">Landlord Dashboard</h1>
                <p className="text-sm text-muted-foreground font-medium">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex gap-3">
               <Button variant="outline" onClick={() => navigate('/')} className="rounded-xl border-border/50 hover:bg-muted/50 transition-all hidden sm:flex">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Link to="/landlord/hostel/add">
                <Button className="bg-gradient-premium shadow-lg shadow-primary/20 hover:scale-105 transition-all rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Hostel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-slide-up">
        
        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
          <StatCard 
            label="Total Hostels" 
            value={myHostels.length} 
            icon={<Building2 className="text-primary" />} 
          />
          <StatCard 
            label="Total Rooms" 
            value={totalRooms} 
            icon={<Building2 className="text-secondary" />} 
          />
          <StatCard 
            label="Available" 
            value={totalAvailableRooms} 
            icon={<Building2 className="text-success" />} 
          />
          <StatCard 
            label="New Bookings" 
            value={myBookings.filter(b => b.status === 'deposit_paid').length} 
            icon={<Receipt className="text-warning" />} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <aside className="space-y-10 order-first lg:order-last">
            <section>
              <SectionHeader title="Recent Inquiries" count={myInquiries.length} icon={<Mail className="h-5 w-5 text-primary" />} />
              
              {myInquiries.length > 0 ? (
                <div className="space-y-4">
                  {myInquiries.slice(0, 10).map(inquiry => (
                    <Card key={inquiry.id} className="glass border-border/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group/inq">
                      <div className="p-4 space-y-4 text-foreground">
                        <div>
                          <p className="font-display font-bold text-sm mb-1">{inquiry.studentName}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter mb-2">{inquiry.hostelName}</p>
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 rounded-md text-[10px] py-0">{inquiry.roomType}</Badge>
                        </div>
                        
                        <div className="space-y-1.5 text-xs text-muted-foreground font-medium border-t border-border/30 pt-3">
                          <div className="flex items-center gap-2 group-hover/inq:text-primary transition-colors">
                            <Mail className="h-3.5 w-3.5" />
                            <span className="truncate">{inquiry.studentEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5" />
                            <span>{inquiry.studentPhone}</span>
                          </div>
                        </div>
                        
                        {inquiry.message && (
                          <p className="text-xs text-muted-foreground italic bg-muted/30 p-2 rounded-lg line-clamp-2 text-foreground">"{inquiry.message}"</p>
                        )}
                        
                        <div className="flex justify-end">
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
                            {new Date(inquiry.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState icon={<Mail className="h-10 w-10" />} message="No inquiries yet" />
              )}
            </section>
          </aside>

          <div className="lg:col-span-2 space-y-12">
            
            {/* ================= MANAGE BOOKINGS ================= */}
            <section>
              <SectionHeader title="Manage Bookings" count={myBookings.filter(b => b.status === 'deposit_paid').length} icon={<Receipt className="h-5 w-5 text-warning" />} />
              
              {myBookings.length > 0 ? (
                <div className="grid gap-6">
                  {myBookings.map(booking => {
                    const hostel = hostels.find(h => h.id === booking.hostelId);
                    return (
                      <Card key={booking.id} className="glass border-border/50 shadow-rich overflow-hidden hover:scale-[1.01] transition-transform">
                        <div className="p-4 sm:p-6 text-foreground">
                          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-6">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-display font-bold">{hostel?.name || 'Unknown Hostel'}</h3>
                                <Badge variant={
                                  booking.status === 'confirmed' ? 'outline' : 
                                  booking.status === 'deposit_paid' ? 'secondary' : 
                                  booking.status === 'pending' ? 'outline' : 'destructive'
                                } className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-widest ${
                                  booking.status === 'confirmed' ? 'bg-success/10 text-success border-success/20' : 
                                  booking.status === 'pending' ? 'bg-warning/10 text-warning border-warning/20' : ''
                                }`}>
                                  {booking.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 sm:gap-6">
                                <div>
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Total Rent</p>
                                  <p className="font-semibold text-primary text-sm sm:text-base">MK {booking.totalRent.toLocaleString()}</p>
                                </div>
                                <div className="w-px h-8 bg-border/50" />
                                <div>
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Deposit Paid</p>
                                  <p className="font-semibold text-success text-sm sm:text-base">MK {booking.depositAmount.toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                              {booking.receiptUrl && (
                                <a href={booking.receiptUrl} target="_blank" rel="noopener noreferrer">
                                  <Button variant="outline" size="sm" className="rounded-xl text-xs gap-2 border-border/50 shadow-sm">
                                    <Eye className="h-3.5 w-3.5" />
                                    View Receipt
                                  </Button>
                                </a>
                              )}
                              {booking.status === 'deposit_paid' && (
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    className="rounded-xl px-4 text-xs gap-2 bg-success hover:bg-success/90 shadow-lg shadow-success/10"
                                    onClick={() => handleVerifyPayment(booking.id)}
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Verify
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="rounded-xl px-4 text-xs gap-2 text-destructive border-destructive/20 hover:bg-destructive/5"
                                    onClick={() => handleRejectBooking(booking.id)}
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <EmptyState icon={<Receipt className="h-12 w-12" />} message="No bookings to manage yet" />
              )}
            </section>

            {/* ================= MY HOSTELS ================= */}
            <section>
              <SectionHeader title="My Hostels" count={myHostels.length} icon={<Building2 className="h-5 w-5 text-primary" />} />
              
              {myHostels.length > 0 ? (
                <div className="grid gap-6">
                  {myHostels.map(hostel => (
                    <Card key={hostel.id} className="glass border-border/50 shadow-rich overflow-hidden group">
                      <div className="p-4 sm:p-6 text-foreground">
                        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-6">
                          <div className="space-y-3 flex-1">
                            <h3 className="text-2xl font-display font-bold group-hover:text-primary transition-colors">{hostel.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                              <MapPin className="h-4 w-4" />
                              <span>{hostel.address}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
                              <div className="flex items-center gap-1 text-warning bg-warning/10 px-2 py-0.5 rounded-full">
                                <Star className="h-4 w-4 fill-current" />
                                <span>{hostel.rating.toFixed(1)}</span>
                              </div>
                              <span className="text-muted-foreground">{hostel.rooms.length} room types</span>
                              <span className="text-muted-foreground">{hostel.reviews.length} reviews</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Link to={`/landlord/hostel/edit/${hostel.id}`}>
                              <Button variant="outline" size="sm" className="rounded-xl gap-2 border-border/50 shadow-sm hover:bg-muted/50">
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(hostel.id, hostel.name)}
                              className="rounded-xl gap-2 text-destructive border-destructive/20 hover:bg-destructive/5"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 pt-6 border-t border-border/50">
                          {hostel.rooms.map(room => (
                            <Badge key={room.id} variant="secondary" className="px-3 rounded-lg bg-muted text-muted-foreground font-medium text-[10px] uppercase tracking-wide">
                              {room.type}: MK {room.rent.toLocaleString()} ({room.available} left)
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState 
                  icon={<Building2 className="h-16 w-16" />} 
                  message="You haven't added any hostels yet" 
                  actionLabel="Add Your First Hostel"
                  onAction={() => navigate('/landlord/hostel/add')}
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function StatCard({ label, value, icon }: any) {
  return (
    <Card className="glass border-border/50 shadow-rich rounded-3xl overflow-hidden hover:scale-105 transition-all group">
      <CardContent className="pt-8 pb-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{label}</p>
            <p className="text-lg sm:text-3xl lg:text-4xl font-display font-black text-gradient leading-none group-hover:scale-105 transition-transform origin-left">{value}</p>
          </div>
          <div className="w-14 h-14 bg-muted/50 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-card transition-colors duration-500 text-2xl">
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
        <div className="p-2.5 bg-muted rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-500 text-foreground">
          {icon}
        </div>
        <h2 className="text-2xl font-display font-bold tracking-tight text-foreground">{title}</h2>
      </div>
      <Badge variant="secondary" className="px-3 rounded-full font-bold text-muted-foreground">
        {count}
      </Badge>
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