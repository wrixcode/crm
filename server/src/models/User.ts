import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
  email: string;
  name: string;
  passwordHash: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

UserSchema.methods.comparePassword = async function(candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

export const User: Model<UserDocument> = mongoose.model<UserDocument>('User', UserSchema);
