import Router from 'express';
const router = Router();
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import authMiddleware from './middleware/authMiddleware.js';

const prisma = new PrismaClient();

const SnippetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

router.post('/createsnippet', authMiddleware, SnippetLimiter, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ "error": "Title and content are required" });
  }

  try {
    const snippet = await prisma.snippet.create({
      data: {
        title: title,
        content: content,
        userId: req.user.userId
      }
    });

    res.status(201).json({ "message": "Snippet created successfully", "snippet": snippet });
  } 
  catch (e) {
    console.log(e);
    res.status(500).json({ "error": "Internal Server Error" });
  }
});

router.get('/displaysnippet/:id' , authMiddleware , SnippetLimiter ,  async(req , res) =>{
  const { id } = req.params;
  const snippet = await prisma.snippet.findUnique({
    where :{
      userId : req.user.userId,
    }
  })
});

export default router;