
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload, Image, Video } from "lucide-react";
import { motion } from "framer-motion";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AnimatedBackground = () => {
  const floatingCircleVariants = {
    animate: {
      y: [0, 20, 0],
      x: [0, 20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: "mirror" as const, 
      },
    },
  };

  return (
    <div className="fixed inset-0 -z-10 bg-black">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-purple-500 rounded-full opacity-20"
          style={{
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          variants={floatingCircleVariants}
          animate="animate"
        />
      ))}
    </div>
  );
};

export default function CreatePost() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [content, setContent] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setMediaType(file.type.startsWith("video/") ? "video" : "image");
    }
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!selectedFile || !content.trim()) {
      toast.error("Please select a file and enter content.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('content', content);

    try {
      const response = await axios.post('https://buzznest-thmn.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      toast.success('Post created successfully!',response.data);
      setSelectedFile(null);
      setContent("");
      setMediaType("image");
      navigate('/home'); 
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden bg-black">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-10 text-center"
      >
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
          "Share your story, inspire the world!"
        </h2>
        <p className="text-lg text-purple-300 mt-2">
          Let your thoughts take flight – upload your media ("Try posting with a ratio of 16:9 for videos and 1:1 for images.")
        </p>
      </motion.div>
      <Card className="w-full max-w-md bg-gray-800/50 backdrop-blur-md border border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.5)] p-6 rounded-lg relative z-10">
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse"
        >
        Upload A Post
        </motion.h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-purple-300 mb-2"
            >
              Choose Image or Video
            </label>
            <Input
              id="file-upload"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="bg-gray-700/50 text-purple-300 border-purple-500 focus:ring-purple-500 focus:border-purple-500"
            />
          </motion.div>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-purple-300 text-sm"
            >
              {mediaType === "image" ? (
                <Image className="inline-block mr-2" size={16} />
              ) : (
                <Video className="inline-block mr-2" size={16} />
              )}
              {selectedFile.name}
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <label
              htmlFor="content"
              className="block text-sm font-medium text-purple-300 mb-2"
            >
              Post Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={handleContentChange}
              placeholder="Write your post content here..."
              className="bg-gray-700/50 text-purple-300 border-purple-500 focus:ring-purple-500 focus:border-purple-500 h-32 placeholder-purple-400"
            />
          </motion.div>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all duration-300 ease-in-out transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Upload Post
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </Card>
    </div>
  );
}