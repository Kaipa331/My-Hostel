import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Users, Target, Award, Heart } from 'lucide-react';
import { Link } from 'react-router';
import { MarketingPageShell } from './MarketingPageShell';

export function AboutUs() {
  return (
    <MarketingPageShell
      eyebrow="About MyHostel"
      title="Helping students find accommodation that feels dependable from day one."
      description="MyHostel connects students and landlords through a cleaner, more transparent housing experience across Malawi."
      actions={
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/for-students" className="w-full sm:w-auto">
            <Button className="w-full">For Students</Button>
          </Link>
          <Link to="/for-landlords" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">For Landlords</Button>
          </Link>
        </div>
      }
    >
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <Card className="glass border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-7 text-muted-foreground">
                To provide a seamless platform that connects students with safe, affordable, and quality hostel accommodation near their universities, making the transition to higher education smoother and more comfortable.
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-amber-500" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-7 text-muted-foreground">
                To become Malawi's leading student accommodation platform, revolutionizing how students find and secure housing, while supporting landlords in efficiently managing their properties.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="text-center">
            <CardContent className="pt-8">
              <Award className="mx-auto mb-4 h-12 w-12 text-amber-500" />
              <h3 className="text-lg font-semibold mb-2">Quality Assurance</h3>
              <p className="text-sm text-muted-foreground">
                  All listed hostels are verified and regularly inspected to ensure they meet our quality standards.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-8">
              <Heart className="mx-auto mb-4 h-12 w-12 text-rose-500" />
              <h3 className="text-lg font-semibold mb-2">Student-First</h3>
              <p className="text-sm text-muted-foreground">
                  We prioritize student needs and work closely with universities to understand accommodation requirements.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-8">
              <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">
                  Building a supportive community where students and landlords can connect and thrive together.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden bg-gradient-premium text-white border-0">
          <CardContent className="py-10 text-center">
            <h2 className="mb-4 text-2xl font-bold">Join Our Growing Community</h2>
            <p className="mb-6 opacity-90">
                Whether you're a student looking for accommodation or a landlord wanting to list your property, MyHostel is here to help.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/student/auth" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full">
                  Join as Student
                </Button>
              </Link>
              <Link to="/landlord/auth" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full border-white/50 bg-white/10 text-white hover:bg-white hover:text-primary">
                  Join as Landlord
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MarketingPageShell>
  );
}
