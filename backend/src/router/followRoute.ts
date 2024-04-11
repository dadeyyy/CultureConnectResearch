import express from "express";
import { db } from "../utils/db.server.js";

const followRouter = express.Router();

followRouter.post("/follow", async (req, res) => {
  try {
    const { followerId, followingId } = req.body;
    await db.followers.create({
      data: {
        followerId: parseInt(followerId),
        followingId: parseInt(followingId),
      },
    });
    res.status(200).json({ message: "Successfully followed user" });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

followRouter.delete("/unfollow/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.body.currentUser; // Retrieve current user's ID
    if (!currentUser) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    await db.followers.deleteMany({
      where: {
        followerId: parseInt(currentUser),
        followingId: parseInt(userId),
      },
    });
    res.status(200).json({ message: "Successfully unfollowed user" });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

followRouter.get("/is-following/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.session.user?.id; // Access current user's ID from session
    const isFollowing = await db.followers.findFirst({
      where: {
        followerId: currentUser,
        followingId: parseInt(userId),
      },
    });
    res.status(200).json({ isFollowing: !!isFollowing });
  } catch (error) {
    console.error("Error checking if user is following:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

followRouter.get("/following-count/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const followingCount = await db.followers.count({
      where: {
        followerId: parseInt(userId),
      },
    });
    res.status(200).json({ followingCount });
  } catch (error) {
    console.error("Error fetching following count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

followRouter.get("/followers-count/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const followersCount = await db.followers.count({
      where: {
        followingId: parseInt(userId),
      },
    });
    res.status(200).json({ followersCount });
  } catch (error) {
    console.error("Error fetching followers count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

followRouter.get("/people-you-may-know", async (req, res) => {
  try{
    const people = await db.user.findMany({
      take: 5,
  })
    res.status(200).json({people})
  }catch(error){
    console.error("error ", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

export default followRouter;
