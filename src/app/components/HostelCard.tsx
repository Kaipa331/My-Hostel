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

      <CardContent className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <Link to={`/hostel/${hostel.id}`} className="min-w-0 hover:underline">
            <h3 className="line-clamp-1 text-xl font-bold tracking-tight text-foreground">
              {hostel.name}
            </h3>
          </Link>
          
          <div className="flex shrink-0 items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-lg text-sm font-black text-amber-600 border border-border/20">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>{hostel.rating.toFixed(1)}</span>
            <span className="text-[10px] font-bold text-muted-foreground/60 ml-0.5">({reviewCount})</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
          <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
          <span className="line-clamp-1">{hostel.address}</span>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          {hostel.amenities.slice(0, 4).map((amenity) => {
            const Icon = amenityIcons[amenity];

            return (
              <Badge
                key={amenity}
                variant="secondary"
                className="h-7 rounded-lg border border-border/40 bg-muted/30 px-2.5 text-[10px] font-bold text-muted-foreground tracking-wide uppercase"
              >
                {Icon ? <Icon className="h-3.5 w-3.5 opacity-70" /> : <Users className="h-3.5 w-3.5 opacity-50" />}
                {amenity}
              </Badge>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-border/50 pt-5 mt-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground leading-none mb-1">Monthly Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black tracking-tighter text-teal-600">
                MK {minRent.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-muted-foreground">/mo</span>
            </div>
          </div>

          <div className="text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 bg-muted px-2 py-1 rounded-md">
            {hostel.distance} km away
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
