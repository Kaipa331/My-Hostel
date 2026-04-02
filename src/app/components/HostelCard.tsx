import { Link } from 'react-router';
import { Hostel } from '../context/AppContext';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Star, Wifi, Car, Utensils, Shield } from 'lucide-react';
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

export function HostelCard({ hostel }: HostelCardProps) {
  const minRent = Math.min(...hostel.rooms.map(r => r.rent));
  const imageUrl = hostel.photos && hostel.photos.length > 0
    ? hostel.photos[0]
    : hostelImages[parseInt(hostel.id, 10) % hostelImages.length];

  const amenityIcons: Record<string, any> = {
    'WiFi': Wifi,
    'Parking': Car,
    'Mess': Utensils,
    'Security': Shield,
  };

  return (
    <Card className="overflow-hidden border card-shadow flex flex-col bg-card transition-colors hover:bg-accent/5">
      <Link to={`/hostel/${hostel.id}`} className="block relative aspect-[4/3] bg-muted overflow-hidden">
        <ImageWithFallback 
          src={imageUrl}
          alt={hostel.name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-background/95 backdrop-blur px-2 py-1 rounded-md shadow-sm border text-xs font-semibold flex items-center gap-1">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span>{hostel.rating.toFixed(1)}</span>
        </div>
      </Link>

      <CardContent className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-4 mb-2">
          <Link to={`/hostel/${hostel.id}`} className="hover:underline">
            <h3 className="font-semibold text-lg line-clamp-1">{hostel.name}</h3>
          </Link>
          <div className="text-right shrink-0">
            <div className="font-bold text-lg">MK {minRent.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">/ month</div>
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1 truncate max-w-[60%]">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{hostel.address}</span>
          </div>
          <span className="shrink-0">{hostel.distance} km from uni</span>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          {hostel.amenities.slice(0, 3).map(amenity => {
            const Icon = amenityIcons[amenity];
            return (
              <Badge key={amenity} variant="secondary" className="font-normal text-xs py-0 h-6">
                {Icon && <Icon className="h-3 w-3 mr-1 opacity-70" />}
                {amenity}
              </Badge>
            );
          })}
          {hostel.amenities.length > 3 && (
            <span className="text-xs text-muted-foreground flex items-center ml-1">
              +{hostel.amenities.length - 3}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}