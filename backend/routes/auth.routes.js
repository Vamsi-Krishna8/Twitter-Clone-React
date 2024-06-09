import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
const router = express.Router();

/*
    This route handler responds to GET requests made to the "/signup" endpoint.
    When such a request is received, it sends a JSON response containing the message 
    "You hit the signup endpoint" back to the client.
*/
router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
