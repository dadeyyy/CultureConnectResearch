import express from 'express';
import { db } from '../utils/db.server.js';
import { isAuthenticated, validate, isAdmin } from '../middleware/middleware.js';
import { archiveSchema } from '../utils/Schemas.js';
const archiveRoute = express.Router();
//Getting all the archives post
archiveRoute.get('/archive', isAuthenticated, async (req, res) => {
    try {
        const allArchive = await db.archive.findMany({});
        res.status(200).json(allArchive);
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
//Posting on archives admin only
archiveRoute.post('/archive', isAuthenticated, isAdmin, validate(archiveSchema), async (req, res) => {
    const data = req.body;
    const newArchive = await db.archive;
    console.log(data);
});
export default archiveRoute;
//# sourceMappingURL=archive.js.map