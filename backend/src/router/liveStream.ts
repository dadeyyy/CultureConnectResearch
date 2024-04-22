import express from 'express';
import axios from 'axios';
import fetch from 'node-fetch';
import {
  LiveInput,
  cloudflareResponse,
  pastLiveStreamApiResponse,
  liveStreamData,
  editVideoTypes,
  pastLiveStreamTypes,
} from '../utils/liveStreamTypes.js';
import { db } from '../utils/db.server.js';
import { isAuthenticated } from '../middleware/middleware.js';
const liveStreamRoute = express.Router();

//Creating live input
liveStreamRoute.post('/createLivestream', async (req, res) => {
  try {
    const { name, description }: liveStreamData = req.body;

    //Call to the cloudflare create live input api
    const response = await axios.post<cloudflareResponse>(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/live_inputs`,
      {
        meta: { name, description },
        recording: { mode: 'automatic' },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        },
      }
    );

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
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create liveStream' });
  }
});

//GET ongoing livestream
liveStreamRoute.get('/getLiveStreams', async (req, res) => {
  const onGoingLive = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream?status=live-inprogress`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': `${process.env.CLOUDFLARE_EMAIL}`,
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
      },
    }
  );
  const onGoingLiveData =
    (await onGoingLive.json()) as pastLiveStreamApiResponse;

  if (onGoingLiveData) {
    return res.json(onGoingLiveData.result);
  }
});

//Saved livestream videos
liveStreamRoute.get('/pastLiveStreams', async (req, res) => {
  try {
    // Check if CLOUDFLARE_EMAIL environment variable is set
    if (!process.env.CLOUDFLARE_EMAIL) {
      throw new Error('CLOUDFLARE_EMAIL environment variable is not set');
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream?status=ready`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Email': process.env.CLOUDFLARE_EMAIL,
          Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        },
      }
    );

    const data = (await response.json()) as pastLiveStreamApiResponse;

    if (data.success) {
      return res.json(data.result);
    }

    return res.status(400).json(data.errors);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

//Get specific livestream
liveStreamRoute.get('/liveStream/:id', async (req, res) => {
  try{

    const {id} = req.params;
    
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': `${process.env.CLOUDFLARE_EMAIL}`,
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
      },
    })



    if(!response.ok){
      return res.json({message: 'Cannot fetch liveStream'})
    }

    const video  = await response.json() as editVideoTypes;
    
    //Reminder not to forget to return if only the livestream is in status = live-inprogress
    if(video.success){

      return res.status(200).json(video.result)
    }

  }
  catch(err){
    console.log(err)
    return res.status(500).json({message: err})
  }

});

liveStreamRoute.get('/getUrlStreamKey', isAuthenticated, async (req, res) => {
  try {
    const sessionId = req.session.user?.id;
    const user = await db.user.findUnique({
      where: {
        id: sessionId,
      },
    });
    if (user) {
      return res.json({
        url: user.url,
        streamKey: user.streamKey,
        videoUID: user.videoUID,
      });
    }

    return res.status(404).json({ message: 'User not found!' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//StartLiveStream
liveStreamRoute.post('/startLiveStream', isAuthenticated, async (req, res) => {
  const body: { title: string; description: string; uid: string } = req.body;
  const user = req.session.user?.id;
  const currentUser = await db.user.findUnique({ where: { id: user } });

  if(user && currentUser){

  const onGoingLive = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream?status=live-inprogress`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Email': `${process.env.CLOUDFLARE_EMAIL}`,
        Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
      },
    }
  );

  const onGoingLiveData =
    (await onGoingLive.json()) as pastLiveStreamApiResponse;

  const liveInputValues = onGoingLiveData.result.map(
    (stream) => stream.liveInput
  );
  const isLiveStreamOnGoing = liveInputValues.includes(body.uid);

  if (isLiveStreamOnGoing) {
    //GET THE VALUE OF THE VIDEO UID
    const videoUID = onGoingLiveData.result.map((stream) => stream.uid);
    console.log('VIDEOUID', videoUID);
    const valueOfVideoUID = videoUID[0];

    //Retrieve the specific video
    const videoDetails = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/${valueOfVideoUID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Email': `${process.env.CLOUDFLARE_EMAIL}`,
          Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        },
      }
    );

    const videoDetailsData = (await videoDetails.json()) as editVideoTypes;
    
    //Check if the video is already saved in the database
    
    
    //Edit video Details:
    const editVideo = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/${videoDetailsData.result.uid}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Email': `${process.env.CLOUDFLARE_EMAIL}`,
          Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        },
        method: 'POST',
        body: JSON.stringify({
          creator: currentUser?.username,
          meta: {
            name: body.title,
            title: body.title,
            description: body.description,
            fullName: `${currentUser?.firstName} ${currentUser?.lastName}`,
            username: `${currentUser?.username}`
          },
        }),
      }
    );

    const existingVideo = await db.liveStream.findFirst({
      where:{
        uid: videoDetailsData.result.uid
      }
    })

    if(!existingVideo){
      const newVideo = await db.liveStream.create({
        data:{
          uid: videoDetailsData.result.uid,
          title: body.title,
          description: body.description,
          userId: currentUser.id
        }
      })
      console.log(newVideo)
    }

    if(existingVideo){
      await db.liveStream.update({
        where:{
          uid: existingVideo.uid
        },
        data:{
          uid: videoDetailsData.result.uid,
          title: body.title,
          description: body.description,
          userId: currentUser.id
        }
      })
    }

    const editedVideoData = await editVideo.json();
    return res.status(200).json(editedVideoData)
  }

  return res.status(400).json({ message: 'Please start the stream with OBS!' });
}

});

liveStreamRoute.get('/liveStream/:id/comments',async (req,res)=>{
  const {id} = req.params;

  //Find the id in the database:
  const liveStream = await db.liveStream.findFirst({
    where:{
      uid: id
    },
    include:{
      comments: true
    }
  })

  return res.json(liveStream?.comments)

})


liveStreamRoute.get('/deleteLiveStreams', async(req,res)=>{
  const data = await db.liveStreamComment.deleteMany({})
  return res.json(data)
})



export default liveStreamRoute;
