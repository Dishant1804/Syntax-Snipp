import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
const dotenvParsed = dotenv.config().parsed;
const JWT_SECRET_MIDDLEWARE = dotenvParsed.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  console.log("inside middleware");
  const token = req.cookies.token || req.headers.authorization;

  if (!token) {
    console.log("token not found")
    return res.status(401).json({ "error": "Unauthorized" , "success" : false });
  }

  try {
    console.log("before decoded")
    console.log("token : ", token)
    // console.log("dotenv : " , JWT_SECRET_MIDDLEWARE);
    console.log("secret :" , process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("after decoded");
    req.user = decoded;
    console.log("after setting token")
    next();
  } 
  catch (err) {
    return res.status(500).json({ "error": "Internal Server Error" });
  }
};

export default authMiddleware;