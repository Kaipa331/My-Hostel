import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { useAuth, useData, Room } from '../context/AppContext';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
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
  const { landlord } = useAuth();
  const { addHostel, updateHostel, getHostelById } = useData();
  const [isLoading, setIsLoading] = useState(false);

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
    if (!landlord) {
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
  }, [landlord, navigate, isEditing, existingHostel]);

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

    const uploadedUrls: string[] = [];

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
        landlordId: landlord!.id,
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

  if (!landlord) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/landlord/dashboard">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Hostel' : 'Add New Hostel'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Hostel Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="university">University *</Label>
                  <Select
                    value={formData.university}
                    onValueChange={(value) => setFormData({...formData, university: value})}
                  >
                    <SelectTrigger id="university">
                      <SelectValue placeholder="Select university" />
                    </SelectTrigger>
                    <SelectContent>
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
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Full address"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="distance">Distance from University (km) *</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    value={formData.distance}
                    onChange={(e) => setFormData({...formData, distance: e.target.value})}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your hostel, its facilities, and what makes it special..."
                    rows={4}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg mb-4">Hostel Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {AMENITIES_OPTIONS.map(amenity => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={formData.amenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                    />
                    <label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div>
              <h3 className="text-lg mb-4">Hostel Photos</h3>
              <div className="mb-3">
                <Label htmlFor="photos">Upload photos (you can choose multiple)</Label>
                <input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="mt-2 block w-full text-sm text-gray-700"
                />
              </div>

              {formData.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {formData.photos.map((photo, index) => (
                    <div key={`${photo}-${index}`} className="relative">
                      <img src={photo} alt={`Hostel photo ${index + 1}`} className="h-24 w-full object-cover rounded-md" />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rooms */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg">Room Types</h3>
                <Button type="button" variant="outline" onClick={addRoom} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Room Type
                </Button>
              </div>

              <div className="space-y-6">
                {rooms.map((room, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4>Room Type {index + 1}</h4>
                        {rooms.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRoom(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label>Room Type *</Label>
                          <Select
                            value={room.type}
                            onValueChange={(value: any) => updateRoom(index, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="double">Double</SelectItem>
                              <SelectItem value="shared">Shared</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Capacity *</Label>
                          <Input
                            type="number"
                            min="1"
                            value={room.capacity}
                            onChange={(e) => updateRoom(index, 'capacity', parseInt(e.target.value))}
                            required
                          />
                        </div>
                        <div>
                          <Label>Rent (MK/month) *</Label>
                          <Input
                            type="number"
                            min="0"
                            value={room.rent}
                            onChange={(e) => updateRoom(index, 'rent', parseInt(e.target.value))}
                            required
                          />
                        </div>
                        <div>
                          <Label>Available Rooms *</Label>
                          <Input
                            type="number"
                            min="0"
                            value={room.available}
                            onChange={(e) => updateRoom(index, 'available', parseInt(e.target.value))}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="mb-3 block">Room Amenities</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {ROOM_AMENITIES_OPTIONS.map(amenity => (
                            <div key={amenity} className="flex items-center space-x-2">
                              <Checkbox
                                id={`room-${index}-amenity-${amenity}`}
                                checked={room.amenities.includes(amenity)}
                                onCheckedChange={() => handleRoomAmenityToggle(index, amenity)}
                              />
                              <label
                                htmlFor={`room-${index}-amenity-${amenity}`}
                                className="text-sm cursor-pointer"
                              >
                                {amenity}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4 border-t">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Saving...' : (isEditing ? 'Update Hostel' : 'Add Hostel')}
              </Button>
              <Link to="/landlord/dashboard" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}