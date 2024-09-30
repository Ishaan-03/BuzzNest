import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, MessageCircle, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { FaUserCircle } from "react-icons/fa"

export default function HomePage() {
  return (
    <motion.div
      className="min-h-screen bg-black text-white overflow-hidden border-4 border-purple-500 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.5)]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.nav
        className="flex items-center justify-between p-4 border-b-2 border-purple-500 shadow-[0_4px_12px_rgba(168,85,247,0.5)]"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Updated Avatar with Profile Icon */}
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
        <div className="w-12 h-12" /> {/* Placeholder for symmetry */}
      </motion.nav>

      <main className="container mx-auto py-8 px-4">
        {/* Added scrolling animation */}
        <ScrollArea className="h-[calc(100vh-7rem)]">
          <motion.div
            className="grid gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, staggerChildren: 0.2 }}
          >
            {[1, 2, 3, 4, 5].map((post) => (
              <motion.div
                key={post}
                className="bg-black border-2 rounded-2xl border-purple-500 shadow-lg shadow-purple-500/20"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-black">
                  <CardHeader className="flex flex-row bg-black items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`https://i.pinimg.com/736x/a1/e0/07/a1e0079cef2bdcb59eeeb436bf80a9ec.jpg?text=U${post}&background=random`} />
                      <AvatarFallback>U{post}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-semibold text-cyan-400">User{post}</p>
                      <p className="text-sm text-gray-400">2 hours ago</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Set object-cover for filling the card */}
                    <img
                      src={`https://i.pinimg.com/736x/41/ba/c2/41bac2c45b603309032a3be7d36308b7.jpg?height=300&width=600&text=Post+${post}`}
                      alt={`Post ${post}`}
                      className="w-full h-64 object-cover rounded-lg border border-purple-500"
                    />
                  </CardContent>
                  <CardFooter className="flex bg-black justify-between">
                    <Button variant="ghost" className="text-pink-500 hover:text-pink-400 hover:bg-pink-500/10">
                      <Heart className="w-5 h-5 mr-2" />
                      Like
                    </Button>
                    <Button variant="ghost" className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Comment
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </ScrollArea>
      </main>
    </motion.div>
  )
}
