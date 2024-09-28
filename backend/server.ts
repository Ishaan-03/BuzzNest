import express from "express";
import authRoutes from  "./src/routes/auth-routes";
import postRoutes from "./src/routes/post-routes";

const app = express();
const PORT = process.env.PORT 

app.use(express.json());
app.use(authRoutes); 
app.use(postRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
