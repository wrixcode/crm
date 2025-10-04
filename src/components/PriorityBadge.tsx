import { Badge } from '@/components/ui/badge';
import { Priority } from '@/types';
import { getPriorityLabel, getPriorityColor } from '@/utils/statusHelpers';

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  return (
    <Badge 
      variant="outline"
      className="font-medium"
      style={{ 
        borderColor: getPriorityColor(priority),
        color: getPriorityColor(priority)
      }}
    >
      {getPriorityLabel(priority)}
    </Badge>
  );
};
