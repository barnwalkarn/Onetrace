import { registerUser,loginAdmin,logoutAdmin } from "../controllers/auth.controller.js";

import express from 'express'


const router = express.Router();


router.post('/register',registerUser)
router.post('/login',loginAdmin)
router.post('/logout',logoutAdmin)


export default router; 