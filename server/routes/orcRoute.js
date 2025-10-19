// File: routes/orcRoute.js

import express from 'express';
import multer from 'multer';
import { analyzeMemberReport, analyzeReport } from '../controllers/analyzeController.js'; // Simple import
import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

const upload = multer({ 
    storage: multer.memoryStorage() 
});

// Final API Endpoint: /orc/analyze
router.post('/analyze', upload.single('reportImage'), analyzeReport);
router.post(
    '/:memberId/report', 
    verifyToken, 
    upload.single('reportImage'),
    analyzeMemberReport 
);

export default router;