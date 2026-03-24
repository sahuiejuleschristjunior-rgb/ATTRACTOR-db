import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const leads = [
  { name: 'Sophia Turner', company: 'Northstar Labs', source: 'LinkedIn', status: 'New' },
  { name: 'Liam Carter', company: 'Helix Digital', source: 'Website', status: 'Qualified' },
  { name: 'Ava Brooks', company: 'CloudArc', source: 'Referral', status: 'Contacted' },
  { name: 'Noah Bennett', company: 'SummitFlow', source: 'Email Campaign', status: 'Proposal' },
  { name: 'Mia Ramirez', company: 'Signal Ops', source: 'Inbound Form', status: 'Won' },
];

const statusVariant = {
  New: 'default',
  Qualified: 'success',
  Contacted: 'warning',
  Proposal: 'warning',
  Won: 'success',
};

export default function LeadsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="mt-1 text-sm text-muted-foreground">A clean, real-time view of incoming opportunities.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline Leads</CardTitle>
          <CardDescription>Prioritize high-intent leads and move faster across the funnel.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.name}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.company}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[lead.status]}>{lead.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
