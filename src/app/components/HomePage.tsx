import { useState, useMemo, useCallback } from 'react';
import { useData } from '../context/AppContext';
import { HostelCard } from './HostelCard';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Slider } from './ui/slider';
import { Card, CardContent } from './ui/card';
import { Search, MapPin, Home } from 'lucide-react';

const heroImage = '/hero-hostel.jpg';

export function HomePage() {
  const { hostels } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [maxPrice, setMaxPrice] = useState(200000);
  const [selectedRoomType, setSelectedRoomType] = useState('all');
  const [maxDistance, setMaxDistance] = useState(10);

  const universities = useMemo(
    () => Array.from(new Set(hostels.map((h) => h.university).filter((u) => u && u.trim()))),
    [hostels]
  );

  const filteredHostels = useMemo(() => {
    return hostels.filter((hostel) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        hostel.name.toLowerCase().includes(q) ||
        hostel.address.toLowerCase().includes(q) ||
        hostel.university.toLowerCase().includes(q);

      const matchesUniversity =
        selectedUniversity === 'all' || hostel.university === selectedUniversity;

      const hasRoomInPriceRange = hostel.rooms.some((room) => room.rent <= maxPrice);
      const hasRoomType =
        selectedRoomType === 'all' ||
        hostel.rooms.some((room) => room.type === selectedRoomType);

      const matchesDistance = hostel.distance <= maxDistance;

      return matchesSearch && matchesUniversity && hasRoomInPriceRange && hasRoomType && matchesDistance;
    });
  }, [hostels, searchQuery, selectedUniversity, maxPrice, selectedRoomType, maxDistance]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedUniversity('all');
    setMaxPrice(200000);
    setSelectedRoomType('all');
    setMaxDistance(10);
  }, []);

  const scrollToListings = useCallback(() => {
    document.getElementById('home-listings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-slate-950/40" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,148,136,0.44),rgba(15,23,42,0.25))]" />
        </div>

        <div className="relative mx-auto flex min-h-[58vh] w-full max-w-6xl items-center justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="w-full max-w-3xl text-center">
            <h1 className="font-display text-4xl font-black leading-tight tracking-tight !text-white sm:text-5xl lg:text-7xl">
              Find Your Own Hostel
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 !text-white/90 sm:text-lg">
              Browse verified student hostels near your campus. Safe, affordable, and just a click away.
            </p>

            <div className="mx-auto mt-10 max-w-2xl rounded-[1.75rem] border border-white/20 bg-white/95 p-2 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex h-14 flex-1 items-center gap-3 rounded-2xl px-5 text-foreground">
                  <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <Input
                    placeholder="Search by location, hostel name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-auto border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
                  />
                </div>
                <Button
                  size="lg"
                  className="h-12 rounded-2xl bg-[#D4AF37] px-8 font-semibold text-white shadow-lg shadow-[#D4AF37]/30 hover:bg-[#C5A017] sm:h-14"
                  onClick={scrollToListings}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LISTINGS + FILTERS SECTION */}
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-32 sm:px-8 lg:px-10">
        <div id="home-listings" className="grid gap-14 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-20">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">Refine search</p>
                <h2 className="mt-3 font-display text-3xl font-black tracking-tight">Find the right fit</h2>
              </div>

              <div className="space-y-8 rounded-3xl border border-border/60 bg-card p-6 shadow-lg sm:p-8">
                <FilterSelect
                  label="University"
                  value={selectedUniversity}
                  onChange={setSelectedUniversity}
                  options={['all', ...universities]}
                />

                <FilterSelect
                  label="Room Type"
                  value={selectedRoomType}
                  onChange={setSelectedRoomType}
                  options={['all', 'single', 'double', 'shared']}
                />

                <div className="space-y-5">
                  <label className="text-sm font-medium">
                    Max Price: <span className="font-semibold">MK {maxPrice.toLocaleString()}</span>
                  </label>
                  <Slider
                    min={0}
                    max={200000}
                    step={10000}
                    value={[maxPrice]}
                    onValueChange={(val) => setMaxPrice(val[0])}
                  />
                </div>

                <div className="space-y-5">
                  <label className="text-sm font-medium">
                    Distance: Up to {maxDistance} km
                  </label>
                  <Slider
                    min={0}
                    max={15}
                    step={1}
                    value={[maxDistance]}
                    onValueChange={(val) => setMaxDistance(val[0])}
                  />
                </div>

                <Button variant="outline" onClick={resetFilters} className="w-full h-11">
                  Clear All Filters
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Verified Hostels Header */}
            <div className="mb-12 rounded-3xl border border-border/60 bg-gradient-to-br from-card/30 via-card to-card p-8 shadow-rich">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.08em] text-primary">
                    AVAILABLE NOW
                  </p>
                  <h2 className="font-display text-3xl font-black tracking-tight text-foreground lg:text-4xl">
                    Verified hostels near campus
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Showing{' '}
                    <span className="font-semibold text-foreground">{filteredHostels.length}</span>{' '}
                    listing{filteredHostels.length === 1 ? '' : 's'} that match your search.
                  </p>
                </div>

                <div className="rounded-2xl border border-border/30 bg-background/50 px-6 py-6 text-sm text-muted-foreground shadow-inner max-w-xs sm:text-right">
                  Compare price, location, amenities, and availability at a glance.
                </div>
              </div>
            </div>

            {/* Hostel Cards Grid - Added extra top spacing */}
            <div className="pt-4">
              {filteredHostels.length > 0 ? (
                <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredHostels.map((h) => (
                    <HostelCard key={h.id} hostel={h} />
                  ))}
                </div>
              ) : (
                <EmptyState onReset={resetFilters} />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function FilterSelect({ label, value, onChange, options }: any) {
  const validOptions = options.filter((opt: string) => opt && opt.trim());

  return (
    <div className="space-y-2.5">
      <label className="text-sm font-medium">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 rounded-2xl">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {validOptions.map((opt: string) => (
            <SelectItem key={opt} value={opt}>
              {opt === 'all' ? 'All' : opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function EmptyState({ onReset }: any) {
  return (
    <Card className="border-dashed bg-muted/30 shadow-none rounded-3xl">
      <CardContent className="py-24 text-center">
        <Home className="mx-auto mb-6 h-14 w-14 text-muted-foreground opacity-60" />
        <h3 className="text-xl font-semibold">No hostels found</h3>
        <p className="mt-3 text-muted-foreground max-w-sm mx-auto">
          Try adjusting your filters or search terms.
        </p>
        <Button variant="outline" onClick={onReset} className="mt-8">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}