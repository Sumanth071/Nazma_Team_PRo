import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IClassProbability {
  className: string;
  probability: number;
}

export interface IPrediction extends Document {
  analysisId: string;
  userId: Types.ObjectId;
  imageId: Types.ObjectId;
  modelVersionId: Types.ObjectId;
  predictedClass: string;
  confidence: number;
  probabilities: IClassProbability[];
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  reviewStatus: 'PENDING' | 'REVIEWED' | 'REQUIRES_FURTHER_REVIEW';
  reviewNotes?: string;
  reviewerId?: Types.ObjectId;
  reviewedAt?: Date;
  explanationId?: Types.ObjectId;
  reportId?: Types.ObjectId;
  processingTimeMs?: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PredictionSchema = new Schema<IPrediction>(
  {
    analysisId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    imageId: {
      type: Schema.Types.ObjectId,
      ref: 'Image',
      required: true,
    },
    modelVersionId: {
      type: Schema.Types.ObjectId,
      ref: 'ModelRegistry',
      required: true,
    },
    predictedClass: {
      type: String,
      required: true,
      enum: ['Adenomatous Polyp', 'Hyperplastic Polyp', 'Serrated Polyp', 'Other / Non-polyp'],
    },
    confidence: {
      type: Number,
      required: true,
    },
    probabilities: [
      {
        className: { type: String, required: true },
        probability: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ['QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'COMPLETED',
      index: true,
    },
    reviewStatus: {
      type: String,
      enum: ['PENDING', 'REVIEWED', 'REQUIRES_FURTHER_REVIEW'],
      default: 'PENDING',
      index: true,
    },
    reviewNotes: {
      type: String,
    },
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    explanationId: {
      type: Schema.Types.ObjectId,
      ref: 'Explanation',
    },
    reportId: {
      type: Schema.Types.ObjectId,
      ref: 'Report',
    },
    processingTimeMs: {
      type: Number,
    },
    errorMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Prediction = mongoose.model<IPrediction>('Prediction', PredictionSchema);
