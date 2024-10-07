import express from "express";
import cors from "cors"
import authRoutes from "./src/routes/auth-routes";
import postRoutes from "./src/routes/post-routes";
import commentRoutes from "./src/routes/comments";
import countRoutes from "./src/routes/count-routes";
import followRoutes from "./src/routes/follow-routes";
import userSearchRoutes from "./src/routes/userSearch-route";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "https://buzz-nest-ishaan-03s-projects.vercel.app/", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, 
}));

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
