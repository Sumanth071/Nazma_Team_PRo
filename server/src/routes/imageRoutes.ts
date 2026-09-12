import { Router, Response } from 'express';
import { Image } from '../models/Image';
import { authenticateJWT, AuthRequest } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { logAudit } from '../middleware/auditLogger';

const router = Router();

router.use(authenticateJWT);

router.post('/upload', upload.single('image'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Please provide a valid colonoscopy image file.' });
      return;
    }

    const file = req.file;
    const user = req.user!;

    const image = await Image.create({
      storageKey: file.path,
      fileName: file.filename,
      originalName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadedBy: user._id,
    });

    await logAudit({
      userId: user._id,
      userName: user.name,
      action: 'IMAGE_UPLOAD',
      resource: 'Image',
      resourceId: image._id.toString(),
      metadata: { fileName: file.filename, fileSize: file.size },
      ip: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully.',
      image,
    });
  } catch (error: any) {
    console.error('[ImageRoutes] Upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Image upload failed.' });
  }
});

export default router;
