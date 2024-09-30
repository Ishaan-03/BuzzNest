import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler, authMiddleware } from "./auth-routes";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/post-count", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    try {
        if (!userId) { 
            return res.status(400).json({ message: "User not found. Please login." });
        }

        const postCount = await prisma.post.count({
            where: { userId }
        });

        console.log("Post count fetched successfully:", postCount);
        res.status(200).json({ postCount });
    } catch (error) {
        console.error("Error fetching post count:", error);
        return res.status(500).json({ message: "Error fetching post count." });
    }
}));

export default router;
