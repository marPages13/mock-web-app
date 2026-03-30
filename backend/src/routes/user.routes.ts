import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { upload } from '../middleware/upload';
import {
  getMe,
  updateMe,
  updateMeValidation,
  listUsers,
  getUser,
  updateUser,
  updateUserAdminValidation,
  deleteUser,
  uploadAvatar,
} from '../controllers/user.controller';

const router = Router();

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get own profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Authentication required
 */
router.get('/me', verifyJWT, getMe);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update own profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pseudo: { type: string }
 *               bio: { type: string }
 *               avatarKey: { type: string }
 *     responses:
 *       200:
 *         description: Updated user profile
 */
router.put('/me/avatar', verifyJWT, upload.single('avatar'), uploadAvatar);
router.put('/me', verifyJWT, updateMeValidation, updateMe);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all users (admin)
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Admin access required
 */
router.get('/', verifyJWT, requireAdmin, listUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID (admin)
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User profile
 *       404:
 *         description: User not found
 */
router.get('/:id', verifyJWT, requireAdmin, getUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user (admin)
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pseudo: { type: string }
 *               bio: { type: string }
 *               email: { type: string }
 *               role: { type: string, enum: [user, admin] }
 *     responses:
 *       200:
 *         description: Updated user profile
 */
router.put('/:id', verifyJWT, requireAdmin, updateUserAdminValidation, updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user (admin)
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete('/:id', verifyJWT, requireAdmin, deleteUser);

export default router;
