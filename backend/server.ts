import express from "express";
import authRoutes from  "./src/routes/auth-routes";

const app = express();
const PORT = process.env.PORT 

app.use(express.json());
app.use(authRoutes); 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
