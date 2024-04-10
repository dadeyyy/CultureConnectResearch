import express from 'express';
import axios from 'axios';
const liveStreamRoute = express.Router();
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
liveStreamRoute.post('/createLivestream', async (req, res) => {
    try {
        const data = req.body;
        const response = await axios.post(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/live_inputs`, {
            meta: { name: data.name },
            recording: { mode: 'automatic' },
        }, {
            headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
            },
        });
        const url = response.data.result.rtmps.url;
        const streamKey = response.data.result.rtmps.streamKey;
        if (response.data) {
            return res.status(200).json({ url, streamKey });
        }
        return res.status(404).json({ error: "No data!" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
export default liveStreamRoute;
//# sourceMappingURL=liveStream.js.map