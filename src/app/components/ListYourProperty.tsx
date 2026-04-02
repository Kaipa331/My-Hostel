import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Building, Camera, Star, Users } from 'lucide-react';
import { Link } from 'react-router';
import { MarketingPageShell } from './MarketingPageShell';

export function ListYourProperty() {
  return (
    <MarketingPageShell
      eyebrow="List Your Property"
      title="Turn your hostel into a stronger, more trusted student listing."
      description="Create a landlord account, publish your property details, and start reaching students who are already searching for accommodation."
      actions={
        <Link to="/landlord/auth" className="w-full sm:w-auto">
          <Button className="w-full">Create Landlord Account</Button>
        </Link>
      }
    >
      <div className="mx-auto max-w-6xl">
        <Card className="mb-12 border-0 bg-gradient-premium text-white">
          <CardContent className="py-10 text-center">
            <Building className="mx-auto mb-4 h-16 w-16 opacity-90" />
            <h2 className="mb-4 text-2xl font-bold">Get Started in Minutes</h2>
            <p className="mx-auto mb-6 max-w-2xl opacity-90">
              Create your landlord account and list your first property. It is free to get started and easy to expand as your portfolio grows.
            </p>
            <Link to="/landlord/auth">
              <Button variant="secondary" size="lg">
                Create Landlord Account
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="mb-12 grid gap-6 md:grid-cols-4">
          {[
            ['1', 'Create Account', 'Sign up as a landlord with your core business information.'],
            ['2', 'Add Property', 'Enter hostel details, room information, and nearby universities.'],
            ['3', 'Upload Photos', 'Showcase your property with clear, high-quality images.'],
            ['4', 'Go Live', 'Get approved and start receiving student inquiries and bookings.'],
          ].map(([step, title, copy]) => (
            <Card key={title} className="text-center">
              <CardContent className="pt-8">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-lg font-bold text-primary">{step}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{copy}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <Card className="glass border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Reach Thousands of Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 leading-7 text-muted-foreground">
                <li>• Direct access to university students</li>
                <li>• Targeted by location and university</li>
                <li>• Professional property presentation</li>
                <li>• Real-time availability updates</li>
                <li>• Direct booking system</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-emerald-500" />
                Professional Listing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 leading-7 text-muted-foreground">
                <li>• High-quality photo galleries</li>
                <li>• Detailed amenity descriptions</li>
                <li>• Room-by-room specifications</li>
                <li>• Location and proximity information</li>
                <li>• Student reviews and ratings</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>What You&apos;ll Need to List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-3 font-semibold">Property Information</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Property name and description</li>
                  <li>• Complete address and location</li>
                  <li>• Contact information</li>
                  <li>• Property type and capacity</li>
                  <li>• Nearby university or universities</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 font-semibold">Room Details</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Room types (single, double, shared)</li>
                  <li>• Pricing for each room type</li>
                  <li>• Availability and capacity</li>
                  <li>• Room amenities and features</li>
                  <li>• House rules and policies</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 font-semibold">Photos & Media</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Exterior and common area photos</li>
                  <li>• Room interior photos</li>
                  <li>• Bathroom and kitchen images</li>
                  <li>• High-quality, well-lit images</li>
                  <li>• At least 5 to 10 photos recommended</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-3 font-semibold">Verification Documents</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Property ownership documents</li>
                  <li>• Business registration (if applicable)</li>
                  <li>• Identification documents</li>
                  <li>• Property insurance (recommended)</li>
                  <li>• Safety and compliance certificates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-center">Success Stories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-muted/50 p-6">
                <Star className="mb-2 h-8 w-8 text-yellow-400" />
                <p className="mb-4 text-muted-foreground">
                  "Since listing on MyHostel, our occupancy rate has increased by 40%. The platform makes it so easy to manage bookings and communicate with students."
                </p>
                <p className="font-semibold">- Mary K., Lilongwe Hostel Owner</p>
              </div>
              <div className="rounded-2xl bg-muted/50 p-6">
                <Star className="mb-2 h-8 w-8 text-yellow-400" />
                <p className="mb-4 text-muted-foreground">
                  "The verification process gave our tenants peace of mind, and the automated booking system saved us hours of work every week."
                </p>
                <p className="font-semibold">- John M., Blantyre Property Manager</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">Is listing free?</h4>
                <p className="text-muted-foreground">Yes, basic listing is completely free. We only charge a small commission on successful bookings.</p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">How long does approval take?</h4>
                <p className="text-muted-foreground">Most listings are approved within 24-48 hours. We verify all properties to ensure quality and safety.</p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">Can I list multiple properties?</h4>
                <p className="text-muted-foreground">Absolutely. You can manage multiple hostels from a single dashboard.</p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold">What if I need help with my listing?</h4>
                <p className="text-muted-foreground">Our support team is available to help you optimize your listing and answer any questions.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] text-white">
          <CardContent className="py-10 text-center">
            <h2 className="mb-4 text-2xl font-bold">Ready to Start Earning?</h2>
            <p className="mb-6 opacity-90">
              Join the growing community of successful landlords on MyHostel. List your property today and start receiving bookings from quality tenants.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/landlord/auth" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full">
                  List Your Property Now
                </Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full border-white/50 bg-white/10 text-white hover:bg-white hover:text-primary">
                  Have Questions?
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MarketingPageShell>
  );
}
