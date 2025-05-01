import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'done';
  dueDate: Date;
  assignedTo: mongoose.Types.ObjectId;
}

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['pending', 'in-progress', 'done'], default: 'pending' },
  dueDate: Date,
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const Task = mongoose.model<ITask>('Task', taskSchema);
