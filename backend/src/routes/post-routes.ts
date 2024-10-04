import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import express, { Request, Response, NextFunction } from "express";
import { asyncHandler, authMiddleware } from "./auth-routes";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Post, Prisma, PrismaClient } from "@prisma/client"; 

const router = express.Router();
const prisma = new PrismaClient(); 

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || ''
});

interface CustomParams {
    folder: string;
    resource_type: string;
}

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        resource_type: 'auto'
    } as CustomParams
});

const upload = multer({ storage: storage });

router.post(
    "/upload",
    authMiddleware, 
    upload.single('file'), 
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { content } = req.body;
            const userId = req.user?.id; 

            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded." });
            }

            if (!content) {
                return res.status(400).json({ message: "Please enter the content." });
            }

            const fileType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
            
            const postData = {
                content,
                userId: userId!, 
                imageUrl: fileType === 'image' ? req.file.path : null,
                videourl: fileType === 'video' ? req.file.path : null,
              };

            const post = await prisma.post.create({
                data: postData
            });

            res.json({
                message: "File uploaded and post created successfully.",
                post,
            });

        } catch (error) {
            next(error);
        }
    })
);

// Route to get posts created by the authenticated user
router.get("/posts/me", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
      return res.status(400).json({ message: "User not authenticated." });
  }

  try {
      const userPosts = await prisma.post.findMany({
          where: {
              userId: userId,
          },
          select: {
              id: true,
              content: true,
              imageUrl: true,
              videourl: true,
              createdAt: true,
              _count: {
                  select: {
                      likes: true,
                  },
              },
              comments: {
                  select: {
                      id: true,
                      content: true,
                      createdAt: true,
                      user: {
                          select: {
                              id: true,
                              username: true,
                              email: true,
                          },
                      },
                  },
              },
          },
          orderBy: {
              createdAt: "desc",
          },
      });

      res.status(200).json(userPosts);
  } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ message: "Internal server error" });
  }
}));


router.get(
    "/posts",
    authMiddleware,
    asyncHandler(async (req: Request, res: Response) => {
      console.log("Authenticated user:", req.user); 
      
      try {
        const posts = await prisma.post.findMany({
          select: {
            id: true,
            content: true,
            imageUrl: true,
            videourl: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
            _count: {
              select: {
                likes: true, 
              },
            },
            comments: {
              select: {
                id: true,
                content: true,
                createdAt: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
  
        console.log("Fetched posts count:", posts.length); 
        res.status(200).json(posts); 
      } catch (error) {
        console.error("Error fetching posts: ", error);
        res.status(500).json({ error: "Internal server error" });
      }
    })
  );
  


router.post(
  "/update/:postId",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { content } = req.body; 
    const userId = req.user?.id; 

    if (!postId || !content) {
      return res.status(400).json({ message: "Post ID and content are required" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ message: "You do not have permission to update this post" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { content },
    });

    return res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  })
);



router.delete(
  "/delete/:postId",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { postId } = req.params; 
      const userId = req.user?.id; 

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (post.userId !== userId) {
        return res.status(403).json({
          message: "You do not have permission to delete this post",
        });
      }

      // Delete all likes associated with the post
      await prisma.postLike.deleteMany({
        where: {
          postId: postId,
        },
      });

      // Now delete the post
      const deletedPost = await prisma.post.delete({
        where: {
          id: postId,
        },
      });

      return res.status(200).json({
        message: "Post deleted successfully",
        post: deletedPost,
      });
    } catch (error) {
      console.error("Error: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  })
);


  

router.post(
  '/post/:postId/like-unlike',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated.' });
    }

    try {
      const existingLike = await prisma.postLike.findFirst({
        where: {
          postId: postId,
          userId: userId,
        },
      });

      if (existingLike) {
        await prisma.postLike.delete({
          where: {
            id: existingLike.id,
          },
        });
        const updatedPost = await prisma.post.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } }, 
        });
        return res.status(200).json({ message: 'Post unliked.', updatedPost });
      } else {
        await prisma.postLike.create({
          data: {
            postId: postId,
            userId: userId,
          },
        });
        const updatedPost = await prisma.post.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } }, 
        });
        return res.status(200).json({ message: 'Post liked.', updatedPost });
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      return res.status(500).json({ message: 'Error processing request.' });
    }
  })
);




export default router;

