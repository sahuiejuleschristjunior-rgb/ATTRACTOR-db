'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Lead = {
  id?: string;
  status?: string;
};

type DashboardState = {
  leads: number;
  clients: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardState>({ leads: 0, clients: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`);

        if (!res.ok) {
          throw new Error('Unable to fetch leads data.');
        }

        const data: Lead[] = await res.json();
        const leads = Array.isArray(data) ? data.length : 0;
        const clients = Array.isArray(data)
          ? data.filter((lead) => lead.status?.toLowerCase() === 'client').length
          : 0;

        setStats({ leads, clients });
      } catch (fetchError) {
        const message =
          fetchError instanceof Error ? fetchError.message : 'Something went wrong while loading dashboard data.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const conversionRate = useMemo(() => {
    if (!stats.leads) return 0;
    return (stats.clients / stats.leads) * 100;
  }, [stats.clients, stats.leads]);

  if (loading) {
    return (
      <section className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Loading your pipeline metrics...</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-36 animate-pulse rounded-xl bg-slate-100 shadow-sm" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-red-700">Dashboard</h1>
        <p className="mt-2 text-sm text-red-600">{error}</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">A quick overview of your lead pipeline performance.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-xl border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">{stats.leads}</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">{stats.clients}</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-slate-200 shadow-sm sm:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-500">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold text-slate-900">{conversionRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
