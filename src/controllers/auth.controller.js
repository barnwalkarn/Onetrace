import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import LoginData from '../models/auth.model.js'; // Adjust the path as needed



const JWT_SECRET_KEY = 'your-secret-key';

export const registerUser = async (req, res) => {
  const { username, password,code } = req.body;

  try {

    if(!code){

        return res.status(400).json({
            message:"Please enter code"
        })

    }
    
    if(code!=="098765"){

        return res.status(400).json({
            message:"Please enter correct code to create user"
        })
    }
    // Validate if username and password are provided
    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required',
      });
    }

    // Check if the username already exists in the database
    const existingUser = await LoginData.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: 'Username already exists, please choose another one.',
      });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user with hashed password
    const newUser = new LoginData({
      username,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      JWT_SECRET_KEY,
      { expiresIn: '1h' } // Token will expire in 1 hour
    );

    // Return a success message and the JWT token
    return res.status(201).json({
      message: 'User registered successfully!',
      username: newUser.username,
      token: token, // Send the JWT token to the client
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Server error, please try again later.',
      error: error.message,
    });
  }
};

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if username is provided
    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required',
      });
    }

    // Find the admin by username
    const admin = await LoginData.findOne({ username });

    if (!admin) {
      return res.status(400).json({
        message: 'Invalid username or password',
      });
    }

    // Compare the hashed password with the provided password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid username or password',
      });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: admin._id, username: admin.username }, 'yourSecretKey', {
      expiresIn: '1h', // Expiration time, can be adjusted as needed
    });

    // Send token as response
    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error, please try again later.',
      error: error.message,
    });
  }
};


export const logoutAdmin = (req, res) => {
    // Invalidate the token on client-side (this will be handled by the front-end)
    res.status(200).json({
      message: 'Logged out successfully',
    });
  };
  