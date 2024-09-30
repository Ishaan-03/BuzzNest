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
router.get("/post-count", auth_routes_1.authMiddleware, (0, auth_routes_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        if (!userId) {
            return res.status(400).json({ message: "User not found. Please login." });
        }
        const postCount = yield prisma.post.count({
            where: { userId }
        });
        console.log("Post count fetched successfully:", postCount);
        res.status(200).json({ postCount });
    }
    catch (error) {
        console.error("Error fetching post count:", error);
        return res.status(500).json({ message: "Error fetching post count." });
    }
})));
exports.default = router;
