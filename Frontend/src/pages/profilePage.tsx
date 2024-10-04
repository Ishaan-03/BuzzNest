import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Grid, Heart, MessageCircle, Pencil, Trash2, Users } from "lucide-react"
import axios from 'axios'
import { toast } from "react-hot-toast"
import { motion } from 'framer-motion'
import { ScrollArea } from "@/components/ui/scroll-area"

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
  comments: Comment[]
  liked?: boolean
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
    return <div className="flex justify-center items-center h-screen text-neon-green">Loading...</div>
  }

  if (userError || statsError || postsError) {
    return <div className="flex justify-center items-center h-screen text-neon-red">An error occurred. Please try again later.</div>
  }

  if (!userData) {
    return null
  }

  const handleLike = async (postId: string) => {
    try {
      await api.post(`/like/${postId}`)
      const updatedPosts = posts.map(post => 
        post.id === postId 
          ? { ...post, _count: { ...post._count, likes: post._count.likes + 1 }, liked: !post.liked }
          : post
      )
      setPosts(updatedPosts)
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({ ...selectedPost, _count: { ...selectedPost._count, likes: selectedPost._count.likes + 1 }, liked: !selectedPost.liked })
      }
      toast.success(selectedPost?.liked ? 'Post unliked successfully' : 'Post liked successfully')
    } catch (error) {
      console.error('Error liking/unliking post:', error)
      toast.error('Failed to like/unlike post')
    }
  }

  const handleComment = async (postId: string) => {
    try {
      await api.post('/comment', {
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
      await api.delete(`/posts/${postId}`)
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
    <div className="container mx-auto p-4 bg-black text-neon-green min-h-screen">
      {/* Profile Info */}
     {/* Profile Info */}
<motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  <Card className="border-neon-green border-2 bg-black text-neon-green shadow-neon-green-glow rounded-lg">
    <CardContent className="flex items-center space-x-4 p-6">
      <div className="relative">
        <Avatar className="w-24 h-24 bg-black border-neon-green border-2 shadow-neon-green-glow rounded-full">
          (
            <img src={"https://i.pinimg.com/736x/9a/27/d2/9a27d2611dd25e485e8805eb945bc760.jpg"} alt="Avatar" className="w-full h-full rounded-full" />
          ) 
        </Avatar>
      </div>
      <div>
        <h1 className="text-3xl font-bold">{userData.username}</h1>
        <div className="flex space-x-6 mt-2">
          <div className="flex ">
            <Grid className="w-5 h-5 text-neon-green" />
            <div className="ml-2 text-center">
              <span className="block text-gray-400">Posts</span>
              <span className="text-neon-green font-semibold">{stats.postCount}</span>
            </div>
          </div>
          <div className="flex">
            <Users className="w-5 h-5 text-neon-green" />
            <div className="ml-2 text-center">
              <span className="block text-gray-400">Followers</span>
              <span className="text-neon-green font-semibold">{stats.followersCount}</span>
            </div>
          </div>
          <div className="flex ">
            <Users className="w-5 h-5 text-neon-green" />
            <div className="ml-2 text-center">
              <span className="block text-gray-400">Following</span>
              <span className="text-neon-green font-semibold">{stats.followingCount}</span>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</motion.div>


      {/* Posts */}
      <ScrollArea className="max-h-screen overflow-y-scroll scrollbar scrollbar-thumb-neon-green scrollbar-track-black">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {posts.map((post) => (
      <motion.div
        key={post.id}
        className="border-neon-green border-2 bg-black text-neon-green shadow-neon-green-glow rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedPost(post)}
      >
        <Card className="bg-black p-4 rounded-lg">
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="bg-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(post.id);
                  }}
                >
                  <Heart
                    className={`w-4 h-4 ${post.liked ? 'text-red-500' : 'text-gray-400'}`}
                  />
                  <span className="text-neon-green">{post._count.likes}</span>
                </Button>

                <Button
                  variant="outline"
                  className="bg-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPost(post);
                  }}
                >
                  <MessageCircle className="w-4 h-4 text-neon-green" />
                </Button>
                <Button
                  variant="outline"
                  className="bg-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate(post.id);
                  }}
                >
                  <Pencil className="w-4 h-4 text-neon-green" />
                </Button>
                <Button
                  variant="outline"
                  className="bg-black"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post.id);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-neon-green" />
                </Button>
              </div>
            </div>
            <div className="mt-2">
              {post.imageUrl && <img src={post.imageUrl} alt="Post" className="w-full h-auto rounded-lg" />}
              {post.videourl && (
                <video controls className="w-full h-auto rounded-lg mt-2">
                  <source src={post.videourl} type="video/mp4" />
                </video>
              )}
            </div>
          </CardContent>
          <h2 className="text-xl text-white font-bold">{post.content}</h2>
        </Card>
      </motion.div>
    ))}
  </div>
</ScrollArea>


      {/* Comments Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="bg-black text-neon-green">
          <DialogHeader>
            <DialogTitle className="text-neon-green">{selectedPost?.content}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <div className="h-64 overflow-y-scroll">
              {selectedPost?.comments.map(comment => (
                <div key={comment.id} className="border-b border-gray-700 py-2">
                  <div className="font-bold">{comment.user.username}</div>
                  <div>{comment.content}</div>
                </div>
              ))}
            </div>
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="bg-gray-900 text-neon-green"
            />
            <Button onClick={() => handleComment(selectedPost!.id)} className="bg-neon-green text-black">Comment</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProfilePage
