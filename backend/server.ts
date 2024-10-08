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
  "https://buzz-nest-ishaan-03s-projects.vercel.app",
  "https://buzz-nest.vercel.app", 
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  console.log(`Origin: ${req.headers.origin}`);
  next();
});

app.options('*', cors()); 

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