import express from "express";
import authRoutes from  "./src/routes/auth-routes";
import postRoutes from "./src/routes/post-routes";
import commentRoutes from "./src/routes/comments";
import countRoutes from "./src/routes/count-routes";

const app = express();
const PORT = process.env.PORT 

app.use(express.json());
app.use(authRoutes); 
app.use(postRoutes);
app.use(commentRoutes);
app.use(countRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
