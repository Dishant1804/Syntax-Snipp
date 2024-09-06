const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

router.use(helmet());

const JWT_SECRET = process.env.JWT_SECRET;

const prisma = new PrismaClient();

const signInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Please try again later.",
});

router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;
  const saltRounds = 12;

  const passwordHash = await bcrypt.hash(password, saltRounds);

  try {
    await prisma.user.create({
      data: {
        username: username,
        email: email,
        passwordHash: passwordHash
      }
    });

    return res.json({"Message" : "Sign-up Successful"});
  }
  catch (e) {
    return res.status(400).json({ "error": e.message });
  }
});

router.post('/signin', signInLimiter , async(req , res) =>{
  const {email , password} = req.body;
  
  try{
    const user = await prisma.user.findUnique({
      where :{
        email : email
      },
      select : {
        id : true,
        passwordHash : true
      }
    });

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!user || !isPasswordValid) {
      return res.status(401).json({ "message": "Invalid Credentials" });
    }

    const token = JWT.sign({userId : user.id} , JWT_SECRET);
    return res.json({"message" : "Sign-in Successful" , "token" : token}); 
  }
  catch(e){
    return res.status(401).json({ "message" :"Invalid Credentials"});
  }
})

module.exports = router;