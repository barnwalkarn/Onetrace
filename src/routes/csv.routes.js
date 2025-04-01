// routes/csv.routes.js

import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { authenticateAdmin } from '../middlewares/auth.middleware.js';
import { addActivities, 
         Addcourses, 
         deleteActivity, 
         deleteAllCsv, 
         deletecourse, 
         deleteCsv, 
         fetchCsv, 
         fetchUser, 
         updateCsv, 
         uploadCsv } from '../controllers/csv.controller.js';  

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/');  // Files will be saved in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Set a unique name for the uploaded file (timestamp-based)
    cb(null, Date.now() + path.extname(file.originalname));  // Append the original file extension
  },
});

// Use multer without any file filter to accept any file type
const upload = multer({ storage: storage });

// Routes

router.use(authenticateAdmin)
router.post('/upload', upload.single('csv'), uploadCsv);  // Upload CSV
router.put('/update', upload.single('csv'), updateCsv); 
router.get('/fetch',fetchCsv)
router.get('/fetchUser',fetchUser)

router.delete('/deleteUser',deleteCsv)
router.delete('/deleteAll',deleteAllCsv)
router.post('/addCourse',Addcourses)


router.delete('/deleteCourse',deletecourse)

router.post('/addActivity',addActivities)
router.delete('/deleteActivity',deleteActivity)


export default router;  // Updated to ES module export
