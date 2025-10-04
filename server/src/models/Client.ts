import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type CallStatus = 'interested' | 'not_interested' | 'follow_up' | 'wrong_number' | 'no_answer';
export type Priority = 'hot' | 'warm' | 'cold';
export type Source = 'google' | 'instagram' | 'facebook' | 'referral' | 'cold_call' | 'other';
export type ActivityType = 'call' | 'meeting' | 'email' | 'follow_up' | 'note';

export interface Activity {
  _id: Types.ObjectId;
  date: Date;
  note: string;
  status: CallStatus;
  type: ActivityType;
}

export interface ClientDocument extends Document {
  name: string;
  phone: string;
  email?: string;
  businessName?: string;
  source: Source;
  status: CallStatus;
  tags: string[];
  priority: Priority;
  nextFollowUp?: Date;
  notes: Activity[];
  createdDate: Date;
  lastContactedDate?: Date;
  userId: Types.ObjectId;
}

const ActivitySchema = new Schema<Activity>({
  date: { type: Date, required: true },
  note: { type: String, required: true },
  status: { type: String, enum: ['interested', 'not_interested', 'follow_up', 'wrong_number', 'no_answer'], required: true },
  type: { type: String, enum: ['call', 'meeting', 'email', 'follow_up', 'note'], default: 'note', required: true },
}, { _id: true });

const ClientSchema = new Schema<ClientDocument>({
  name: { type: String, required: true },
  phone: { type: String, required: true, index: true },
  email: { type: String },
  businessName: { type: String },
  source: { type: String, enum: ['google', 'instagram', 'facebook', 'referral', 'cold_call', 'other'], required: true },
  status: { type: String, enum: ['interested', 'not_interested', 'follow_up', 'wrong_number', 'no_answer'], required: true },
  tags: { type: [String], default: [] },
  priority: { type: String, enum: ['hot', 'warm', 'cold'], required: true },
  nextFollowUp: { type: Date },
  notes: { type: [ActivitySchema], default: [] },
  createdDate: { type: Date, default: Date.now },
  lastContactedDate: { type: Date },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

ClientSchema.index({ phone: 1, userId: 1 }, { unique: true });
ClientSchema.index({ email: 1, userId: 1 }, { unique: false, partialFilterExpression: { email: { $exists: true } } });

export const Client: Model<ClientDocument> = mongoose.model<ClientDocument>('Client', ClientSchema);
