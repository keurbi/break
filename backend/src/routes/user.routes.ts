import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController';
import { authenticateFirebase } from '../middlewares/firebaseAuth';
import { authorizeRoles } from '../middlewares/authRoles';

const router = Router();

router.post('/', authenticateFirebase, authorizeRoles('manager'), createUser);
router.get('/', authenticateFirebase, authorizeRoles('manager'), getUsers);
router.get('/:id', authenticateFirebase, authorizeRoles('manager'), getUserById);
router.put('/:id', authenticateFirebase, authorizeRoles('manager'), updateUser);
router.delete('/:id', authenticateFirebase, authorizeRoles('manager'), deleteUser);

export default router;