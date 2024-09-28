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
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("./auth-routes");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || ''
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
    params: {
        folder: 'uploads',
        resource_type: 'auto'
    }
});
const upload = (0, multer_1.default)({ storage: storage });
router.post("/upload", auth_routes_1.authMiddleware, upload.single('file'), (0, auth_routes_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { content } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        if (!content) {
            return res.status(400).json({ message: "Please enter the content." });
        }
        const fileType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
        const postData = {
            content,
            userId: userId,
            imageUrl: fileType === 'image' ? req.file.path : null,
            videourl: fileType === 'video' ? req.file.path : null,
        };
        const post = yield prisma.post.create({
            data: postData
        });
        res.json({
            message: "File uploaded and post created successfully.",
            post,
        });
    }
    catch (error) {
        next(error);
    }
})));
exports.default = router;
