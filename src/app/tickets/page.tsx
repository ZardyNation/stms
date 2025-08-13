
'use client';

import { useEffect } from 'react';

export default function TicketsPage() {
  useEffect(() => {
    window.location.href = 'https://www.myeventadvisor.com/event/c3741d06-3920-42e8-abf4-ee2328c8cf97';
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <p className="text-foreground">Redirecting to ticket sales...</p>
    </div>
  );
}
