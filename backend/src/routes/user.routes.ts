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
import { validateRequest } from '../middlewares/validateRequest';
import { createUserValidators, idParamValidator, updateUserValidators } from '../validators/user.validators';

const router = Router();

router.post('/', authenticateFirebase, authorizeRoles('manager'), createUserValidators, validateRequest, createUser);
router.get('/', authenticateFirebase, authorizeRoles('manager'), getUsers);
router.get('/:id', authenticateFirebase, authorizeRoles('manager'), idParamValidator, validateRequest, getUserById);
router.put('/:id', authenticateFirebase, authorizeRoles('manager'), updateUserValidators, validateRequest, updateUser);
router.delete('/:id', authenticateFirebase, authorizeRoles('manager'), idParamValidator, validateRequest, deleteUser);

export default router;