import { useEffect, useMemo, useState } from 'react';
import { createClientApi, deleteClientApi, getClientsApi, updateClientApi } from '../../api/clientApi';

const initialForm = { name: '', phone: '', email: '', company: '', status: 'prospect' };

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchClients = async () => {
    const res = await getClientsApi();
    setClients(res.data || res.clients || []);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filtered = useMemo(() => {
    return clients.filter((client) => {
      const matchesQuery =
        client.name?.toLowerCase().includes(query.toLowerCase()) ||
        client.email?.toLowerCase().includes(query.toLowerCase()) ||
        client.company?.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [clients, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setOpen(true);
  };

  const openEdit = (client) => {
    setEditing(client);
    setForm({
      name: client.name || '',
      phone: client.phone || '',
      email: client.email || '',
      company: client.company || '',
      status: client.status || 'prospect'
    });
    setOpen(true);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    if (editing?._id) {
      await updateClientApi(editing._id, form);
    } else {
      await createClientApi(form);
    }
    setOpen(false);
    await fetchClients();
  };

  const onDelete = async (id) => {
    await deleteClientApi(id);
    await fetchClients();
  };

  return (
    <div className="space-y-4">
      <div className="card flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <input className="input" placeholder="Search clients" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="input max-w-xs" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All status</option>
            <option value="prospect">Prospect</option>
            <option value="client">Client</option>
            <option value="lost">Lost</option>
          </select>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          + New Client
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Company</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((client) => (
              <tr key={client._id} className="border-b border-slate-100">
                <td className="px-3 py-3 font-medium">{client.name}</td>
                <td className="px-3 py-3">{client.company}</td>
                <td className="px-3 py-3">{client.email}</td>
                <td className="px-3 py-3">{client.phone}</td>
                <td className="px-3 py-3 capitalize">{client.status}</td>
                <td className="space-x-2 px-3 py-3">
                  <button className="btn-secondary" onClick={() => openEdit(client)}>
                    Edit
                  </button>
                  <button className="btn-secondary !text-red-600" onClick={() => onDelete(client._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button className="btn-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>
        <span className="text-sm text-slate-500">
          Page {page} / {totalPages}
        </span>
        <button className="btn-secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4">
          <form className="w-full max-w-xl space-y-4 rounded-2xl bg-white p-6" onSubmit={submitForm}>
            <h3 className="text-lg font-semibold">{editing ? 'Edit client' : 'Create client'}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              <input className="input" placeholder="Company" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} required />
              <input className="input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
              <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} required />
              <select className="input sm:col-span-2" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                <option value="prospect">Prospect</option>
                <option value="client">Client</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary" type="submit">
                {editing ? 'Save changes' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
