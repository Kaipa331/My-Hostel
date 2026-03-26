import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { useAllAuth } from '../context/AuthContext';
import { useData } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { GraduationCap, LogOut, Heart, Mail, User, Phone, Building, Home, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { student, studentLogout, toggleSaveHostel } = useAllAuth();
  const { hostels, inquiries } = useData();

  useEffect(() => {
    if (!student) {
      navigate('/student/auth');
    }
  }, [student, navigate]);

  const handleLogout = () => {
    studentLogout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!student) return null;

  const savedHostels = hostels.filter(h => student.savedHostels.includes(h.id));
  const studentInquiries = inquiries.filter(i => i.studentEmail === student.email);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl">Student Dashboard</h1>
                <p className="text-sm text-gray-600">{student.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/')}>
                <Home className="h-4 w-4 mr-2" />
                Browse Hostels
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
        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              My Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{student.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{student.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">University</p>
                  <p className="font-medium">{student.university}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="font-medium">{student.studentId}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Saved Hostels</p>
                  <p className="text-3xl">{savedHostels.length}</p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Inquiries Sent</p>
                  <p className="text-3xl">{studentInquiries.length}</p>
                </div>
                <Mail className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Hostels */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Saved Hostels ({savedHostels.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {savedHostels.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Heart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No saved hostels yet</p>
                <Button 
                  variant="link" 
                  onClick={() => navigate('/')}
                  className="mt-2"
                >
                  Browse hostels to save
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedHostels.map(hostel => {
                  const minRent = Math.min(...hostel.rooms.map(r => r.rent));
                  return (
                    <div key={hostel.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{hostel.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="h-4 w-4" />
                            <span>{hostel.university}</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl text-blue-600">MK {minRent.toLocaleString()}</span>
                            <span className="text-gray-600">/month</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              toggleSaveHostel(hostel.id);
                              toast.success('Removed from saved hostels');
                            }}
                          >
                            <Heart className="h-4 w-4 fill-current text-red-500" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t">
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/hostel/${hostel.id}`)}
                          className="flex-1"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inquiry History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              Inquiry History ({studentInquiries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studentInquiries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Mail className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No inquiries sent yet</p>
                <p className="text-sm mt-1">Send inquiries to landlords to see them here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {studentInquiries.map(inquiry => (
                  <div key={inquiry.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{inquiry.hostelName}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{inquiry.roomType}</Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(inquiry.date).toLocaleDateString('en-GB', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <p className="text-gray-700">{inquiry.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
