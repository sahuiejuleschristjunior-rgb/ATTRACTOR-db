import { Building2, Handshake, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const clientCards = [
  {
    title: 'Enterprise Accounts',
    value: '36',
    description: 'High-value clients on annual contracts.',
    icon: Building2,
  },
  {
    title: 'Renewal Health',
    value: '94%',
    description: 'Accounts likely to renew this quarter.',
    icon: ShieldCheck,
  },
  {
    title: 'Open Opportunities',
    value: '18',
    description: 'Upsell and expansion opportunities identified.',
    icon: Handshake,
  },
];

export default function ClientsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
        <p className="mt-1 text-sm text-muted-foreground">Monitor account health and growth opportunities.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {clientCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardDescription>{item.title}</CardDescription>
                  <CardTitle className="mt-2 text-2xl">{item.value}</CardTitle>
                </div>
                <Icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
