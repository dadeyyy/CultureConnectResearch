import express from 'express';
import axios from 'axios';
import fetch from 'node-fetch';
const liveStreamRoute = express.Router();
//Creating live input
liveStreamRoute.post('/createLivestream', async (req, res) => {
    try {
        const { name, description } = req.body;
        //Call to the cloudflare create live input api
        const response = await axios.post(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`, {
            meta: { name, description },
            recording: { mode: 'automatic' },
        }, {
            headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
            },
        });
        const { data } = response;
        if (data.success) {
            const responseData = data.result;
            return res.status(200).json(responseData);
        }
        const errors = data.errors;
        if (errors.length > 0) {
            const { message, code } = errors[0];
            return res.status(code).json({ message });
        }
    }
    catch (err) {
        return res.status(500).json({ message: "Failed to create liveStream" });
    }
});
//GET ongoing livestream
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
            const connectedLiveInputs = await Promise.all(liveInputs.map(async (input) => {
                const connectedData = await axios.get(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs/${input.uid}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auth-Email': `${process.env.CLOUDFLARE_EMAIL}`,
                        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
                    },
                });
                const { data } = connectedData;
                if (data.result.status !== null && data.result.status.current.state === "connected") {
                    return data;
                }
            }));
            //Filter undefined
            const filteredConnectedLiveInputs = connectedLiveInputs.filter(input => input !== undefined);
            //Extract UID
            const connectedLiveInputsUIDs = filteredConnectedLiveInputs.map(input => input.result.uid);
            // Filter liveInputs based on the UIDs present in connectedLiveInputsUIDs
            const filteredLiveInputs = liveInputs.filter(input => connectedLiveInputsUIDs.includes(input.uid));
            if (filteredLiveInputs.length > 0) {
                return res.status(200).json(filteredLiveInputs);
            }
            return res.status(404).json({ message: 'No connected livestream available' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});
//Saved livestream videos
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
        res.status(500).json({ error: err });
    }
});
//Get specific livestream
liveStreamRoute.get('/liveStream/:id', async (req, res) => {
    try {
        const liveStreamId = req.params.id;
        console.log(liveStreamId);
        if (!process.env.CLOUDFLARE_EMAIL) {
            throw new Error('CLOUDFLARE_EMAIL environment variable is not set');
        }
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs/${liveStreamId}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
                Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
            },
        });
        const liveStream = (await response.json());
        if (liveStream.success) {
            return res.json(liveStream);
        }
        return res.json({ error: liveStream.errors[0].message });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
});
export default liveStreamRoute;
//# sourceMappingURL=liveStream.js.map