import express, { Request, Response } from "express";
import { asyncHandler, authMiddleware } from "./auth-routes";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Route to search for users by email or username
router.get("/search", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const { query } = req.query; 

    if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Invalid search query." });
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    {
                        username: {
                            contains: query,
                            mode: "insensitive", 
                        },
                    },
                    {
                        email: {
                            contains: query, 
                            mode: "insensitive", 
                        },
                    },
                ],
            },
            select: {
                id: true,
                username: true,
                email: true,
            },
        });

        res.status(200).json(users);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Internal server error." });
    }
}));

export default router;
