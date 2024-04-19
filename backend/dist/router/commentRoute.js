import express from "express";
import { db } from "../utils/db.server.js";
import { isAuthenticated, validate, isCommentAuthor } from "../middleware/middleware.js";
import { commentSchema } from "../utils/Schemas.js";
const commentRoute = express.Router();
commentRoute.get("/post/:postId/comments", isAuthenticated, async (req, res) => {
    try {
        const postId = req.params.postId;
        //find post with and its comment;
        const comments = await db.comment.findMany({
            where: {
                postId: +postId,
            },
        });
        if (comments) {
            return res.status(200).json({ comments });
        }
    }
    catch (error) {
        console.log(error);
    }
});
commentRoute.post("/post/:postId/comment", isAuthenticated, validate(commentSchema), async (req, res) => {
    const postId = req.params.postId;
    const userId = req.session.user?.id;
    const data = req.body;
    //Find Post
    const post = await db.post.findUnique({
        where: {
            id: +postId,
        },
    });
    if (post) {
        const comment = await db.comment.create({
            data: {
                content: data.content,
                post: {
                    connect: { id: +postId },
                },
                user: {
                    connect: { id: userId },
                },
            },
        });
        console.log(comment);
        return res.status(201).json({ message: `Commented ${comment}`, comment });
    }
    else {
        console.log("No post found");
        return res.status(404).json({ error: "Can't find post" });
    }
});
commentRoute.put("/post/:postId/comment/:commentId", isAuthenticated, isCommentAuthor, validate(commentSchema), async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const data = req.body;
        const updateComment = await db.comment.update({
            where: {
                id: +commentId,
            },
            data: {
                ...data,
            },
            include: {
                user: true,
            },
        });
        return res.status(200).json({
            message: "Successfully updated the comment!",
            data: updateComment,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error, message: "INTERNAL SERVER ERROR" });
    }
});
commentRoute.delete("/post/:postId/comment/:commentId", isAuthenticated, isCommentAuthor, async (req, res) => {
    try {
        const { commentId } = req.params;
        const deletedComment = await db.comment.delete({
            where: {
                id: +commentId,
            },
            include: {
                user: true,
            },
        });
        return res.status(200).json({
            message: "Successfully deleted comment",
            data: deletedComment,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error, message: "INTERNAL SERVER ERROR!" });
    }
});
commentRoute.get("/post/:postId/comments", isAuthenticated, async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentCount = await db.comment.count({
            where: {
                postId: +postId,
            },
        });
        return res.status(200).json({ commentCount });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
commentRoute.get("/shared-post/:postId/comments", isAuthenticated, async (req, res) => {
    try {
        const postId = req.params.postId;
        // Find shared post and its comments
        const comments = await db.comment.findMany({
            where: {
                sharedId: +postId,
            },
        });
        if (comments) {
            return res.status(200).json({ comments });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
commentRoute.post("/shared-post/:postId/comment", isAuthenticated, validate(commentSchema), async (req, res) => {
    const postId = req.params.postId;
    const userId = req.session.user?.id;
    const data = req.body;
    // Find SharedPost
    const sharedPost = await db.sharedPost.findUnique({
        where: {
            id: +postId,
        },
    });
    if (sharedPost) {
        const comment = await db.comment.create({
            data: {
                content: data.content,
                share: {
                    connect: { id: +postId },
                },
                user: {
                    connect: { id: userId },
                },
            },
        });
        console.log(comment);
        return res.status(201).json({ message: `Commented on Shared Post`, comment });
    }
    else {
        console.log("No shared post found");
        return res.status(404).json({ error: "Can't find shared post" });
    }
});
commentRoute.put("/shared-post/:postId/comment/:commentId", isAuthenticated, isCommentAuthor, validate(commentSchema), async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const data = req.body;
        const updateComment = await db.comment.update({
            where: {
                id: +commentId,
            },
            data: {
                ...data,
            },
            include: {
                user: true,
            },
        });
        return res.status(200).json({
            message: "Successfully updated the comment!",
            data: updateComment,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error, message: "INTERNAL SERVER ERROR" });
    }
});
commentRoute.delete("/shared-post/:postId/comment/:commentId", isAuthenticated, isCommentAuthor, async (req, res) => {
    try {
        const { commentId } = req.params;
        const deletedComment = await db.comment.delete({
            where: {
                id: +commentId,
            },
            include: {
                user: true,
            },
        });
        return res.status(200).json({
            message: "Successfully deleted comment",
            data: deletedComment,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error, message: "INTERNAL SERVER ERROR!" });
    }
});
commentRoute.get("/shared-post/:postId/comments-count", isAuthenticated, async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentCount = await db.comment.count({
            where: {
                sharedId: +postId,
            },
        });
        return res.status(200).json({ commentCount });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
export default commentRoute;
//# sourceMappingURL=commentRoute.js.map