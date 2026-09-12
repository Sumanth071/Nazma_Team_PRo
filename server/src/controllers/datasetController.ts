import { Response } from 'express';
import { Dataset } from '../models/Dataset';
import { logAudit } from '../middleware/auditLogger';
import { AuthRequest } from '../middleware/authMiddleware';

export const getDatasets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const datasets = await Dataset.find().sort({ createdAt: -1 });
    res.json({ success: true, count: datasets.length, datasets });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDatasetById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dataset = await Dataset.findById(id);
    if (!dataset) {
      res.status(404).json({ success: false, message: 'Dataset not found.' });
      return;
    }
    res.json({ success: true, dataset });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDataset = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, version, description, totalImages, classes, metadata } = req.body;

    const dataset = await Dataset.create({
      name,
      version: version || 'v1.0.0',
      description: description || '',
      totalImages: Number(totalImages) || 1000,
      classes: classes || [
        { name: 'Adenomatous Polyp', count: 520 },
        { name: 'Hyperplastic Polyp', count: 280 },
        { name: 'Serrated Polyp', count: 140 },
        { name: 'Other / Non-polyp', count: 60 },
      ],
      metadata: metadata || { source: 'Hospital Endoscopy Consortium', resolution: '1024x768' },
    });

    await logAudit({
      userId: req.user?._id,
      userName: req.user?.name,
      action: 'DATASET_CREATE',
      resource: 'Dataset',
      resourceId: dataset._id.toString(),
      metadata: { name: dataset.name, version: dataset.version },
      ip: req.ip,
    });

    res.status(201).json({ success: true, message: 'Dataset created successfully.', dataset });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDataset = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dataset = await Dataset.findByIdAndUpdate(id, req.body, { new: true });
    if (!dataset) {
      res.status(404).json({ success: false, message: 'Dataset not found.' });
      return;
    }

    await logAudit({
      userId: req.user?._id,
      userName: req.user?.name,
      action: 'DATASET_UPDATE',
      resource: 'Dataset',
      resourceId: id,
      metadata: { name: dataset.name },
      ip: req.ip,
    });

    res.json({ success: true, message: 'Dataset updated successfully.', dataset });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDataset = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const dataset = await Dataset.findByIdAndDelete(id);
    if (!dataset) {
      res.status(404).json({ success: false, message: 'Dataset not found.' });
      return;
    }

    await logAudit({
      userId: req.user?._id,
      userName: req.user?.name,
      action: 'DATASET_DELETE',
      resource: 'Dataset',
      resourceId: id,
      metadata: { name: dataset.name },
      ip: req.ip,
    });

    res.json({ success: true, message: 'Dataset deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
