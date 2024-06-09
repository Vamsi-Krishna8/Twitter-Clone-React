//This imports the jsonwebtoken library, which is used to create and verify JWTs.

/*

    The function takes two parameters:

        userId: The ID of the user for whom the token is being generated.
        res: The response object from Express, which will be used to set the cookie.
*/
import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });
};
