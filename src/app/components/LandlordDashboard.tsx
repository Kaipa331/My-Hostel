import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth, useData } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Building2, Plus, Edit, Trash2, Mail, Phone, Star, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export function LandlordDashboard() {
  const { landlord } = useAuth();
  const { hostels, inquiries, deleteHostel, getInquiriesByLandlord } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!landlord) {
      navigate('/landlord/auth');
    }
  }, [landlord, navigate]);

  if (!landlord) {
    return null;
  }

  const myHostels = hostels.filter(h => h.landlordId === landlord.id);
  const myInquiries = getInquiriesByLandlord(landlord.id);

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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Welcome back, {landlord.name}!</h1>
        <p className="text-gray-600">Manage your hostels and view inquiries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Hostels</p>
                <p className="text-3xl">{myHostels.length}</p>
              </div>
              <Building2 className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Rooms</p>
                <p className="text-3xl">{totalRooms}</p>
              </div>
              <Building2 className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Available Rooms</p>
                <p className="text-3xl">{totalAvailableRooms}</p>
              </div>
              <Building2 className="h-10 w-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">New Inquiries</p>
                <p className="text-3xl">{myInquiries.length}</p>
              </div>
              <Mail className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* My Hostels */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Hostels</CardTitle>
                <Link to="/landlord/hostel/add">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Hostel
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {myHostels.length > 0 ? (
                <div className="space-y-4">
                  {myHostels.map(hostel => (
                    <div key={hostel.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg mb-1">{hostel.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>{hostel.address}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{hostel.rating.toFixed(1)}</span>
                            </div>
                            <span>{hostel.rooms.length} room types</span>
                            <span>{hostel.reviews.length} reviews</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/landlord/hostel/edit/${hostel.id}`}>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(hostel.id, hostel.name)}
                            className="gap-2 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {hostel.rooms.map(room => (
                          <Badge key={room.id} variant="secondary">
                            {room.type}: MK {room.rent.toLocaleString()} ({room.available} available)
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't added any hostels yet</p>
                  <Link to="/landlord/hostel/add">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Your First Hostel
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Inquiries */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Recent Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              {myInquiries.length > 0 ? (
                <div className="space-y-4">
                  {myInquiries.slice(0, 10).map(inquiry => (
                    <div key={inquiry.id} className="border rounded-lg p-3">
                      <div className="mb-2">
                        <p className="text-sm mb-1">{inquiry.studentName}</p>
                        <p className="text-xs text-gray-600 mb-1">{inquiry.hostelName}</p>
                        <Badge variant="outline" className="text-xs">{inquiry.roomType}</Badge>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{inquiry.studentEmail}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{inquiry.studentPhone}</span>
                        </div>
                      </div>
                      {inquiry.message && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{inquiry.message}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(inquiry.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">No inquiries yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}