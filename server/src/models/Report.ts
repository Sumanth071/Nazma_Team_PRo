import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReport extends Document {
  reportId: string;
  predictionId: Types.ObjectId;
  generatedBy: Types.ObjectId;
  filePath: string;
  fileSize?: number;
  status: 'READY' | 'GENERATING' | 'FAILED';
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reportId: {
      type: String,
      required: true,
      unique: true,
    },
    predictionId: {
      type: Schema.Types.ObjectId,
      ref: 'Prediction',
      required: true,
    },
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['READY', 'GENERATING', 'FAILED'],
      default: 'READY',
    },
  },
  { timestamps: true }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
