import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFeatureContribution {
  featureId: string;
  name: string;
  contribution: number;
  description?: string;
}

export interface IExplanation extends Document {
  predictionId: Types.ObjectId;
  method: string;
  featureContributions: IFeatureContribution[];
  visualizationPath?: string;
  heatmapBase64?: string;
  summaryNote?: string;
  createdAt: Date;
}

const ExplanationSchema = new Schema<IExplanation>(
  {
    predictionId: {
      type: Schema.Types.ObjectId,
      ref: 'Prediction',
      required: true,
    },
    method: {
      type: String,
      default: 'SHAP (TreeExplainer) + GradCAM Attention Heatmap',
    },
    featureContributions: [
      {
        featureId: { type: String, required: true },
        name: { type: String, required: true },
        contribution: { type: Number, required: true },
        description: { type: String },
      },
    ],
    visualizationPath: {
      type: String,
    },
    heatmapBase64: {
      type: String,
    },
    summaryNote: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Explanation = mongoose.model<IExplanation>('Explanation', ExplanationSchema);
