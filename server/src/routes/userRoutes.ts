import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/rbacMiddleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', requireRole('Admin'), getUsers);
router.post('/', requireRole('Admin'), createUser);
router.put('/:id', (req: any, res: any, next: any) => {
  const isAdmin = req.user?.role?.name === 'Admin';
  const isSelf = req.user?._id?.toString() === req.params.id;

  if (!isAdmin && !isSelf) {
    res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges.' });
    return;
  }

  // Prevent non-admins from promoting themselves or changing their account status
  if (!isAdmin) {
    delete req.body.roleId;
    delete req.body.status;
  }

  next();
}, updateUser);
router.delete('/:id', requireRole('Admin'), deleteUser);

export default router;

