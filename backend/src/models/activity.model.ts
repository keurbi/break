import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    duration: Number,
    difficulty: Number,
    type: String,
    subType: String,
    resource: String,
    benefits: [String],
    tags: [String],
    tips: [String],
}, { collection: 'activities' });

export default mongoose.model('Activity', activitySchema);