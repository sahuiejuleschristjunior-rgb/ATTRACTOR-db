import { useEffect, useMemo, useState } from 'react';
import { assignLeadApi, getLeadsApi, updateLeadApi } from '../../api/leadApi';

const pipeline = ['new', 'contacted', 'converted'];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [newAssignee, setNewAssignee] = useState({});

  const fetchLeads = async () => {
    const res = await getLeadsApi();
    setLeads(res.data || res.leads || []);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const assignees = useMemo(() => {
    const existing = leads.map((lead) => lead.assignedTo).filter(Boolean);
    return ['Unassigned', ...new Set(existing), 'sales@dbattractor.com', 'owner@dbattractor.com'];
  }, [leads]);

  const grouped = useMemo(
    () => pipeline.map((status) => ({ status, leads: leads.filter((lead) => lead.status === status) })),
    [leads]
  );

  const moveLead = async (lead, direction) => {
    const currentIndex = pipeline.indexOf(lead.status);
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= pipeline.length) return;
    await updateLeadApi(lead._id, { status: pipeline[nextIndex] });
    await fetchLeads();
  };

  const assignLead = async (leadId) => {
    const assignee = newAssignee[leadId];
    if (!assignee) return;
    await assignLeadApi(leadId, assignee === 'Unassigned' ? '' : assignee);
    await fetchLeads();
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="text-lg font-semibold">Lead Pipeline</h3>
        <p className="text-sm text-slate-500">Drag-ready structure with quick state transitions.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {grouped.map((column) => (
          <div key={column.status} className="card space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="text-sm font-semibold capitalize text-slate-800">{column.status}</h4>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">{column.leads.length}</span>
            </div>
            {column.leads.map((lead) => (
              <div key={lead._id} className="rounded-xl border border-slate-200 p-3">
                <p className="font-medium text-slate-900">{lead.name}</p>
                <p className="text-xs text-slate-500">{lead.email || 'No email'}</p>
                <p className="mb-2 text-xs text-slate-500">Source: {lead.source}</p>

                <div className="mb-2 flex items-center gap-2">
                  <select
                    className="input !py-1 text-xs"
                    value={newAssignee[lead._id] ?? lead.assignedTo ?? 'Unassigned'}
                    onChange={(e) => setNewAssignee((prev) => ({ ...prev, [lead._id]: e.target.value }))}
                  >
                    {assignees.map((assignee) => (
                      <option key={assignee} value={assignee}>
                        {assignee}
                      </option>
                    ))}
                  </select>
                  <button className="btn-secondary !px-2 !py-1 text-xs" onClick={() => assignLead(lead._id)}>
                    Assign
                  </button>
                </div>

                <div className="flex justify-between gap-2">
                  <button className="btn-secondary w-full !py-1 text-xs" onClick={() => moveLead(lead, -1)}>
                    ← Back
                  </button>
                  <button className="btn-primary w-full !py-1 text-xs" onClick={() => moveLead(lead, 1)}>
                    Next →
                  </button>
                </div>
              </div>
            ))}
            {!column.leads.length && <p className="text-xs text-slate-500">No leads in this stage.</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
