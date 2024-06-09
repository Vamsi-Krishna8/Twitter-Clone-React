import express from "express";
import {
  getMe,
  signup,
  login,
  logout,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

/*
    This route handler responds to GET requests made to the "/signup" endpoint.
    When such a request is received, it sends a JSON response containing the message 
    "You hit the signup endpoint" back to the client.
*/
router.get("/me", protectRoute, getMe);
router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
