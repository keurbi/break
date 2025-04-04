import mongoose, { Schema, Document } from 'mongoose';

interface IActivity extends Document {
  type: string;
  subType: string;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  resource: string;
  tags: string[];
  benefits: string[];
  tips: string[];
  category: string;
  status: string;
}

const activitySchema: Schema = new Schema({
  type: { type: String, required: true },
  subType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  difficulty: { 
    type: String, 
    required: true, 
    enum: ['easy', 'medium', 'hard']
  },
  resource: { type: String, required: true },
  tags: { type: [String], default: [] },
  benefits: { type: [String], default: [] },
  tips: { type: [String], default: [] },
  category: { 
    type: String, 
    required: true, 
    enum: ['exercice', 'mobilité', 'relaxation']
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['planned', 'in-progress', 'completed'] 
  },
});

const Activity = mongoose.model<IActivity>('Activity', activitySchema);

export default Activity;
