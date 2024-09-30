"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_routes_1 = require("./auth-routes");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// Route to follow or unfollow a user
router.post("/follow/:userId", auth_routes_1.authMiddleware, (0, auth_routes_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const followerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const followingId = req.params.userId;
    if (!followerId) {
        return res.status(400).json({ message: "User not authenticated." });
    }
    if (followerId === followingId) {
        return res.status(400).json({ message: "You cannot follow yourself." });
    }
    try {
        const existingFollow = yield prisma.follower.findUnique({
            where: {
                followerId_followingId: {
                    followerId: followerId,
                    followingId: followingId,
                },
            },
        });
        if (existingFollow) {
            yield prisma.follower.delete({
                where: {
                    id: existingFollow.id,
                },
            });
            return res.status(200).json({ message: "Unfollowed successfully." });
        }
        else {
            yield prisma.follower.create({
                data: {
                    followerId: followerId,
                    followingId: followingId,
                },
            });
            return res.status(200).json({ message: "Followed successfully." });
        }
    }
    catch (error) {
        console.error("Error following/unfollowing user:", error);
        return res.status(500).json({ message: "Error processing request." });
    }
})));
// Route to get the count of followers and following for a user
router.get("/followers-following/:userId", auth_routes_1.authMiddleware, (0, auth_routes_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        // Count the number of followers
        const followersCount = yield prisma.follower.count({
            where: {
                followingId: userId,
            },
        });
        // Count the number of users the current user is following
        const followingCount = yield prisma.follower.count({
            where: {
                followerId: userId,
            },
        });
        res.status(200).json({
            followersCount,
            followingCount,
        });
    }
    catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({ message: "Error fetching user stats" });
    }
})));
exports.default = router;
