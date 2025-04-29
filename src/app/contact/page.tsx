// src/app/contact/page.tsx
import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { Mail, Phone, MapPin, Send } from 'lucide-react'; // Import icons

export default function ContactPage() {
  return (
    <main className="container mx-auto p-4 md:p-8 min-h-screen bg-secondary">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Mail className="h-8 w-8" /> Get In Touch
          </CardTitle>
          <CardDescription>
            We'd love to hear from you! Reach out with any questions or feedback.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          {/* Contact Information Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Contact Information</h3>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium">Our Office</p>
                <p className="text-muted-foreground text-sm">
                  123 Cricket Lane, <br />
                  Sportsville, ST 45678
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium">Email Us</p>
                <p className="text-muted-foreground text-sm">
                  <a href="mailto:support@boxcricketbooker.fake" className="hover:text-primary transition-colors">
                    support@boxcricketbooker.fake
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium">Call Us</p>
                <p className="text-muted-foreground text-sm">
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
             {/* Placeholder for Map */}
             <div className="mt-6 aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                <MapPin className="h-16 w-16 text-muted-foreground opacity-30" />
                <p className="absolute text-muted-foreground text-sm font-medium">Map Placeholder</p>
             </div>
          </div>

          {/* Contact Form Section */}
          <div className="space-y-6">
             <h3 className="text-xl font-semibold text-foreground mb-4">Send Us a Message</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your Name" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your.email@example.com" />
              </div>
              <div className="space-y-2">
                 <Label htmlFor="subject">Subject</Label>
                 <Input id="subject" placeholder="Booking Inquiry, Feedback, etc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Write your message here..." className="min-h-[120px]" />
              </div>
            </div>
             <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
               <Send className="mr-2 h-4 w-4" /> Send Message
             </Button>
          </div>
        </CardContent>

      </Card>
    </main>
  );
}
