// src/app/settings/page.tsx
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the Settings page. Content to be added here.</p>
          {/* Add app settings, preferences, etc. later */}
        </CardContent>
      </Card>
    </main>
  );
}
