const jwt = require("jsonwebtoken");
const { User } = require("./schema");

const requireAuth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Authorization token is missing" });
  }

  try {
    console.log(token);
    const secretKey = "mysecretkey"; // Replace with your secret key
    const decoded = jwt.verify(token, secretKey);

    console.log("2");
    // The user data is limited to what's in the token
    const userId = decoded.userId;

    // Here, you can make a database query to fetch the complete user data using the userId
    User.findById(userId, (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: "User not found" });
      }

      // Now you have access to the complete user data
      const userData = {
        id: user._id,
        username: user.username,
        email: user.email,
        theme: user.theme,
      };

      // Attach the user data to the request for further processing in your route
      req.user = userData;

      next();
    });
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = {
  requireAuth,
};
