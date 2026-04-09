import { Link } from 'react-router-dom';
import { Hostel } from '../context/AppContext';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Star, Wifi, Car, Utensils, Shield, Droplets, Camera, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HostelCardProps {
  hostel: Hostel;
}

const hostelImages = [
  'https://images.unsplash.com/photo-1763924636780-4da2a7c3327c?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1697494794128-0cdc5e4314c1?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1635151926449-b9e7e5246fa6?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1615431303449-9ad9207d05de?auto=format&fit=crop&q=80&w=600',
];

const amenityIcons: Record<string, any> = {
  WiFi: Wifi,
  Parking: Car,
  Mess: Utensils,
  Security: Shield,
  Water: Droplets,
  CCTV: Camera,
};

function formatRoomType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function HostelCard({ hostel }: HostelCardProps) {
  const minRent = Math.min(...hostel.rooms.map((r) => r.rent));
  const imageUrl =
    hostel.photos && hostel.photos.length > 0
      ? hostel.photos[0]
      : hostelImages[parseInt(hostel.id, 10) % hostelImages.length];
  const cheapestRoom = [...hostel.rooms].sort((a, b) => a.rent - b.rent)[0];
  const totalAvailable = hostel.rooms.reduce((sum, room) => sum + room.available, 0);
  const reviewCount = hostel.reviews.length;

  return (
    <Card className="group overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      
      {/* IMAGE */}
      <Link to={`/hostel/${hostel.id}`} className="relative block aspect-[1.2/1] overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={hostel.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* room type */}
        <Badge className="absolute left-3 top-3 rounded-full bg-white/90 text-xs font-semibold text-slate-700 backdrop-blur px-3 py-1 shadow">
          {formatRoomType(cheapestRoom?.type || 'room')}
        </Badge>

        {/* availability */}
        {totalAvailable === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow">
              Fully Booked
            </span>
          </div>
        ) : (
          <Badge className="absolute right-3 top-3 rounded-full bg-amber-400 text-xs font-semibold text-amber-950 px-3 py-1 shadow">
            {totalAvailable} room{totalAvailable === 1 ? '' : 's'}
          </Badge>
        )}
      </Link>

      {/* CONTENT */}
      <CardContent className="p-5 space-y-5">
        
        {/* TITLE + RATING */}
        <div className="flex items-start justify-between gap-3">
          <Link to={`/hostel/${hostel.id}`} className="min-w-0">
            <h3 className="line-clamp-1 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {hostel.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-lg text-sm font-semibold text-amber-600">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {hostel.rating.toFixed(1)}
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        </div>

        {/* LOCATION */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary/70" />
          <span className="line-clamp-1">{hostel.address}</span>
        </div>

        {/* AMENITIES */}
        <div className="flex flex-wrap gap-2">
          {hostel.amenities.slice(0, 4).map((amenity) => {
            const Icon = amenityIcons[amenity];

            return (
              <div
                key={amenity}
                className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground"
              >
                {Icon ? (
                  <Icon className="h-3.5 w-3.5 opacity-70" />
                ) : (
                  <Users className="h-3.5 w-3.5 opacity-50" />
                )}
                {amenity}
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t pt-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Monthly Rent
            </p>
            <p className="text-xl font-bold text-primary">
              MK {minRent.toLocaleString()}
              <span className="text-sm text-muted-foreground font-medium"> /mo</span>
            </p>
          </div>

          <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-md">
            {hostel.distance} km away
          </div>
        </div>

      </CardContent>
    </Card>
  );
}