import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useClients } from '@/contexts/ClientContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityBadge } from '@/components/PriorityBadge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Phone, Mail, Building2, Calendar, Trash2, Save, Edit, MessageCircle, PhoneCall, Video, Send } from 'lucide-react';
import { CallStatus, Priority, ActivityType, Source } from '@/types';
import { formatDate } from '@/utils/statusHelpers';

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getClientById, updateClient, addNote, deleteClient } = useClients();
  const { toast } = useToast();
  const client = getClientById(id!);

  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState(client);
  const [newNote, setNewNote] = useState('');
  const [newStatus, setNewStatus] = useState<CallStatus>(client?.status || 'no_answer');
  const [activityType, setActivityType] = useState<ActivityType>('call');
  const [nextFollowUp, setNextFollowUp] = useState(client?.nextFollowUp || '');
  const [priority, setPriority] = useState<Priority>(client?.priority || 'cold');

  useEffect(() => {
    if (client) {
      setEditedClient(client);
      setNewStatus(client.status);
      setPriority(client.priority);
      setNextFollowUp(client.nextFollowUp || '');
    }
  }, [client]);

  if (!client) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Client not found</p>
            <Link to="/clients">
              <Button>Back to Clients</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveEdit = () => {
    if (!editedClient) return;
    
    updateClient(client.id, {
      name: editedClient.name,
      phone: editedClient.phone,
      email: editedClient.email,
      businessName: editedClient.businessName,
      source: editedClient.source,
      tags: editedClient.tags,
    });
    
    setIsEditing(false);
    toast({ title: 'Client updated successfully!' });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast({
        title: 'Note required',
        description: 'Please enter a note',
        variant: 'destructive'
      });
      return;
    }

    addNote(client.id, newNote, newStatus, activityType);
    updateClient(client.id, { 
      status: newStatus,
      priority,
      nextFollowUp: nextFollowUp || undefined
    });
    
    toast({ title: 'Activity logged successfully!' });
    setNewNote('');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi ${client.name}, `);
    window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const handleEmail = () => {
    window.location.href = `mailto:${client.email}`;
  };

  const handleDelete = () => {
    deleteClient(client.id);
    toast({ title: 'Client deleted' });
    navigate('/clients');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/clients">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <p className="text-muted-foreground">Client Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this client and all their activities.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Client Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={editedClient?.name || ''}
                    onChange={(e) => setEditedClient(prev => prev ? {...prev, name: e.target.value} : prev)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editedClient?.phone || ''}
                    onChange={(e) => setEditedClient(prev => prev ? {...prev, phone: e.target.value} : prev)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={editedClient?.email || ''}
                    onChange={(e) => setEditedClient(prev => prev ? {...prev, email: e.target.value} : prev)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input
                    value={editedClient?.businessName || ''}
                    onChange={(e) => setEditedClient(prev => prev ? {...prev, businessName: e.target.value} : prev)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Source</Label>
                  <Select
                    value={editedClient?.source}
                    onValueChange={(value: Source) => setEditedClient(prev => prev ? {...prev, source: value} : prev)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="cold_call">Cold Call</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>Phone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{client.phone}</p>
                    <Button variant="ghost" size="sm" onClick={handleWhatsApp}>
                      <MessageCircle className="h-4 w-4 text-green-600" />
                    </Button>
                  </div>
                </div>

                {client.email && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{client.email}</p>
                      <Button variant="ghost" size="sm" onClick={handleEmail}>
                        <Send className="h-4 w-4 text-blue-600" />
                      </Button>
                    </div>
                  </div>
                )}

                {client.businessName && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>Business</span>
                    </div>
                    <p className="font-medium">{client.businessName}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Source</p>
                  <p className="font-medium capitalize">{client.source.replace('_', ' ')}</p>
                </div>
              </>
            )}

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Status</p>
              <StatusBadge status={client.status} />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Priority</p>
              <PriorityBadge priority={client.priority} />
            </div>

            {client.tags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {client.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-secondary rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t space-y-2">
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-sm">{formatDate(client.createdDate)}</p>
            </div>

            {client.lastContactedDate && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Last Contacted</p>
                <p className="text-sm">{formatDate(client.lastContactedDate)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Note */}
          <Card>
            <CardHeader>
              <CardTitle>Log Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activityType">Activity Type</Label>
                <Select value={activityType} onValueChange={(value: ActivityType) => setActivityType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">📞 Phone Call</SelectItem>
                    <SelectItem value="meeting">🤝 Meeting</SelectItem>
                    <SelectItem value="email">📧 Email</SelectItem>
                    <SelectItem value="follow_up">📅 Follow-up</SelectItem>
                    <SelectItem value="note">📝 Note</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Details</Label>
                <Textarea
                  id="note"
                  placeholder="What happened during this interaction?"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newStatus} onValueChange={(value: CallStatus) => setNewStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interested">✅ Interested</SelectItem>
                      <SelectItem value="not_interested">❌ Not Interested</SelectItem>
                      <SelectItem value="follow_up">📅 Follow Up</SelectItem>
                      <SelectItem value="wrong_number">📵 Wrong Number</SelectItem>
                      <SelectItem value="no_answer">⏳ No Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hot">🔥 Hot</SelectItem>
                      <SelectItem value="warm">⚡ Warm</SelectItem>
                      <SelectItem value="cold">❄️ Cold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="followup">Next Follow-up</Label>
                  <Input
                    id="followup"
                    type="date"
                    value={nextFollowUp}
                    onChange={(e) => setNextFollowUp(e.target.value)}
                  />
                </div>
              </div>

              <Button onClick={handleAddNote} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Log Activity
              </Button>
            </CardContent>
          </Card>

          {/* Call History */}
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              {client.notes.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No activities yet. Log your first activity above.
                </p>
              ) : (
                <div className="space-y-4">
                  {[...client.notes].reverse().map(note => {
                    const activityIcons = {
                      call: <PhoneCall className="h-4 w-4" />,
                      meeting: <Video className="h-4 w-4" />,
                      email: <Mail className="h-4 w-4" />,
                      follow_up: <Calendar className="h-4 w-4" />,
                      note: <Edit className="h-4 w-4" />
                    };
                    
                    return (
                      <div key={note.id} className="border-l-4 pl-4 py-2" style={{ borderColor: 'hsl(var(--primary))' }}>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <div className="flex items-center gap-1 text-sm font-medium">
                            {activityIcons[note.type || 'note']}
                            <span className="capitalize">{note.type?.replace('_', ' ') || 'Note'}</span>
                          </div>
                          <StatusBadge status={note.status} />
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(note.date)}
                          </span>
                        </div>
                        <p className="text-sm">{note.note}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
