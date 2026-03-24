import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AutomationsPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Automations</h1>
      <Card>
        <CardHeader>
          <CardTitle>Automation Center</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Configure workflow triggers and notification rules here.</p>
        </CardContent>
      </Card>
    </section>
  );
}
