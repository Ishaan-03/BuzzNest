import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler, authMiddleware } from "./auth-routes";

const router = express.Router();
const prisma = new PrismaClient();

// Route to follow or unfollow a user
router.post("/follow/:userId", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const followerId = req.user?.id; 
    const followingId = req.params.userId;

    if (!followerId) {
        return res.status(400).json({ message: "User not authenticated." });
    }

    if (followerId === followingId) {
        return res.status(400).json({ message: "You cannot follow yourself." });
    }

    try {
        const existingFollow = await prisma.follower.findUnique({
            where: {
                followerId_followingId: {
                    followerId: followerId,
                    followingId: followingId,
                },
            },
        });

        if (existingFollow) {
            await prisma.follower.delete({
                where: {
                    id: existingFollow.id,
                },
            });
            return res.status(200).json({ message: "Unfollowed successfully." });
        } else {
            await prisma.follower.create({
                data: {
                    followerId: followerId,
                    followingId: followingId,
                },
            });
            return res.status(200).json({ message: "Followed successfully." });
        }
    } catch (error) {
        console.error("Error following/unfollowing user:", error);
        return res.status(500).json({ message: "Error processing request." });
    }
}));

// Route to get the count of followers and following for a user
router.get("/followers-following/:userId", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;

    try {
        // Count the number of followers
        const followersCount = await prisma.follower.count({
            where: {
                followingId: userId,
            },
        });

        // Count the number of users the current user is following
        const followingCount = await prisma.follower.count({
            where: {
                followerId: userId,
            },
        });

        res.status(200).json({
            followersCount,
            followingCount,
        });
    } catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({ message: "Error fetching user stats" });
    }
}));

export default router;
