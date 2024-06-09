import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    // Extract the JWT token from the request cookies
    const token = req.cookies.jwt;

    // Check if token is missing
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No Token Provided" });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is invalid
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }

    // Find user by ID from the decoded token and exclude password field
    const user = await User.findById(decoded.userId).select("-password");

    // Check if user is not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Attach the user object to the request for further processing
    req.user = user;

    // Move to the next middleware or route handler
    next();
  } catch (err) {
    // Log any errors that occur during the middleware execution
    console.log("Error in protectRoute middleware", err.message);

    // Send a 500 Internal Server Error response if an error occurs
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
