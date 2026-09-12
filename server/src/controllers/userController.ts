import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { logAudit } from '../middleware/auditLogger';
import { AuthRequest } from '../middleware/authMiddleware';

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, role, status } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;

    let users = await User.find(query).populate('roleId', 'name description permissions').sort({ createdAt: -1 });

    if (role) {
      users = users.filter((u: any) => u.roleId?.name?.toLowerCase() === (role as string).toLowerCase());
    }

    res.json({ success: true, count: users.length, users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, roleId, status } = req.body;

    const existing = await User.findOne({ email: email?.toLowerCase() });
    if (existing) {
      res.status(400).json({ success: false, message: 'User with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password || 'Password123!', 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      roleId,
      status: status || 'active',
    });

    await logAudit({
      userId: req.user?._id,
      userName: req.user?.name,
      action: 'USER_CREATE',
      resource: 'User',
      resourceId: user._id.toString(),
      metadata: { email: user.email },
      ip: req.ip,
    });

    res.status(201).json({ success: true, message: 'User created successfully.', user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, roleId, status, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (roleId) user.roleId = roleId;
    if (status) user.status = status;
    if (password) user.passwordHash = await bcrypt.hash(password, 10);

    await user.save();

    await logAudit({
      userId: req.user?._id,
      userName: req.user?.name,
      action: 'USER_UPDATE',
      resource: 'User',
      resourceId: user._id.toString(),
      metadata: { updatedFields: Object.keys(req.body) },
      ip: req.ip,
    });

    res.json({ success: true, message: 'User updated successfully.', user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (req.user?._id.toString() === id) {
      res.status(400).json({ success: false, message: 'You cannot delete your own administrative account.' });
      return;
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    await logAudit({
      userId: req.user?._id,
      userName: req.user?.name,
      action: 'USER_DELETE',
      resource: 'User',
      resourceId: id,
      metadata: { email: user.email },
      ip: req.ip,
    });

    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
