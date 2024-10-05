
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Zap, TrendingUp, Calendar, Music, Film, Send, Search, X, Upload } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { FaUserCircle } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { toast } from "react-hot-toast"

interface User {
  id: string
  username: string
  email: string
  isFollowing?: boolean
}

interface Comment {
  id: string
  content: string
  userId: string
  createdAt: string
  user: User
}

interface Post {
  id: string
  content: string
  imageUrl: string | null
  videourl: string | null
  createdAt: string
  user: User
  _count: {
    likes: number
  }
  comments: Comment[]
  liked?: boolean
  showComments?: boolean
}

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({})
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
    fetchCurrentUser()
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get<User>('/profile')
      setCurrentUser(response.data)
    } catch (error) {
      console.error('Error fetching current user:', error)
      toast.error('Failed to fetch user profile')
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await api.get<Post[]>('/posts')
      setPosts(response.data.map(post => ({ ...post, showComments: false })))
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('Failed to fetch posts')
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const response = await api.post(`/post/${postId}/like-unlike`)
      const updatedPost = response.data.updatedPost
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === postId 
          ? { ...post, _count: { likes: updatedPost.likesCount }, liked: !post.liked }
          : post
      ))
      toast.success(response.data.message)
    } catch (error) {
      console.error('Error liking/unliking post:', error)
      toast.error('Failed to like/unlike post')
    }
  }

  const toggleComments = (postId: string) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId ? { ...post, showComments: !post.showComments } : post
    ))
  }

  const handleCommentChange = (postId: string, content: string) => {
    setNewComments(prev => ({ ...prev, [postId]: content }))
  }

  const handleCommentSubmit = async (postId: string) => {
    if (!newComments[postId]?.trim()) return

    try {
      const response = await api.post('/comment', {
        postId,
        content: newComments[postId].trim()
      })
      
      setPosts(prevPosts => prevPosts.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, response.data.comment] }
          : post
      ))
      setNewComments(prev => ({ ...prev, [postId]: '' }))
      toast.success('Comment added successfully')
    } catch (error) {
      console.error('Error posting comment:', error)
      toast.error('Failed to add comment')
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      const response = await api.get<User[]>(`/search?query=${searchQuery}`)
      setSearchResults(response.data)
    } catch (error) {
      console.error('Error searching users:', error)
      toast.error('Failed to search users')
    }
  }

  const handleFollow = async (userId: string) => {
    try {
      const response = await api.post(`/follow/${userId}`)
      toast.success(response.data.message)
      setSearchResults(prevResults => 
        prevResults.map(user => 
          user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
        )
      )
    } catch (error) {
      console.error('Error following/unfollowing user:', error)
      toast.error('Failed to follow/unfollow user')
    }
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
            <FaUserCircle onClick={() => navigate("/profile")} className="w-8 h-8 text-cyan-400" />
          </motion.div>
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            <span className="text-xl font-bold text-yellow-400 animate-pulse">
              BuzzNest
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={() => navigate("/post")}
            >
              <Upload className="w-6 h-6 text-cyan-400" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full"
              onClick={() => setShowSearch(true)}
            >
              <Search className="w-6 h-6 text-cyan-400" />
            </Button>
          </div>
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
                {searchResults.length > 0 && (
                  <div className="mt-4 bg-gray-900 rounded-lg p-4">
                    {searchResults.map(user => (
                      <div key={user.id} className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-cyan-400">{user.username}</p>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                        <Button
                          onClick={() => handleFollow(user.id)}
                          className={user.isFollowing ? "bg-red-500 hover:bg-red-600" : "bg-purple-500 hover:bg-purple-600"}
                        >
                          {user.isFollowing ? 'Unfollow' : 'Follow'}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
                        <AvatarImage src={`https://i.pinimg.com/564x/45/e1/fd/45e1fd15b05a84174098254d21181410.jpg`} alt={`${post.user.username} avatar`} />
                        <AvatarFallback>{post.user.username[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-lg font-semibold text-cyan-400">{post.user.username}</p>
                        <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {post.imageUrl && (
                        <div className="aspect-square w-full overflow-hidden rounded-lg border border-purple-500">
                          <img
                            src={post.imageUrl}
                            alt={`Post by ${post.user.username}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      {post.videourl && (
                        <div className="aspect-video w-full overflow-hidden rounded-lg border border-purple-500">
                          <video src={post.videourl} controls className="w-full h-full object-cover" />
                        </div>
                      )}
                      <p className="text-sm text-gray-300">{post.content}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start pt-2 space-y-4">
                      <div className="flex justify-between w-full">
                        <div className="flex flex-col items-center">
                          <Button 
                            variant="ghost" 
                            className={`text-pink-500 hover:text-pink-400 hover:bg-pink-500/10 transition-all duration-300 ${
                              post.liked ? 'text-red-500' : ''
                            }`}
                            onClick={() => handleLike(post.id)}
                          >
                            <Heart className={`w-5 h-5 mr-2 ${post.liked ? 'fill-current' : ''}`} />
                            <span className="font-semibold">Like</span>
                          </Button>
                          <AnimatePresence>
                            <motion.span
                              key={post._count.likes}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.3 }}
                              className="text-sm text-gray-400 mt-1"
                            >
                              {post._count.likes} likes
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
                                      <AvatarFallback>{comment.user.username[0]}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-cyan-400">{comment.user.username}</span>
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

          {/* Right Sidebar - visible on lg screens and above */}
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
                      {['#AIinMarketing', '#DiwaliVibes', '#MetaVerse', '#MentalHealthAwareness', '#CryptoGaming ','#ShareYourTravelDestinations'].map((topic, index) => (
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
                  <li className="text-gray-300">Dua Lipa - Feeding India Concert - November 30, 2024</li>
                  <li className="text-gray-300">Diljit Dosanjh - "Dil-Luminati" tour - Dates yet to be announced</li>
                   <li className="text-gray-300">Karan Aujla - "It Was All a Dream" tour - Jaipur (December 29, 2024)</li>
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
                      <li className="text-gray-300">1. "Shit Talk" by Karan Aujla:</li>
                      <li className="text-gray-300">2. "Lover" by Diljit Dosanjh</li>
                      <li className="text-gray-300">3. "Espresso" by Sabrina Carpenter</li>
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
                      <li className="text-gray-300">1. 3 Idiots (2009)</li>
                      <li className="text-gray-300">2. Zindagi Na Milegi Dobara (2011)</li>
                      <li className="text-gray-300">3. The Shawshank Redemption (1994)</li>
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