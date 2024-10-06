import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import z from "zod";
import { asyncHandler, authMiddleware } from "./auth-routes";

const router = express.Router();
const prisma = new PrismaClient();

const commentValidation = z.object({
    postId: z.string(),
    userId: z.string(),
    content: z.string(),
});
// post route to post comments
router.post('/comments/:postId', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const { content } = req.body;
    const userId = req.user?.id;
    const { postId } = req.params;

    if (!userId) {
        return res.status(401).json({ error: 'User is not authenticated' });
    }

    const input = commentValidation.safeParse({ postId, userId, content });
    
    if (!input.success) {
        return res.status(400).json({ error: "Invalid input", issues: input.error.issues });
    }
    
    try {
        const newComment = await prisma.comment.create({
            data: {
                postId,
                userId,
                content,
            },
        });
    
        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create comment' });
    }
}));


router.post('/comments', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const { postId, content } = req.body;
    const userId = req.user?.id; 
    
    // Validate input
    if (!postId || !content) {
      return res.status(400).json({ error: 'Post ID and content are required' });
    }
    
    if (!userId) {
      return res.status(401).json({ error: 'User is not authenticated' });
    }
    
    try {
      const newComment = await prisma.comment.create({
        data: {
          postId,
          userId, 
          content,
        },
      });
    
      res.status(201).json(newComment);  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create comment' });
    }
}));





// GET route to fetch comments 
router.get("/getcomments", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    try {
        const postId = req.query.postId as string;

        console.log("Requested postId:", postId); 

        if (!postId) {
            return res.status(400).json({ message: "Invalid postId" });
        }

        const comments = await prisma.comment.findMany({
            where: {
                postId: postId,
            },
            select: {
                content: true,
                userId: true,
                createdAt: true,
            },
        });

        console.log("Fetched comments:", comments); 

        if (comments.length === 0) {
            console.log("No comments found for this postId."); 
        }

        res.status(200).json({ comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ message: "Error fetching comments" });
    }
}));




export default router;
