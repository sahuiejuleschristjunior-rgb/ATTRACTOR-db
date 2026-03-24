'use client';

import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const initialLeads = [
  { id: 'lead-1', name: 'Sophia Turner', company: 'Northstar Labs', source: 'LinkedIn', status: 'prospect' },
  { id: 'lead-2', name: 'Liam Carter', company: 'Helix Digital', source: 'Website', status: 'client' },
  { id: 'lead-3', name: 'Ava Brooks', company: 'CloudArc', source: 'Referral', status: 'prospect' },
  { id: 'lead-4', name: 'Noah Bennett', company: 'SummitFlow', source: 'Email Campaign', status: 'lost' },
  { id: 'lead-5', name: 'Mia Ramirez', company: 'Signal Ops', source: 'Inbound Form', status: 'client' },
];

const leadStatuses = ['prospect', 'client', 'lost'];

const statusVariant = {
  prospect: 'default',
  client: 'success',
  lost: 'destructive',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState(initialLeads);
  const [savingLeadIds, setSavingLeadIds] = useState({});

  const statusCounts = useMemo(() => {
    return leads.reduce(
      (acc, lead) => {
        acc[lead.status] = (acc[lead.status] ?? 0) + 1;
        return acc;
      },
      { prospect: 0, client: 0, lost: 0 }
    );
  }, [leads]);

  const handleStatusChange = async (leadId, nextStatus) => {
    const previousLead = leads.find((lead) => lead.id === leadId);
    if (!previousLead || previousLead.status === nextStatus) return;

    setLeads((currentLeads) =>
      currentLeads.map((lead) => (lead.id === leadId ? { ...lead, status: nextStatus } : lead))
    );
    setSavingLeadIds((current) => ({ ...current, [leadId]: true }));

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        throw new Error('Unable to update lead status.');
      }
    } catch (_error) {
      setLeads((currentLeads) =>
        currentLeads.map((lead) => (lead.id === leadId ? { ...lead, status: previousLead.status } : lead))
      );
    } finally {
      setSavingLeadIds((current) => {
        const next = { ...current };
        delete next[leadId];
        return next;
      });
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="mt-1 text-sm text-muted-foreground">A clean, real-time view of incoming opportunities.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline Leads</CardTitle>
          <CardDescription>
            Prospect: {statusCounts.prospect} • Client: {statusCounts.client} • Lost: {statusCounts.lost}
          </CardDescription>
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
              {leads.map((lead) => {
                const isSaving = Boolean(savingLeadIds[lead.id]);

                return (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <select
                          className="h-9 min-w-28 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-700 outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
                          value={lead.status}
                          onChange={(event) => handleStatusChange(lead.id, event.target.value)}
                          disabled={isSaving}
                        >
                          {leadStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status[0].toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                        <Badge variant={statusVariant[lead.status]} className="capitalize">
                          {lead.status}
                        </Badge>
                        {isSaving && <span className="text-xs text-slate-500">Saving...</span>}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
