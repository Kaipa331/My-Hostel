import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertTriangle, Send, CheckCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { MarketingPageShell } from './MarketingPageShell';

export function ReportIssue() {
  const [formData, setFormData] = useState({
    issueType: '',
    name: '',
    email: '',
    subject: '',
    description: '',
    hostelId: '',
    priority: 'medium',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success("Issue reported successfully! We'll investigate and get back to you within 24 hours.");
      setFormData({
        issueType: '',
        name: '',
        email: '',
        subject: '',
        description: '',
        hostelId: '',
        priority: 'medium',
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <MarketingPageShell
      eyebrow="Report an Issue"
      title="Help us keep the platform safe, accurate, and reliable."
      description="Report suspicious listings, booking problems, safety concerns, or technical issues and our team will review them quickly."
      actions={
        <Link to="/contact" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full">Contact Support</Button>
        </Link>
      }
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="order-2 space-y-6 lg:order-1 lg:col-span-1">
            <Card className="border-border/60 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">What to Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                {[
                  'Inaccurate property information',
                  'Suspicious or fraudulent listings',
                  'Safety or maintenance concerns',
                  'Booking or payment issues',
                  'Platform technical problems',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <p className="text-sm leading-snug text-muted-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/15 bg-primary/5 shadow-md">
              <CardContent className="px-6 py-6 text-center">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">Emergency Issues</h3>
                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                  For immediate safety concerns, call our emergency line directly.
                </p>
                <p className="text-base font-bold text-primary">+265 991 234 567</p>
              </CardContent>
            </Card>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-2">
            <Card className="border-border/60 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Submit Your Report</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="issueType">Issue Type *</Label>
                      <Select
                        value={formData.issueType}
                        onValueChange={(value) => setFormData({ ...formData, issueType: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select issue type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inaccurate-info">Inaccurate Information</SelectItem>
                          <SelectItem value="fraudulent-listing">Suspicious/Fraudulent Listing</SelectItem>
                          <SelectItem value="safety-concern">Safety Concern</SelectItem>
                          <SelectItem value="booking-issue">Booking/Payment Issue</SelectItem>
                          <SelectItem value="technical-problem">Technical Problem</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority Level</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData({ ...formData, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - General inquiry</SelectItem>
                          <SelectItem value="medium">Medium - Needs attention</SelectItem>
                          <SelectItem value="high">High - Urgent issue</SelectItem>
                          <SelectItem value="critical">Critical - Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Brief description of the issue"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hostelId">Hostel/Property ID (if applicable)</Label>
                    <Input
                      id="hostelId"
                      value={formData.hostelId}
                      onChange={(e) => setFormData({ ...formData, hostelId: e.target.value })}
                      placeholder="Hostel ID or property name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Please provide as much detail as possible about the issue..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="rounded-lg border border-border/60 bg-muted/40 p-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <strong>What happens next?</strong> Our team will review your report within 24 hours. For urgent safety issues, please call our emergency line immediately. We&apos;ll keep you updated on the status of your report.
                    </p>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                        Submitting Report...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Report
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mt-10 overflow-hidden border-0 bg-gradient-premium text-white shadow-lg">
          <CardContent className="px-6 py-10 text-center sm:px-10">
            <h2 className="mb-3 text-xl font-bold sm:text-2xl">Need Immediate Help?</h2>
            <p className="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
              For urgent issues or if you need to speak with someone right away, our support team is available.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link to="/contact">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Contact Support
                </Button>
              </Link>
              <Link to="/help">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/50 bg-white/10 text-white hover:bg-white hover:text-primary"
                >
                  Browse Help Center
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </MarketingPageShell>
  );
}
