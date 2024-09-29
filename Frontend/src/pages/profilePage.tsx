import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Grid, Users, MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

const user = {
  username: "Ishaan Saxena",
  followersCount: 1200,
  followingCount: 3800,
  postsCount: 42,
};

const posts = [
  {
    id: 1,
    imageUrl: "https://i.pinimg.com/564x/23/6e/5a/236e5af3426b5e01ac1e6948712721a7.jpg",
    content: "Beautiful sunset at the beach.",
  },
  {
    id: 2,
    imageUrl: "https://i.pinimg.com/564x/5e/d1/f1/5ed1f18c7164c84de81d95218dc9f72b.jpg",
    content: "A glimpse of my digital art.",
  },
  {
    id: 3,
    imageUrl: "https://i.pinimg.com/564x/2b/3f/4c/2b3f4c4649b6e084fd0be8ce620a64a9.jpg",
    content: "Exploring the beauty of nature.",
  },
  {
    id: 4,
    imageUrl: "https://i.pinimg.com/564x/3a/52/2c/3a522c27f27d96a0926b11d7a0ae0cde.jpg",
    content: "Creating magic with colors.",
  },
  {
    id: 5,
    imageUrl: "https://i.pinimg.com/564x/8b/43/01/8b4301c5436adaf8224d92e8af0593b6.jpg",
    content: "A moment of creativity.",
  },
  {
    id: 6,
    imageUrl: "https://i.pinimg.com/564x/de/7a/8e/de7a8ea5357306e38cf8eaa5db8343dd.jpg",
    content: "Art is my escape.",
  },
  {
    id: 7,
    imageUrl: "https://i.pinimg.com/564x/8c/0a/60/8c0a606d504275bd3e7d1aafc8ccfcbd.jpg",
    content: "Capturing life's beautiful moments.",
  },
];

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}

export default function UserProfile() {
  const [selectedPost, setSelectedPost] = useState(null);

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-600 rounded-full filter blur-[100px] opacity-20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-cyan-400 rounded-full filter blur-[100px] opacity-20"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
        />
      </div>

      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        <motion.div
          className="flex items-center space-x-6 bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg"
          whileHover={{ scale: 1.05 }}
        >
          <Avatar className="w-28 h-28 border-4 border-purple-500 shadow-lg shadow-purple-500/50">
            <AvatarImage src="/placeholder-avatar.jpg" alt="@username" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
              @{user.username}
            </h1>
            <p className="text-gray-400 text-lg">Digital Artist & Web Developer</p>
          </div>
        </motion.div>

        <Card className="bg-gray-900 border-gray-800 shadow-lg shadow-cyan-500/20">
          <CardContent className="p-6">
            <div className="flex justify-around text-center">
              <StatCard
                icon={<Grid className="w-12 h-12 text-cyan-400" />}
                value={user.postsCount}
                label="Posts"
              />
              <StatCard
                icon={<Users className="w-12 h-12 text-pink-400" />}
                value={user.followersCount}
                label="Followers"
              />
              <StatCard
                icon={<MessageSquare className="w-12 h-12 text-yellow-400" />}
                value={user.followingCount}
                label="Following"
              />
            </div>
          </CardContent>
        </Card>

        <ScrollArea className="h-96 max-h-96 overflow-hidden border border-gray-700 rounded-lg">
          <motion.div
            className="grid grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {posts.map((post) => (
              <motion.div
                key={post.id}
                className="aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-shadow duration-300"
                whileHover={{ scale: 1.1 }}
                onClick={() => handlePostClick(post)}
              >
                <img
                  src={post.imageUrl}
                  alt={`Post ${post.id}`}
                  className="w-full h-full object-cover object-center" // Ensures the image is centered and not cropped
                />
              </motion.div>
            ))}
          </motion.div>
        </ScrollArea>

        <AnimatePresence>
          {selectedPost && (
            <PostModal post={selectedPost} closeModal={closeModal} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <motion.div
      className="space-y-2 group"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {icon}
      <p className="text-3xl font-bold text-cyan-400">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
    </motion.div>
  );
}

// Modal Component for Post
function PostModal({ post, closeModal }: { post: any; closeModal: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-black p-6 rounded-lg shadow-xl border border-gray-700 max-w-lg w-full relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <button onClick={closeModal} className="absolute top-2 right-2">
          <X className="w-6 h-6 text-gray-400 hover:text-gray-200" />
        </button>
        <div className="space-y-4">
          <img
            src={post.imageUrl}
            alt={`Post ${post.id}`}
            className="w-full h-auto max-h-[70vh] object-contain rounded-lg" 
          />
          <p className="text-white text-lg">{post.content}</p> 
          <div className="flex justify-between mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
              Update
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

