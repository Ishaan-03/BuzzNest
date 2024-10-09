import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  const navigate = useNavigate();

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('https://buzznest-nbvy.onrender.com/signup', {
        username,
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setSuccessMessage('Signup successful!');
        navigate('/home');
      } else {
        throw new Error('No token received from server');
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'An error occurred during signup');
    }
  };

  return (
    <div className="min-h-screen w-screen flex justify-center items-center bg-black">
      <div className="flex flex-col md:flex-row w-10/12 max-w-4xl shadow-lg rounded-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-white">
          <h2 className="text-3xl font-bold text-gray-800">Create an account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
          </p>

          {errorMessage && <p className="mt-2 text-red-600">{errorMessage}</p>}
          {successMessage && <p className="mt-2 text-green-600">{successMessage}</p>}
          
          <form className="mt-8 space-y-4" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-white bg-gray-600 mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="BuzzNest@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-white bg-gray-600 mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-white bg-gray-600 mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 mt-6 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Sign Up
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
              "Connect, share, and create your hive of memories. Join <span className="text-blue-500 font-bold">BuzzNest</span> today and be part of the buzz that brings the world closer!"
            </p>
            <p className="mt-4 text-sm text-white">Ishaan Saxena, Founder of BuzzNest</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;