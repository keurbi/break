import express from 'express';
import { getAllActivities, getActivityById, createActivity, updateActivity, deleteActivity } from '../controllers/activitiesController';
import { authenticateFirebase } from '../middlewares/firebaseAuth';
import { authorizeRoles } from '../middlewares/authRoles';
import { validateRequest } from '../middlewares/validateRequest';
import { createActivityValidators, idParamValidator, listActivitiesValidators, updateActivityValidators } from '../validators/activity.validators';

const router = express.Router();

// Public list with pagination and soft delete filter
router.get('/', listActivitiesValidators, validateRequest, getAllActivities);
// Public get by id
router.get('/:id', idParamValidator, validateRequest, getActivityById);

// Protected write operations
router.post('/', authenticateFirebase, authorizeRoles('manager'), createActivityValidators, validateRequest, createActivity);
router.put('/:id', authenticateFirebase, authorizeRoles('manager'), updateActivityValidators, validateRequest, updateActivity);
router.delete('/:id', authenticateFirebase, authorizeRoles('manager'), idParamValidator, validateRequest, deleteActivity);

export default router;