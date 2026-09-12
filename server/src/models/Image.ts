import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IImage extends Document {
  storageKey: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  width?: number;
  height?: number;
  uploadedBy: Types.ObjectId;
  createdAt: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    storageKey: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export const Image = mongoose.model<IImage>('Image', ImageSchema);
