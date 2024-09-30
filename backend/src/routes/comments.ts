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
router.post("/comment", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;

    const result = commentValidation.safeParse(body);

    if (!result.success) {
        const { errors } = result.error;
        return res.status(400).json({
            message: "Validation error",
            errors,
        });
    }

    const { postId, userId, content } = result.data;

    const comment = await prisma.comment.create({
        data: {
            postId,
            userId,
            content,
        },
    });

    res.status(200).json({ message: "Comment saved successfully", comment });
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
