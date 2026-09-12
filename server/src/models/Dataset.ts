import mongoose, { Schema, Document } from 'mongoose';

export interface IDataset extends Document {
  name: string;
  version: string;
  description: string;
  totalImages: number;
  classes: {
    name: string;
    count: number;
  }[];
  metadata: {
    source: string;
    resolution: string;
    colorSpace: string;
    splits: {
      train: number;
      val: number;
      test: number;
    };
  };
  createdAt: Date;
}

const DatasetSchema = new Schema<IDataset>(
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
    description: {
      type: String,
      required: true,
    },
    totalImages: {
      type: Number,
      required: true,
    },
    classes: [
      {
        name: { type: String, required: true },
        count: { type: Number, required: true },
      },
    ],
    metadata: {
      source: { type: String, default: 'Colonoscopy Polyp Benchmark Consortium' },
      resolution: { type: String, default: '1920x1080 / Resized 224x224' },
      colorSpace: { type: String, default: 'RGB' },
      splits: {
        train: { type: Number, default: 0.7 },
        val: { type: Number, default: 0.15 },
        test: { type: Number, default: 0.15 },
      },
    },
  },
  { timestamps: true }
);

export const Dataset = mongoose.model<IDataset>('Dataset', DatasetSchema);
