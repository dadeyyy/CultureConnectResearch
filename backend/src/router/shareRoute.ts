import express from "express";
import { isAuthenticated, isAuthor, validate } from "../middleware/middleware.js";
import { db } from "../utils/db.server.js";
import { upload, cloudinary } from "../utils/cloudinary.js";
import { postSchema, postTypeSchema, sharedPostTypeSchema } from "../utils/Schemas.js";

const shareRoute = express.Router();

// GET SPECIFIC SHARED POST
shareRoute.get("/shared-post/:id", async (req, res) => {
  try {
    // Get parameter ID
    const sharedId = parseInt(req.params.id);

    // Find post in the database
    const sharedPost = await db.sharedPost.findUnique({
      where: {
        id: sharedId,
      },
      include: {
        user: {
          select: {
            avatarUrl: true,
            createdAt: true,
            firstName: true,
            id: true,
            lastName: true,
            role: true,
            username: true,
            province: true,
          },
        },
        post: {
          include: {
            photos: true,
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                province: true,
                role: true,
              },
            },
          },
        },
      },
    });

    // If post is found, return post
    if (sharedPost) {
      return res.status(200).json(sharedPost);
    }

    // If not, return not found
    return res.status(404).json({ error: "Post not found!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Share a post
shareRoute.post("/post/share/:postId", isAuthenticated, async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const userId = req.session.user?.id;
    const data: sharedPostTypeSchema = req.body;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const postToShare = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        photos: true,
        user: true,
        comments: true,
      },
    });

    if (!postToShare) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Create a new shared post entry
    const sharedPost = await db.sharedPost.create({
      data: {
        caption: data.caption,
        postId: postToShare.id,
        userId: userId,
      },
      include: {
        post: true,
        user: true,
      },
    });

    return res.status(201).json({ message: "Post shared successfully", data: sharedPost });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch shared posts
shareRoute.get("/post/shared", async (req, res) => {
  try {
    const limit: number = parseInt(req.query.limit as string) || 1;
    const offset: number = parseInt(req.query.offset as string) || 0;

    const sharedPosts = await db.sharedPost.findMany({
      include: {
        post: {
          include: {
            photos: true,
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                province: true,
                avatarUrl: true,
                interest: true,
              },
            },
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(sharedPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Cannot get the shared posts" });
  }
});

// DELETE sharedpost
shareRoute.delete("/shared-post/:sharedId", isAuthenticated, async (req, res) => {
  try {
    const sharedId = parseInt(req.params.sharedId);

    // Find shared post to delete
    const sharedPost = await db.sharedPost.findUnique({
      where: {
        id: sharedId,
      },
    });

    if (!sharedPost) {
      return res.status(404).json({ error: "Can't find shared post!" });
    }

    // Delete the shared post
    await db.sharedPost.delete({
      where: {
        id: sharedId,
      },
    });

    return res.status(200).json({ message: `Successfully deleted shared post! #${sharedId}` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error, message: "Internal Server Error!" });
  }
});

export default shareRoute;
