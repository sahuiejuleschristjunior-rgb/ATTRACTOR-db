import { useEffect, useMemo, useState } from 'react';
import { getDashboardApi } from '../../api/dashboardApi';
import { getLeadsApi } from '../../api/leadApi';
import StatCard from '../../components/ui/StatCard';
import StatusChart from '../../components/ui/StatusChart';
import RecentActivity from '../../components/ui/RecentActivity';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [stats, leadsRes] = await Promise.all([getDashboardApi(), getLeadsApi()]);
        const leads = leadsRes.data || leadsRes.leads || [];
        const byStatus = ['new', 'contacted', 'converted'].map((status) => ({
          status,
          count: leads.filter((lead) => lead.status === status).length
        }));

        setDashboard({
          totalClients: stats.data?.totalClients ?? stats.totalClients ?? 0,
          totalLeads: stats.data?.totalLeads ?? stats.totalLeads ?? leads.length,
          byStatus,
          activity: (leads.slice(0, 6) || []).map((lead) => ({
            title: `${lead.name} updated to ${lead.status}`,
            time: new Date(lead.updatedAt || lead.createdAt || Date.now()).toLocaleString()
          }))
        });
      } catch (_err) {
        setDashboard({ totalClients: 0, totalLeads: 0, byStatus: [], activity: [] });
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const cards = useMemo(
    () => [
      { label: 'Total Clients', value: dashboard?.totalClients ?? 0 },
      { label: 'Total Leads', value: dashboard?.totalLeads ?? 0 }
    ],
    [dashboard]
  );

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <StatusChart data={dashboard.byStatus} />
        <RecentActivity items={dashboard.activity} />
      </section>
    </div>
  );
}
