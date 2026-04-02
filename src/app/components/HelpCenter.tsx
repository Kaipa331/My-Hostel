import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, Search, HelpCircle, User, Building, CreditCard, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: 'Getting Started',
      icon: <User className="h-5 w-5" />,
      questions: [
        {
          q: 'How do I create a student account?',
          a: 'Click on "Student Portal" and select "Sign Up". Fill in your details including your university, and verify your email to get started.'
        },
        {
          q: 'How do I list my hostel as a landlord?',
          a: 'Create a landlord account, then go to your dashboard and click "Add Hostel". Fill in all the details and submit for admin approval.'
        },
        {
          q: 'What universities do you support?',
          a: 'We support all major universities in Malawi including UNIMA, MUST, MUBAS, LUANAR, and many more.'
        }
      ]
    },
    {
      category: 'Booking & Payment',
      icon: <CreditCard className="h-5 w-5" />,
      questions: [
        {
          q: 'How do I book a room?',
          a: 'Browse available hostels, click "View Details", select your preferred room type, and follow the booking process. You\'ll need to pay a deposit to secure your booking.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept bank transfers, Airtel Money, and TNM Mpamba. Payment instructions will be provided during the booking process.'
        },
        {
          q: 'Can I cancel my booking?',
          a: 'Yes, you can cancel within 24 hours of booking. Take not that booking fee is non refundable. Contact support for cancellations after this period.'
        }
      ]
    },
    {
      category: 'Hostel Management',
      icon: <Building className="h-5 w-5" />,
      questions: [
        {
          q: 'How do I update my hostel information?',
          a: 'Go to your landlord dashboard, select the hostel, and click "Edit". Make your changes and save.'
        },
        {
          q: 'How do I manage room availability?',
          a: 'In your hostel details, you can update room availability and pricing. Changes are reflected immediately on the platform.'
        },
        {
          q: 'How do I respond to student inquiries?',
          a: 'Check your dashboard for new inquiries. You can respond directly through the platform or contact students via their provided information.'
        }
      ]
    },
    {
      category: 'Technical Support',
      icon: <HelpCircle className="h-5 w-5" />,
      questions: [
        {
          q: 'I forgot my password. What should I do?',
          a: 'Click "Forgot Password" on the login page and follow the instructions sent to your email.'
        },
        {
          q: 'The website is not loading properly. What can I do?',
          a: 'Try clearing your browser cache, or try a different browser. If the issue persists, contact our support team.'
        },
        {
          q: 'How do I report a problem with a listing?',
          a: 'Use the "Report Issue" link in the footer or contact support directly with details about the problematic listing.'
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-background py-16 sm:py-24">
      <div className="w-full max-w-none mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
        <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-10 font-medium transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-black text-foreground mb-4 tracking-tight">Help Center</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Find answers to common questions and get the help you need.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative glass rounded-xl shadow-lg border-border/50">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-transparent border-0 text-foreground placeholder:text-muted-foreground/60 text-base focus-visible:ring-0"
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-6">
            {filteredFaqs.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="hover:shadow-lg transition-shadow border-border/60 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <CardTitle className="flex items-center gap-3 font-display font-bold">
                    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border/50 shadow-sm text-primary">
                      {category.icon}
                    </div>
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`} className="border-b-0">
                        <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline hover:text-primary transition-colors">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Still Need Help */}
          <Card className="mt-12 bg-gradient-premium border-0 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <CardContent className="text-center py-10 relative z-10 text-primary-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-3xl font-display font-bold mb-4">Still Need Help?</h2>
              <p className="mb-8 opacity-90 text-lg max-w-xl mx-auto">
                Can't find what you're looking for? Our support team is here to help via WhatsApp or Email.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/contact" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full h-12 rounded-xl font-bold shadow-lg text-foreground hover:bg-background/90">
                    Submit a Ticket
                  </Button>
                </Link>
                <a 
                  href="https://wa.me/265991695597?text=Hello! I need help with MyHostel.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full sm:w-auto"
                >
                  <Button variant="outline" size="lg" className="w-full h-12 rounded-xl border-white/20 text-white hover:bg-white hover:text-primary bg-white/10 font-bold transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 mr-2 fill-current">
                      <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.64 4.64 1.853 6.64L2.667 29.333l6.88-1.813A13.28 13.28 0 0 0 16.003 29.333C23.36 29.333 29.333 23.36 29.333 16S23.36 2.667 16.003 2.667zm0 24c-2.12 0-4.2-.573-6-1.653l-.427-.253-4.08 1.08 1.093-4-.28-.44A10.64 10.64 0 0 1 5.333 16c0-5.88 4.787-10.667 10.67-10.667 5.88 0 10.667 4.787 10.667 10.667 0 5.88-4.787 10.667-10.667 10.667zm5.84-7.973c-.32-.16-1.893-.933-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.826 1.04-.986 1.253-.16.213-.32.24-.64.08-.32-.16-1.347-.493-2.56-1.573-.947-.84-1.587-1.88-1.773-2.2-.187-.32-.02-.493.14-.653.147-.147.32-.387.48-.573.16-.187.213-.32.32-.533.107-.213.053-.4-.027-.56-.08-.16-.72-1.733-.987-2.373-.253-.613-.52-.533-.72-.533h-.613c-.213 0-.56.08-.853.4S9.76 11.68 9.76 12.907c0 1.227.893 2.413 1.013 2.573.12.16 1.76 2.773 4.267 3.773.6.267 1.067.427 1.427.547.6.187 1.147.16 1.573.093.48-.067 1.467-.6 1.68-1.187.213-.587.213-1.093.147-1.187-.067-.093-.267-.16-.587-.32z"/>
                    </svg>
                    WhatsApp Chat
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}