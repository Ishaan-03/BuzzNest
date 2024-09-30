import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import SignupPage from "./pages/Signup"; 
import HomePage from "./pages/homePage"; 
import LearnMore from "./pages/Learnmore";
import UserProfile from "./pages/profilePage";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col w-screen h-screen">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/learnmore" element={<LearnMore />} /> 
          <Route path="/profile" element={<UserProfile />} /> 
          <Route path="/home" element={<HomePage />} /> 
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
