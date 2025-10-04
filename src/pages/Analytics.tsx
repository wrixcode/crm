import { useMemo } from 'react';
import { useClients } from '@/contexts/ClientContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Phone, Target } from 'lucide-react';

const Analytics = () => {
  const { clients } = useClients();

  const analytics = useMemo(() => {
    const totalClients = clients.length;
    const interested = clients.filter(c => c.status === 'interested').length;
    const notInterested = clients.filter(c => c.status === 'not_interested').length;
    const followUp = clients.filter(c => c.status === 'follow_up').length;
    const noAnswer = clients.filter(c => c.status === 'no_answer').length;
    const wrongNumber = clients.filter(c => c.status === 'wrong_number').length;

    const conversionRate = totalClients > 0 ? ((interested / totalClients) * 100).toFixed(1) : '0';

    // Source breakdown
    const sourceStats = clients.reduce((acc, client) => {
      acc[client.source] = (acc[client.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Priority breakdown
    const hotLeads = clients.filter(c => c.priority === 'hot').length;
    const warmLeads = clients.filter(c => c.priority === 'warm').length;
    const coldLeads = clients.filter(c => c.priority === 'cold').length;

    // Tag analysis
    const tagStats = clients.reduce((acc, client) => {
      client.tags.forEach(tag => {
        if (!acc[tag]) {
          acc[tag] = { total: 0, interested: 0 };
        }
        acc[tag].total++;
        if (client.status === 'interested') {
          acc[tag].interested++;
        }
      });
      return acc;
    }, {} as Record<string, { total: number; interested: number }>);

    return {
      totalClients,
      interested,
      notInterested,
      followUp,
      noAnswer,
      wrongNumber,
      conversionRate,
      sourceStats,
      hotLeads,
      warmLeads,
      coldLeads,
      tagStats
    };
  }, [clients]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your sales performance and insights</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalClients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.interested} interested clients
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.hotLeads}</div>
            <p className="text-xs text-muted-foreground">
              High priority prospects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow Ups</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.followUp}</div>
            <p className="text-xs text-muted-foreground">
              Pending follow-ups
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'Interested', value: analytics.interested, color: 'hsl(var(--status-interested))' },
              { label: 'Not Interested', value: analytics.notInterested, color: 'hsl(var(--status-not-interested))' },
              { label: 'Follow Up', value: analytics.followUp, color: 'hsl(var(--status-follow-up))' },
              { label: 'No Answer', value: analytics.noAnswer, color: 'hsl(var(--status-no-answer))' },
              { label: 'Wrong Number', value: analytics.wrongNumber, color: 'hsl(var(--status-wrong-number))' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{label}</span>
                  <span className="text-sm text-muted-foreground">
                    {value} ({analytics.totalClients > 0 ? ((value / analytics.totalClients) * 100).toFixed(1) : '0'}%)
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${analytics.totalClients > 0 ? (value / analytics.totalClients) * 100 : 0}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: '🔥 Hot Leads', value: analytics.hotLeads, color: 'hsl(var(--priority-hot))' },
                { label: '⚡ Warm Leads', value: analytics.warmLeads, color: 'hsl(var(--priority-warm))' },
                { label: '❄️ Cold Leads', value: analytics.coldLeads, color: 'hsl(var(--priority-cold))' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-sm text-muted-foreground">
                      {value} ({analytics.totalClients > 0 ? ((value / analytics.totalClients) * 100).toFixed(1) : '0'}%)
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${analytics.totalClients > 0 ? (value / analytics.totalClients) * 100 : 0}%`,
                        backgroundColor: color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Source Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.sourceStats)
                .sort(([, a], [, b]) => b - a)
                .map(([source, count]) => (
                  <div key={source}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">{source.replace('_', ' ')}</span>
                      <span className="text-sm text-muted-foreground">
                        {count} ({analytics.totalClients > 0 ? ((count / analytics.totalClients) * 100).toFixed(1) : '0'}%)
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${analytics.totalClients > 0 ? (count / analytics.totalClients) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Industry/Tag Performance */}
      {Object.keys(analytics.tagStats).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Industry Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.tagStats)
                .sort(([, a], [, b]) => b.total - a.total)
                .map(([tag, stats]) => {
                  const conversionRate = stats.total > 0 ? ((stats.interested / stats.total) * 100).toFixed(1) : '0';
                  return (
                    <div key={tag}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{tag}</span>
                        <span className="text-sm text-muted-foreground">
                          {stats.interested}/{stats.total} ({conversionRate}% conversion)
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${conversionRate}%`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Analytics;
