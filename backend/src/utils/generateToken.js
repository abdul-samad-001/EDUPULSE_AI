const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  console.log("JWT Secret:", process.env.JWT_SECRET);

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = generateToken;