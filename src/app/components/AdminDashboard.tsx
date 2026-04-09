import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAllAuth } from '../context/AuthContext';
import { useData } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Shield, Users, Building, CheckCircle, 
  XCircle, Clock, Home, ArrowRight, UserPlus
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { admin, landlords, approveLandlord, rejectLandlord } = useAllAuth();
  const { hostels, inquiries } = useData();

  useEffect(() => {
    if (!admin) {
      navigate('/admin/auth');
    }
  }, [admin, navigate]);

  const handleApproveLandlord = (landlordId: string, name: string) => {
    approveLandlord(landlordId);
    toast.success(`${name}'s account has been approved!`);
  };

  const handleRejectLandlord = (landlordId: string, name: string) => {
    rejectLandlord(landlordId);
    toast.success(`${name}'s account has been rejected`);
  };

  if (!admin) return null;

  const pendingLandlords = landlords.filter(l => l.status === 'pending');
  const approvedLandlords = landlords.filter(l => l.status === 'approved');
  const rejectedLandlords = landlords.filter(l => l.status === 'rejected');

  const stats = [
    { label: 'Total Landlords', value: landlords.length, icon: <Users />, color: 'text-primary' },
    { label: 'Pending Approval', value: pendingLandlords.length, icon: <Clock />, color: 'text-warning' },
    { label: 'Total Hostels', value: hostels.length, icon: <Building />, color: 'text-success' },
    { label: 'Total Inquiries', value: inquiries.length, icon: <Home />, color: 'text-secondary' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 pb-16">
      
      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-destructive rounded-2xl flex items-center justify-center shadow-lg shadow-destructive/20 border border-destructive/20">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold tracking-tight uppercase tracking-widest text-foreground">Admin Control Center</h1>
                <p className="text-sm text-muted-foreground font-medium">Administrator: {admin.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/')} className="rounded-xl border-border/50 hover:bg-muted/50 transition-all">
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Portal Home</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10 animate-slide-up">
        
        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-foreground">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="space-y-8 order-first lg:order-last text-foreground">
            {/* ================= LANDLORD DIRECTORY ================= */}
            <section>
              <SectionHeader title="Landlords" count={approvedLandlords.length} icon={<Users className="h-5 w-5 text-primary" />} />
              
              <div className="space-y-4">
                {approvedLandlords.map(landlord => (
                  <Card key={landlord.id} className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all group">
                    <div className="p-4 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-display font-bold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">{landlord.name}</h4>
                          <Badge className="bg-success/10 text-success border-success/20 rounded-md text-[8px] py-0 font-black uppercase tracking-widest">Verified</Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{landlord.email}</p>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full h-8 text-[10px] font-bold uppercase tracking-widest rounded-lg border-destructive/20 text-destructive hover:bg-destructive/5"
                        onClick={() => handleRejectLandlord(landlord.id, landlord.name)}
                      >
                        Revoke Access
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

             {/* ================= REJECTED LANDLORDS ================= */}
             {rejectedLandlords.length > 0 && (
               <section>
                 <SectionHeader title="Suspended" count={rejectedLandlords.length} icon={<Shield className="h-5 w-5 text-destructive" />} />
                 <div className="space-y-2 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                    {rejectedLandlords.map(landlord => (
                        <Card key={landlord.id} className="bg-white border border-red-200 rounded-2xl p-3 flex items-center justify-between">
                            <span className="text-xs font-bold text-destructive truncate">{landlord.name}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-[8px] font-black uppercase px-2 hover:bg-success/10 hover:text-success"
                              onClick={() => handleApproveLandlord(landlord.id, landlord.name)}
                            >
                              Restore
                            </Button>
                        </Card>
                    ))}
                 </div>
               </section>
             )}
          </aside>

          <div className="lg:col-span-2 space-y-10 text-foreground">
            {/* ================= PENDING LANDLORDS ================= */}
            <section>
              <SectionHeader title="Pending Approvals" count={pendingLandlords.length} icon={<UserPlus className="h-5 w-5 text-warning" />} />
              
              {pendingLandlords.length > 0 ? (
                <div className="space-y-6">
                  {pendingLandlords.map(landlord => (
                    <Card key={landlord.id} className="bg-white border border-yellow-200 shadow-sm rounded-2xl overflow-hidden group">
                        <div className="p-4 sm:p-6 text-foreground">
                          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-6">
                            <div className="space-y-1.5 flex-1 min-w-0">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="text-lg sm:text-xl font-display font-bold truncate">{landlord.name}</h3>
                                <Badge className="bg-warning/10 text-warning border-warning/20 rounded-full px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-widest">
                                  Pending
                                </Badge>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground font-medium">
                                 <div className="flex items-center gap-2 truncate">
                                  <Shield className="h-3.5 w-3.5 flex-shrink-0" />
                                  <span className="truncate">{landlord.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                                  <span>{new Date(landlord.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button 
                              onClick={() => handleApproveLandlord(landlord.id, landlord.name)}
                              className="flex-1 sm:flex-initial rounded-xl px-4 sm:px-6 bg-success hover:bg-success/90 shadow-lg shadow-success/10 gap-2 text-xs sm:text-sm"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="hidden xs:inline">Approve</span>
                            </Button>
                            <Button 
                              onClick={() => handleRejectLandlord(landlord.id, landlord.name)}
                              variant="destructive"
                              className="flex-1 sm:flex-initial rounded-xl px-4 sm:px-6 shadow-lg shadow-destructive/10 gap-2 text-xs sm:text-sm"
                            >
                              <XCircle className="h-4 w-4" />
                              <span className="hidden xs:inline">Reject</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState icon={<Clock className="h-12 w-12" />} message="No pending approvals" />
              )}
            </section>

            {/* ================= ALL HOSTELS OVERVIEW ================= */}
            <section>
              <SectionHeader title="Platform Hostels" count={hostels.length} icon={<Building className="h-5 w-5 text-primary" />} />
              
              <div className="grid sm:grid-cols-2 gap-6 text-foreground">
                {hostels.map(hostel => {
                  const landlord = landlords.find(l => l.id === hostel.landlordId);
                  return (
                    <Card key={hostel.id} className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all group">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-1">
                            <h3 className="font-display font-bold text-lg leading-tight group-hover:text-primary transition-colors">{hostel.name}</h3>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-tight">{hostel.university}</p>
                          </div>
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 rounded-lg font-bold">
                            {hostel.rating.toFixed(1)} ⭐
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-6 text-sm text-muted-foreground font-medium border-t border-border/30 pt-4">
                          <p className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 inline text-[10px] uppercase font-bold text-muted-foreground" /> Landlord: {landlord?.name}</p>
                          <p className="flex items-center gap-2">Rooms: {hostel.rooms.length} types • {hostel.reviews.length} reviews</p>
                        </div>

                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => navigate(`/hostel/${hostel.id}`)}
                          className="w-full rounded-xl bg-muted/50 border hover:bg-primary hover:text-white transition-all flex items-center justify-between px-4 text-foreground"
                        >
                          View as Public <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function StatCard({ label, value, icon, color }: any) {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all group">
      <CardContent className="pt-8 pb-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">{label}</p>
            <p className="text-lg sm:text-3xl font-display font-black text-gradient leading-none group-hover:scale-105 transition-transform origin-left">{value}</p>
          </div>
          <div className={`w-14 h-14 bg-muted/50 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-card transition-colors duration-500 text-2xl ${color}`}>
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
        <h2 className="text-2xl font-display font-bold tracking-tight uppercase tracking-tight text-foreground">{title}</h2>
      </div>
      <Badge variant="secondary" className="px-3 rounded-full font-bold text-muted-foreground bg-muted shadow-inner">
        {count}
      </Badge>
    </div>
  );
}

function EmptyState({ icon, message }: any) {
  return (
    <Card className="border-2 border-dashed border-border/50 bg-muted/20 rounded-3xl">
      <CardContent className="py-16 text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground/30 shadow-inner">
          {icon}
        </div>
        <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">{message}</p>
      </CardContent>
    </Card>
  );
}
