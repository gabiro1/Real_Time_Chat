import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//sign up new user
export const signup = async (req, res) => {
    const { name, email, password, bio } = req.body;

    // Check if user already exists
    try {
        if (!name || !email || !password || !bio) {
            return res.json({ success: false, message: "Please fill all the fields" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            fullname: name,
            password: hashedPassword,
            bio,
        });

        const token = generateToken(newUser._id);

        res.json({
            success: true,
            message: "User created successfully",
            user: {
                _id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                bio: newUser.bio,
                profilePicture: newUser.profilePicture,
            },
            token,
        });
    } catch (error) {
        console.error("Error checking for existing user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userdata = await User.findOne({ email });

        if (!userdata) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const ispasswordCorrect = await bcrypt.compare(password, userdata.password);
        if (!ispasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(userdata._id);
        res.json({
            success: true,
            message: "User logged in successfully",
            user: {
              _id: userdata._id,
              email: userdata.email,
              fullname: userdata.fullname,
              bio: userdata.bio,
              profilePicture: userdata.profilePicture,
            },
            token,
          });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// check if user is authenticated 
export const checkAuth = async (req, res) => {
    try {
      const token = req.headers.token;
      if (!token) return res.status(401).json({ message: "Unauthorized" });
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ message: "Unauthorized" });
  
      res.json({
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          fullname: user.fullname,
          bio: user.bio,
          profilePicture: user.profilePicture,
        },
      });
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };

 export const UpdateProfile = async (req, res) => {
    try {
        const {profilePicture, fullname, bio} = req.body;
        const userId = req.user._id;
        let updatedUser;

        if (!profilePicture) {
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullname}, {new: true});
        }
        else{
            const uploadImage = await cloudinary.uploader.upload(profilePicture);
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullname, profilePicture: uploadImage.secure_url}, {new: true});
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            user:updatedUser
        });
        
    } catch (error) {
        console.error(error.message);
        return res.json({ success:false,message: error.message }); 
        
    }

}

