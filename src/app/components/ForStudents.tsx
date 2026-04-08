import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Search, Heart, Shield, Clock, Star } from 'lucide-react';
import { Link } from 'react-router';
import { MarketingPageShell } from './MarketingPageShell';

export function ForStudents() {
  return (
    <MarketingPageShell
      eyebrow="For Students"
      title="Find a place near campus without wasting time on confusing listings."
      description="Search verified hostels, compare your options clearly, and move forward with more confidence."
      actions={
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/" className="w-full sm:w-auto">
            <Button className="w-full">Browse Hostels</Button>
          </Link>
          <Link to="/auth" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">Create Account</Button>
          </Link>
        </div>
      }
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="text-center">
            <CardContent className="pt-8">
              <Search className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">Browse Hostels</h3>
              <p className="mb-4 text-muted-foreground">Search and filter hostels by location, price, and amenities.</p>
              <Link to="/">
                <Button className="w-full">Start Browsing</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-8">
              <Heart className="mx-auto mb-4 h-12 w-12 text-rose-500" />
              <h3 className="mb-2 text-lg font-semibold">Save Favorites</h3>
              <p className="mb-4 text-muted-foreground">Save your favorite hostels and compare options easily.</p>
              <Link to="/auth">
                <Button variant="outline" className="w-full">Create Account</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-8">
              <Shield className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
              <h3 className="mb-2 text-lg font-semibold">Book Securely</h3>
              <p className="mb-4 text-muted-foreground">Safe and secure booking process with verified hostels.</p>
              <Link to="/auth">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <Card className="glass border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                  Save Time & Effort
                </CardTitle>
              </CardHeader>
              <CardContent>
              <ul className="space-y-2 leading-7 text-muted-foreground">
                  <li>• Find verified hostels near your university</li>
                  <li>• Compare prices and amenities easily</li>
                  <li>• Book rooms with just a few clicks</li>
                  <li>• Get instant booking confirmations</li>
                  <li>• Direct communication with landlords</li>
                </ul>
              </CardContent>
            </Card>

          <Card className="glass border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                  Peace of Mind
                </CardTitle>
              </CardHeader>
              <CardContent>
              <ul className="space-y-2 leading-7 text-muted-foreground">
                  <li>• All hostels are verified and inspected</li>
                  <li>• Secure payment processing</li>
                  <li>• Clear booking policies and terms</li>
                  <li>• 24/7 support for urgent issues</li>
                  <li>• Transparent pricing with no hidden fees</li>
                </ul>
              </CardContent>
            </Card>
        </div>

        <Card className="mb-12 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-center">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid gap-8 md:grid-cols-4">
                <Card className="text-center">
                  <CardContent>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-lg font-bold text-primary">1</span>
                    </div>
                    <h4 className="font-semibold mb-2">Create Account</h4>
                    <p className="text-sm text-muted-foreground">Sign up with your university email and basic details.</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-lg font-bold text-primary">2</span>
                    </div>
                    <h4 className="font-semibold mb-2">Browse & Compare</h4>
                    <p className="text-sm text-muted-foreground">Search hostels by location and filter by your preferences.</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-lg font-bold text-primary">3</span>
                    </div>
                    <h4 className="font-semibold mb-2">Book & Pay</h4>
                    <p className="text-sm text-muted-foreground">Secure your room with simple booking and payment options.</p>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-lg font-bold text-primary">4</span>
                    </div>
                    <h4 className="font-semibold mb-2">Move In</h4>
                    <p className="text-sm text-muted-foreground">Get your keys and start your university journey.</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

        <Card className="mb-12 border-0 bg-gradient-premium text-white">
          <CardContent className="py-8 text-center">
            <Star className="mx-auto mb-4 h-8 w-8 text-yellow-300" />
            <blockquote className="mb-4 text-lg">
                "MyHostel made finding accommodation so easy! I found a great hostel near campus within minutes and the booking process was seamless."
            </blockquote>
            <cite className="text-blue-100">- Sarah M., MUST Student</cite>
          </CardContent>
        </Card>

        <Card className="border-0 bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] text-white">
          <CardContent className="py-10 text-center">
            <h2 className="mb-4 text-2xl font-bold">Ready to Find Your Home?</h2>
            <p className="mb-6 opacity-90">
                Join thousands of students who have found their perfect accommodation through MyHostel.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full">
                  Get Started
                </Button>
              </Link>
              <Link to="/" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full border-white/50 bg-white/10 text-white hover:bg-white hover:text-primary">
                  Browse Hostels
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MarketingPageShell>
  );
}
