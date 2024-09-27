import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import SignupPage from "./pages/Signup"; 
import HomePage from "./pages/HomePage"; 
import LearnMore from "./pages/Learnmore";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col w-screen h-screen">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/learnmore" element={<LearnMore />} /> 
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
