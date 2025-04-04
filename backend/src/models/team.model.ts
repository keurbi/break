import mongoose, { Schema, Document } from 'mongoose';

interface ITeam extends Document {
  name: string;
  manager_id: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  department: string;
  objectives: string[];
  creationDate: Date;
}

const teamSchema: Schema = new Schema({
  name: { type: String, required: true },
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  department: { type: String, required: true },
  objectives: { type: [String], default: [] },
  creationDate: { type: Date, default: Date.now },
});

const Team = mongoose.model<ITeam>('Team', teamSchema);

export default Team;
