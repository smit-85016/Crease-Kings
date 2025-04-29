// src/app/contact/page.tsx
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the Contact Us page. Content to be added here.</p>
          {/* Add contact form or details later */}
        </CardContent>
      </Card>
    </main>
  );
}
