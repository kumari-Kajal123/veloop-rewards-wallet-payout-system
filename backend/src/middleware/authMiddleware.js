// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         message: "Authentication required",
//       });
//     }

//     console.error("JWT verification error:", error.name, error.message);

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     req.user = decoded;

//     console.error("JWT verification error:", error.name, error.message);

//     next();
// } catch (error) {
//   console.error("JWT verification error:", error.name, error.message);

//   return res.status(401).json({
//     message: "Invalid or expired token",
//   });
// }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("Wallet API hit:", req.originalUrl);
console.log("Authorization header present:", !!authHeader);
console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Authorization header missing or invalid format");
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      "JWT verification error:",
      error.name,
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
