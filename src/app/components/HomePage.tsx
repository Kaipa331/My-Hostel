import { useState } from 'react';
import { useData } from '../context/AppContext';
import { HostelCard } from './HostelCard';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, MapPin, DollarSign, Home, Sparkles, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-primary-foreground dark:from-primary dark:via-secondary dark:to-accent py-12 md:py-24 lg:py-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 dark:bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 dark:bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
            <Sparkles className="h-4 w-4 text-blue-300" />
            <span className="text-sm font-medium text-white/90 dark:text-white/80">Discover Your Home Away From Home</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white dark:text-white mb-6 tracking-tight leading-tight">
            Find Your Perfect <span className="bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-200 dark:to-cyan-200 bg-clip-text text-transparent">Student Hostel</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/80 dark:text-white/70 mb-8 max-w-2xl mx-auto font-light">
            Affordable, comfortable, and verified accommodation near your university. Find, book, and move in hassle-free.
          </p>

          {/* CTA Badges */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-white/30 px-4 py-2">
              ✓ Instant Booking
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-white/30 px-4 py-2">
              ✓ Verified Hostels
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-white/30 px-4 py-2">
              ✓ Best Prices
            </Badge>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-300 dark:to-cyan-300 rounded-full opacity-0 group-hover:opacity-100 blur transition duration-300"></div>
              <div className="relative bg-white dark:bg-slate-900 rounded-full p-1 shadow-2xl">
                <div className="flex items-center bg-white dark:bg-slate-900 rounded-full px-4 py-4 md:py-5">
                  <Search className="h-5 w-5 text-foreground/40 mr-3 flex-shrink-0" />
                  <Input
                    type="text"
                    placeholder="Search by hostel name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-transparent text-base md:text-lg focus:outline-none focus:ring-0 placeholder-foreground/40 flex-1 text-foreground"
                  />
                  <Button className="ml-2 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white px-6 cursor-pointer">
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl p-6 hover:bg-white/15 dark:hover:bg-white/10 transition">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Home className="h-6 w-6 text-blue-300" />
                <span className="text-3xl font-bold text-white">{hostels.length}</span>
              </div>
              <p className="text-white/70 text-sm">Quality Hostels</p>
            </div>
            <div className="backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl p-6 hover:bg-white/15 dark:hover:bg-white/10 transition">
              <div className="flex items-center justify-center gap-3 mb-2">
                <MapPin className="h-6 w-6 text-blue-300" />
                <span className="text-3xl font-bold text-white">{universities.length}</span>
              </div>
              <p className="text-white/70 text-sm">Universities</p>
            </div>
            <div className="backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl p-6 hover:bg-white/15 dark:hover:bg-white/10 transition">
              <div className="flex items-center justify-center gap-3 mb-2">
                <DollarSign className="h-6 w-6 text-blue-300" />
                <span className="text-3xl font-bold text-white">60K+</span>
              </div>
              <p className="text-white/70 text-sm">Starting Price</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-8">
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