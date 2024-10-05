'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Save } from "lucide-react"
import { motion } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useParams, useNavigate } from 'react-router-dom'

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-black">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-purple-500 rounded-full opacity-10"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ y: 0 }}
            animate={{
              y: [0, Math.random() * 50, 0], 
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "mirror",
              delay: Math.random() * 5, 
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function UpdatePost() {
  const [postContent, setPostContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setPostContent(response.data.content)
      } catch (error) {
        console.error('Error fetching post:', error)
        toast.error('Failed to fetch post')
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId])

  const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const response = await axios.post(`http://localhost:3000/update/${postId}`, 
        { content: postContent },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      toast.success('Post updated successfully')
      navigate('/profile')  // Redirect to home page after successful update
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error('Failed to update post')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden bg-black">
      <AnimatedBackground />
      <Card className="w-full max-w-md bg-gray-800/70 backdrop-blur-md border border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.5)] p-6 rounded-lg relative z-10">
        <h1 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
          Update Post
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-purple-300 mb-2">
              Post Content
            </label>
            <Textarea
              id="content"
              value={postContent}
              onChange={handleContentChange}
              placeholder="Edit your post content here..."
              className="bg-gray-700/70 text-purple-300 border-purple-500 focus:ring-purple-500 focus:border-purple-500 h-48 placeholder-purple-400"
            />
          </div>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
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
                  Updating...
                </span>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Update Post
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </Card>
    </div>
  )
}