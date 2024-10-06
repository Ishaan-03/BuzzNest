'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"

const neonColors = [
  'text-[#ff00ff]', // Magenta
  'text-[#00ffff]', // Cyan
  'text-[#ffff00]', // Yellow
  'text-[#ff9900]', // Orange
]

const sections = [
  {
    title: 'Introduction to BuzzNest',
    content: `BuzzNest is a distraction-free social media platform designed to redefine the purpose of social media for the betterment of society. Here at BuzzNest, we invite you to join a community that fosters positivity, shares knowledge, promotes digital skills, and empowers you to showcase yourself—all completely free. Whether you're sharing your achievements or learning from others, BuzzNest is a place for meaningful interactions that contribute to personal growth and collective betterment.`,
  },
  {
    title: 'Motive Behind Creating BuzzNest',
    content: `The key motivation behind BuzzNest was to create a space where social media serves its original purpose: connecting people through positive and meaningful content. On BuzzNest, you can share your learnings, post valuable knowledge, showcase your achievements, and engage in thoughtful conversations through comments. 

You won't be bombarded with notifications designed to steal your attention, nor will you find short-form content aimed at giving you dopamine boosts. BuzzNest is built to ensure you stay focused, with features that let you post, delete, and update your content at will. You can also search for friends by their username or registered email. To maintain a positive community, I, as the Founder and CEO, personally handle any posts flagged as cryptic or inappropriate. Additionally, for your well-being, you'll automatically be logged out after an hour, reminding you to take breaks from screen time.`,
  },
  {
    title: 'How to Use BuzzNest',
    content: `1. Sign Up and Log In: Start by signing up or logging in to your account. Keep your email and password handy as these will grant you access to the platform.
   
2. Navigating the Home Page: Once logged in, you'll be redirected to the home page, where posts from enthusiastic members of the BuzzNest community will be displayed. You can interact with this content by liking, commenting, and following other users.

3. Accessing Your Profile: Click on the profile icon in the top left corner to view your profile. Here, you can manage your posts, followers, and following count. You can also update or delete your posts, check likes, and read comments on your content.

4. Uploading Content: To upload a post, click the upload icon in the top right corner of the home page. You'll be able to select files directly from your device and share them with the community.

5. Searching for Users: You can search for users by their email or username through the search icon on the top right. The search results will allow you to follow or unfollow users, affecting your follower and following counts.`,
  },
  {
    title: 'Suggestions While Using BuzzNest',
    content: `1. Device Recommendation: For the best experience, we recommend using BuzzNest on a PC, laptop, or tablet to fully enjoy the animations and smooth scrolling. However, the platform is mobile-responsive and works well on smartphones too.
   
2. Post with Caution: Ensure that the content you post is something you are comfortable sharing with everyone. BuzzNest does not currently have private or public account options—every post is visible to the entire community. If our user base grows, we plan to introduce private account features in the future.

3. Encouraging a Positive Community: Our goal is to foster a community of positivity and encouragement. Avoid cyberbullying, and be sure to uplift and support fellow members. When commenting, remain respectful and mindful of your words—being overly dark or sarcastic isn't cool and can hurt others. Be responsible and considerate when engaging with the community.`,
  },
  {
    title: 'Contact and Support',
    content: `If you need assistance, wish to report inappropriate content, or have suggestions to improve BuzzNest, feel free to reach out to me at saxenaishaan03@gmail.com. For any cryptic posts that you believe should be removed, kindly provide the user's email for prompt action.`,
  },
]

export default function Component() {
  const [expandedSection, setExpandedSection] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col">
      <motion.header
        className="p-8 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
          <span className="text-[#ff00ff]">Learn More</span> about{' '}
          <span className="text-[#00ffff]">BuzzNest</span>
        </h1>
      </motion.header>
      <ScrollArea className="flex-grow h-[calc(100vh-12rem)]">
        <motion.main
          className="p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <motion.section
                key={index}
                className="bg-gray-900 rounded-lg p-6 shadow-lg"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.h2
                  className={`text-xl sm:text-2xl font-semibold mb-4 cursor-pointer flex justify-between items-center ${
                    neonColors[index % neonColors.length]
                  }`}
                  onClick={() => setExpandedSection(expandedSection === index ? null : index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{section.title}</span>
                  {expandedSection === index ? (
                    <ChevronUp className="w-6 h-6" />
                  ) : (
                    <ChevronDown className="w-6 h-6" />
                  )}
                </motion.h2>
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedSection === index ? 'auto' : 0,
                    opacity: expandedSection === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-300 whitespace-pre-line">{section.content}</p>
                </motion.div>
              </motion.section>
            ))}
          </div>
        </motion.main>
      </ScrollArea>
    </div>
  )
}