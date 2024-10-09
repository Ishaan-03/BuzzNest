import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://15.207.107.166:3000/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'An error occurred during login');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen w-screen flex justify-center items-center bg-black">
      <div className="flex flex-col md:flex-row w-10/12 max-w-4xl shadow-lg rounded-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-white">
          <h2 className="text-3xl font-bold text-gray-800">Login to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
          </p>

          {error && <p className="mt-2 text-red-600">{error}</p>}
          
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full text-white bg-gray-600 mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="BuzzNest@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full text-white bg-gray-600 mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 mt-6 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Sign in
            </motion.button>
          </form>
        </div>

        <motion.div 
          className="w-full md:w-1/2 bg-black flex justify-center items-center p-6 md:p-8"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center">
            <p className="text-xl font-semibold text-white">
              "In the digital hive of <span className="text-blue-500 font-bold">BuzzNest</span>, every login is a key to unlock a world of shared experiences. Your story is the honey that sweetens our collective journey."
            </p>
            <p className="mt-4 text-sm text-white">Ishaan Saxena, CEO & Founder of BuzzNest</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;