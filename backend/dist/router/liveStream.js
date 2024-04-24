import express from 'express';
import fetch from 'node-fetch';
import { db } from '../utils/db.server.js';
import { isAuthenticated } from '../middleware/middleware.js';
import { catchAsync } from '../middleware/errorHandler.js';
import ExpressError from '../middleware/ExpressError.js';
const liveStreamRoute = express.Router();
//GET ongoing livestream
liveStreamRoute.get('/getLiveStreams', 
// isAuthenticated,
catchAsync(async (req, res) => {
    const onGoingLive = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream?status=live-inprogress`, {
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Email': `${process.env.CLOUDFLARE_EMAIL}`,
            Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        },
    });
    const onGoingLiveData = (await onGoingLive.json());
    if (onGoingLiveData.success) {
        return res.status(200).json(onGoingLiveData.result);
    }
    throw new ExpressError('Livestream data error', 400);
}));
//Saved livestream videos
liveStreamRoute.get('/pastLiveStreams', catchAsync(async (req, res) => {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream?status=ready`, {
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Email': `${process.env.CLOUDFLARE_EMAIL}`,
            Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        },
    });
    const data = (await response.json());
    if (data.success) {
        return res.status(200).json(data.result);
    }
    throw new ExpressError('Past Livestream error', 400);
}));
//Get specific livestream
liveStreamRoute.get('/liveStream/:id', isAuthenticated, catchAsync(async (req, res) => {
    const { id } = req.params;
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Email': `${process.env.CLOUDFLARE_EMAIL}`,
            Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        },
    });
    const video = (await response.json());
    if (video.success) {
        return res.status(200).json(video.result);
    }
    throw new ExpressError('Specific livestream error', 400);
}));
liveStreamRoute.get('/getUrlStreamKey', isAuthenticated, catchAsync(async (req, res) => {
    const sessionId = req.session.user?.id;
    const user = await db.user.findUnique({
        where: {
            id: sessionId,
        },
    });
    if (user) {
        return res.status(200).json({
            url: user.url,
            streamKey: user.streamKey,
            videoUID: user.videoUID,
        });
    }
    throw new ExpressError('Error getting streamkey', 400);
}));
//StartLiveStream
liveStreamRoute.post('/startLiveStream', isAuthenticated, catchAsync(async (req, res) => {
    const body = req.body;
    const user = req.session.user?.id;
    const currentUser = await db.user.findUnique({ where: { id: user } });
    if (user && currentUser) {
        const onGoingLive = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream?status=live-inprogress`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Email': `${process.env.CLOUDFLARE_EMAIL}`,
                Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
            },
        });
        const onGoingLiveData = (await onGoingLive.json());
        const liveInputValues = onGoingLiveData.result.map((stream) => stream.liveInput);
        const isLiveStreamOnGoing = liveInputValues.includes(body.uid);
        if (isLiveStreamOnGoing) {
            //GET THE VALUE OF THE VIDEO UID
            const videoUID = onGoingLiveData.result.map((stream) => stream.uid);
            const valueOfVideoUID = videoUID[0];
            //Retrieve the specific video
            const videoDetails = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/${valueOfVideoUID}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Email': `${process.env.CLOUDFLARE_EMAIL}`,
                    Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
                },
            });
            const videoDetailsData = (await videoDetails.json());
            //Check if the video is already saved in the database
            //Edit video Details:
            const editVideo = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream/${videoDetailsData.result.uid}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auth-Email': `${process.env.CLOUDFLARE_EMAIL}`,
                    Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
                },
                method: 'POST',
                body: JSON.stringify({
                    creator: currentUser.username,
                    meta: {
                        name: body.title,
                        title: body.title,
                        description: body.description,
                        fullName: `${currentUser?.firstName} ${currentUser?.lastName}`,
                        username: `${currentUser?.username}`,
                    },
                }),
            });
            const existingVideo = await db.liveStream.findFirst({
                where: {
                    uid: videoDetailsData.result.uid,
                },
            });
            if (!existingVideo) {
                const newVideo = await db.liveStream.create({
                    data: {
                        uid: videoDetailsData.result.uid,
                        title: body.title,
                        description: body.description,
                        userId: currentUser.id,
                    },
                });
            }
            if (existingVideo) {
                await db.liveStream.update({
                    where: {
                        uid: existingVideo.uid,
                    },
                    data: {
                        uid: videoDetailsData.result.uid,
                        title: body.title,
                        description: body.description,
                        userId: currentUser.id,
                    },
                });
            }
            const editedVideoData = await editVideo.json();
            return res.status(200).json(editedVideoData);
        }
        throw new ExpressError('Please start the camera with OBS', 400);
    }
}));
//Get livestream comments
liveStreamRoute.get('/liveStream/:id/comments', isAuthenticated, catchAsync(async (req, res) => {
    const { id } = req.params;
    //Find the id in the database:
    const liveStream = await db.liveStream.findFirst({
        where: {
            uid: id,
        },
        include: {
            comments: true,
        },
    });
    if (liveStream) {
        return res.json(liveStream?.comments);
    }
    throw new ExpressError('No livestream found', 404);
}));
//LiveDetails fetchLiveStreams
liveStreamRoute.get('/fetchLiveStreams/:id', catchAsync(async (req, res) => {
    const id = req.params.id;
    const liveStreams = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream`, {
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Email': `${process.env.CLOUDFLARE_EMAIL}`,
            Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        },
    });
    const liveStreamsData = (await liveStreams.json());
    if (liveStreamsData.success) {
        //getResults without the current id
        const liveStreamsDataWithoutId = liveStreamsData.result.filter((data) => data.uid !== id);
        return res.json(liveStreamsDataWithoutId);
    }
    throw new ExpressError('Failed to get livestreams', 404);
}));
liveStreamRoute.get('/deleteLiveStreams', async (req, res) => {
    const data = await db.liveStreamComment.deleteMany({});
    return res.json(data);
});
export default liveStreamRoute;
//# sourceMappingURL=liveStream.js.map