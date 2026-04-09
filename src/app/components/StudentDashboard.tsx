import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { useAllAuth } from '../context/AuthContext';
import { useData } from '../context/AppContext';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

import {
  GraduationCap,
  Heart,
  Mail,
  User,
  Home,
  Receipt,
  Phone,
  Building2,
  MapPin,
  Calendar,
  ChevronRight
} from 'lucide-react';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { student, toggleSaveHostel } = useAllAuth();
  const { hostels, inquiries, getBookingsByStudent } = useData();

  useEffect(() => {
    if (!student) navigate('/auth');
  }, [student, navigate]);

  if (!student) return null;

  const savedHostels = hostels.filter(h => student.savedHostels.includes(h.id));
  const studentInquiries = inquiries.filter(i => i.studentEmail === student.email);
  const studentBookings = getBookingsByStudent(student.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 pb-16">

      {/* HEADER */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <GraduationCap className="text-white h-5 w-5" />
            </div>

            <div>
              <h1 className="font-semibold text-lg text-gray-900">
                Dashboard
              </h1>
              <p className="text-xs text-gray-500">{student.name}</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="rounded-lg border-gray-300 hover:bg-gray-100"
          >
            <Home className="h-4 w-4 mr-2" />
            Browse
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <StatCard label="Saved" value={savedHostels.length} icon={<Heart />} />
          <StatCard label="Inquiries" value={studentInquiries.length} icon={<Mail />} />
          <StatCard label="Bookings" value={studentBookings.length} icon={<Receipt />} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* SIDEBAR */}
          <aside className="space-y-8">

            {/* PROFILE */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
              <div className="h-16 bg-gray-100"></div>
              <CardHeader className="text-center pb-2 relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center">
                    <User className="text-gray-500 h-6 w-6" />
                  </div>
                </div>
                <div className="mt-6">
                  <CardTitle className="text-base font-semibold">Profile</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                <ProfileItem icon={<User />} label="Name" value={student.name} />
                <ProfileItem icon={<Mail />} label="Email" value={student.email} />
                <ProfileItem icon={<Phone />} label="Phone" value={student.phone} />
                <ProfileItem icon={<Building2 />} label="University" value={student.university} />

                <Button className="w-full mt-3">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* INQUIRIES */}
            <section>
              <SectionHeader title="Recent Inquiries" count={studentInquiries.length} />

              {studentInquiries.length === 0 ? (
                <EmptyState message="No inquiries yet" />
              ) : (
                <div className="space-y-3">
                  {studentInquiries.slice(0, 3).map(inquiry => (
                    <Card
                      key={inquiry.id}
                      className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between mb-1">
                        <h4 className="font-medium text-sm text-gray-900">{inquiry.hostelName}</h4>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(inquiry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {inquiry.message}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </aside>

          {/* MAIN */}
          <div className="lg:col-span-2 space-y-10">

            {/* BOOKINGS */}
            <section>
              <SectionHeader title="Bookings" count={studentBookings.length} />

              {studentBookings.length === 0 ? (
                <EmptyState message="No bookings yet" />
              ) : (
                <div className="space-y-4">
                  {studentBookings.map(b => {
                    const hostel = hostels.find(h => h.id === b.hostelId);

                    const statusStyles = {
                      pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
                      confirmed: 'bg-green-50 text-green-700 border border-green-200',
                      cancelled: 'bg-red-50 text-red-700 border border-red-200'
                    };

                    return (
                      <Card key={b.id} className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
                        <div className="flex justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">{hostel?.name}</h3>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {hostel?.address}
                            </p>
                          </div>

                          <Badge className={`${statusStyles[b.status]} capitalize`}>
                            {b.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                          <StatMini label="Rent" value={`MK ${b.totalRent.toLocaleString()}`} />
                          <StatMini label="Fee" value={`MK ${b.bookingFee.toLocaleString()}`} />
                          <StatMini label="Deposit" value={`MK ${b.depositAmount.toLocaleString()}`} />
                        </div>

                        {b.status === 'pending' && (
                          <Button onClick={() => navigate(`/hostel/${b.hostelId}`)}>
                            Complete Payment
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>

            {/* SAVED */}
            <section>
              <SectionHeader title="Saved Hostels" count={savedHostels.length} />

              {savedHostels.length === 0 ? (
                <EmptyState message="No saved hostels" />
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {savedHostels.map(h => {
                    const minRent = Math.min(...h.rooms.map(r => r.rent));

                    return (
                      <Card key={h.id} className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
                        <h3 className="font-semibold text-gray-900">{h.name}</h3>
                        <p className="text-xs text-gray-400">{h.university}</p>

                        <p className="mt-3 text-xl font-semibold text-blue-600">
                          MK {minRent.toLocaleString()}
                        </p>

                        <div className="flex gap-2 mt-4">
                          <Button size="sm" onClick={() => navigate(`/hostel/${h.id}`)}>
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleSaveHostel(h.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

/* HELPERS */

function StatCard({ label, value, icon }: any) {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4 flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className="text-gray-400">{icon}</div>
    </Card>
  );
}

function StatMini({ label, value }: any) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function SectionHeader({ title, count }: any) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-semibold text-gray-900">{title}</h2>
      <Badge variant="secondary">{count}</Badge>
    </div>
  );
}

function ProfileItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-gray-400">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function EmptyState({ message }: any) {
  return (
    <Card className="bg-white border border-dashed border-gray-300 rounded-2xl p-6 text-center text-gray-400">
      {message}
    </Card>
  );
}