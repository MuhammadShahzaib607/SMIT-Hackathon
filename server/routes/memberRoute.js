// File: routes/memberRoutes.js

import express from 'express';
import { 
    createFamilyMember, 
    getFamilyMembers, 
    deleteFamilyMember, 
} from '../controllers/memberController.js';
import { verifyToken } from '../utils/verifyToken.js';


const router = express.Router();

// [POST] /api/member (Member Create)
router.post('/', verifyToken, createFamilyMember); 

// [GET] /api/member (Saare members list karna, sirf login user ke)
router.get('/', verifyToken, getFamilyMembers); 

// router.get('/', testing); 

// [DELETE] /api/member/:id (Member Delete) - ID yahan Member ki hai
router.delete('/:id', verifyToken, deleteFamilyMember); 

export default router;