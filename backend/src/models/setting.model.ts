import mongoose, { Schema, Document } from 'mongoose';

interface ISetting extends Document {
  key: string;
  value: any;
  description: string;
  updatedAt: Date;
}

const settingSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  description: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

const Setting = mongoose.model<ISetting>('Setting', settingSchema);

export default Setting;
