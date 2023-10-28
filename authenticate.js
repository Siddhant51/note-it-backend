const jwt = require("jsonwebtoken");
const { User } = require("./schema");

const requireAuth = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Authorization token is missing" });
  }

  try {
    console.log(token);
    const secretKey = "mysecretkey"; // Replace with your secret key
    const decoded = jwt.verify(token, secretKey);

    console.log(decoded);
    // The user data is limited to what's in the token
    const userId = decoded.userId;

    // Here, you can make a database query to fetch the complete user data using the userId
    try {
      const user = await User.findById(userId);
      console.log("User found", user);

      // Now you have access to the complete user data
      const userData = {
        id: user._id,
        username: user.username,
        email: user.email,
        theme: user.theme,
      };

      // Attach the user data to the request for further processing in your route
      req.user = userData;
    } catch (error) {
      return res.status(401).json({ error: "Error while fetching data" });
    }
    console.log("authenticated");
    next();
  } catch (err) {
    return res.status(401).json({ error: err });
  }
};

module.exports = {
  requireAuth,
};
