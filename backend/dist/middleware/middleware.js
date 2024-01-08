import * as z from 'zod';
import { db } from '../utils/db.server.js';
export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            const zError = error.issues[0].message;
            console.log(zError);
            return res.status(500).json({ error: zError });
        }
        return res.status(400).json({ message: 'Invalid Data', error: error });
    }
};
export function isAuthenticated(req, res, next) {
    if (req.session.user) {
        console.log('AUTHENTICATED');
        next();
    }
    else {
        console.log('User not authenticated!!!');
        return res.status(401).json({ error: 'User not authenticated!' });
    }
}
export const isAuthor = async (req, res, next) => {
    const postId = parseInt(req.params.postId);
    const username = req.session.user?.username;
    try {
        //find post
        const post = await db.post.findUnique({
            where: {
                id: postId,
            },
            include: { user: true },
        });
        const user = post?.user.username;
        const authorized = username === user;
        if (post && authorized) {
            console.log('Authorized');
            next();
        }
        else if (!post) {
            res.status(404).json({ error: "Post can't be found!" });
        }
        else if (!authorized) {
            res.status(401).json({ error: 'Unauthorized' });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
export const isCommentAuthor = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        const author = req.session.user?.id;
        //Find comment
        const comment = await db.comment.findUnique({
            where: {
                id: +commentId,
            },
            include: {
                user: true,
            },
        });
        const commentAuthor = comment?.user.id;
        if (comment && author === commentAuthor) {
            console.log(author);
            console.log(commentAuthor);
            next();
        }
        else {
            return res.status(400).json({ error: 'Not an author' });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error, message: 'INTERNAL SERVER ERROR! ' });
    }
};
//# sourceMappingURL=middleware.js.map