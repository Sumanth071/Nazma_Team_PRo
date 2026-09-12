import mongoose, { Schema, Document } from 'mongoose';

export interface IModel extends Document {
  name: string;
  version: string;
  backbone: string;
  classifier: string;
  datasetVersion: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    rocAuc: number;
    sensitivity: number;
    specificity: number;
    confusionMatrix?: {
      labels: string[];
      matrix: number[][];
    };
  };
  status: 'Experimental' | 'Validation' | 'Production' | 'Archived';
  modelPath: string;
  createdAt: Date;
}

const ModelSchema = new Schema<IModel>(
  {
    name: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
      unique: true,
    },
    backbone: {
      type: String,
      required: true,
      default: 'ConvNeXt V2 (Tiny/Base)',
    },
    classifier: {
      type: String,
      required: true,
      default: 'XGBoost Multi-Class',
    },
    datasetVersion: {
      type: String,
      required: true,
      default: 'ColoPolyp-DB-v1.0',
    },
    metrics: {
      accuracy: { type: Number, required: true },
      precision: { type: Number, required: true },
      recall: { type: Number, required: true },
      f1Score: { type: Number, required: true },
      rocAuc: { type: Number, required: true },
      sensitivity: { type: Number, required: true },
      specificity: { type: Number, required: true },
      confusionMatrix: {
        labels: [String],
        matrix: [[Number]],
      },
    },
    status: {
      type: String,
      enum: ['Experimental', 'Validation', 'Production', 'Archived'],
      default: 'Validation',
    },
    modelPath: {
      type: String,
      default: 'models/convnextv2_xgboost_v1.bin',
    },
  },
  { timestamps: true }
);

export const ModelRegistry = mongoose.model<IModel>('ModelRegistry', ModelSchema);
