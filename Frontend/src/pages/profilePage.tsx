import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Grid, Heart, Loader, MessageCircle, Pencil, Trash2, Users } from "lucide-react"
import axios from 'axios'
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from '@/components/ui/skeleton'

interface User {
  id: string
  username: string
  email: string
}

interface Comment {
  id: string
  content: string
  userId: string
  createdAt: string
  user: {
    id: string
    username: string
    email: string
  }
}

interface Post {
  id: string
  content: string
  imageUrl: string
  videourl: string
  createdAt: string
  _count: {
    likes: number
  }
  likes: number
  comments: Comment[]
  liked?: boolean
  likesCount: number
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

const useUserData = () => {
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get<{ user: User }>('/profile')
        setUserData(response.data.user)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('Failed to fetch user data')
        toast.error('Failed to fetch user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  return { userData, loading, error }
}

const useUserStats = (userId: string | undefined) => {
  const [stats, setStats] = useState({ postCount: 0, followersCount: 0, followingCount: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) return
      try {
        const [postCountResponse, followersResponse] = await Promise.all([
          api.get<{ postCount: number }>('/post-count'),
          api.get<{ followersCount: number, followingCount: number }>(`/followers-following/${userId}`)
        ])
        setStats({
          postCount: postCountResponse.data.postCount,
          followersCount: followersResponse.data.followersCount,
          followingCount: followersResponse.data.followingCount
        })
      } catch (error) {
        console.error('Error fetching user stats:', error)
        setError('Failed to fetch user stats')
        toast.error('Failed to fetch user stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  return { stats, loading, error }
}

const useUserPosts = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get<Post[]>('/posts/me')
        setPosts(response.data)
      } catch (error) {
        console.error('Error fetching user posts:', error)
        setError('Failed to fetch user posts')
        toast.error('Failed to fetch user posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return { posts, setPosts, loading, error }
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { userData, loading: userLoading, error: userError } = useUserData()
  const { stats, loading: statsLoading, error: statsError } = useUserStats(userData?.id)
  const { posts, setPosts, loading: postsLoading, error: postsError } = useUserPosts()
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (!userLoading && !userData) {
      navigate('/login')
    }
  }, [userLoading, userData, navigate])

  if (userLoading || statsLoading || postsLoading) {
    return (
      <motion.div 
        className="flex justify-center items-center h-screen text-neon-green"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Loader/>
      </motion.div>
    )
  }

  if (userError || statsError || postsError) {
    return (
      <motion.div 
        className="flex justify-center items-center h-screen text-neon-red"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-4xl">An error occurred. Please try again later.</div>
      </motion.div>
    )
  }

  if (!userData) {
    return null
  }

  const handleLike = async (postId: string) => {
    try {
      const response = await api.post(`/post/${postId}/like-unlike`)
      const updatedPostData = response.data.updatedPost

      const updatedPosts = posts.map(post =>
        post.id === postId
          ? { 
              ...post, 
              likesCount: updatedPostData.likesCount,
              liked: !post.liked 
            }
          : post
      )
      setPosts(updatedPosts)

      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({
          ...selectedPost,
          likesCount: updatedPostData.likesCount,
          liked: !selectedPost.liked,
        })
      }

      toast.success(
        selectedPost?.liked ? 'Post unliked successfully' : 'Post liked successfully'
      )
    } catch (error) {
      console.error('Error liking/unliking post:', error)
      toast.error('Failed to like/unlike post')
    }
  }

  const handleComment = async (postId: string) => {
    try {
      await api.post('/comments', {
        postId,
        userId: userData.id,
        content: comment
      })
      setComment('')
      if (selectedPost) {
        const updatedPost = { ...selectedPost }
        updatedPost.comments = [...updatedPost.comments, { id: Date.now().toString(), content: comment, userId: userData.id, createdAt: new Date().toISOString(), user: userData }]
        setSelectedPost(updatedPost)
        const updatedPosts = posts.map(post => post.id === postId ? updatedPost : post)
        setPosts(updatedPosts)
      }
      toast.success('Comment added successfully')
    } catch (error) {
      console.error('Error posting comment:', error)
      toast.error('Failed to add comment')
    }
  }

  const handleUpdate = (postId: string) => {
    navigate(`/updatePost/${postId}`)
  }

  const handleDelete = async (postId: string) => {
    try {
      await api.delete(`/delete/${postId}`)
      const updatedPosts = posts.filter(post => post.id !== postId)
      setPosts(updatedPosts)
      setSelectedPost(null)
      toast.success('Post deleted successfully')
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    }
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-neon-green p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container mx-auto">
        {/* Profile Info */}
        <motion.div 
          className="mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-neon-green border-2 bg-black bg-opacity-50 text-neon-green shadow-neon-green-glow rounded-lg overflow-hidden">
            <CardContent className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8 p-6">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Avatar className="w-32 h-32 bg-black border-neon-green border-4 shadow-neon-green-glow rounded-full">
                  <img src="https://i.pinimg.com/736x/9a/27/d2/9a27d2611dd25e485e8805eb945bc760.jpg" alt="Avatar" className="w-full h-full rounded-full object-cover" />
                </Avatar>
              </motion.div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold mb-4">{userData.username}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  <motion.div className="flex " whileHover={{ scale: 1.1 }}>
                    <Grid className="w-6 h-6 text-neon-green mr-2" />
                    <div className="text-center">
                      <span className="block text-gray-400">Posts</span>
                      <span className="text-neon-green font-semibold text-xl">{stats.postCount}</span>
                    </div>
                  </motion.div>
                  <motion.div className="flex " whileHover={{ scale: 1.1 }}>
                    <Users className="w-6 h-6 text-neon-green mr-2" />
                    <div className="text-center">
                      <span className="block text-gray-400">Followers</span>
                      <span className="text-neon-green font-semibold text-xl">{stats.followersCount}</span>
                    </div>
                  </motion.div>
                  <motion.div className="flex " whileHover={{ scale: 1.1 }}>
                    <Users className="w-6 h-6 text-neon-green mr-2" />
                    <div className="text-center">
                      <span className="block text-gray-400">Following</span>
                      <span className="text-neon-green font-semibold text-xl">{stats.followingCount}</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Posts */}
        <ScrollArea className="h-[calc(100vh-300px)] overflow-y-auto pr-4">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, staggerChildren: 0.1 }}
          >
            <AnimatePresence>
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  className="border-neon-green border-2 bg-black bg-opacity-50 text-neon-green shadow-neon-green-glow rounded-lg overflow-hidden"
                  onClick={() => setSelectedPost(post)}
                >
                  <Card className="bg-transparent p-4 rounded-lg">
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-transparent border border-neon-green rounded-full p-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleLike(post.id)
                            }}
                          >
                            <Heart
                              className={`w-5 h-5 ${post.liked ? 'text-red-500' : 'text-gray-400'}`}
                            />
                          </motion.button>
                          <span className="text-neon-green">{post._count.likes}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-transparent border border-neon-green rounded-full p-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedPost(post)
                            }}
                          >
                            <MessageCircle className="w-5 h-5 text-neon-green" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-transparent border border-neon-green rounded-full p-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUpdate(post.id)
                            }}
                          >
                            <Pencil className="w-5 h-5 text-neon-green" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-transparent border border-neon-green rounded-full p-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(post.id)
                            }}
                          >
                            <Trash2 className="w-5 h-5 text-neon-green" />
                          </motion.button>
                        </div>
                      </div>
                      <div className="mt-2">
                        {post.imageUrl && (
                          <img src={post.imageUrl} alt="Post" className="w-full h-48 object-cover rounded-lg mb-4" />
                        )}
                        {post.videourl && (
                          <video controls className="w-full h-48 object-cover rounded-lg mb-4">
                            <source src={post.videourl} type="video/mp4" />
                          </video>
                        )}
                      </div>
                      <h2 className="text-xl text-white font-bold line-clamp-2">{post.content}</h2>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </ScrollArea>

        {/* Comments Dialog */}
        <AnimatePresence>
          {selectedPost && (
            <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
              <DialogContent className="bg-black bg-opacity-90 text-neon-green border-neon-green border-2 rounded-lg">
                <DialogHeader>
                  <DialogTitle className="text-neon-green text-2xl mb-4">{selectedPost.content}</DialogTitle>
                </DialogHeader>
                <motion.div 
                  className="flex flex-col space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <ScrollArea className="h-64 overflow-y-auto pr-4">
                    {selectedPost.comments.map(comment => (
                      <motion.div 
                        key={comment.id} 
                        className="border-b border-gray-700 py-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="font-bold text-neon-green">{comment.user.username}</div>
                        <div className="text-gray-300">{comment.content}</div>
                      </motion.div>
                    ))}
                  </ScrollArea>
                  <Input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="bg-gray-900 text-neon-green border-neon-green focus:ring-neon-green"
                  />
                  <Button 
                    onClick={() => handleComment(selectedPost.id)} 
                    className="bg-neon-green text-black hover:bg-neon-green-dark transition-colors duration-300"
                  >
                    Comment
                  </Button>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default ProfilePage
