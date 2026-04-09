import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Building, TrendingUp, Users, DollarSign, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MarketingPageShell } from './MarketingPageShell';

export function ForLandlords() {
  return (
    <MarketingPageShell
      eyebrow="For Landlords"
      title="Fill more rooms with a platform designed around student housing."
      description="MyHostel helps landlords reach serious student renters, manage listings, and present properties with more credibility."
      actions={
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/auth" className="w-full sm:w-auto">
            <Button className="w-full">Start Listing</Button>
          </Link>
          <Link to="/contact" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">Talk to Sales</Button>
          </Link>
        </div>
      }
    >
      <div className="mx-auto max-w-6xl space-y-16 py-8">
        <div className="grid gap-12 md:grid-cols-3 mb-16 py-6">
          <Card className="text-center">
            <CardContent className="pt-10">
              <Building className="mx-auto mb-4 h-12 w-12 text-amber-500" />
              <h3 className="mb-2 text-lg font-semibold">List Your Property</h3>
              <p className="mb-4 text-muted-foreground">Add your hostel to our platform and reach thousands of students.</p>
              <Link to="/auth">
                <Button className="w-full">Get Started</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-8">
              <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">Manage Tenants</h3>
              <p className="mb-4 text-muted-foreground">Easily manage bookings, payments, and tenant communication.</p>
              <Link to="/auth">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-8">
              <TrendingUp className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
              <h3 className="mb-2 text-lg font-semibold">Track Performance</h3>
              <p className="mb-4 text-muted-foreground">Monitor occupancy rates and revenue with clearer analytics.</p>
              <Link to="/auth">
                <Button variant="outline" className="w-full">View Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-14 md:grid-cols-2 mb-16 py-6">
          <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                  Reach More Students
                </CardTitle>
              </CardHeader>
              <CardContent>
              <ul className="space-y-3 leading-8 text-muted-foreground">
                  <li>• Access to thousands of university students</li>
                  <li>• Targeted exposure to students from specific universities</li>
                  <li>• Professional property listings with high-quality photos</li>
                  <li>• Direct communication with interested tenants</li>
                  <li>• Automated booking and inquiry management</li>
                </ul>
              </CardContent>
            </Card>

          <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                  Increase Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
              <ul className="space-y-2 leading-7 text-muted-foreground">
                  <li>• Higher occupancy rates through better marketing</li>
                  <li>• Competitive pricing insights</li>
                  <li>• Reduced vacancy periods</li>
                  <li>• Streamlined booking and payment processes</li>
                  <li>• Detailed financial reporting and analytics</li>
                </ul>
              </CardContent>
            </Card>
        </div>

        <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-center">Powerful Management Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-14 md:grid-cols-3">
                <Card className="text-center border-border/50">
                  <CardContent>
                    <CheckCircle className="mx-auto mb-3 h-8 w-8 text-emerald-500" />
                    <h4 className="text-base sm:text-lg font-semibold mb-3">Easy Listing Management</h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-7">Add, edit, and manage multiple properties with our dashboard.</p>
                  </CardContent>
                </Card>
                <Card className="text-center border-border/50">
                  <CardContent>
                    <CheckCircle className="mx-auto mb-3 h-8 w-8 text-emerald-500" />
                    <h4 className="text-base sm:text-lg font-semibold mb-3">Automated Bookings</h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-7">Handle inquiries and bookings with a more streamlined process.</p>
                  </CardContent>
                </Card>
                <Card className="text-center border-border/50">
                  <CardContent>
                    <CheckCircle className="mx-auto mb-3 h-8 w-8 text-emerald-500" />
                    <h4 className="text-base sm:text-lg font-semibold mb-3">Payment Processing</h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-7">Secure payment collection with multiple payment methods.</p>
                  </CardContent>
                </Card>
                <Card className="text-center border-border/50">
                  <CardContent>
                    <CheckCircle className="mx-auto mb-3 h-8 w-8 text-emerald-500" />
                    <h4 className="text-base sm:text-lg font-semibold mb-3">Tenant Screening</h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-7">Verified student profiles and background checks for peace of mind.</p>
                  </CardContent>
                </Card>
                <Card className="text-center border-border/50">
                  <CardContent>
                    <CheckCircle className="mx-auto mb-3 h-8 w-8 text-emerald-500" />
                    <h4 className="text-base sm:text-lg font-semibold mb-3">24/7 Support</h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-7">Round-the-clock support for you and your tenants.</p>
                  </CardContent>
                </Card>
                <Card className="text-center border-border/50">
                  <CardContent>
                    <CheckCircle className="mx-auto mb-3 h-8 w-8 text-emerald-500" />
                    <h4 className="text-base sm:text-lg font-semibold mb-3">Analytics & Reports</h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-7">Detailed insights into occupancy, revenue, and tenant demographics.</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

        <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-center">Simple, Transparent Pricing</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="text-center border-2 border-primary/15">
                  <CardContent>
                  <h3 className="mb-2 text-xl sm:text-2xl font-bold text-primary">Free</h3>
                  <p className="mb-4 text-muted-foreground">Basic listing and management.</p>
                  <ul className="mb-6 space-y-1 text-sm text-muted-foreground">
                      <li>• Property listing</li>
                      <li>• Basic booking management</li>
                      <li>• Student inquiries</li>
                      <li>• Email support</li>
                    </ul>
                    <Button variant="outline" className="w-full">Get Started</Button>
                  </CardContent>
                </Card>

              <Card className="text-center border-2 border-emerald-200 bg-emerald-50/60">
                  <CardContent>
                  <h3 className="mb-2 text-xl sm:text-2xl font-bold text-emerald-600">MK 5,000/month</h3>
                  <p className="mb-4 text-muted-foreground">Premium features for growth.</p>
                  <ul className="mb-6 space-y-1 text-sm text-muted-foreground">
                      <li>• Everything in Free</li>
                      <li>• Priority listing</li>
                      <li>• Advanced analytics</li>
                      <li>• Priority support</li>
                      <li>• Marketing tools</li>
                    </ul>
                    <Button className="w-full bg-green-600 hover:bg-green-700">Choose Premium</Button>
                  </CardContent>
                </Card>

              <Card className="text-center border-2 border-amber-200">
                  <CardContent>
                  <h3 className="mb-2 text-xl sm:text-2xl font-bold text-amber-600">Custom</h3>
                  <p className="mb-4 text-muted-foreground">For large property portfolios.</p>
                  <ul className="mb-6 space-y-1 text-sm text-muted-foreground">
                      <li>• Everything in Premium</li>
                      <li>• Multiple properties</li>
                      <li>• White-label solution</li>
                      <li>• Dedicated account manager</li>
                      <li>• Custom integrations</li>
                    </ul>
                    <Button variant="outline" className="w-full">Contact Sales</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
        </Card>

        <Card className="border-0 bg-[linear-gradient(135deg,#7c2d12,#ea580c)] text-white">
          <CardContent className="py-10 text-center">
            <h2 className="mb-4 text-2xl font-bold">Ready to Grow Your Business?</h2>
            <p className="mb-6 opacity-90">
                Join hundreds of successful landlords who have increased their occupancy and revenue with MyHostel.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full">
                  Start Listing Today
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/50 bg-white/10 text-white hover:bg-white hover:text-orange-600">
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MarketingPageShell>
  );
}
