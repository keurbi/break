import mongoose, { Schema, Document } from 'mongoose';

interface ITip extends Document {
  title: string;
  content: string;
  category: string; // e.g., 'wellness', 'productivity', 'app-usage'
  applicableRoles: string[]; // e.g., ['employee', 'manager', 'hr']
  createdAt: Date;
  updatedAt: Date;
}

const tipSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true, enum: ['wellness', 'productivity', 'app-usage'] },
  applicableRoles: { type: [String], default: ['employee', 'manager', 'hr'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Tip = mongoose.model<ITip>('Tip', tipSchema);

export default Tip;
