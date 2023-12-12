import express from 'express';
import { isAuthenticated } from '../middleware/middleware.js';
const postRoute = express.Router();
postRoute.get('/authenticated', isAuthenticated, (req, res) => {
    res.send(`YOU ARE AUTHENTICATED AS ${req.session.user?.username}`);
});
postRoute.get('/testAuth', isAuthenticated, (req, res) => {
    res.send("Hello!");
});
export default postRoute;
//# sourceMappingURL=postRoute.js.map