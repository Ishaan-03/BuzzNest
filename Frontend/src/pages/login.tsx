import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 

const LoginPage = () => {
  const navigate = useNavigate(); 
  return (
    <div className="min-h-screen w-screen flex justify-center items-center bg-black">
      <div className="flex w-10/12 max-w-4xl shadow-lg rounded-lg overflow-hidden">
       
        <div className="w-1/2 p-8 bg-white">
          <h2 className="text-3xl font-bold text-gray-800">Login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account? 
            <span 
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate('/signup')}  
            >
              Sign Up
            </span>
          </p>
          
          <form className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" placeholder="BuzzNest@example.com" className="w-full text-white bg-gray-600 mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" placeholder="Enter your password" className="w-full text-white bg-gray-600 mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 mt-6 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Login
            </motion.button>
          </form>
        </div>

        <motion.div 
          className="w-1/2 bg-black flex justify-center items-center p-8"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center">
            <p className="text-xl font-semibold text-white">
              "Welcome back to <span className="text-blue-500 font-bold">BuzzNest</span>! Reconnect with your hive, continue the buzz, and stay connected with the world."
            </p>
            <p className="mt-4 text-sm text-white">Ishaan Saxena, Founder of BuzzNest</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
