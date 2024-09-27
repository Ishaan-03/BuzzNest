import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const LearnMore = () => {
  const navigate = useNavigate(); 

  const handleExplore = () => {
    navigate('/'); // Navigate to the home route
  };

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(https://fotoomnia.com/thumbnails/720/4177056a21e4458e4354c6d1755a4540.jpg)` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Navbar */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex justify-center items-center p-6 z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold text-white">BuzzNest</h1>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 p-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl sm:text-6xl font-bold text-white mb-4">Discover BuzzNest</h2>
        <p className="text-lg sm:text-xl text-white mb-8 max-w-3xl">
          Dive into a world of endless possibilities with BuzzNest, <br /> the social media platform designed to connect,<br /> inspire, and empower you.
        </p>
      </motion.div>

      {/* Content Sections */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col md:flex-row justify-between items-center px-4 md:px-8 space-y-8 md:space-y-0 md:space-x-8 z-10">
      <motion.div
  className="max-w-md bg-white bg-opacity-70 p-6 md:p-8 rounded-lg shadow-xl flex flex-col items-center text-center" // Add flex, items-center, and text-center for alignment
  initial={{ opacity: 0, x: 50 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 1 }}
>
  <h3 className="text-3xl md:text-4xl font-semibold text-black mb-4">Join the BuzzNest Community</h3>
  <p className="text-base md:text-lg text-black mb-6"> {/* Add mb-6 for spacing */}
  BuzzNest is more than just a social media platform. It is a place where you can connect with like-minded individuals, share your passions, and grow your personal brand. With cutting-edge features and a user-friendly interface, BuzzNest empowers you to take control of your online presence.
  </p>
  <Button
    onClick={handleExplore}
    className="py-3 px-6 bg-primary text-primary-foreground rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-opacity-80"
  >
    Let's Explore
  </Button>
</motion.div>

        <motion.div
  className="max-w-md bg-white bg-opacity-70 p-6 md:p-8 rounded-lg shadow-xl flex flex-col items-center text-center" // Add flex, items-center, and text-center for alignment
  initial={{ opacity: 0, x: 50 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 1 }}
>
  <h3 className="text-3xl md:text-4xl font-semibold text-black mb-4">Join the BuzzNest Community</h3>
  <p className="text-base md:text-lg text-black mb-6"> {/* Add mb-6 for spacing */}
    We believe in the power of community. At BuzzNest, you'll find a vibrant and diverse community of individuals who are passionate about sharing ideas, supporting each other, and creating meaningful connections.
  </p>
  <Button
    onClick={handleExplore}
    className="py-3 px-6 bg-primary text-primary-foreground rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:bg-opacity-80"
  >
    Let's Explore
  </Button>
</motion.div>

      </div>
    </div>
  );
};

export default LearnMore;

//