import { Badge } from '@/components/ui/badge';
import { CallStatus } from '@/types';
import { getStatusLabel, getStatusColor } from '@/utils/statusHelpers';

interface StatusBadgeProps {
  status: CallStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <Badge 
      className="font-medium"
      style={{ 
        backgroundColor: getStatusColor(status),
        color: 'white',
        borderColor: getStatusColor(status)
      }}
    >
      {getStatusLabel(status)}
    </Badge>
  );
};
