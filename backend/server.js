//importing express library
// Express helps manage routing, middleware, and HTTP requests/responses more easily.
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";

/*
    The line dotenv.config(); is used to load environment variables from a .env file into process.env. 
    This is commonly used in Node.js applications to manage configuration settings in a way that is both secure 
    and flexible.
*/
dotenv.config();
const PORT = process.env.PORT || 8000;
//Created an Express application instance.
const app = express();

/*
    app.get("/"): This defines a route handler for GET requests to the root URL ("/"). In web development, a route is a 
    URL pattern that the server responds to. Here, "/" is the root route, meaning it's the base URL 
    (e.g., http://localhost:8000/).

    (req, res): This is a callback function that gets executed when the specified route ("/") is accessed. It takes 
    two arguments:

    req (short for request): This object contains information about the HTTP request, such as query parameters, headers, 
    and the request body.
    res (short for response): This object is used to send a response back to the client.

    res.send("Server is ready"): This line sends the string "Server is ready" as the HTTP response when the root route 
    ("/") is accessed. The send method is a simple way to send a response back to the client.

    app.get("/", (req, res) => {
        res.send("Server is ready!!");
    });

*/

app.use("/api/auth", authRoutes);

//Started the server on port 8000 and logged a message to the console.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
