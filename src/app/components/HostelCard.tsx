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
  'https://images.unsplash.com/photo-1763924636780-4da2a7c3327c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwZG9ybWl0b3J5JTIwcm9vbXxlbnwxfHx8fDE3NzQ0NTAxMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1697494794128-0cdc5e4314c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYWNjb21tb2RhdGlvbiUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3NDQ1MDEwMnww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1635151926449-b9e7e5246fa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3N0ZWwlMjBjb21tb24lMjBhcmVhJTIwbG91bmdlfGVufDF8fHx8MTc3NDQ1MDEwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1615431303449-9ad9207d05de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3N0ZWwlMjBleHRlcmlvciUyMGJ1aWxkaW5nfGVufDF8fHx8MTc3NDQ1MDEwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/hostel/${hostel.id}`}>
        <div className="relative h-48 bg-gray-200">
          <ImageWithFallback 
            src={imageUrl}
            alt={hostel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{hostel.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>

      <CardContent className="pt-4">
        <Link to={`/hostel/${hostel.id}`}>
          <h3 className="text-xl mb-2 hover:text-blue-600">{hostel.name}</h3>
        </Link>
        
        <div className="flex items-start gap-2 text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm">{hostel.address}</p>
            <p className="text-sm">{hostel.distance} km from {hostel.university}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {hostel.amenities.slice(0, 4).map(amenity => {
            const Icon = amenityIcons[amenity];
            return (
              <Badge key={amenity} variant="secondary" className="gap-1">
                {Icon && <Icon className="h-3 w-3" />}
                {amenity}
              </Badge>
            );
          })}
          {hostel.amenities.length > 4 && (
            <Badge variant="secondary">+{hostel.amenities.length - 4} more</Badge>
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl text-blue-600">MK {minRent.toLocaleString()}</span>
          <span className="text-gray-600">/month</span>
        </div>
        
        <p className="text-sm text-gray-600">
          {hostel.rooms.length} room types available
        </p>
      </CardContent>

      <CardFooter>
        <Link to={`/hostel/${hostel.id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}