import { useState } from 'react';
import { useData } from '../context/AppContext';
import { HostelCard } from './HostelCard';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, MapPin, DollarSign, Home } from 'lucide-react';
import { Badge } from './ui/badge';

export function HomePage() {
  const { hostels } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedRoomType, setSelectedRoomType] = useState('all');

  // Get unique universities
  const universities = Array.from(new Set(hostels.map(h => h.university)));

  // Filter hostels
  const filteredHostels = hostels.filter(hostel => {
    const matchesSearch = hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hostel.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUniversity = selectedUniversity === 'all' || hostel.university === selectedUniversity;
    const hasRoomInPriceRange = hostel.rooms.some(room => room.rent >= priceRange[0] && room.rent <= priceRange[1]);
    const hasRoomType = selectedRoomType === 'all' || hostel.rooms.some(room => room.type === selectedRoomType);
    
    return matchesSearch && matchesUniversity && hasRoomInPriceRange && hasRoomType;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl mb-4 text-gray-900">Find Your Perfect Student Hostel</h1>
        <p className="text-xl text-gray-600 mb-8">Discover comfortable and affordable accommodation near your university</p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by hostel name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-6 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <Home className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-3xl mb-1">{hostels.length}</div>
            <div className="text-gray-600">Available Hostels</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-3xl mb-1">{universities.length}</div>
            <div className="text-gray-600">Universities Covered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-3xl mb-1">MK 60K+</div>
            <div className="text-gray-600">Starting From</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* University Filter */}
              <div>
                <label className="text-sm mb-2 block">University</label>
                <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Universities</SelectItem>
                    {universities.map(uni => (
                      <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Room Type Filter */}
              <div>
                <label className="text-sm mb-2 block">Room Type</label>
                <Select value={selectedRoomType} onValueChange={setSelectedRoomType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="shared">Shared</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="text-sm mb-2 block">
                  Price Range: MK {priceRange[0].toLocaleString()} - MK {priceRange[1].toLocaleString()}
                </label>
                <Slider
                  min={0}
                  max={200000}
                  step={10000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mt-2"
                />
              </div>

              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedUniversity('all');
                  setPriceRange([0, 200000]);
                  setSelectedRoomType('all');
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Hostels Grid */}
        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl mb-2">Available Hostels</h2>
              <p className="text-gray-600">{filteredHostels.length} hostels found</p>
            </div>
          </div>

          {filteredHostels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredHostels.map(hostel => (
                <HostelCard key={hostel.id} hostel={hostel} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600">No hostels found matching your criteria.</p>
                <Button variant="outline" className="mt-4" onClick={() => {
                  setSearchQuery('');
                  setSelectedUniversity('all');
                  setPriceRange([0, 200000]);
                  setSelectedRoomType('all');
                }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}