// routes/auth-controller.js
import express, { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

// Zod validation schemas
const signupValidation = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(4).max(8)
});

const loginValidation = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(8)
});

// Async handler to wrap async routes
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Middleware to verify JWT token and attach user to request
const authMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string, email: string , username :string; };
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

// User Signup
router.post(
  "/signup",
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const result = signupValidation.safeParse(body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request",
        errors: result.error.errors
      });
    }

    const { email, username, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists, please try logging in"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
      },
      JWT_SECRET,
      { expiresIn: "1h" } 
    );

    res.status(201).json({
      message: "User created successfully",
      token 
    });
  })
);

// User Login
router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const result = loginValidation.safeParse(body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid request",
        errors: result.error.errors
      });
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        message: "User does not exist, please sign up"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: "1h" } 
    );

    res.status(200).json({
      message: "User logged in successfully",
      token 
    });
  })
);

router.get(
  "/profile",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { id: true, username : true, email: true } 
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile retrieved successfully",
      user
    });
  })
);

// Error handling middleware
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: "An unexpected error occurred",
    error: err.message
  });
});

// Handle server termination
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing Prisma client");
  await prisma.$disconnect();
  process.exit(0);
});

export default router;
export { authMiddleware };
