import csv from 'csvtojson';
import fs from 'fs/promises';  // Use the promise-based fs API
import path from 'path';
import BugData from '../models/csv.model.js';
import mongoose from 'mongoose';

// Define the base directory for the project (using __dirname for clarity)
const __dirnamePath = path.resolve();  // Resolves the absolute path


//Uplaod name team csv file 







export const uploadCsv = async (req, res) => {
  try {
    // Check if file is provided
    const { username, teamname } = req.body;

    if (!username || !teamname) {
      return res.status(400).json({
        message: 'Username and teamname are required in the request body.',
      });
    }

    //Validation for the user already exist

    const existingData = await BugData.findOne({username,teamname});


    if(existingData){
        return res.status(400).json({
            message:'A user with the same username and teamname already exists. Upload rejected.'
        })
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: 'No file uploaded',
      });
    }
    // Define the full path to the uploaded file in the 'uploads' folder
    const filePath = path.Ijoin(__dirnamePath, 'upload', file.filename);
     // Log the resolved file path for debugging
    console.log("Resolved file path:", filePath);  // This should print the exact file path
    // // Check if the file exists at the resolved path
    try {
      await fs.access(filePath);  // Use promise-based fs.access
    } catch (err) {
      return res.status(500).json({
        message: 'CSV file not found at the expected path.',
        error: err.message,
      });
    }

    // Convert CSV to JSON
    const jsonData = await csv().fromFile(filePath);
    console.log("Conversion done:", jsonData);

    const bugData = jsonData.map(item => ({
      bugid: item.ID, // Map the CSV fields to the required format
      title: item.Title,
      severity: item.Severity,
      createdDate: item['Created Date'], // Clean up spaces from Created Date if needed
    }));

    const newBugData = new BugData({
      username: username,  // Receive from the request body
      teamname: teamname,  // Receive from the request body
      bugs: bugData,
    });

    // Save the data to the database
    const savedBugData = await newBugData.save();

    // Delete the file after processing
    await fs.unlink(filePath);  // Use the promise-based fs.unlink
    console.log("File deleted");

    // Send the response
    res.status(200).json({

        message: 'Data Uploaded successfully',

        _id: savedBugData._id, 
        username:savedBugData.username,
        teamname:savedBugData.teamname,
        bugs:savedBugData.bugs
    
     
    //   data: savedBugData,
    //   _id:savedBugData._id  // Send back the parsed data
    });
  } catch (error) {
    console.error("Error occurred during the upload process:", error);
    res.status(500).json({
      message: 'Please check the format of the csv file upload it should must include ID,title,severity and created date',
      error: error.message,
    });
  }
};

//fetch csv of all user

export const fetchCsv = async(req,res)=>{

    try {
        // Fetch all BugData from the database
        const allBugData = await BugData.find();
    
        // Return the data as a JSON response
        res.status(200).json(
            {

                message:'Fetched successfully',
                AllUserData:allBugData            
            }
            
            );
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
        res.status(500).json({
          message: 'Error occurred while fetching the bug data',
          error: error.message,
        });
      }

}

//Delete User By id


export const deleteCsv = async(req,res)=>{

    try {
        // Get the _id of the document to delete from the URL params
        const { userId } = req.body;
    
        // Check if the id is provided
        if (!userId) {
          return res.status(400).json({
            message: 'User ID is required',
          });
        }
    
        // Try to find and delete the BugData document by ID
        const deletedUser = await BugData.findByIdAndDelete(userId);
    
        // If no document is found, return a 404 error
        if (!deletedUser) {
          return res.status(404).json({
            message: 'User not found',
          });
        }
    
        // Return success message and the deleted user data
        res.status(200).json({
          message: 'User data deleted successfully',
          deletedUser,
        });
      } catch (error) {
        console.error('Error during deletion:', error);
        res.status(500).json({
          message: 'Error occurred while deleting the user data',
          error: error.message,
        });
      }
    

}


//Delete All csv

export const deleteAllCsv = async(req,res)=>{


    try {
        // Delete all BugData (CSV data) from the database
        const deletedData = await BugData.deleteMany({});
    
        // If no data is deleted, return a 404 error
        if (deletedData.deletedCount === 0) {
          return res.status(404).json({
            message: 'No users or CSV data found to delete.',
          });
        }
    
        // Successfully deleted all user CSV data
        res.status(200).json({
          message: 'All user CSV data deleted successfully.',
          deletedCount: deletedData.deletedCount,
        });
      } catch (error) {
        console.error('Error during deletion:', error);
        res.status(500).json({
          message: 'Error occurred while deleting all user data.',
          error: error.message,
        });
      }
    

}


//Fetch User by id

export const fetchUser = async(req,res) =>{

    try {
        // Get the user ID from the request parameters
        const { userId } = req.body;
    
        // Find the user by their ID
        const user = await BugData.findById(userId);
    
        // If no user is found with the given ID, return a 404 error
        if (!user) {
          return res.status(404).json({
            message: 'User not found',
          });
        }
    
        // Successfully found the user, return the user data
        res.status(200).json({
          message: 'User Fetched Successfully',
          data: user,
        });
      } catch (error) {
        console.error('Error during fetching user:', error);
        res.status(500).json({
          message: 'Error occurred while fetching user data',
          error: error.message,
        });
      }
    

}



export const Addcourses = async(req,res)=>{


    try {



    const {userId,courseName} = req.body;

    if(!userId||!courseName){

        return res.status(400).json({

            message:'Course cannot be empty'
        })
    }

    //find the user by his id 
    const user = await BugData.findById(userId);

    if(!user){

        return res.status(400).json({

            message:"the given user doesnt exist"
        })
    }

    const courseExists = user.courses.some( course => course.courseName === courseName )

    if(courseExists){
        return res.status(400).json({
            message:'course already exist in the List'
        })
    }


    const newCourse = {

        _id: new mongoose.Types.ObjectId(),
        courseName:courseName,

    }

    user.courses.push(newCourse);

    await user.save()

    //sending responses
    return res.status(200).json({

        message:'course added successfully',
        username:user.username,
        teamname:user.teamname,
        courses:user.courses
    })

        
    } catch (error) {


        return res.status(500).json({
            message:'Error in adding courses',
            error:error.message
        })
        
    }

    




}

export const deletecourse = async(req,res)=>{


    try {


        const { userId, courseId } = req.body;
   // Check if both userId and courseId are provided
   if (!userId || !courseId) {
    return res.status(400).json({
      message: 'User ID and Course ID are required',
    });
  }

  // Find the user by userId
  const user = await BugData.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    });
  }

  // Find the index of the course to be deleted by its courseId
  const courseIndex = user.courses.findIndex(course => course._id.toString() === courseId);

  // If the course is not found in the user's courses
  if (courseIndex === -1) {
    return res.status(404).json({
      message: 'Course not found in user courses',
    });
  }

  // Remove the course from the courses array
  user.courses.splice(courseIndex, 1);

  // Save the updated user data after course deletion
  await user.save();

  return res.status(200).json({
    message: 'Course deleted successfully',
    username: user.username,
    teamname: user.teamname,
    courses: user.courses,
  });

        
    } catch (error) {

        res.status(500).json({
            message:'Unable to delete Course'
        })
        
    }


}

export const addActivities = async (req, res) => {
    try {
      const { userId, activityName } = req.body; // Assuming userId is the user document's _id and activityName is the name of the activity you want to add
  
      if (!userId || !activityName) {
        return res.status(400).json({
          message: 'User ID and Activity Name are required',
        });
      }
  
      // Find the user by userId
      const user = await BugData.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }
  
      // Check if the activity already exists
      const activityExists = user.activities.some(activity => activity.activityName === activityName);
      if (activityExists) {
        return res.status(400).json({
          message: 'Activity already exists in the list',
        });
      }
  
      // Add the new activity to the activities array
      const newActivity = {
        _id: new mongoose.Types.ObjectId(), // Generate a new unique _id for the activity
        activityName,
      };
  
      user.activities.push(newActivity);
  
      // Save the updated user document
      await user.save();
  
      return res.status(200).json({
        message: 'Activity added successfully',
        username: user.username,
        teamname: user.teamname,
        activities: user.activities,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Error in adding activity',
        error: error.message,
      });
    }
  };
  

  export const deleteActivity = async (req, res) => {
    try {
      const { userId, activityId } = req.body; // Assuming userId is the user document's _id and activityId is the _id of the activity to be deleted
  
      if (!userId || !activityId) {
        return res.status(400).json({
          message: 'User ID and Activity ID are required',
        });
      }
  
      // Find the user by userId
      const user = await BugData.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }
  
      // Find the index of the activity in the activities array
      const activityIndex = user.activities.findIndex(activity => activity._id.toString() === activityId);
  
      if (activityIndex === -1) {
        return res.status(404).json({
          message: 'Activity not found in the user\'s activities list',
        });
      }
  
      // Remove the activity from the activities array
      user.activities.splice(activityIndex, 1); // Splice removes the activity at the given index
  
      // Save the updated user document
      await user.save();
  
      return res.status(200).json({
        message: 'Activity deleted successfully',
        username: user.username,
        teamname: user.teamname,
        activities: user.activities,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Unable to delete activity',
        error: error.message,
      });
    }
  };



// Update csv

  export const updateCsv = async (req, res) => {
    try {
      const { userId, username, teamname } = req.body;
      const file = req.file;
  
      // Ensure userId is provided
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
      }
  
      // Find existing record by userId
      let existingData = await BugData.findById(userId);
  
      if (!existingData) {
        return res.status(404).json({
          message: 'No record found for the given user ID.',
        });
      }
  
      let updatedFields = {};
  
      // Update username if provided
      if (username) {
        updatedFields.username = username;
      }
  
      // Update teamname if provided
      if (teamname) {
        updatedFields.teamname = teamname;
      }
  
      // Process CSV file if provided
      if (file) {
        const filePath = path.join(__dirnamePath, 'upload', file.filename);
  
        try {
          await fs.access(filePath);
        } catch (err) {
          return res.status(500).json({
            message: 'CSV file not found at the expected path.',
            error: err.message,
          });
        }
  
        // Convert CSV to JSON
        const jsonData = await csv().fromFile(filePath);
        console.log('CSV Conversion Done:', jsonData);
  
        // Convert to required format
        const bugData = jsonData.map(item => ({
          bugid: item.ID,
          title: item.Title,
          severity: item.Severity,
          createdDate: item['Created Date'],
        }));
  
        updatedFields.bugs = bugData;
  
        // Delete the file after processing
        await fs.unlink(filePath);
        console.log('File deleted');
      }
  
      // Update database record
      const updatedBugData = await BugData.findByIdAndUpdate(
        userId,
        { $set: updatedFields },
        { new: true }
      );
  
      res.status(200).json({
        message: 'Data updated successfully',
        _id: updatedBugData._id,
        username: updatedBugData.username,
        teamname: updatedBugData.teamname,
        bugs: updatedBugData.bugs,
      });
    } catch (error) {
      console.error('Error during update:', error);
      res.status(500).json({
        message: 'Error updating data. Please check input fields.',
        error: error.message,
      });
    }
  };
  
  