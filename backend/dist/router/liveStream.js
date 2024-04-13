import express from 'express';
import axios from 'axios';
import fetch from 'node-fetch';
const liveStreamRoute = express.Router();
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
liveStreamRoute.post('/createLivestream', async (req, res) => {
    try {
        const { name, description } = req.body;
        //Call to the cloudflare create live input api
        const response = await axios.post(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/live_inputs`, {
            meta: { name: name, description: description },
            recording: { mode: 'automatic' },
        }, {
            headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
            },
        });
        if (response.data.success) {
            const responseData = response.data.result;
            //sample responseData:
            // "result": {
            //   "created": "2014-01-02T02:20:00Z",
            //   "deleteRecordingAfterDays": 45,
            //   "meta": {
            //     "name": "test stream 1"
            //   },
            //   "modified": "2014-01-02T02:20:00Z",
            //   "recording": {
            //     "mode": "off",
            //     "requireSignedURLs": false,
            //     "timeoutSeconds": 0
            //   },
            //   "rtmps": {
            //     "streamKey": "2fb3cb9f17e68a2568d6ebed8d5505eak3ceaf8c9b1f395e1b76b79332497cada",
            //     "url": "rtmps://live.cloudflare.com:443/live/"
            //   },
            //   "rtmpsPlayback": {
            //     "streamKey": "2fb3cb9f17e68a2568d6ebed8d5505eak3ceaf8c9b1f395e1b76b79332497cada",
            //     "url": "rtmps://live.cloudflare.com:443/live/"
            //   },
            //   "srt": {
            //     "passphrase": "2fb3cb9f17e68a2568d6ebed8d5505eak3ceaf8c9b1f395e1b76b79332497cada",
            //     "streamId": "f256e6ea9341d51eea64c9454659e576",
            //     "url": "srt://live.cloudflare.com:778"
            //   },
            //   "srtPlayback": {
            //     "passphrase": "2fb3cb9f17e68a2568d6ebed8d5505eak3ceaf8c9b1f395e1b76b79332497cada",
            //     "streamId": "f256e6ea9341d51eea64c9454659e576",
            //     "url": "rtmps://live.cloudflare.com:443/live/"
            //   },
            //   "status": null,
            //   "uid": "66be4bf738797e01e1fca35a7bdecdcd",
            //   "webRTC": {
            //     "url": "https://customer-m033z5x00ks6nunl.cloudflarestream.com/b236bde30eb07b9d01318940e5fc3edake34a3efb3896e18f2dc277ce6cc993ad/webRTC/publish"
            //   },
            //   "webRTCPlayback": {
            //     "url": "https://customer-m033z5x00ks6nunl.cloudflarestream.com/b236bde30eb07b9d01318940e5fc3edake34a3efb3896e18f2dc277ce6cc993ad/webRTC/play"
            //   }
            // },
            return res.status(200).json(responseData);
        }
        if (!response.data.success) {
            const errors = response.data.errors;
            if (errors.length > 0) {
                const creatingLiveStreamError = errors.map((data) => ({ data }));
                return res.json(creatingLiveStreamError);
            }
            return res.status(400).json({ error: 'Failed to create livestream' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
liveStreamRoute.get('/getLiveStreams', async (req, res) => {
    try {
        const response = await axios.get(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Email': `${process.env.CLOUDFLARE_EMAIL}`,
                Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
            },
        });
        const { data } = response;
        if (data.success) {
            const liveInputs = data.result;
            //Sample Live inputs data:
            // "liveInputs": [
            //   {
            //     "created": "2014-01-02T02:20:00Z",
            //     "deleteRecordingAfterDays": 45,
            //     "meta": {
            //       "name": "test stream 1"
            //     },
            //     "modified": "2014-01-02T02:20:00Z",
            //     "uid": "66be4bf738797e01e1fca35a7bdecdcd"
            //   }
            // ]
            if (liveInputs.length > 0) {
                return res.status(200).json(liveInputs);
            }
            //If there is no available livestream
            return res.status(404).json({ message: 'No livestream available' });
        }
        return res.status(400).json({ error: 'Data not found!' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});
liveStreamRoute.get('/pastLiveStreams', async (req, res) => {
    try {
        // Check if CLOUDFLARE_EMAIL environment variable is set
        if (!process.env.CLOUDFLARE_EMAIL) {
            throw new Error('CLOUDFLARE_EMAIL environment variable is not set');
        }
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
                Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
            },
        });
        const data = await response.json();
        if (data.success) {
            return res.json(data.result);
        }
        return res.status(400).json(data.errors);
    }
    catch (err) {
        console.log(`ERROR ${err}`);
    }
});
export default liveStreamRoute;
//# sourceMappingURL=liveStream.js.map