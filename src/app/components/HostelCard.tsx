import { Link } from 'react-router';
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
    <Card className="group overflow-hidden rounded-[1.35rem] border border-border/60 bg-card shadow-[0_18px_40px_-28px_rgba(15,23,42,0.28)] transition-all hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-26px_rgba(15,23,42,0.35)]">
      <Link to={`/hostel/${hostel.id}`} className="relative block aspect-[1.12/1] overflow-hidden bg-muted">
        <ImageWithFallback
          src={imageUrl}
          alt={hostel.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />

        <Badge className="absolute left-3 top-3 rounded-full border-0 bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-sm">
          {formatRoomType(cheapestRoom?.type || 'room')}
        </Badge>

        {totalAvailable === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/35">
            <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm">
              Fully Booked
            </span>
          </div>
        ) : (
          <Badge className="absolute right-3 top-3 rounded-full border-0 bg-amber-400 px-2.5 py-1 text-[10px] font-semibold text-amber-950 shadow-sm">
            {totalAvailable} room{totalAvailable === 1 ? '' : 's'}
          </Badge>
        )}
      </Link>

      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/hostel/${hostel.id}`} className="min-w-0 hover:underline">
            <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-foreground">
              {hostel.name}
            </h3>
          </Link>

          <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-slate-700">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>{hostel.rating.toFixed(1)}</span>
            <span className="text-xs font-medium text-muted-foreground">
              ({reviewCount})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{hostel.address}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {hostel.amenities.slice(0, 4).map((amenity) => {
            const Icon = amenityIcons[amenity];

            return (
              <Badge
                key={amenity}
                variant="secondary"
                className="h-6 rounded-full border border-amber-100 bg-amber-50 px-2.5 text-[10px] font-medium text-amber-900"
              >
                {Icon ? <Icon className="h-3 w-3 opacity-70" /> : <Users className="h-3 w-3 opacity-50" />}
                {amenity}
              </Badge>
            );
          })}
        </div>

        <div className="flex items-end justify-between border-t border-border/60 pt-3">
          <div className="leading-none">
            <span className="text-2xl font-bold tracking-tight text-teal-600">
              MK {minRent.toLocaleString()}
            </span>
            <span className="ml-1 text-sm text-muted-foreground">/month</span>
          </div>

          <div className="text-right text-xs text-muted-foreground">
            {hostel.distance} km from campus
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
