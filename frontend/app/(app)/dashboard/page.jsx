import { ArrowUpRight, CircleCheckBig, DollarSign, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const kpis = [
  { label: 'New Leads', value: '1,248', trend: '+12.4%', icon: UserPlus },
  { label: 'Conversion Rate', value: '18.6%', trend: '+2.1%', icon: CircleCheckBig },
  { label: 'MRR', value: '$42,800', trend: '+8.3%', icon: DollarSign },
];

const activity = [
  { title: 'New lead from Product Hunt', time: '5 minutes ago' },
  { title: 'Client Acme Inc upgraded to Pro', time: '2 hours ago' },
  { title: 'Automation sequence published', time: 'Today, 9:40 AM' },
  { title: 'Quarterly report generated', time: 'Yesterday, 6:22 PM' },
];

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of your pipeline performance and recent activity.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardDescription>{item.label}</CardDescription>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{item.value}</div>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-600">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {item.trend} this month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Track key moments across your teams and workflows.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {activity.map((item) => (
              <li key={item.title} className="rounded-xl border border-border bg-slate-50/80 px-4 py-3">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
