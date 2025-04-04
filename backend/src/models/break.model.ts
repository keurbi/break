import mongoose, { Schema, Document } from 'mongoose';

interface IBreak extends Document {
  user_id: mongoose.Types.ObjectId;
  break_id: string;
  completed: boolean;
  duration: number;
  dateStart: Date;
}

const breakSchema: Schema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  break_id: { type: String, required: true },
  completed: { type: Boolean, default: false },
  duration: { type: Number, required: true },
  dateStart: { type: Date, required: true },
});

const Break = mongoose.model<IBreak>('Break', breakSchema);

export default Break;
