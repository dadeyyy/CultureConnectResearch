import express from 'express';
import axios from 'axios';

const liveStreamRoute = express.Router();

liveStreamRoute.post('/createLivestream', async (req, res) => {
  try {
    const data = req.body;
    const response = await axios.post(
      'https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/stream/live_inputs',
      {
        meta: { name: data.name },
        recording: { mode: 'automatic' },
      },
      {
        headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`
        }
      }
    );

    const url = response.rtmps.url;
    const streamKey = response.rtmps.streamKey;
    

    

    //SAMPLE RESPONSE DATA:
    // {
    //     "uid": "f256e6ea9341d51eea64c9454659e576",
    //     "rtmps": {
    //       "url": "rtmps://live.cloudflare.com:443/live/",
    //       "streamKey": "MTQ0MTcjM3MjI1NDE3ODIyNTI1MjYyMjE4NTI2ODI1NDcxMzUyMzcf256e6ea9351d51eea64c9454659e576"
    //     },
    //     "created": "2021-09-23T05:05:53.451415Z",
    //     "modified": "2021-09-23T05:05:53.451415Z",
    //     "meta": {
    //       "name": "test stream"
    //     },
    //     "status": null,
    //     "recording": {
    //       "mode": "automatic",
    //       "requireSignedURLs": false,
    //       "allowedOrigins": null
    //     }
    //   }
    

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default liveStreamRoute;
