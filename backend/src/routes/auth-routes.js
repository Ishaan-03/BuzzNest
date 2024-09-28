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
exports.asyncHandler = void 0;
// routes/auth-controller.js
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
// Zod validation schemas
const signupValidation = zod_1.z.object({
    username: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(4).max(8)
});
const loginValidation = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(4).max(8)
});
// Async handler to wrap async routes
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.asyncHandler = asyncHandler;
// Middleware to verify JWT token and attach user to request
const authMiddleware = (0, exports.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}));
// User Signup
router.post("/signup", (0, exports.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const result = signupValidation.safeParse(body);
    if (!result.success) {
        return res.status(400).json({
            message: "Invalid request",
            errors: result.error.errors
        });
    }
    const { email, username, password } = result.data;
    const existingUser = yield prisma.user.findUnique({
        where: { email }
    });
    if (existingUser) {
        return res.status(409).json({
            message: "User already exists, please try logging in"
        });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const newUser = yield prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    });
    const token = jsonwebtoken_1.default.sign({
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
    }, JWT_SECRET, { expiresIn: "1h" });
    res.status(201).json({
        message: "User created successfully",
        token
    });
})));
// User Login
router.post("/login", (0, exports.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const result = loginValidation.safeParse(body);
    if (!result.success) {
        return res.status(400).json({
            message: "Invalid request",
            errors: result.error.errors
        });
    }
    const { email, password } = result.data;
    const user = yield prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        return res.status(404).json({
            message: "User does not exist, please sign up"
        });
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }
    const token = jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({
        message: "User logged in successfully",
        token
    });
})));
router.get("/profile", authMiddleware, (0, exports.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield prisma.user.findUnique({
        where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
        select: { id: true, username: true, email: true }
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
        message: "Profile retrieved successfully",
        user
    });
})));
// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "An unexpected error occurred",
        error: err.message
    });
});
// Handle server termination
process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("SIGTERM signal received: closing Prisma client");
    yield prisma.$disconnect();
    process.exit(0);
}));
exports.default = router;
