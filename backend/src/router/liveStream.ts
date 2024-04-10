import express from 'express';
import axios from 'axios';

const liveStreamRoute = express.Router();
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

type LiveInput = {
    created: string;
    deleteRecordingAfterDays: number;
    meta: {
      name: string;
    };
    modified: string;
    uid: string;
  }[]
  

type cloudflareResponse = {
  result: {
    uid: string;
    rtmps: {
      url: string;
      streamKey: string;
    };
    created: string;
    modified: string;
    meta: {
      name: string;
    };
    status: string | null;
    recording: {
      mode: string;
      requireSignedURLs: boolean;
      allowedOrigins: string[] | null;
    };
  };
};

liveStreamRoute.post('/createLivestream', async (req, res) => {
  try {
    const data = req.body;
    const response = await axios.post<cloudflareResponse>(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/live_inputs`,
      {
        meta: { name: data.name },
        recording: { mode: 'automatic' },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        },
      }
    );
    const url = response.data.result.rtmps.url;
    const streamKey = response.data.result.rtmps.streamKey;

    if (response.data) {
      return res.status(200).json({ url, streamKey });
    }

    return res.status(404).json({ error: 'No data!' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

liveStreamRoute.get('/getLiveStreams', async (req, res) => {

    try{

        const response = await axios.get(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Email': `${process.env.CLOUDFLARE_EMAIL}`,
                    'Authorization': `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
                },
                
            }
        );
        
        const { data } = response;

        if(data.success){
            // const liveInputs: LiveInput = data.result.liveInputs;
            // const liveInputsData = liveInputs.map((live)=>({name: live.meta.name, uid: live.uid}))


            // console.log(data.success)
            // return res.status(200).json(liveInputsData)

            console.log(data)
            res.status(200).json(data)
        }
        return res.status(400).json({error:'Data not found!'})
    }
    catch(error){
        console.log(error);
        res.status(500).json({error})
    }
});

export default liveStreamRoute;
