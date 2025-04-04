import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  department: string;
  manager_id: mongoose.Types.ObjectId;
  createdAt: Date;
  lastLogin: Date;
  achievements: string[];
  preferences: {
    theme: string;
    notifications: boolean;
    language: string;
  };
  customization: {
    unlockedTitles: {
      titleId: mongoose.Types.ObjectId;
      unlockedAt: Date;
      isActive: boolean;
    }[];
    unlockedBadges: {
      badgeId: mongoose.Types.ObjectId;
      unlockedAt: Date;
      isActive: boolean;
    }[];
    activeTitle: mongoose.Types.ObjectId;
    activeBadge: mongoose.Types.ObjectId;
  };
}

const userSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, required: true },
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  achievements: { type: [String], default: [] },
  preferences: {
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'en' },
  },
  customization: {
    unlockedTitles: [{
      titleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Title' },
      unlockedAt: { type: Date, required: true },
      isActive: { type: Boolean, default: false }
    }],
    unlockedBadges: [{
      badgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
      unlockedAt: { type: Date, required: true },
      isActive: { type: Boolean, default: false }
    }],
    activeTitle: { type: mongoose.Schema.Types.ObjectId, ref: 'Title' },
    activeBadge: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
  }
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
