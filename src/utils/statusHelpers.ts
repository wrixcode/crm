import { CallStatus, Priority } from '@/types';

export const getStatusLabel = (status: CallStatus): string => {
  const labels: Record<CallStatus, string> = {
    interested: 'Interested',
    not_interested: 'Not Interested',
    follow_up: 'Follow Up',
    wrong_number: 'Wrong Number',
    no_answer: 'No Answer'
  };
  return labels[status];
};

export const getStatusColor = (status: CallStatus): string => {
  const colors: Record<CallStatus, string> = {
    interested: 'hsl(var(--status-interested))',
    not_interested: 'hsl(var(--status-not-interested))',
    follow_up: 'hsl(var(--status-follow-up))',
    wrong_number: 'hsl(var(--status-wrong-number))',
    no_answer: 'hsl(var(--status-no-answer))'
  };
  return colors[status];
};

export const getPriorityLabel = (priority: Priority): string => {
  const labels: Record<Priority, string> = {
    hot: '🔥 Hot',
    warm: '⚡ Warm',
    cold: '❄️ Cold'
  };
  return labels[priority];
};

export const getPriorityColor = (priority: Priority): string => {
  const colors: Record<Priority, string> = {
    hot: 'hsl(var(--priority-hot))',
    warm: 'hsl(var(--priority-warm))',
    cold: 'hsl(var(--priority-cold))'
  };
  return colors[priority];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const isFollowUpDueToday = (followUpDate?: string): boolean => {
  if (!followUpDate) return false;
  const today = new Date();
  const followUp = new Date(followUpDate);
  return followUp.toDateString() === today.toDateString();
};

export const isFollowUpOverdue = (followUpDate?: string): boolean => {
  if (!followUpDate) return false;
  const today = new Date();
  const followUp = new Date(followUpDate);
  return followUp < today && followUp.toDateString() !== today.toDateString();
};
