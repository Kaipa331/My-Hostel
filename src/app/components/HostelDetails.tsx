import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { useData, Room } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { MapPin, Star, Phone, Mail, Users, DollarSign, CheckCircle2, ArrowLeft, Receipt, Upload, CreditCard, Landmark, Wallet } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { useAllAuth } from '../context/AuthContext';
import { calculateFees } from '../utils/fees';

const hostelImages = [
  'https://images.unsplash.com/photo-1763924636780-4da2a7c3327c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwZG9ybWl0b3J5JTIwcm9vbXxlbnwxfHx8fDE3NzQ0NTAxMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1697494794128-0cdc5e4314c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYWNjb21tb2RhdGlvbiUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3NDQ1MDEwMnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1635151926449-b9e7e5246fa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3N0ZWwlMjBjb21tb24lMjBhcmVhJTIwbG91bmdlfGVufDF8fHx8MTc3NDQ1MDEwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1615431303449-9ad9207d05de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3N0ZWwlMjBleHRlcmlvciUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3NDQ1MDEwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
];

export function HostelDetails() {
  const { id } = useParams();
  const { user } = useAllAuth();
  const { getHostelById, addInquiry, addBooking, uploadReceipt } = useData();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'airtel_money' | 'mpamba' | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [inquiryForm, setInquiryForm] = useState({
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    roomType: '',
    message: '',
  });

  const hostel = getHostelById(id || '');

  if (!hostel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4">Hostel not found</p>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      hostelId: hostel.id,
      hostelName: hostel.name,
      ...inquiryForm,
    });
    toast.success('Inquiry sent successfully! The landlord will contact you soon.');
    setIsInquiryOpen(false);
    setInquiryForm({
      studentName: '',
      studentEmail: '',
      studentPhone: '',
      roomType: '',
      message: '',
    });
  };

  const handleBookNow = (room: Room) => {
    if (!user) {
      toast.error('Please log in as a student to book a room.');
      return;
    }
    if (user.role !== 'student') {
      toast.error('Only students can book rooms.');
      return;
    }
    setSelectedRoom(room);
    setIsBookingOpen(true);
  };

  const confirmBooking = async () => {
    if (!selectedRoom || !user) return;
    
    setIsSubmitting(true);
    try {
      const fees = calculateFees(selectedRoom.rent);
      const id = await addBooking({
        studentId: user.id,
        hostelId: hostel.id,
        roomId: selectedRoom.id,
        totalRent: selectedRoom.rent,
        bookingFee: fees.bookingFee,
        depositAmount: fees.depositAmount,
      });
      setBookingId(id);
      setIsBookingOpen(false);
      setIsPaymentOpen(true);
      toast.success('Booking initiated! Please complete the payment to secure your room.');
    } catch (error) {
      toast.error('Failed to initiate booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReceiptUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId || !receiptFile || !paymentMethod) {
      toast.error('Please select a payment method and upload a receipt.');
      return;
    }

    setIsSubmitting(true);
    try {
      await uploadReceipt(bookingId, receiptFile);
      toast.success('Receipt uploaded successfully! The landlord will verify your payment.');
      setIsPaymentOpen(false);
      setBookingId(null);
      setReceiptFile(null);
      setPaymentMethod(null);
    } catch (error) {
      toast.error('Failed to upload receipt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const imageUrl = hostel.photos && hostel.photos.length > 0
    ? hostel.photos[0]
    : hostelImages[parseInt(hostel.id, 10) % hostelImages.length];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 md:h-96 bg-gray-300">
        <ImageWithFallback 
          src={imageUrl}
          alt={hostel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
          <Link to="/">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl text-white mb-2 font-bold">{hostel.name}</h1>
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-xl">{hostel.rating.toFixed(1)}</span>
              <span className="text-gray-300">({hostel.reviews.length} reviews)</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{hostel.distance} km from {hostel.university}</span>
            </div>
          </div>
        </div>
      </div>

      {hostel.photos && hostel.photos.length > 1 && (
        <div className="container mx-auto px-4 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {hostel.photos.map((photo, index) => (
              <ImageWithFallback
                key={`${hostel.id}-photo-${index}`}
                src={photo}
                alt={`Hostel photo ${index + 1}`}
                className="h-24 w-full object-cover rounded-md"
              />
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Hostel</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{hostel.description}</p>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{hostel.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hostel.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Available Rooms */}
            <Card>
              <CardHeader>
                <CardTitle>Available Rooms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hostel.rooms.map(room => (
                  <div key={room.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg capitalize mb-1">{room.type} Room</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>Capacity: {room.capacity}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-xl text-blue-600">MK {room.rent.toLocaleString()}/month</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={room.available > 0 ? 'default' : 'secondary'}>
                        {room.available > 0 ? `${room.available} Available` : 'Full'}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.map(amenity => (
                          <Badge key={amenity} variant="outline">{amenity}</Badge>
                        ))}
                      </div>
                      <Button 
                        disabled={room.available === 0} 
                        onClick={() => handleBookNow(room)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hostel.reviews.map(review => (
                  <div key={review.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p>{review.studentName}</p>
                        <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Contact & Inquiry</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Starting from</p>
                  <p className="text-3xl text-blue-600">MK {Math.min(...hostel.rooms.map(r => r.rent)).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">/month</p>
                </div>

                <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">Send Inquiry</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Send Inquiry</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          value={inquiryForm.studentName}
                          onChange={(e) => setInquiryForm({...inquiryForm, studentName: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={inquiryForm.studentEmail}
                          onChange={(e) => setInquiryForm({...inquiryForm, studentEmail: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={inquiryForm.studentPhone}
                          onChange={(e) => setInquiryForm({...inquiryForm, studentPhone: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="roomType">Interested Room Type</Label>
                        <Select value={inquiryForm.roomType} onValueChange={(value) => setInquiryForm({...inquiryForm, roomType: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                          <SelectContent>
                            {hostel.rooms.map(room => (
                              <SelectItem key={room.id} value={room.type} disabled={room.available === 0}>
                                {room.type} - MK {room.rent.toLocaleString()} ({room.available} available)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={inquiryForm.message}
                          onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                          placeholder="Any specific questions or requirements..."
                          rows={4}
                        />
                      </div>
                      <Button type="submit" className="w-full">Submit Inquiry</Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="pt-4 border-t space-y-3">
                  <p className="text-sm text-gray-600">Need help? Contact the landlord</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span>+265 991 234 567</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span>landlord@hostel.mw</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
          </DialogHeader>
          {selectedRoom && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Rent</span>
                  <span className="font-semibold">MK {selectedRoom.rent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Booking Fee (5% - Non-refundable)</span>
                  <span>MK {(selectedRoom.rent * 0.05).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Initial Deposit (50%)</span>
                  <span>MK {(selectedRoom.rent * 0.5).toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t flex justify-between text-lg font-bold text-blue-600">
                  <span>Total Due Within 48h</span>
                  <span>MK {(selectedRoom.rent * 0.55).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 bg-amber-50 p-3 rounded border border-amber-100 italic">
                Note: Your room will be reserved for 48 hours. You must pay the deposit and booking fee within this time to secure your spot.
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsBookingOpen(false)}>Cancel</Button>
                <Button className="flex-1" onClick={confirmBooking} disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Instructions & Receipt Upload Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Instructions</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={paymentMethod === 'bank' ? 'default' : 'outline'} 
                className="flex flex-col h-20 gap-1 p-2"
                onClick={() => setPaymentMethod('bank')}
              >
                <Landmark className="h-5 w-5" />
                <span className="text-xs">Bank</span>
              </Button>
              <Button 
                variant={paymentMethod === 'airtel_money' ? 'default' : 'outline'} 
                className="flex flex-col h-20 gap-1 p-2"
                onClick={() => setPaymentMethod('airtel_money')}
              >
                <Wallet className="h-5 w-5" />
                <span className="text-xs">Airtel Money</span>
              </Button>
              <Button 
                variant={paymentMethod === 'mpamba' ? 'default' : 'outline'} 
                className="flex flex-col h-20 gap-1 p-2"
                onClick={() => setPaymentMethod('mpamba')}
              >
                <CreditCard className="h-5 w-5" />
                <span className="text-xs">Mpamba</span>
              </Button>
            </div>

            {paymentMethod === 'bank' && (
              <div className="p-4 bg-gray-50 rounded-lg text-sm space-y-2">
                <p className="font-semibold">Standard Bank</p>
                <p>Account Name: Hostel Management Ltd</p>
                <p>Account Number: 90876543210</p>
                <p>Branch: Zomba</p>
              </div>
            )}

            {paymentMethod === 'airtel_money' && (
              <div className="p-4 bg-red-50 rounded-lg text-sm space-y-2">
                <p className="font-semibold">Airtel Money</p>
                <p>Name: John Landlord</p>
                <p>Number: +265 991 234 567</p>
                <p>Reference: Use your Name + Hostel Name</p>
              </div>
            )}

            {paymentMethod === 'mpamba' && (
              <div className="p-4 bg-green-50 rounded-lg text-sm space-y-2">
                <p className="font-semibold">TNM Mpamba</p>
                <p>Name: John Landlord</p>
                <p>Number: +265 881 234 567</p>
                <p>Reference: Use your Name + Hostel Name</p>
              </div>
            )}

            <form onSubmit={handleReceiptUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receipt">Upload Payment Receipt</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="receipt" 
                    type="file" 
                    accept="image/*,application/pdf"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                    className="cursor-pointer"
                    required
                  />
                  <Upload className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500">Supported formats: JPEG, PNG, PDF</p>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || !receiptFile || !paymentMethod}>
                {isSubmitting ? 'Uploading...' : 'Submit Receipt for Verification'}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}