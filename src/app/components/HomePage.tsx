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
import { Search, MapPin, Home, Building2, ShieldCheck, Clock } from 'lucide-react';

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
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-slate-950/36" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,148,136,0.44),rgba(15,23,42,0.2))]" />
        </div>

        <div className="relative mx-auto flex min-h-[58vh] w-full max-w-6xl items-center justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="w-full max-w-3xl text-center">
            <h1 className="font-display text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find Your Perfect Hostel
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
              Browse verified student hostels near your campus. Safe, affordable, and just a click away.
            </p>

            <div className="mx-auto mt-8 max-w-2xl rounded-[1.5rem] border border-white/20 bg-white/92 p-2 shadow-2xl backdrop-blur-xl sm:mt-10">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex h-14 flex-1 items-center gap-3 rounded-2xl px-4 text-foreground">
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
                  className="h-12 rounded-2xl bg-teal-500 px-6 font-semibold text-white hover:bg-teal-400 sm:h-14 sm:px-8"
                  onClick={scrollToListings}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto -mt-8 grid max-w-5xl gap-4 px-4 pb-10 sm:-mt-10 sm:gap-5 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            { icon: Building2, label: 'Verified Hostels', value: `${hostels.length}+` },
            { icon: ShieldCheck, label: 'Trusted Landlords', value: `${Math.max(universities.length * 10, 50)}+` },
            { icon: Clock, label: 'Avg. Booking Time', value: '< 24hrs' },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-[1.5rem] border border-border/50 bg-background/95 p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] backdrop-blur-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-black tracking-tight text-foreground">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <div id="home-listings" className="grid gap-8 lg:grid-cols-[296px_minmax(0,1fr)] lg:gap-10">
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Refine search</p>
                <h2 className="mt-2 font-display text-3xl font-black tracking-tight">Find the right fit</h2>
              </div>

              <div className="space-y-7 rounded-[2rem] border border-border/60 bg-card p-5 shadow-lg sm:p-6">
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

                <div className="space-y-4">
                  <label className="text-sm font-medium">
                    Max Price: MK {maxPrice.toLocaleString()}
                  </label>
                  <Slider
                    min={0}
                    max={200000}
                    step={10000}
                    value={[maxPrice]}
                    onValueChange={(val) => setMaxPrice(val[0])}
                  />
                </div>

                <div className="space-y-4">
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

                <Button variant="outline" onClick={resetFilters} className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-border/60 bg-gradient-to-br from-primary/[0.08] via-background to-amber-100/40 p-5 shadow-sm sm:mb-10 sm:gap-5 sm:p-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Available now</p>
                <h2 className="mt-2 max-w-2xl font-display text-3xl font-black tracking-tight text-foreground">
                  Verified hostels near campus
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Showing {filteredHostels.length} listing{filteredHostels.length === 1 ? '' : 's'} that match your search.
                </p>
              </div>
              <div className="rounded-2xl border border-primary/10 bg-background/80 px-4 py-4 text-sm leading-6 text-muted-foreground shadow-sm sm:px-5">
                Compare price, location, and amenities at a glance.
              </div>
            </div>

            {filteredHostels.length ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredHostels.map((h) => (
                  <HostelCard key={h.id} hostel={h} />
                ))}
              </div>
            ) : (
              <EmptyState onReset={resetFilters} />
            )}
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
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11 rounded-xl">
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
    <Card className="border-dashed bg-muted/30 shadow-none rounded-[2rem]">
      <CardContent className="py-20 text-center">
        <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold text-foreground mb-1">No hostels found</h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your search or resetting filters.
        </p>
        <Button variant="outline" onClick={onReset}>
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
