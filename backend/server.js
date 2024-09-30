"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./src/routes/auth-routes"));
const post_routes_1 = __importDefault(require("./src/routes/post-routes"));
const comments_1 = __importDefault(require("./src/routes/comments"));
const count_routes_1 = __importDefault(require("./src/routes/count-routes"));
const follow_routes_1 = __importDefault(require("./src/routes/follow-routes"));
const userSearch_route_1 = __importDefault(require("./src/routes/userSearch-route"));
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.json());
app.use(auth_routes_1.default);
app.use(post_routes_1.default);
app.use(comments_1.default);
app.use(count_routes_1.default);
app.use(follow_routes_1.default);
app.use(userSearch_route_1.default);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
