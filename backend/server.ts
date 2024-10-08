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

// More permissive CORS configuration
app.use(cors({
  origin: '*', // This allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Handle preflight requests
app.options('*', (req, res) => {
  res.sendStatus(200);
});

app.use(express.json());

app.use(authRoutes);
app.use(postRoutes);
app.use(commentRoutes);
app.use(countRoutes);
app.use(followRoutes);
app.use(userSearchRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});