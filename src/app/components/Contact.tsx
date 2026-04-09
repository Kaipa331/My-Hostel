import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { MarketingPageShell } from './MarketingPageShell';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <MarketingPageShell
      eyebrow="Contact"
      title="Talk to us about student housing, support, or listing your property."
      description="Whether you are a student searching for a room or a landlord trying to grow occupancy, we are here to help."
      actions={
        <Link to="/help" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full">Visit Help Center</Button>
        </Link>
      }
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  { icon: Mail, label: 'Email', lines: ['support@myhostel.com'] },
                  { icon: Phone, label: 'Phone', lines: ['+265 991 234 567'] },
                  { icon: MapPin, label: 'Address', lines: ['Lilongwe, Malawi'] },
                  { icon: Clock, label: 'Business Hours', lines: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 4:00 PM'] },
                ].map(({ icon: Icon, label, lines }) => (
                  <div key={label} className="flex items-start gap-4 rounded-2xl border border-border/60 bg-background/70 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{label}</p>
                      {lines.map((line) => (
                        <p key={line} className="text-sm leading-6 text-muted-foreground">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 bg-gradient-premium text-white">
              <CardContent className="py-8 text-center">
                <h3 className="mb-2 text-lg font-semibold">Need Immediate Help?</h3>
                <p className="mb-4 opacity-90">
                    For urgent accommodation issues, call our support line directly.
                </p>
                <div className="flex justify-center">
                  <Button variant="secondary" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="What's this about?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MarketingPageShell>
  );
}
