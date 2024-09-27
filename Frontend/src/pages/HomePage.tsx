import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [showMergedImages, setShowMergedImages] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMergedImages(true);
    }, 1000); 

    return () => clearTimeout(timer); 
  }, []);

  const handleGetStarted = () => {
    navigate('/signup'); // Redirect to the signup page
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
      {showMergedImages ? (
        <div className="absolute inset-0 w-full h-full flex">
          {/* First Image */}
          <motion.div
            className="w-1/2 h-full"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            <img
              src="https://images.pexels.com/photos/28577587/pexels-photo-28577587/free-photo-of-capturing-sunset-silhouette-with-smartphone.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Background 2"
              className="object-cover w-full h-full opacity-60"
            />
          </motion.div>

          {/* Second Image */}
          <motion.div
            className="w-1/2 h-full"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            <img
              src="https://images.pexels.com/photos/3974405/pexels-photo-3974405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Background 3"
              className="object-cover w-full h-full opacity-60"
            />
          </motion.div>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
      ) : (
        // Initial image display
        <motion.div
          className="absolute inset-0 w-full h-full flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src="https://images.pexels.com/photos/28589286/pexels-photo-28589286/free-photo-of-wet-dog-in-forest-stream-adventure.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Initial Background"
            className="object-cover w-full h-full"
          />
        </motion.div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-8 p-6">
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-white"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          Welcome to <span className="text-blue-500">BuzzNest</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-200"
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
        >
          "Create your own hive of connections, share your story, and experience the buzz of life."
        </motion.p>

        <motion.div
          className="mt-8 flex space-x-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <button 
            onClick={handleGetStarted} // Add click event to redirect
            className="py-3 px-6 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all"
          >
            Get Started
          </button>
          <button onClick={() => navigate('/learnmore')} className="py-3 px-6 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-all">
            Learn More
          </button>
        </motion.div>

        <motion.p
          className="text-sm md:text-md text-gray-300 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.5 }}
        >
          "Together we thrive. BuzzNest - Where your stories find their place."
        </motion.p>
      </div>
    </div>
  );
};

export default HomePage;
