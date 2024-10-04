import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Pencil, Trash2 } from "lucide-react"
import axios from 'axios'
import { toast } from "react-hot-toast"

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
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (userError || statsError || postsError) {
    return <div className="flex justify-center items-center h-screen">An error occurred. Please try again later.</div>
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
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardContent className="flex items-center space-x-4 p-6">
          <Avatar className="h-24 w-24">
            <img src="/placeholder-avatar.jpg" alt={userData.username} className="h-full w-full object-cover rounded-full" />
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{userData.username}</h1>
            <p className="text-gray-500">{userData.email}</p>
            <div className="flex space-x-4 mt-2">
              <span>{stats.postCount} posts</span>
              <span>{stats.followersCount} followers</span>
              <span>{stats.followingCount} following</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="cursor-pointer" onClick={() => setSelectedPost(post)}>
            <CardContent className="p-0">
              {post.videourl ? (
                <video src={post.videourl} className="w-full h-48 object-cover" controls />
              ) : (
                <img src={post.imageUrl || '/placeholder.svg'} alt="Post" className="w-full h-48 object-cover" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={Boolean(selectedPost)} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="w-2/3 max-w-full mx-auto">
          <DialogHeader>
            <DialogTitle>
              <div className="flex justify-between">
                <span>Post Details</span>
                <div className="flex space-x-4">
                  <Button variant="ghost" onClick={() => handleUpdate(selectedPost?.id ?? '')}>
                    <Pencil className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" onClick={() => handleDelete(selectedPost?.id ?? '')}>
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          <CardContent>
            {selectedPost?.videourl ? (
              <video src={selectedPost.videourl} className="w-full h-64 object-cover" controls />
            ) : (
              <img src={selectedPost?.imageUrl || '/placeholder.svg'} alt="Post" className="w-full h-64 object-cover" />
            )}

            <div className="mt-4">
              <p>{selectedPost?.content}</p>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-2 items-center">
                <Button
                  variant="ghost"
                  onClick={() => handleLike(selectedPost?.id ?? '')}
                  className={selectedPost?.liked ? 'text-red-500' : ''}
                >
                  <Heart className="w-5 h-5" />
                  <span>{selectedPost?._count.likes}</span>
                </Button>
                <Button variant="ghost">
                  <MessageCircle className="w-5 h-5" />
                  <span>{selectedPost?.comments.length}</span>
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-bold">Comments</h3>
              <div className="space-y-4">
                {selectedPost?.comments.map((comment) => (
                  <div key={comment.id} className="p-2 bg-gray-100 rounded-lg">
                    <p className="font-bold">{comment.user.username}</p>
                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <Input
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full"
              />
              <Button onClick={() => handleComment(selectedPost?.id ?? '')} className="mt-2">
                Post Comment
              </Button>
            </div>
          </CardContent>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProfilePage
