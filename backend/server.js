"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./src/routes/auth-routes"));
const post_routes_1 = __importDefault(require("./src/routes/post-routes"));
const comments_1 = __importDefault(require("./src/routes/comments"));
const count_routes_1 = __importDefault(require("./src/routes/count-routes"));
const follow_routes_1 = __importDefault(require("./src/routes/follow-routes"));
const userSearch_route_1 = __importDefault(require("./src/routes/userSearch-route"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
    "https://buzz-nest.vercel.app",
    "https://buzz-nest-ishaan-03s-projects.vercel.app",
    "http://localhost:5173",
];
// CORS configuration
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
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
app.options('*', (0, cors_1.default)());
// Express middleware
app.use(express_1.default.json());
// Route Handlers
app.use(auth_routes_1.default);
app.use(post_routes_1.default);
app.use(comments_1.default);
app.use(count_routes_1.default);
app.use(follow_routes_1.default);
app.use(userSearch_route_1.default);
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
