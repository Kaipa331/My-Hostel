import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useAllAuth } from '../context/AuthContext';
import { useData, Room } from '../context/AppContext';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, Plus, Trash2, Building2, MapPin, Info, Image, Layout, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const AMENITIES_OPTIONS = [
  'WiFi', 'Parking', 'Laundry', 'Common Room', 'Security', 
  'Mess', 'Gym', 'Library', 'Garden', 'Sports Room',
  'Power Backup', 'Water Purifier', 'CCTV'
];

const ROOM_AMENITIES_OPTIONS = [
  'AC', 'Fan', 'Study Table', 'Wardrobe', 'Attached Bathroom', 
  'Balcony', 'Window', 'Mattress', 'Pillow', 'Bed'
];

export function AddEditHostel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAllAuth();
  const { addHostel, updateHostel, getHostelById } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const isEditing = !!id;
  const existingHostel = isEditing ? getHostelById(id) : null;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    university: '',
    distance: '',
    amenities: [] as string[],
    photos: [] as string[],
  });

  const [rooms, setRooms] = useState<Omit<Room, 'id'>[]>([
    { type: 'single', capacity: 1, rent: 0, available: 0, amenities: [] }
  ]);

  useEffect(() => {
    if (!user || user.role !== 'landlord') {
      navigate('/landlord/auth');
      return;
    }

    if (isEditing && existingHostel) {
      setFormData({
        name: existingHostel.name,
        description: existingHostel.description,
        address: existingHostel.address,
        university: existingHostel.university,
        distance: existingHostel.distance.toString(),
        amenities: existingHostel.amenities,
        photos: existingHostel.photos || [],
      });
      setRooms(existingHostel.rooms.map(r => ({
        type: r.type,
        capacity: r.capacity,
        rent: r.rent,
        available: r.available,
        amenities: r.amenities,
      })));
    }
  }, [user, navigate, isEditing, existingHostel]);

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleRoomAmenityToggle = (roomIndex: number, amenity: string) => {
    setRooms(prev => prev.map((room, idx) => {
      if (idx === roomIndex) {
        return {
          ...room,
          amenities: room.amenities.includes(amenity)
            ? room.amenities.filter(a => a !== amenity)
            : [...room.amenities, amenity]
        };
      }
      return room;
    }));
  };

  const addRoom = () => {
    setRooms([...rooms, { type: 'single', capacity: 1, rent: 0, available: 0, amenities: [] }]);
  };

  const removeRoom = (index: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((_, idx) => idx !== index));
    }
  };

  const updateRoom = (index: number, field: keyof Room, value: any) => {
    setRooms(prev => prev.map((room, idx) => 
      idx === index ? { ...room, [field]: value } : room
    ));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const uniqueFileName = `hostels/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('hostel-photos')
          .upload(uniqueFileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          toast.error(`Failed to upload ${file.name}: ${error.message}`);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from('hostel-photos')
          .getPublicUrl(uniqueFileName);

        if (publicUrlData?.publicUrl) {
          uploadedUrls.push(publicUrlData.publicUrl);
        }
      }

      if (uploadedUrls.length) {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, ...uploadedUrls],
        }));
        toast.success(`${uploadedUrls.length} photos uploaded!`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const roomsWithIds = rooms.map((room, idx) => ({
        id: `room-${Date.now()}-${idx}`,
        ...room,
      }));

      const hostelData = {
        landlordId: user!.id,
        name: formData.name,
        description: formData.description,
        address: formData.address,
        university: formData.university,
        distance: parseFloat(formData.distance),
        photos: formData.photos,
        rooms: roomsWithIds,
        amenities: formData.amenities,
      };

      if (isEditing && existingHostel) {
        await updateHostel(existingHostel.id, hostelData);
        toast.success('Hostel updated successfully!');
      } else {
        await addHostel(hostelData);
        toast.success('Hostel added successfully!');
      }

      navigate('/landlord/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save hostel. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || user.role !== 'landlord') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      
      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-40 glass border-b border-border/50 bg-card/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Link to="/landlord/dashboard">
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted/50">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="w-12 h-12 bg-gradient-premium rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold tracking-tight">
                  {isEditing ? 'Edit Property' : 'List New Property'}
                </h1>
                <p className="text-sm text-muted-foreground font-medium">Step-by-step property management</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-12 animate-slide-up">
          
          {/* ================= BASIC INFORMATION ================= */}
          <FormSection title="Basic Information" icon={<Info className="h-5 w-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Hostel Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="e.g. Royal Palms Residence"
                  className="h-14 bg-muted/30 border-border/50 rounded-2xl focus:ring-primary/20 text-lg font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Primary University *</Label>
                <Select
                  value={formData.university}
                  onValueChange={(value) => setFormData({...formData, university: value})}
                >
                  <SelectTrigger className="h-14 bg-muted/30 border-border/50 rounded-2xl focus:ring-primary/20">
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/20">
                    <SelectItem value="University of Malawi (UNIMA)">University of Malawi (UNIMA)</SelectItem>
                    <SelectItem value="Mzuzu University">Mzuzu University</SelectItem>
                    <SelectItem value="Malawi University of Business and Applied Sciences (MUBAS)">MUBAS</SelectItem>
                    <SelectItem value="Lilongwe University of Agriculture and Natural Resources (LUANAR)">LUANAR</SelectItem>
                    <SelectItem value="Malawi University of Science and Technology (MUST)">MUST</SelectItem>
                    <SelectItem value="Catholic University of Malawi">Catholic University of Malawi</SelectItem>
                    <SelectItem value="Kamuzu University of Health Sciences">Kamuzu University of Health Sciences</SelectItem>
                    <SelectItem value="DMI St. John the Baptist University">DMI St. John the Baptist University</SelectItem>
                    <SelectItem value="African Bible College">African Bible College</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Full Address *</Label>
                <div className="relative">
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Specific location or street name"
                    required
                    className="h-14 bg-muted/30 border-border/50 rounded-2xl pl-12 focus:ring-primary/20"
                  />
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Distance from Campus (km) *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.distance}
                  onChange={(e) => setFormData({...formData, distance: e.target.value})}
                  required
                  placeholder="e.g. 1.2"
                  className="h-14 bg-muted/30 border-border/50 rounded-2xl focus:ring-primary/20"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Property Description *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Highlight what makes your hostel unique..."
                  rows={6}
                  required
                  className="bg-muted/30 border-border/50 rounded-3xl focus:ring-primary/20 p-6 leading-relaxed"
                />
              </div>
            </div>
          </FormSection>

          {/* ================= AMENITIES ================= */}
          <FormSection title="Property Amenities" icon={<CheckCircle2 className="h-5 w-5 text-success" />}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {AMENITIES_OPTIONS.map(amenity => (
                <div key={amenity} className="flex items-center space-x-3 p-4 bg-muted/20 border border-border/10 rounded-2xl hover:bg-muted/40 transition-colors group cursor-pointer">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                    className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-md"
                  />
                  <label htmlFor={`amenity-${amenity}`} className="text-sm font-semibold cursor-pointer group-hover:text-primary transition-colors">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </FormSection>

          {/* ================= PHOTOS ================= */}
          <FormSection title="Property Showcase" icon={<Image className="h-5 w-5 text-secondary" />}>
            <div className="space-y-6">
              <div className="relative group/upload">
                <input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <label 
                  htmlFor="photos" 
                  className="flex flex-col items-center justify-center px-12 py-16 border-2 border-dashed border-border/50 rounded-4xl bg-muted/10 hover:bg-muted/20 cursor-pointer transition-all hover:border-primary/50 group"
                >
                  <div className={`w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${isUploading ? 'animate-pulse' : ''}`}>
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-display font-bold">
                    {isUploading ? 'Uploading Gallery...' : 'Add Property Photos'}
                  </p>
                  <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mt-2">Multiple files accepted</p>
                </label>
              </div>

              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div key={`${photo}-${index}`} className="relative h-40 group rounded-3xl overflow-hidden shadow-rich border border-border/50">
                      <img src={photo} alt={`Property photo ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removePhoto(index)}
                          className="rounded-xl shadow-xl"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </FormSection>

          {/* ================= ROOM TYPES ================= */}
          <FormSection 
            title="Room Options" 
            icon={<Layout className="h-5 w-5 text-primary" />}
            action={
              <Button type="button" variant="outline" onClick={addRoom} className="rounded-xl gap-2 border-primary/20 text-primary hover:bg-primary/5">
                <Plus className="h-4 w-4" /> Add Type
              </Button>
            }
          >
            <div className="space-y-10">
              {rooms.map((room, index) => (
                <Card key={index} className="glass border-border/50 shadow-rich rounded-4xl overflow-hidden group">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/30">
                      <h4 className="font-display font-black text-xl uppercase tracking-tight flex items-center gap-2">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">#{index + 1}</div>
                        Room Suite Configuration
                      </h4>
                      {rooms.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRoom(index)}
                          className="text-destructive hover:bg-destructive/10 rounded-xl"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Type *</Label>
                        <Select
                          value={room.type}
                          onValueChange={(value: any) => updateRoom(index, 'type', value)}
                        >
                          <SelectTrigger className="h-14 bg-muted/30 border-border/50 rounded-2xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single Suite</SelectItem>
                            <SelectItem value="double">Premium Double</SelectItem>
                            <SelectItem value="shared">Shared Dormitory</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Max Capacity (Students) *</Label>
                        <Input
                          type="number"
                          min="1"
                          value={room.capacity}
                          onChange={(e) => updateRoom(index, 'capacity', parseInt(e.target.value))}
                          required
                          className="h-14 bg-muted/30 border-border/50 rounded-2xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Monthly Rent (MK) *</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            value={room.rent}
                            onChange={(e) => updateRoom(index, 'rent', parseInt(e.target.value))}
                            required
                            className="h-14 bg-muted/30 border-border/50 rounded-2xl pl-12 font-black text-xl text-primary"
                          />
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">MK</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Available Units *</Label>
                        <Input
                          type="number"
                          min="0"
                          value={room.available}
                          onChange={(e) => updateRoom(index, 'available', parseInt(e.target.value))}
                          required
                          className="h-14 bg-muted/30 border-border/50 rounded-2xl font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-[10px] uppercase font-black tracking-widest ml-1">Suite Amenities</Label>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {ROOM_AMENITIES_OPTIONS.map(amenity => (
                          <div key={amenity} className="flex items-center space-x-3 p-3 bg-muted/10 border border-border/5 rounded-xl hover:bg-muted/20 transition-all cursor-pointer">
                            <Checkbox
                              id={`room-${index}-amenity-${amenity}`}
                              checked={room.amenities.includes(amenity)}
                              onCheckedChange={() => handleRoomAmenityToggle(index, amenity)}
                              className="border-primary/50 data-[state=checked]:bg-primary rounded-md"
                            />
                            <label
                              htmlFor={`room-${index}-amenity-${amenity}`}
                              className="text-xs font-bold cursor-pointer"
                            >
                              {amenity}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </FormSection>

          {/* ================= SUBMIT ================= */}
          <div className="flex flex-col sm:flex-row gap-6 pt-12 border-t border-border/30">
            <Button 
              type="submit" 
              disabled={isLoading || isUploading} 
              className="flex-1 h-16 text-xl font-display font-black bg-gradient-premium shadow-xl shadow-primary/20 rounded-3xl hover:scale-[1.02] transition-all"
            >
              {isLoading ? 'Processing...' : (isEditing ? 'Update Property' : 'Publish Property')}
            </Button>
            <Link to="/landlord/dashboard" className="flex-1">
              <Button type="button" variant="outline" className="w-full h-16 text-xl font-display font-medium rounded-3xl border-border/50 hover:bg-muted/50">
                Discard Changes
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function FormSection({ title, icon, children, action }: any) {
  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between pb-2 border-b-2 border-muted">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-muted/50 rounded-xl flex items-center justify-center text-primary shadow-sm">
            {icon}
          </div>
          <h2 className="text-2xl font-display font-black tracking-tight">{title}</h2>
        </div>
        {action}
      </div>
      <div>{children}</div>
    </section>
  );
}