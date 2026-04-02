import { useState, useMemo, useCallback, useEffect } from 'react';
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
import { Search, MapPin, DollarSign, Home, Building2, ShieldCheck, Clock } from 'lucide-react';

const heroImages = [
  '/hero-hostel.jpg',
  '/hero-hostel-2.jpg',
  '/hero-hostel-3.jpg',
  '/hero-hostel-4.jpg',
];

export function HomePage() {
  const { hostels } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [maxPrice, setMaxPrice] = useState(200000);
  const [selectedRoomType, setSelectedRoomType] = useState('all');
  const [maxDistance, setMaxDistance] = useState(10);
  const [activeHeroImage, setActiveHeroImage] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveHeroImage((current) => (current + 1) % heroImages.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, []);

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
          {heroImages.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === activeHeroImage ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
          <div className="absolute inset-0 bg-slate-950/65" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.18),transparent_28%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="relative mx-auto flex min-h-[68vh] w-full max-w-6xl items-center px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
          <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md sm:mb-7 sm:px-4 sm:text-xs sm:tracking-[0.28em]">
                <ShieldCheck className="h-4 w-4 text-amber-300" />
                Verified student accommodation
              </div>

              <h1 className="font-display text-4xl font-black leading-[1] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Your next hostel should feel safe, close, and worth every kwacha.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/78 sm:mt-5 sm:text-lg">
                Browse trusted stays near campus, compare prices quickly, and move into a place that actually fits student life.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5 text-sm text-white/85 sm:mt-7 sm:gap-3">
                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                  {hostels.length}+ verified listings
                </div>
                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                  Near {universities.length} universities
                </div>
                <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                  Prices starting around MK 60,000
                </div>
              </div>

              <div className="mt-8 max-w-3xl rounded-[2rem] border border-white/15 bg-white/12 p-3 shadow-2xl backdrop-blur-xl sm:mt-9">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="flex h-14 flex-1 items-center gap-3 rounded-2xl bg-white/92 px-4 text-foreground shadow-sm">
                    <MapPin className="h-5 w-5 shrink-0 text-primary" />
                    <Input
                      placeholder="Search by location, hostel, or university..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-auto border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="h-14 w-full rounded-2xl bg-amber-400 px-6 font-bold text-slate-950 hover:bg-amber-300 sm:w-auto sm:px-8"
                    onClick={scrollToListings}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Explore listings
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Trusted stays',
                  description: 'Only verified properties that are easier to assess before you commit.',
                },
                {
                  icon: Clock,
                  title: 'Fast comparison',
                  description: 'Check distance, rent, and room type in one place without jumping around.',
                },
                {
                  icon: Building2,
                  title: 'Built for students',
                  description: 'Designed around campus living, affordability, and practical amenities.',
                },
              ].map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 text-white shadow-xl backdrop-blur-md sm:p-6"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14">
                    <Icon className="h-6 w-6 text-amber-300" />
                  </div>
                  <h2 className="font-display text-xl font-bold">{title}</h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-white/72">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mx-auto -mt-3 grid max-w-6xl gap-4 px-4 pb-10 sm:-mt-4 sm:gap-5 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            { icon: Building2, label: 'Verified Hostels', value: hostels.length.toString() },
            { icon: MapPin, label: 'Universities Covered', value: universities.length.toString() },
            { icon: DollarSign, label: 'Starting Price', value: 'MK 60K' },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-[1.75rem] border border-border/60 bg-background/92 p-6 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
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
        <div className="mb-12 grid gap-5 lg:mb-14 lg:grid-cols-3 lg:gap-6">
          {[
            {
              title: 'Smart search',
              copy: 'Filter by university, room type, distance, and rent without losing the bigger picture.',
            },
            {
              title: 'Transparent pricing',
              copy: 'Compare options side by side and quickly spot which hostels fit your budget range.',
            },
            {
              title: 'Move with confidence',
              copy: 'Review location, amenities, and availability before you reach out or reserve a room.',
            },
          ].map(({ title, copy }) => (
            <div key={title} className="rounded-[1.75rem] border border-border/60 bg-card p-6 shadow-sm sm:p-7">
              <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>

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
                Focus on what matters: distance, room style, and price.
              </div>
            </div>

            {filteredHostels.length ? (
              <div className="grid gap-6 sm:grid-cols-2">
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
