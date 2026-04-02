import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Shield, Eye, Lock, Database, FileText, Mail } from 'lucide-react';
import { Link } from 'react-router';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-10 font-medium transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-5 border border-primary/20">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-black text-foreground mb-3 tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">How we protect and handle your personal information</p>
          <p className="text-sm text-muted-foreground/60 mt-2">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>

        {/* Sections */}
        <div className="space-y-5">

          <PolicyCard icon={<Eye className="h-5 w-5 text-primary" />} title="Information We Collect">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Personal Information</h4>
                <ul className="space-y-1.5 text-muted-foreground text-sm">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />Name and contact details (email, phone number)</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />University affiliation (for students)</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />Profile information and preferences</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />Payment information (processed securely)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Usage Information</h4>
                <ul className="space-y-1.5 text-muted-foreground text-sm">
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />Device and browser information</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />IP address and location data</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />Pages visited and features used</li>
                  <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />Search queries and interactions</li>
                </ul>
              </div>
            </div>
          </PolicyCard>

          <PolicyCard icon={<Lock className="h-5 w-5 text-green-600" />} title="How We Use Your Information">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                ['Account Management', 'To create and manage your account'],
                ['Service Provision', 'To connect students with landlords and facilitate bookings'],
                ['Communication', 'To send booking confirmations, updates, and support messages'],
                ['Platform Improvement', 'To analyze usage patterns and improve our services'],
                ['Legal Compliance', 'To comply with applicable laws and regulations'],
                ['Fraud Prevention', 'To detect and prevent fraudulent activities'],
              ].map(([bold, text]) => (
                <li key={bold} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                  <span><strong className="text-foreground">{bold}:</strong> {text}</span>
                </li>
              ))}
            </ul>
          </PolicyCard>

          <PolicyCard icon={<Database className="h-5 w-5 text-purple-600" />} title="Information Sharing">
            <p className="text-sm text-muted-foreground mb-3">
              We do not sell, trade, or rent your personal information. We may share it only in these circumstances:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                ['With Your Consent', 'When you explicitly agree to share information'],
                ['Service Providers', 'Trusted partners who help operate our platform (payment processors, hosting)'],
                ['Legal Requirements', 'When required by law or to protect our rights'],
                ['Business Transfers', 'In case of merger, acquisition, or sale of assets'],
                ['Landlords (for Students)', 'Basic contact information to facilitate bookings'],
              ].map(([bold, text]) => (
                <li key={bold} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 shrink-0" />
                  <span><strong className="text-foreground">{bold}:</strong> {text}</span>
                </li>
              ))}
            </ul>
          </PolicyCard>

          <PolicyCard icon={<Shield className="h-5 w-5 text-blue-600" />} title="Data Security">
            <p className="text-sm text-muted-foreground mb-3">We implement industry-standard security measures:</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                'SSL/TLS encryption for all data transmission',
                'Secure password hashing and storage',
                'Regular security audits and updates',
                'Limited access to personal data on a need-to-know basis',
                'Secure payment processing through certified providers',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />{item}
                </li>
              ))}
            </ul>
          </PolicyCard>

          <PolicyCard icon={<FileText className="h-5 w-5 text-accent" />} title="Your Rights">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                ['Access', 'Request a copy of your personal data'],
                ['Correction', 'Request correction of inaccurate information'],
                ['Deletion', 'Request deletion of your personal data'],
                ['Portability', 'Request transfer of your data to another service'],
                ['Restriction', 'Request limitation of how we process your data'],
                ['Objection', 'Object to certain types of data processing'],
              ].map(([bold, text]) => (
                <li key={bold} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  <span><strong className="text-foreground">{bold}:</strong> {text}</span>
                </li>
              ))}
            </ul>
          </PolicyCard>

          <PolicyCard icon={<Eye className="h-5 w-5 text-orange-500" />} title="Cookies and Tracking">
            <p className="text-sm text-muted-foreground mb-3">We use cookies and similar technologies to enhance your experience:</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                ['Essential Cookies', 'Required for basic platform functionality'],
                ['Analytics Cookies', 'Help us understand how you use our platform'],
                ['Preference Cookies', 'Remember your settings and preferences'],
              ].map(([bold, text]) => (
                <li key={bold} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                  <span><strong className="text-foreground">{bold}:</strong> {text}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground mt-3">You can control cookie settings through your browser preferences.</p>
          </PolicyCard>

          <PolicyCard icon={<Mail className="h-5 w-5 text-primary" />} title="Contact Us">
            <p className="text-sm text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-muted/50 rounded-2xl p-4 border border-border/50 space-y-1 text-sm">
              <p className="font-semibold text-foreground">MyHostel Privacy Team</p>
              <p className="text-muted-foreground">Email: privacy@myhostel.com</p>
              <p className="text-muted-foreground">Phone: +265 991 695 597</p>
              <p className="text-muted-foreground">Address: Lilongwe, Malawi</p>
            </div>
          </PolicyCard>

          {/* Footer note */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 text-center">
            <p className="text-sm text-muted-foreground">
              This privacy policy may be updated periodically. We will notify you of any significant changes via email or platform notifications.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

function PolicyCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <Card className="border border-border/60 rounded-2xl overflow-hidden shadow-sm">
      <CardHeader className="pb-3 pt-5 px-6">
        <CardTitle className="flex items-center gap-3 text-base font-display font-bold">
          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center shrink-0">
            {icon}
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-5">
        {children}
      </CardContent>
    </Card>
  );
}