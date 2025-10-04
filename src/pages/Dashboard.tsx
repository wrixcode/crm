import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useClients } from '@/contexts/ClientContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { 
  Phone, 
  UserPlus, 
  TrendingUp, 
  Calendar, 
  Users,
  AlertCircle 
} from 'lucide-react';
import { isFollowUpDueToday, isFollowUpOverdue, formatDateShort } from '@/utils/statusHelpers';

const Dashboard = () => {
  const { clients } = useClients();

  const stats = useMemo(() => {
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));

    return {
      total: clients.length,
      interested: clients.filter(c => c.status === 'interested').length,
      followUpToday: clients.filter(c => isFollowUpDueToday(c.nextFollowUp)).length,
      followUpOverdue: clients.filter(c => isFollowUpOverdue(c.nextFollowUp)).length,
      callsThisWeek: clients.filter(c => 
        c.lastContactedDate && new Date(c.lastContactedDate) >= weekStart
      ).length,
      hotLeads: clients.filter(c => c.priority === 'hot').length
    };
  }, [clients]);

  const followUpsToday = useMemo(() => 
    clients
      .filter(c => isFollowUpDueToday(c.nextFollowUp) || isFollowUpOverdue(c.nextFollowUp))
      .sort((a, b) => {
        if (isFollowUpOverdue(a.nextFollowUp) && !isFollowUpOverdue(b.nextFollowUp)) return -1;
        if (!isFollowUpOverdue(a.nextFollowUp) && isFollowUpOverdue(b.nextFollowUp)) return 1;
        return 0;
      })
  , [clients]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your sales overview.</p>
        </div>
        <Link to="/clients">
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Client
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interested</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interested}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.interested / stats.total) * 100) : 0}% conversion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls This Week</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.callsThisWeek}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hotLeads}</div>
          </CardContent>
        </Card>
      </div>

      {/* Follow-ups Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Follow-ups</CardTitle>
            </div>
            {stats.followUpOverdue > 0 && (
              <span className="text-sm text-destructive font-medium">
                {stats.followUpOverdue} overdue
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {followUpsToday.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No follow-ups scheduled for today
            </p>
          ) : (
            <div className="space-y-3">
              {followUpsToday.map(client => (
                <Link key={client.id} to={`/clients/${client.id}`}>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{client.name}</p>
                        {isFollowUpOverdue(client.nextFollowUp) && (
                          <span className="text-xs text-destructive font-medium">OVERDUE</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{client.phone}</p>
                      {client.businessName && (
                        <p className="text-sm text-muted-foreground">{client.businessName}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-4">
                        <p className="text-sm font-medium">
                          {client.nextFollowUp && formatDateShort(client.nextFollowUp)}
                        </p>
                      </div>
                      <StatusBadge status={client.status} />
                      <PriorityBadge priority={client.priority} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-4">No clients yet</p>
              <Link to="/clients">
                <Button>Add Your First Client</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {clients
                .filter(c => c.lastContactedDate)
                .sort((a, b) => 
                  new Date(b.lastContactedDate!).getTime() - new Date(a.lastContactedDate!).getTime()
                )
                .slice(0, 5)
                .map(client => (
                  <Link key={client.id} to={`/clients/${client.id}`}>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.phone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={client.status} />
                        <PriorityBadge priority={client.priority} />
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
