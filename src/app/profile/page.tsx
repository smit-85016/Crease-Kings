// src/app/profile/page.tsx
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the User Profile page. Content to be added here.</p>
          {/* Add user details, booking history, etc. later */}
        </CardContent>
      </Card>
    </main>
  );
}
