import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization;

  if (!token) {
    return res.status(401).json({ "error": "Unauthorized" , "success" : false });
  }

  try {
    console.log("above decode")
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded");
    req.user = decoded;
    next();
  } 
  catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      console.log(err);
      return res.status(401).json({ "error": "Unauthorized" });
    }
    return res.status(500).json({ "error": "Internal Server Error" });
  }
};

export default authMiddleware;