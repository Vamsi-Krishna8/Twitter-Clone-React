import User from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    // Destructure user data from request body
    const { fullName, username, email, password } = req.body;

    // Validate email format using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    // Check if email is already registered
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    // Validate password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    // Generate salt and hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user instance
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    // Save new user to database
    await newUser.save();

    // Generate authentication token and set as cookie
    generateTokenAndSetCookie(newUser._id, res);

    // Respond with newly created user data
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      followers: newUser.followers,
      following: newUser.following,
      profileImg: newUser.profileImg,
      coverImg: newUser.coverImg,
    });
  } catch (error) {
    // Log and handle any errors
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    // Destructure the username and password from the request body
    const { username, password } = req.body;

    // Find the user in the database by their username
    const user = await User.findOne({ username });

    // Compare the provided password with the hashed password in the database
    // The optional chaining (user?.password) ensures we don't try to access password on a null or undefined user
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    // If the user doesn't exist or the password is incorrect, return an error response
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Generate a token and set it as a cookie in the response
    generateTokenAndSetCookie(user._id, res);

    // Return a success response with the user's information
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    // Log any errors that occur and return a 500 Internal Server Error response
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the JWT cookie by setting its value to an empty string and setting maxAge to 0
    res.cookie("jwt", "", { maxAge: 0 });

    // Send a success response indicating successful logout
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    // Log any errors that occur during the logout process
    console.log("Error in logout controller", error.message);

    // Send a 500 Internal Server Error response if an error occurs
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
