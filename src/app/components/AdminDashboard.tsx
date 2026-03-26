import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAllAuth } from '../context/AuthContext';
import { useData } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Shield, LogOut, Users, Building, CheckCircle, XCircle, Clock, Home } from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { admin, adminLogout, landlords, approveLandlord, rejectLandlord } = useAllAuth();
  const { hostels, inquiries } = useData();

  useEffect(() => {
    if (!admin) {
      navigate('/admin/auth');
    }
  }, [admin, navigate]);

  const handleLogout = () => {
    adminLogout();
    toast.success('Logged out successfully');
    navigate('/');
  };

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
    { label: 'Total Landlords', value: landlords.length, icon: Users, color: 'text-blue-600' },
    { label: 'Pending Approval', value: pendingLandlords.length, icon: Clock, color: 'text-yellow-600' },
    { label: 'Total Hostels', value: hostels.length, icon: Building, color: 'text-green-600' },
    { label: 'Total Inquiries', value: inquiries.length, icon: Home, color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">{admin.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/')}>
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending Landlords */}
        {pendingLandlords.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                Pending Landlord Approvals ({pendingLandlords.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingLandlords.map(landlord => (
                  <div key={landlord.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{landlord.name}</h3>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Email: {landlord.email}</p>
                        <p>Phone: {landlord.phone}</p>
                        <p className="text-xs">Registered: {new Date(landlord.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleApproveLandlord(landlord.id, landlord.name)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleRejectLandlord(landlord.id, landlord.name)}
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Approved Landlords */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Approved Landlords ({approvedLandlords.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {approvedLandlords.map(landlord => {
                const landlordHostels = hostels.filter(h => h.landlordId === landlord.id);
                return (
                  <div key={landlord.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{landlord.name}</h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Approved
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Email: {landlord.email}</p>
                        <p>Phone: {landlord.phone}</p>
                        <p>Hostels Listed: {landlordHostels.length}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleRejectLandlord(landlord.id, landlord.name)}
                        variant="outline"
                        size="sm"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Revoke Access
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Rejected Landlords */}
        {rejectedLandlords.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Rejected Landlords ({rejectedLandlords.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rejectedLandlords.map(landlord => (
                  <div key={landlord.id} className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{landlord.name}</h3>
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          Rejected
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Email: {landlord.email}</p>
                        <p>Phone: {landlord.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleApproveLandlord(landlord.id, landlord.name)}
                        variant="outline"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Reconsider
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Hostels Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              All Hostels ({hostels.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {hostels.map(hostel => {
                const landlord = landlords.find(l => l.id === hostel.landlordId);
                return (
                  <div key={hostel.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{hostel.name}</h3>
                        <p className="text-sm text-gray-600">{hostel.university}</p>
                      </div>
                      <Badge>{hostel.rating} ⭐</Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Landlord: {landlord?.name}</p>
                      <p>Address: {hostel.address}</p>
                      <p>Rooms: {hostel.rooms.length} types • {hostel.reviews.length} reviews</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
