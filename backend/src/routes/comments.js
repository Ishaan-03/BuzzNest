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
const zod_1 = __importDefault(require("zod"));
const auth_routes_1 = require("./auth-routes");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const commentValidation = zod_1.default.object({
    postId: zod_1.default.string(),
    userId: zod_1.default.string(),
    content: zod_1.default.string(),
});
// post route to post comments
router.post("/comment", auth_routes_1.authMiddleware, (0, auth_routes_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const comment = yield prisma.comment.create({
        data: {
            postId,
            userId,
            content,
        },
    });
    res.status(200).json({ message: "Comment saved successfully", comment });
})));
// GET route to fetch comments 
router.get("/getcomments", auth_routes_1.authMiddleware, (0, auth_routes_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.query.postId;
        console.log("Requested postId:", postId);
        if (!postId) {
            return res.status(400).json({ message: "Invalid postId" });
        }
        const comments = yield prisma.comment.findMany({
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
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ message: "Error fetching comments" });
    }
})));
exports.default = router;
