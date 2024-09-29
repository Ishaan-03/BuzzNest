import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import express, { Request, Response, NextFunction } from "express";
import { asyncHandler, authMiddleware } from "./auth-routes";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { PrismaClient } from "@prisma/client"; 

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
  
  router.post("/update", authMiddleware, asyncHandler(async (req: Request, res: Response) => {
    const { postId, content } = req.body;
    const userId = req.user?.id;

    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    });

    if (!post) {
        return res.status(404).send("Post not found");
    }

    if (post.userId !== userId) {
        return res.status(403).json({ message: "You do not have permission to update this post" });
    }

    const updatedPost = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            content
        }
    });

    res.status(200).json({
        message: "Post updated successfully",
        post: updatedPost
    });
}));
router.delete("/delete",authMiddleware, asyncHandler(async(req: Request ,res: Response)=> {
 try {
   const {postId} = req.body; 
   const userId = req.user?.id; 
 
   const post=  await prisma.post.findUnique({
     where: {
       id : postId
     }
   })
   if(!post){
     return res.status(404).send("Post not found");
   }
   if(post.userId !== userId){
     return res.status(403).json({message: "You do not have permission to delete this post"});
   }
   const deletedPost = await prisma.post.delete({
     where: {
       id: postId
     }
   });
   res.status(200).json({
     message: "Post deleted successfully",
     post: deletedPost
   });
 } catch (error) {
  console.error("error: ", Error)
  return error
 }
}))
  
  

export default router;

