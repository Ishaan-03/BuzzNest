"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Zap, TrendingUp, Calendar, Music, Film, Send, Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FaUserCircle } from "react-icons/fa"

interface Post {
  id: number
  likes: number
  isLiked: boolean
  comments: Comment[]
  showComments: boolean
}

interface Comment {
  id: number
  username: string
  content: string
  createdAt: Date
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>(
    Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      likes: Math.floor(Math.random() * 100),
      isLiked: false,
      showComments: false,
      comments: [
        {
          id: 1,
          username: `User${Math.floor(Math.random() * 100)}`,
          content: "Great post! Love the content.",
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
        },
        {
          id: 2,
          username: `User${Math.floor(Math.random() * 100)}`,
          content: "Thanks for sharing this!",
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000))
        }
      ]
    }))
  )

  const [newComments, setNewComments] = useState<{ [key: number]: string }>({})
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleLike = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    )
  }

  const toggleComments = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, showComments: !post.showComments }
          : post
      )
    )
  }

  const handleCommentChange = (postId: number, content: string) => {
    setNewComments((prev) => ({ ...prev, [postId]: content }))
  }

  const handleCommentSubmit = (postId: number) => {
    if (!newComments[postId]?.trim()) return

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: post.comments.length + 1,
                  username: "CurrentUser",
                  content: newComments[postId].trim(),
                  createdAt: new Date()
                }
              ]
            }
          : post
      )
    )
    setNewComments((prev) => ({ ...prev, [postId]: "" }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
    setSearchQuery("")
    setShowSearch(false)
  }

  return (
    <ScrollArea className="h-screen">
      <div className="min-h-screen bg-black text-white">
        <nav className="sticky top-0 z-10 flex items-center justify-between p-4 border-b-2 border-purple-500 shadow-[0_4px_12px_rgba(168,85,247,0.5)] bg-black">
          <motion.div
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-cyan-400 shadow-lg shadow-cyan-400/50"
            whileHover={{ scale: 1.2 }}
            transition={{ duration: 0.3 }}
          >
            <FaUserCircle className="w-8 h-8 text-cyan-400" />
          </motion.div>
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            <span className="text-xl font-bold text-yellow-400 animate-pulse">Ishaan Saxena</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full"
            onClick={() => setShowSearch(true)}
          >
            <Search className="w-6 h-6 text-cyan-400" />
          </Button>
        </nav>

        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            >
              <div className="w-full max-w-2xl px-4">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder="Search user by username or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-16 pl-6 pr-16 text-lg bg-gray-900 border-2 border-purple-500 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-500 hover:bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center"
                  >
                    <Search className="w-6 h-6" />
                  </Button>
                </form>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full absolute top-4 right-4 text-black bg-white hover:text-gray-300"
                  onClick={() => setShowSearch(false)}
                >
                  <X className="w-6 h-6 bg-black" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center">
          {/* Main Content */}
          <main className="w-full lg:w-2/3 py-8 px-4 max-w-3xl">
            <motion.div
              className="grid gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, staggerChildren: 0.2 }}
            >
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  className="bg-gray-900 border-2 rounded-2xl border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] overflow-hidden"
                  whileHover={{ scale: 1.03, shadow: "0 0 25px rgba(168,85,247,0.5)" }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-transparent">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <Avatar>
                        <AvatarImage src={`https://i.pinimg.com/736x/a1/e0/07/a1e0079cef2bdcb59eeeb436bf80a9ec.jpg?text=U${post.id}&background=random`} alt={`User ${post.id} avatar`} />
                        <AvatarFallback>U{post.id}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-lg font-semibold text-cyan-400">User{post.id}</p>
                        <p className="text-xs text-gray-400">2 hours ago</p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="aspect-square w-full overflow-hidden rounded-lg border border-purple-500">
                        <img
                          src={`https://i.pinimg.com/736x/41/ba/c2/41bac2c45b603309032a3be7d36308b7.jpg?width=600&height=600&text=Post+${post.id}`}
                          alt={`Post ${post.id}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-300">
                        This is the content of post {post.id}. It's a beautiful day to share amazing moments with friends!
                        #SocialLife #Memories
                      </p>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start pt-2 space-y-4">
                      <div className="flex justify-between w-full">
                        <div className="flex flex-col items-center">
                          <Button 
                            variant="ghost" 
                            className={`text-pink-500 hover:text-pink-400 hover:bg-pink-500/10 transition-all duration-300 ${
                              post.isLiked ? 'text-red-500' : ''
                            }`}
                            onClick={() => handleLike(post.id)}
                          >
                            <Heart className={`w-5 h-5 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                            <span className="font-semibold">Like</span>
                          </Button>
                          <AnimatePresence>
                            <motion.span
                              key={post.likes}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.3 }}
                              className="text-sm text-gray-400 mt-1"
                            >
                              {post.likes} likes
                            </motion.span>
                          </AnimatePresence>
                        </div>
                        <Button 
                          variant="ghost" 
                          className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300"
                          onClick={() => toggleComments(post.id)}
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          <span className="font-semibold">Comment</span>
                        </Button>
                      </div>
                      
                      {/* Comment Section */}
                      <AnimatePresence>
                        {post.showComments && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full space-y-4 overflow-hidden"
                          >
                            <h3 className="text-lg font-semibold text-cyan-400">Comments</h3>
                            <ScrollArea className="h-48 w-full rounded-md border border-purple-500 p-4">
                              {post.comments.map((comment) => (
                                <div key={comment.id} className="mb-4 last:mb-0">
                                  <div className="flex items-center space-x-2">
                                    <Avatar className="w-6 h-6">
                                      <AvatarFallback>{comment.username[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-cyan-400">{comment.username}</span>
                                    <span className="text-xs text-gray-400">
                                      {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-300">{comment.content}</p>
                                </div>
                              ))}
                            </ScrollArea>
                            <div className="flex space-x-2">
                              <Textarea
                                placeholder="Add a comment..."
                                value={newComments[post.id] || ""}
                                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                className="flex-grow bg-gray-800 border-purple-500 text-white"
                              />
                              <Button
                                onClick={() => handleCommentSubmit(post.id)}
                                className="bg-purple-500 hover:bg-purple-600"
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Post
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </main>

          {/* Right Sidebar - visible on lg screens and above, now with ScrollArea */}
          <aside className="hidden lg:block w-1/3 sticky top-[72px] h-[calc(100vh-72px)]">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6 p-4 border-l border-purple-500">
                <Card className="bg-gray-900 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <CardHeader>
                    <h2 className="text-xl font-bold text-cyan-400 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" /> Trending Topics
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {['#TechTalk', '#ArtisticVibes', '#FoodieFriday', '#FitnessFun', '#TravelDreams'].map((topic, index) => (
                        <li key={index} className="text-gray-300 hover:text-white cursor-pointer transition-colors duration-200">
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <CardHeader>
                    <h2 className="text-xl font-bold text-cyan-400 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" /> Upcoming Events
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="text-gray-300">Tech Meetup - June 15</li>
                      <li className="text-gray-300">Art Exhibition - June 20</li>
                      <li className="text-gray-300">Food Festival - June 25</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <CardHeader>
                    <h2 className="text-xl font-bold text-cyan-400 flex items-center">
                      <Music className="w-5 h-5 mr-2" /> Popular Music
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="text-gray-300">1. "Neon Lights" - The Glow</li>
                      <li className="text-gray-300">2. "Midnight Drive" - Luna</li>
                      <li className="text-gray-300">3. "Electric Dreams" - Synth Wave</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <CardHeader>
                    <h2 className="text-xl font-bold text-cyan-400 flex items-center">
                      <Film className="w-5 h-5 mr-2" /> Movie Recommendations
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="text-gray-300">1. "Neon Noir"</li>
                      <li className="text-gray-300">2. "Cyber City"</li>
                      <li className="text-gray-300">3. "Digital Dreamscape"</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </aside>
        </div>
      </div>
    </ScrollArea>
  )
}