export type CallStatus = 
  | 'interested' 
  | 'not_interested' 
  | 'follow_up' 
  | 'wrong_number' 
  | 'no_answer';

export type Priority = 'hot' | 'warm' | 'cold';

export type Source = 'google' | 'instagram' | 'facebook' | 'referral' | 'cold_call' | 'other';

export type ActivityType = 'call' | 'meeting' | 'email' | 'follow_up' | 'note';

export interface Activity {
  id: string;
  date: string;
  note: string;
  status: CallStatus;
  type: ActivityType;
}

export interface CallNote extends Activity {}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  businessName?: string;
  source: Source;
  status: CallStatus;
  tags: string[];
  priority: Priority;
  nextFollowUp?: string;
  notes: CallNote[];
  createdDate: string;
  lastContactedDate?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
