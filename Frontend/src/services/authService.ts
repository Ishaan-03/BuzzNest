
const API_URL = "https://buzznest-thmn.onrender.com"; 

interface SignupResponse {
  message: string;
  token: string;
}

interface LoginResponse {
  message: string;
  token: string;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
}

// User Signup
export const signupUser = async (username: string, email: string, password: string): Promise<SignupResponse> => {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Signup failed");
  }

  return response.json();
};

// User Login
export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  return response.json();
};

// Fetch User Profile
export const fetchUserProfile = async (token: string): Promise<UserProfile> => {
  console.log("Fetching user profile with token:", token); 
  const response = await fetch(`${API_URL}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error fetching user profile:", errorData);
    throw new Error(errorData.message || "Failed to fetch profile");
  }

  return response.json();
};

