"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Upload, Image, Video } from "lucide-react";
import { motion } from "framer-motion";

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("File:", selectedFile);
    console.log("Content:", content);
    console.log("Media Type:", mediaType);
    setSelectedFile(null);
    setContent("");
    setMediaType("image");
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
          Let your thoughts take flight – upload your media 
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
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Post
            </Button>
          </motion.div>
        </form>
      </Card>
    </div>
  );
}
