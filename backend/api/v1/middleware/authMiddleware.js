import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization;
  console.log("middleware token", token)

  if (!token) {
    return res.status(401).json({ "error": "Unauthorized", "success": false });
  }

  try {
    console.log("before token decode")
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("after token decode")
    req.user = decoded;
    next();
  }
  catch (err) {
    return res.status(500).json({ "error": "Internal Server Error" });
  }
};

export default authMiddleware;