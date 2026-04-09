import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData, Room } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  MapPin, Star, Phone, Mail, Users, 
  DollarSign, CheckCircle2, ArrowLeft, 
  Receipt, Upload, CreditCard, Landmark, 
  Wallet, Info, Heart, Share2, Shield, Clock
} from 'lucide-react';
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
  const { user, student, toggleSaveHostel } = useAllAuth();
  const { getHostelById, addInquiry, addBooking, uploadReceipt } = useData();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'airtel_money' | 'mpamba' | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestForm, setGuestForm] = useState({ name: '', email: '', phone: '' });
  
  const [inquiryForm, setInquiryForm] = useState({
    studentName: user?.name || '',
    studentEmail: user?.email || '',
    studentPhone: user?.phone || '',
    roomType: '',
    message: '',
  });

  const hostel = getHostelById(id || '');

  // Auto-fill form when user logs in
  useEffect(() => {
    if (user) {
      setInquiryForm(prev => ({
        ...prev,
        studentName: user.name,
        studentEmail: user.email,
        studentPhone: user.phone || prev.studentPhone,
      }));
    }
  }, [user]);

  if (!hostel) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Info className="h-12 w-12 mx-auto opacity-30" />
        <h1 className="text-2xl font-bold">Hostel Not Found</h1>
        <Link to="/"><Button>Back</Button></Link>
      </div>
    );
  }

  const isSaved = student?.savedHostels.includes(hostel.id);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry({
      hostelId: hostel.id,
      hostelName: hostel.name,
      studentId: user?.id,
      ...inquiryForm,
    });
    toast.success('Inquiry sent');
    setIsInquiryOpen(false);
  };

  const handleBookNow = (room: Room) => {
    setSelectedRoom(room);
    if (!user) {
      // Guest booking — collect contact details first
      setIsGuestOpen(true);
    } else if (user.role !== 'student' && user.role !== 'landlord' && user.role !== 'admin') {
      toast.error('Only students can book rooms.');
    } else {
      setIsBookingOpen(true);
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.name || !guestForm.email || !guestForm.phone) {
      toast.error('Please fill in all contact details.');
      return;
    }
    setIsGuestOpen(false);
    setIsBookingOpen(true);
  };

  const confirmBooking = async () => {
    if (!selectedRoom) return;
    
    setIsSubmitting(true);
    try {
      const fees = calculateFees(selectedRoom.rent);
      const id = await addBooking({
        studentId: user?.id || `guest_${Date.now()}`,
        hostelId: hostel.id,
        roomId: selectedRoom.id,
        totalRent: selectedRoom.rent,
        bookingFee: fees.bookingFee,
        depositAmount: fees.depositAmount,
        guestName: user ? undefined : guestForm.name,
        guestEmail: user ? undefined : guestForm.email,
        guestPhone: user ? undefined : guestForm.phone,
      } as any);
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
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* HERO (RESTORED CONTENT) */}
      <div className="relative h-[45vh] overflow-hidden">
        <ImageWithFallback src={imageUrl} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-between">
          <div className="max-w-7xl mx-auto w-full px-4 py-6 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <Link to="/">
                <Button variant="outline" size="sm" className="border border-white/20 bg-white/20 text-white hover:bg-white/30 shadow-lg rounded-xl">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
              </Link>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`border border-white/20 rounded-xl transition-all ${isSaved ? 'text-destructive fill-destructive bg-white/20' : 'text-white'}`}
                  onClick={() => {
                    if (!user) {
                      toast.error('Please login to save hostels');
                      return;
                    }
                    toggleSaveHostel(hostel.id);
                    toast.success(isSaved ? 'Removed from saved' : 'Added to saved');
                  }}
                >
                  <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="icon" className="border border-white/20 bg-white/10 text-white rounded-xl">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary hover:bg-primary/90 text-white border-none shadow-premium px-3 py-1 rounded-full uppercase tracking-widest text-[10px] font-black">
                  {hostel.university}
                </Badge>
                <Badge className="border border-white/20 bg-white/10 text-white shadow-lg px-3 py-1 rounded-full uppercase tracking-widest text-[10px] font-black">
                  {hostel.distance} km from Campus
                </Badge>
              </div>
              <div>
                <h1 className="text-3xl md:text-6xl font-display font-black text-white leading-tight drop-shadow-2xl">
                  {hostel.name}
                </h1>
                <div className="flex items-center gap-6 mt-2 text-white/80">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{hostel.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-white">{hostel.rating.toFixed(1)}</span>
                    <span className="text-xs text-white/70">({hostel.reviews.length} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto w-full px-4 -mt-20 relative z-10">
        {/* Photo Gallery Peek */}
        {hostel.photos && hostel.photos.length > 1 && (
          <div className="grid grid-cols-4 gap-3 md:gap-4 mb-12">
            {hostel.photos.slice(1, 4).map((photo, index) => (
              <div key={index} className="h-24 md:h-32 rounded-3xl overflow-hidden shadow-rich border-2 border-background bg-white/40 group">
                <ImageWithFallback
                  src={photo}
                  alt={`Hostel thumbnail ${index + 2}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
            {hostel.photos.length > 4 && (
              <div className="h-24 md:h-32 rounded-3xl overflow-hidden shadow-rich border-2 border-background bg-white/40 flex items-center justify-center cursor-pointer hover:bg-white/60 transition-all font-display font-bold text-muted-foreground">
                +{hostel.photos.length - 4} More
              </div>
            )}
          </div>
        )}

        {/* ✅ FIXED GAP HERE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            {/* DESCRIPTION */}
            <Card className="p-6 rounded-2xl">
              <CardTitle>About</CardTitle>
              <p>{hostel.description}</p>
              <div className="mt-4 p-4 bg-muted/30 rounded-2xl border border-border/20 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Location</p>
                  <p className="font-semibold">{hostel.address}</p>
                </div>
              </div>
            </Card>

{/* ✅ AMENITIES FIX */}
            <div>
              <h2 className="text-xl font-bold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hostel.amenities.map(a => (
                  <div key={a} className="p-3 bg-white rounded-xl border flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {a}
                  </div>
                ))}
              </div>
            </div>

{/* ✅ ROOMS FIX */}
            <div>
              <h2 className="text-xl font-bold mb-4">Rooms</h2>

              <div className="grid gap-6">
                {hostel.rooms.map(room => (
                  <Card key={room.id} className="p-6">

                    <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-display font-black capitalize">{room.type} Suite</h3>
                          <Badge className={`rounded-full px-3 py-0.5 text-[10px] uppercase font-bold tracking-widest ${room.available > 0 ? 'bg-success/10 text-success border-success/20' : 'bg-muted text-muted-foreground border-muted-foreground/20'}`}>
                            {room.available > 0 ? `${room.available} Vacant` : 'Fully Occupied'}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground font-bold">
                            <Users className="h-4 w-4 text-primary" />
                            <span>Up to {room.capacity} Students</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl sm:text-3xl font-display font-black text-gradient">MK {room.rent.toLocaleString()}</span>
                            <span className="text-muted-foreground text-xs font-bold uppercase tracking-tighter mt-2">/month</span>
                          </div>
                        </div>
                      </div>

                      <Button 
                        disabled={room.available === 0} 
                        onClick={() => handleBookNow(room)}
                        className="w-full md:w-auto h-14 px-8 bg-gradient-premium shadow-xl shadow-primary/20 hover:scale-105 transition-all rounded-3xl text-lg font-bold"
                      >
                        Book Securely
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                      {room.amenities.map(amenity => (
                        <Badge key={amenity} variant="outline" className="rounded-lg bg-muted/50 text-[10px] font-bold py-1 border-border/50">{amenity}</Badge>
                      ))}
                    </div>

                  </Card>
                ))}
              </div>
            </div>

            {/* ✅ REVIEWS FIX */}
            <div>
              <h2 className="text-xl font-bold mb-4">Reviews</h2>

              {hostel.reviews && hostel.reviews.length > 0 ? (
                <div className="grid gap-4">
                  {hostel.reviews.map(review => {
                    const reviewerName = review.reviewer_name || 'Guest';
                    return (
                      <Card key={review.id} className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary font-bold">{reviewerName.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold">{reviewerName}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-6">
                  <p className="text-muted-foreground">No reviews available yet.</p>
                </Card>
              )}
            </div>

          </div>

          {/* ✅ SIDEBAR FIX */}
          <div className="space-y-6 sticky top-24">
            <Card className="p-6">
              <Button onClick={() => setIsInquiryOpen(true)}>
                Send Inquiry
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* ===== INQUIRY DIALOG ===== */}
      <Dialog open={isGuestOpen} onOpenChange={setIsGuestOpen}>
        <DialogContent className="max-w-sm bg-card border-border/50 rounded-4xl overflow-hidden shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-black text-xl text-center">Your Contact Details</DialogTitle>
          </DialogHeader>
          <div className="px-2 pb-2 space-y-2 text-center">
            <p className="text-sm text-muted-foreground">You're booking as a guest. We'll send confirmation to you directly.</p>
          </div>
          <form onSubmit={handleGuestSubmit} className="space-y-4 px-2 pb-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Full Name</Label>
              <Input
                placeholder="Your Full Name"
                value={guestForm.name}
                onChange={(e) => setGuestForm({...guestForm, name: e.target.value})}
                required
                className="h-12 bg-muted/30 border-border/50 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Email Address</Label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={guestForm.email}
                onChange={(e) => setGuestForm({...guestForm, email: e.target.value})}
                required
                className="h-12 bg-muted/30 border-border/50 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Phone Number</Label>
              <Input
                type="tel"
                placeholder="+265 99X XXX XXX"
                value={guestForm.phone}
                onChange={(e) => setGuestForm({...guestForm, phone: e.target.value})}
                required
                className="h-12 bg-muted/30 border-border/50 rounded-xl"
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-gradient-premium shadow-lg shadow-primary/20 rounded-2xl font-bold uppercase tracking-widest transition-all hover:scale-[1.02]">
              Continue to Booking
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{' '}
              <a href="/auth" className="text-primary font-semibold hover:underline">Sign in</a>
            </p>
          </form>
        </DialogContent>
      </Dialog>

      {/* Booking Confirmation Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-md bg-card border-border/50 rounded-4xl overflow-hidden shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-black text-2xl text-center">Confirm Reservation</DialogTitle>
          </DialogHeader>
          {selectedRoom && (
            <div className="space-y-8 px-2">
              <div className="bg-muted/30 p-6 rounded-3xl border border-border/50 space-y-4">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">Monthly Rent</span>
                  <span className="font-black text-lg">MK {selectedRoom.rent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">Booking Fee</span>
                  <span className="font-bold text-primary">MK {(selectedRoom.rent * 0.05).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">Initial Deposit</span>
                  <span className="font-bold text-secondary">MK {(selectedRoom.rent * 0.5).toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                  <span className="font-display font-black text-xl text-gradient">TOTAL DUE</span>
                  <span className="font-display font-black text-xl text-gradient">MK {(selectedRoom.rent * 0.55).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-[10px] text-warning font-black uppercase tracking-widest bg-warning/10 p-4 rounded-2xl border border-warning/20">
                <Clock className="h-4 w-4 shrink-0" />
                <span>Room reserved for 48 hours. Please complete the deposit within this window.</span>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 h-12 rounded-2xl border-border/50 hover:bg-muted/50" onClick={() => setIsBookingOpen(false)}>Cancel</Button>
                <Button className="flex-1 h-12 bg-gradient-premium shadow-lg shadow-primary/20 rounded-2xl font-bold uppercase tracking-widest transition-all hover:scale-105" onClick={confirmBooking} disabled={isSubmitting}>
                  {isSubmitting ? 'Processing...' : 'Confirm'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Instructions & Receipt Upload Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="max-w-md bg-card border-border/50 rounded-4xl overflow-hidden shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-black text-2xl text-center">Final Payment Steps</DialogTitle>
          </DialogHeader>
          <div className="space-y-8 px-2">
            <div className="grid grid-cols-3 gap-3">
              <PaymentButton 
                active={paymentMethod === 'bank'} 
                onClick={() => setPaymentMethod('bank')} 
                icon={<Landmark className="h-6 w-6" />}
                label="Bank"
              />
              <PaymentButton 
                active={paymentMethod === 'airtel_money'} 
                onClick={() => setPaymentMethod('airtel_money')} 
                icon={<Wallet className="h-6 w-6" />}
                label="Airtel"
              />
              <PaymentButton 
                active={paymentMethod === 'mpamba'} 
                onClick={() => setPaymentMethod('mpamba')} 
                icon={<CreditCard className="h-6 w-6" />}
                label="Mpamba"
              />
            </div>

            <div className="min-h-[100px] animate-fade-in">
                {paymentMethod === 'bank' && (
                <div className="p-5 bg-card/50 rounded-3xl border border-border/50 text-sm space-y-2 shadow-inner">
                    <p className="font-black text-xs uppercase tracking-widest text-primary">Standard Bank</p>
                    <p className="font-bold">Account: Hostel Management Ltd</p>
                    <p className="font-bold">Number: 90876543210</p>
                    <p className="text-muted-foreground text-xs uppercase tracking-tighter">Branch: Zomba Main</p>
                </div>
                )}

                {paymentMethod === 'airtel_money' && (
                <div className="p-5 bg-destructive/5 rounded-3xl border border-destructive/10 text-sm space-y-2 shadow-inner">
                    <p className="font-black text-xs uppercase tracking-widest text-destructive">Airtel Money</p>
                    <p className="font-bold">Name: John Landlord</p>
                    <p className="font-bold">Number: +265 991 234 567</p>
                    <p className="text-muted-foreground text-xs uppercase tracking-tighter">Ref: Use Your Full Name</p>
                </div>
                )}

                {paymentMethod === 'mpamba' && (
                <div className="p-5 bg-success/5 rounded-3xl border border-success/10 text-sm space-y-2 shadow-inner">
                    <p className="font-black text-xs uppercase tracking-widest text-success">TNM Mpamba</p>
                    <p className="font-bold">Name: John Landlord</p>
                    <p className="font-bold">Number: +265 881 234 567</p>
                    <p className="text-muted-foreground text-xs uppercase tracking-tighter">Ref: Use Your Full Name</p>
                </div>
                )}

                {!paymentMethod && (
                    <div className="p-8 text-center text-muted-foreground grayscale">
                        <ArrowLeft className="h-8 w-8 mx-auto mb-2 opacity-20" />
                        <p className="text-xs uppercase font-bold tracking-widest">Select Payment Method</p>
                    </div>
                )}
            </div>

            <form onSubmit={handleReceiptUpload} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Upload Receipt</Label>
                <div className="relative">
                  <Input 
                    type="file" 
                    accept="image/*,application/pdf"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                    className="h-14 bg-muted/30 border-border/50 rounded-2xl file:hidden flex items-center pr-12 pt-4"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Upload className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter text-center">JPEG, PNG or PDF Accepted</p>
              </div>

              <Button type="submit" className="w-full h-14 bg-gradient-premium shadow-xl shadow-primary/20 rounded-2xl font-bold uppercase tracking-widest transition-all hover:scale-[1.02]" disabled={isSubmitting || !receiptFile || !paymentMethod}>
                {isSubmitting ? 'Uploading Receipt...' : 'Confirm Submission'}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== INQUIRY DIALOG ===== */}
      <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
        <DialogContent className="max-w-md bg-card border-border/50 rounded-4xl overflow-hidden shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display font-black text-2xl text-center">Inquiry Form</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInquirySubmit} className="space-y-5 px-2">
            <div className="space-y-4">
               <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Your Full Name</Label>
                <Input
                  value={inquiryForm.studentName}
                  onChange={(e) => setInquiryForm({...inquiryForm, studentName: e.target.value})}
                  required
                  className="h-12 bg-muted/30 border-border/50 rounded-xl focus:ring-primary/20"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Email Address</Label>
                  <Input
                    type="email"
                    value={inquiryForm.studentEmail}
                    onChange={(e) => setInquiryForm({...inquiryForm, studentEmail: e.target.value})}
                    required
                    className="h-12 bg-muted/30 border-border/50 rounded-xl focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Phone Number</Label>
                  <Input
                    type="tel"
                    value={inquiryForm.studentPhone}
                    onChange={(e) => setInquiryForm({...inquiryForm, studentPhone: e.target.value})}
                    required
                    className="h-12 bg-muted/30 border-border/50 rounded-xl focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Room Interest</Label>
                <Select value={inquiryForm.roomType} onValueChange={(value) => setInquiryForm({...inquiryForm, roomType: value})}>
                  <SelectTrigger className="h-12 bg-muted/30 border-border/50 rounded-xl">
                    <SelectValue placeholder="Select suite type" />
                  </SelectTrigger>
                  <SelectContent className="border border-white/20 bg-card/95">
                    {hostel.rooms.map(room => (
                      <SelectItem key={room.id} value={room.type} disabled={room.available === 0}>
                        {room.type} - MK {room.rent.toLocaleString()} ({room.available} vacant)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Your Message</Label>
                <Textarea
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                  placeholder="Tell us about your requirements..."
                  rows={4}
                  className="bg-muted/30 border-border/50 rounded-xl focus:ring-primary/20"
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-14 bg-gradient-premium shadow-lg shadow-primary/20 rounded-2xl font-bold uppercase tracking-widest transition-all hover:scale-[1.02]">Submit Inquiry</Button>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function PaymentButton({ active, onClick, icon, label }: any) {
    return (
        <Button 
            variant={active ? 'default' : 'outline'} 
            className={`flex flex-col h-24 gap-2 rounded-3xl transition-all shadow-sm ${active ? 'bg-primary border-primary scale-[1.05]' : 'bg-muted/20 border-border/50 hover:bg-card/80'}`}
            onClick={onClick}
        >
            <div className={`transition-transform ${active ? 'scale-110' : 'grayscale'}`}>{icon}</div>
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </Button>
    );
}