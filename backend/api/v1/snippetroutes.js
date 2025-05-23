import { Router } from 'express';
const router = Router();
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import authMiddleware from './middleware/authMiddleware.js';

const prisma = new PrismaClient();

const SnippetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

router.get('/easter', (req, res) => {
  res.send("Congratulations");
})

/**
 * Create a new snippet
 */
router.post('/createsnippet', authMiddleware, SnippetLimiter, async (req, res) => {
  const { title, content, description, tags, language, isPrivate } = req.body;
  const userId = req.user.userId;

  if (!title || !content || !description) {
    return res.status(400).json({ "error": "Title, content, and description are required" });
  }

  try {
    const subscription = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!subscription || !subscription.isSubscribed) {
      const snippetCount = await prisma.snippet.count({
        where: { userId }
      });

      if (snippetCount >= 10) {
        return res.status(403).json({ "error": "Snippet limit reached. You can only create up to 10 snippets." });
      }
    }

    if (subscription && subscription.isSubscribed) {
      const snippetCount = await prisma.snippet.count({
        where: { id: userId }
      })

      if (snippetCount >= 150) {
        return res.status(403).json({ "error": "Snippet limit reached. You can only create up to 150 snippets." });
      }
    }

    const snippet = await prisma.snippet.create({
      data: {
        title: title,
        content: content,
        description: description,
        userId: userId,
        language: language,
        isPrivate: isPrivate,
        tags: {
          create: tags.map(tagName => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName }
              }
            }
          }))
        }
      }
    });

    return res.status(201).json({ "message": "Snippet created successfully", "snippet": snippet, "success": true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ "error": "Internal Server Error" });
  }
});

/**
 * Display the shareable snippet with a particular ID
 */
router.get('/sharesnippet/:id', SnippetLimiter, async (req, res) => {
  const { id } = req.params;

  try {
    const snippet = await prisma.snippet.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            username: true,
          }
        },
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    });

    if (!snippet) {
      return res.status(404).json({ "message": "Snippet not found" });
    }

    const formattedSnippet = {
      ...snippet,
      tags: snippet.tags.map(tagRelation => tagRelation.tag.name),
    };

    return res.status(200).json({ snippet: formattedSnippet });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ "error": "Internal server error" });
  }
});

/**
 * Display the snippet with a particular ID protected
 */
router.get('/displaysnippet/:id', authMiddleware, SnippetLimiter, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const subscription = await prisma.user.findUnique({
      where: { id: userId }
    });

    const snippet = await prisma.snippet.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            profileImage: true,
          }
        },
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              }
            }
          }
        }
      }
    });

    if (!snippet) {
      return res.status(404).json({ "message": "Snippet not found" });
    }

    const formattedSnippet = {
      ...snippet,
      tags: snippet.tags.map(tagRelation => tagRelation.tag.name),
    };

    return res.status(200).json({ snippet: formattedSnippet, success: true, isSubscribed: subscription.isSubscribed });
  }
  catch (e) {
    console.log(e);
    return res.status(500).json({ "error": "Internal server error" });
  }
});

/**
 * Display all snippets
 */
router.get('/displayallsnippets', authMiddleware, SnippetLimiter, async (req, res) => {
  const userId = req.user.userId;

  try {
    const subscription = await prisma.user.findUnique({
      where: { id: userId }
    });

    const allSnippets = await prisma.snippet.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
            profileImage: true,
          }
        },
        tags: {
          select: {
            tag: {
              select: {
                name: true,
              }
            }
          }
        },
        favorites: {
          where: {
            userId: userId
          }
        }
      }
    });

    if (!Array.isArray(allSnippets)) {
      return res.status(500).json({ error: "Failed to retrieve snippets" });
    }

    const formattedSnippets = allSnippets.map(snippet => ({
      ...snippet,
      tags: snippet.tags.map(tagRelation => tagRelation.tag.name),
      isFavorite: snippet.favorites.length > 0
    }));

    return res.status(200).json({ allSnippets: formattedSnippets, isSubscribed: subscription.isSubscribed })

  }
  catch (e) {
    console.log(e);
    return res.status(500).json({ "error": "Internal server error" });
  }
});

/**
 * Display user's snippets
 */
router.get('/mysnippets', authMiddleware, SnippetLimiter, async (req, res) => {
  const userId = req.user.userId;

  try {
    const subscription = await prisma.user.findUnique({
      where: { id: userId }
    });

    const userSnippets = await prisma.snippet.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            profileImage: true,
          }
        },
        tags: {
          include: {
            tag: true,
          }
        },
        favorites: {
          where: {
            userId: userId
          }
        }
      },
    });

    if (!userSnippets || userSnippets.length === 0) {
      return res.status(200).json({ message: "No snippets found for this user", snippets: [] });
    }

    const formattedSnippets = userSnippets.map(snippet => ({
      id: snippet.id,
      title: snippet.title,
      description: snippet.description,
      content: snippet.content,
      user: snippet.user,
      language: snippet.language,
      createdAt: snippet.createdAt,
      updatedAt: snippet.updatedAt,
      isPrivate: snippet.isPrivate,
      tags: snippet.tags.map(tagRelation => tagRelation.tag.name),
      isFavorite: snippet.favorites.length > 0
    }));

    return res.status(200).json({ snippets: formattedSnippets, isSubscribed: subscription.isSubscribed });
  }
  catch (e) {
    console.error(e);
    return res.status(500).json({ "error": "Internal server error" });
  }
});

/**
 * Delete user's snippets
 */
router.delete('/deletesnippet/:id', authMiddleware, SnippetLimiter, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const toDeleteSnippet = await prisma.snippet.findFirst({
      where: {
        id: id,
        userId: userId,
      }
    });

    if (!toDeleteSnippet) {
      return res.status(404).json({ "message": "Snippet not found so not deleted" });
    }

    await prisma.snippet.delete({
      where: {
        id: id,
      }
    })

    return res.status(200).json({ "message": "Snippet deleted", "success": true });
  }
  catch (e) {
    console.log(e);
    return res.status(500).json({ "error": "Internal server error" });
  }
});

/**
 * Update user's Snippets
 */
router.patch('/updatesnippet/:id', authMiddleware, SnippetLimiter, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { title, description, content, tags, language, isPrivate } = req.body;

  try {
    const subscription = await prisma.user.findUnique({
      where: { id: userId }
    });

    const toUpdateSnippet = await prisma.snippet.findFirst({
      where: {
        id: id,
        userId: userId,
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!toUpdateSnippet) {
      return res.status(404).json({ "error": "Snippet not found or you don't have permission to update it" });
    }

    const updateData = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ "error": "Title must be a non-empty string" });
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string') {
        return res.status(400).json({ "error": "Description must be a string" });
      }
      updateData.description = description.trim();
    }

    if (content !== undefined) {
      if (typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({ "error": "Content must be a non-empty string" });
      }
      updateData.content = content.trim();
    }

    if (language !== undefined) {
      if (typeof language !== 'string' || content.trim().length === 0) {
        return res.status(400).json({ "error": "Content must be a non-empty string" });
      }
      updateData.language = language.trim();
    }

    if (isPrivate !== undefined) {
      if (typeof isPrivate !== 'boolean') {
        return res.status(400).json({ "error": "isPrivate must be a boolean" });
      }
      updateData.isPrivate = isPrivate;
    }

    if (tags !== undefined) {
      if (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string' || tag.trim().length === 0)) {
        return res.status(400).json({ "error": "Tags must be an array of non-empty strings" });
      }
      updateData.tags = {
        deleteMany: {},
        create: tags.map(tagName => ({
          tag: {
            connectOrCreate: {
              where: { name: tagName.trim() },
              create: { name: tagName.trim() }
            }
          }
        }))
      };
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ "error": "No valid fields to update" });
    }

    const updatedSnippet = await prisma.snippet.update({
      where: { id: id },
      data: updateData,
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    return res.status(200).json({ message: 'Snippet updated successfully', snippet: updatedSnippet, success: true, isSubscribed: subscription.isSubscribed });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ "error": "Internal server error" });
  }
});

/**
 * Mark a snippet as favorite
 */
router.post('/favorite/:snippetId', authMiddleware, SnippetLimiter, async (req, res) => {
  const userId = req.user.userId;
  const { snippetId } = req.params;
  try {
    await prisma.favorite.create({
      data: { userId, snippetId }
    });
    return res.status(200).json({ message: 'Snippet marked as favorite' });
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(409).json({ message: 'Snippet already favorited' });
    }
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Unmark a snippet as favorite
 */
router.delete('/favorite/:snippetId', authMiddleware, SnippetLimiter, async (req, res) => {
  const userId = req.user.userId;
  const { snippetId } = req.params;
  try {
    await prisma.favorite.delete({
      where: { userId_snippetId: { userId, snippetId } }
    });
    return res.status(200).json({ message: 'Snippet removed from favorites' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Display user's favorite snippets (via Favorite model)
 */
router.get('/favoritesnippets', authMiddleware, SnippetLimiter, async (req, res) => {
  const userId = req.user.userId;
  try {
    const subscription = await prisma.user.findUnique({ where: { id: userId } });
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        snippet: {
          include: {
            user: { select: { username: true, email: true, profileImage: true } },
            tags: { include: { tag: true } }
          }
        }
      }
    });
    const formattedSnippets = favorites.map(fav => ({
      ...fav.snippet,
      tags: fav.snippet.tags.map(tagRelation => tagRelation.tag.name),
      isFavorite: true
    }));
    return res.status(200).json({ snippets: formattedSnippets, isSubscribed: subscription.isSubscribed });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;