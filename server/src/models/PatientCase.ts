import mongoose, { Document, Schema } from 'mongoose';

export interface IPatientCase extends Document {
  caseId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  procedureDate: Date;
  endoscopist: string;
  indication: 'Screening' | 'Surveillance' | 'High Risk' | 'Symptomatic';
  anatomicalLocation: string;
  polypFindings: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  status: 'Scheduled' | 'Completed' | 'Reviewed' | 'Follow-up Required';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PatientCaseSchema = new Schema<IPatientCase>(
  {
    caseId: { type: String, required: true, unique: true, index: true },
    patientName: { type: String, required: true, trim: true },
    patientAge: { type: Number, required: true, min: 1, max: 120 },
    patientGender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    procedureDate: { type: Date, default: Date.now },
    endoscopist: { type: String, default: 'Dr. John Smith' },
    indication: {
      type: String,
      enum: ['Screening', 'Surveillance', 'High Risk', 'Symptomatic'],
      default: 'Screening',
    },
    anatomicalLocation: { type: String, default: 'Sigmoid Colon' },
    polypFindings: { type: String, default: 'Adenomatous Polyp' },
    riskLevel: { type: String, enum: ['Low', 'Moderate', 'High'], default: 'Moderate' },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Reviewed', 'Follow-up Required'],
      default: 'Completed',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const PatientCase = mongoose.model<IPatientCase>('PatientCase', PatientCaseSchema);
