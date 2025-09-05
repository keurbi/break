import { Router } from 'express';
import { createCheckoutSession } from '../controllers/paymentsController';
import { authenticateFirebase } from '../middlewares/firebaseAuth';

const router = Router();

// Protected route to create a checkout session
router.post('/checkout-session', authenticateFirebase, createCheckoutSession);

export default router;
