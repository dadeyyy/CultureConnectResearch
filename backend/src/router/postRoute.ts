import express from 'express';
import { isAuthenticated, isAuthor, validate } from '../middleware/middleware.js';
import { db } from '../utils/db.server.js';
import { upload } from '../utils/cloudinary.js';
import { postSchema, postTypeSchema } from '../utils/PostSchema.js';

const postRoute = express.Router();

//ADD POST
postRoute.post(
  '/post',
  isAuthenticated,
  upload.array('image'),
  validate(postSchema),
  async (req, res) => {
    try {
      const data: postTypeSchema = req.body;
      const files: Express.Multer.File[] = req.files as Express.Multer.File[];
      const images = files?.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));

      const newPost = await db.post.create({
        data: {
          ...data,
          userId: req.session.user?.id!,
          photos: {
            create: images,
          },
        },
        include: {
          photos: true,
          user: true
        },
      });

      res
        .status(201)
        .json({ message: 'Successfully created new post', data: newPost });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

// GET ALL THE POST
postRoute.get('/post', async (req, res) => {
  try {
    const allPost = await db.post.findMany({
      include: {
        photos: true,
      },
    });
    res.status(200).json(allPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Cannot get the posts' });
  }
});

// GET SPECIFIC POST
postRoute.get('/post/:id', async (req, res) => {
  try {
    //Get parameters ID
    const postId = parseInt(req.params.id);

    //Find post in the database
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        photos: true,
      },
    });

    //If post is found, return post
    if (post) {
      return res.status(200).json(post);
    }

    //If not, return not found
    return res.status(404).json({ error: 'Post not found!' });
  } catch (error) {
    console.log(error);
  }
});

postRoute.put(
  '/post/:postId',
  isAuthenticated,
  upload.array('image'),
  validate(postSchema),
  async (req, res) => {
    try {
      const postId = parseInt(req.params.postId);
      const data: postTypeSchema = req.body;
      const files: Express.Multer.File[] = req.files as Express.Multer.File[];

      //Check if post with the given ID exists
      const post = await db.post.findUnique({
        where: {
          id: postId,
        },
        include: { photos: true },
      });

      //If not, return not found
      if (!post) {
        return res.status(404).json({ error: 'Post not found!' });
      }

      //Update the post data
      const updatedPost = await db.post.update({
        where: { id: postId },
        data: {
          ...data,
          userId: req.session.user?.id,
          photos: {
            create: files?.map((file) => ({
              url: file.path,
              filename: file.filename,
            })),
          },
        },
        include: { photos: true, user: true },
      });

      res
        .status(200)
        .json({ message: 'Successfully updated post', data: updatedPost });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);


postRoute.delete('/post/:postId', isAuthenticated, isAuthor,  async (req,res)=>{

  try{

    const postId = parseInt(req.params.postId)
    
    const deletedPost = await db.post.delete({
      where:{
        id: +postId
      },
      include: {photos: true}
    })
  
    return res.status(500).json({message: `Successfully deleted post! #${deletedPost.id}`})
  }
  catch(error){
    console.log(error)
  }
})

postRoute.get('/allpost', async (req,res)=>{
  
  const allpost = await db.post.findMany({})
  return res.json(allpost)
})

export default postRoute;
