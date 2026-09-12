import { Response } from 'express';
import { Role } from '../models/Role';
import { logAudit } from '../middleware/auditLogger';
import { AuthRequest } from '../middleware/authMiddleware';

export const getRoles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const roles = await Role.find().sort({ name: 1 });
    res.json({ success: true, roles });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, permissions } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: 'Role name is required.' });
      return;
    }

    const existing = await Role.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      res.status(400).json({ success: false, message: 'Role with this name already exists.' });
      return;
    }

    const role = await Role.create({
      name,
      description: description || '',
      permissions: permissions || [],
    });

    await logAudit({
      userId: req.user?._id,
      userName: req.user?.name,
      action: 'ROLE_CREATE',
      resource: 'Role',
      resourceId: role._id.toString(),
      metadata: { name: role.name },
      ip: req.ip,
    });

    res.status(201).json({ success: true, message: 'Role created successfully.', role });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRolePermissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { permissions, description } = req.body;

    const role = await Role.findById(id);
    if (!role) {
      res.status(404).json({ success: false, message: 'Role not found.' });
      return;
    }

    if (permissions && Array.isArray(permissions)) {
      role.permissions = permissions;
    }
    if (description) {
      role.description = description;
    }

    await role.save();

    await logAudit({
      userId: req.user?._id,
      userName: req.user?.name,
      action: 'ROLE_PERMISSIONS_UPDATE',
      resource: 'Role',
      resourceId: id,
      metadata: { role: role.name, permissionsCount: role.permissions.length },
      ip: req.ip,
    });

    res.json({ success: true, message: 'Role permissions updated successfully.', role });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);
    if (!role) {
      res.status(404).json({ success: false, message: 'Role not found.' });
      return;
    }

    // Protect system built-in roles
    if (['Admin', 'Researcher', 'Clinician'].includes(role.name)) {
      res.status(400).json({ success: false, message: 'Core system roles cannot be deleted.' });
      return;
    }

    await Role.findByIdAndDelete(id);

    await logAudit({
      userId: req.user?._id,
      userName: req.user?.name,
      action: 'ROLE_DELETE',
      resource: 'Role',
      resourceId: id,
      metadata: { name: role.name },
      ip: req.ip,
    });

    res.json({ success: true, message: 'Role deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
