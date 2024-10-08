import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth-routes";
import postRoutes from "./src/routes/post-routes";
import commentRoutes from "./src/routes/comments";
import countRoutes from "./src/routes/count-routes";
import followRoutes from "./src/routes/follow-routes";
import userSearchRoutes from "./src/routes/userSearch-route";

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://buzz-nest.vercel.app",
  "https://buzz-nest-ishaan-03s-projects.vercel.app",
  "http://localhost:5173"
];

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Handle preflight requests
app.options('*', cors());

// Express middleware
app.use(express.json());

// Route Handlers
app.use(authRoutes);
app.use(postRoutes);
app.use(commentRoutes);
app.use(countRoutes);
app.use(followRoutes);
app.use(userSearchRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
