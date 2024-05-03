import express from "express";
import {
  isAuthenticated,
  isAuthor,
  isProvinceAdmin,
  validate,
} from "../middleware/middleware.js";
import { db } from "../utils/db.server.js";
import { upload, cloudinary } from "../utils/cloudinary.js";
import {
  postSchema,
  postTypeSchema,
  sharedPostTypeSchema,
} from "../utils/Schemas.js";
import { catchAsync } from "../middleware/errorHandler.js";
import ExpressError from "../middleware/ExpressError.js";
import { Request, Response } from "express";
import axios from "axios";

type CheckResult = {
  alcohol: number;
  drugs: number;
  gore: { prob: number };
  media: { id: string; uri: string };
  medical_drugs: number;
  nudity: {
    sexual_activity: number;
    sexual_display: number;
    erotica: number;
    sextoy: number;
  };
  offensive: {
    prob: number;
    nazi: number;
    confederate: number;
    supremacist: number;
    terrorist: number;
  };
  recreational_drugs: number;
  request: {
    id: string;
    timestamp: number;
    operations: number;
  };
  skull: { prob: number };
  status: string;
  weapon: number;
  weapon_firearm: number;
  weapon_knife: number;
};

const postRoute = express.Router();

// postRoute.get("/testnudes", async (req, res) => {
//   try {
//     const response = await axios.get(
//       "https://api.sightengine.com/1.0/check.json",
//       {
//         params: {
//           url: "https://res.cloudinary.com/dmpip4nzo/image/upload/v1714672569/uploads/urawsjdjqym8gvg61t0b.jpg",

//           models: "nudity-2.0,offensive,gore",
//           api_user: "1265562336",
//           api_secret: "kEUrZw2vnrqS2XvArXXe77VCbvFf2k4j",
//         },
//       }
//     );
//     const result: CheckResult = response.data;
//     console.log(result);
//     res.json(response.data);
//   } catch (error) {
//     // handle error
//     if (axios.isAxiosError(error)) {
//       if (error.response) res.json(error.response.data);
//       else res.status(500).json({ error: error.message });
//     } else {
//       res.status(500).json({ error });
//     }
//   }
// });

async function validateImage(url: string, id: number) {
  try {
    const response = await axios.get(
      "https://api.sightengine.com/1.0/check.json",
      {
        params: {
          url: `${url}`,
          models: "nudity-2.0,offensive,gore",
          api_user: "1265562336",
          api_secret: "kEUrZw2vnrqS2XvArXXe77VCbvFf2k4j",
        },
      }
    );
    const result: CheckResult = response.data;
    console.log(result);
    if (!result) {
      return "error";
    }
    if (
      result.gore.prob >= 0.8 ||
      result.nudity.erotica >= 0.8 ||
      result.nudity.sextoy >= 0.8 ||
      result.nudity.sexual_activity >= 0.8 ||
      result.nudity.sexual_display >= 0.8 ||
      result.offensive.prob >= 0.8
    ) {
      await db.sharedPost.deleteMany({
        where: {
          postId: id,
        },
      });

      const deletePost = await db.post.delete({
        where: {
          id: id,
        },
        include: {
          reports: true,
          photos: true,
          sharedPost: true,
        },
      });
      return deletePost;
    } else {
      const updatedPost = await db.post.update({
        where: {
          id: id,
        },
        data: {
          isValidated: true,
        },
        include: {
          photos: true,
        },
      });
      console.log(updatedPost);
      return updatedPost;
    }
  } catch (error) {
    // handle error
    if (axios.isAxiosError(error)) {
      if (error.response) return error.response.data;
      else return { error: error.message };
    } else {
      return { error };
    }
  }
}

setInterval(async () => {
  const post = await db.post.findMany({
    where: { isValidated: false },
    include: {
      photos: true,
    },
  });

  post.map(async (images) =>
    images.photos.map(async (image) => {
      try {
        const result = await validateImage(image.url, images.id);
        console.log(result);
      } catch (error) {
        console.error("Error:", error);
      }
    })
  );
  console.log("Running background task...");
}, 10000);

//ADD POST
postRoute.post(
  "/post",
  isAuthenticated,
  upload.array("image"),
  validate(postSchema),
  catchAsync(async (req: Request, res: Response) => {
    const data: postTypeSchema = req.body;
    const files: Express.Multer.File[] = req.files as Express.Multer.File[];
    const tags = data.tags?.replace(/ /g, "").split(",") || [];

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
        tags: tags,
      },
      include: {
        photos: true,
        user: true,
      },
    });
    if (newPost) {
      return res
        .status(201)
        .json({ message: "Successfully created new post", data: newPost });
    }

    throw new ExpressError("Failed to create post", 400);
  })
);

// GET ALL THE POST
postRoute.get(
  "/post",
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const limit: number = parseInt(req.query.limit as string) || 2;
    const offset: number = parseInt(req.query.offset as string) || 0;

    const allPost = await db.post.findMany({
      include: {
        photos: true,
        user: true,
        comments: true,
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(allPost);
  })
);

const deleteOldestData = (array: number[]) => {
  setTimeout(() => {
    array.shift();
  }, 2000);
};

setInterval(() => {
  deleteOldestData(postIds);
  deleteOldestData(sharedPostIds);
}, 30000);

let postIds: number[] = [];
let sharedPostIds: number[] = [];

//fetch all
postRoute.get(
  "/post/all",
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const limit: number = parseInt(req.query.limit as string) || 1;
    console.log(postIds);
    // Fetch existing post IDs
    const regularPosts = await db.post.findMany({
      include: {
        photos: true,
        user: true,
      },
      where: {
        isValidated: true,
        id: {
          notIn: postIds,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
    const regularPostsWithType = regularPosts.map((post) => ({
      ...post,
      type: "regular",
    }));

    const sharedPosts = await db.sharedPost.findMany({
      include: {
        user: true,
      },
      where: {
        id: {
          notIn: sharedPostIds,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    const sharedPostsWithType = sharedPosts.map((sharedPost) => ({
      ...sharedPost,
      type: "shared",
    }));

    const allPosts = [...regularPostsWithType, ...sharedPostsWithType];

    // Sort combined posts by createdAt
    const sortedPosts = allPosts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.status(200).json(sortedPosts);
    regularPosts.forEach((post) => {
      postIds.push(post.id);
    });
    console.log(postIds);
    sharedPosts.forEach((post) => {
      sharedPostIds.push(post.id);
    });
    console.log(sharedPostIds);
  })
);

//fetch all
// postRoute.get(
//   "/post/all",
//   isAuthenticated,
//   catchAsync(async (req: Request, res: Response) => {
//     const limit: number = parseInt(req.query.limit as string) || 1;
//     const regularOffset: number = parseInt(req.query.offset as string) || 0;
//     const sharedOffset: number =
//       parseInt(req.query.sharedOffset as string) || 0; // New offset for shared posts

//     const regularPosts = await db.post.findMany({
//       include: {
//         photos: true,
//         user: true,
//       },
//       where: {
//         isValidated: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//       skip: regularOffset,
//       take: limit,
//     });

//     const regularPostsWithType = regularPosts.map((post) => ({
//       ...post,
//       type: "regular",
//     }));

//     const sharedPosts = await db.sharedPost.findMany({
//       include: {
//         user: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//       skip: sharedOffset, // Use separate offset for shared posts
//       take: limit,
//     });

//     const sharedPostsWithType = sharedPosts.map((sharedPost) => ({
//       ...sharedPost,
//       type: "shared",
//     }));

//     const allPosts = [...regularPostsWithType, ...sharedPostsWithType];

//     // Sort combined posts by createdAt
//     const sortedPosts = allPosts.sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     );

//     res.status(200).json(sortedPosts);
//   })
// );

// GET SPECIFIC POST
postRoute.get(
  "/post/:id",
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    // Get parameter ID
    const postId = parseInt(req.params.id);

    // Find post in the database
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        photos: true,
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            role: true,
            province: true,
          },
        }, // Corrected include syntax
      },
    });

    // If post is found, return post
    if (post) {
      return res.status(200).json(post);
    }

    // If not, return not found
    throw new ExpressError("Post not found", 404);
  })
);

postRoute.put(
  "/post/:postId",
  isAuthenticated,
  isAuthor,
  upload.array("image"),
  validate(postSchema),
  catchAsync(async (req: Request, res: Response) => {
    const postId = parseInt(req.params.postId);
    const data: postTypeSchema = req.body;
    const files = req.files as Express.Multer.File[];
    const tags = data.tags?.replace(/ /g, "").split(",") || [];

    const dataNoFiles = {
      caption: data.caption,
      province: data.province,
      municipality: data.municipality,
      userId: req.session.user?.id,
      tags: tags,
    };

    let newFiles: { url: string; filename: string }[] = [];
    if (files && files.length > 0) {
      newFiles = files.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));
    }

    const updatedPost = await db.post.update({
      where: {
        id: postId,
      },
      data: {
        ...dataNoFiles,
        photos: {
          create: newFiles,
        },
      },
      include: {
        photos: true,
      },
    });

    if (data.deletedFiles) {
      for (let filename of data.deletedFiles) {
        await cloudinary.uploader.destroy(filename);
      }

      const filesToDelete = await db.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          photos: true,
        },
      });

      const dataToDelete = data.deletedFiles.filter((file) =>
        filesToDelete?.photos.some((filename) => file === filename.filename)
      );

      await db.post.update({
        where: { id: postId },
        data: {
          photos: {
            deleteMany: { filename: { in: dataToDelete } },
          },
        },
        include: {
          photos: true,
        },
      });
    }

    return res.status(200).json(updatedPost);
  })
);

postRoute.delete(
  "/post/:postId",
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const postId = parseInt(req.params.postId);

    // Find post to delete
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new ExpressError("Post not found", 404);
    }

    // Delete associated SharedPost records first
    await db.sharedPost.deleteMany({
      where: {
        postId: postId,
      },
    });

    // Then delete the Post
    const deletedPost = await db.post.delete({
      where: {
        id: postId,
      },
      include: { photos: true },
    });

    return res
      .status(200)
      .json({ message: `Successfully deleted post! #${deletedPost.id}` });
  })
);

postRoute.post(
  "/post/:postId/report",
  catchAsync(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const currentUser = req.session.user?.id;
    const { reason } = req.body;

    // Find post
    const post = await db.post.findUnique({
      where: {
        id: +postId,
      },
      include: {
        user: true,
      },
    });

    // Determine if the post is the current user's post, if not, proceed to report
    if (!post || post.user.id === currentUser) {
      throw new ExpressError(
        "You cannot report your own post or the post does not exist",
        403
      );
    }

    // Check if the user has already reported this post
    const existingReport = await db.report.findFirst({
      where: {
        postId: +postId,
        userId: currentUser,
      },
    });

    if (existingReport) {
      throw new ExpressError("You already reported this post", 400);
    }

    // Create a report record
    await db.report.create({
      data: {
        postId: +postId as number,
        userId: currentUser as number,
        reportReason: reason,
      },
    });

    // Update the reportCount field in the Post model
    const updatedPost = await db.post.update({
      where: {
        id: +postId,
      },
      data: {
        reportCount: {
          increment: 1,
        },
      },
      include: {
        reports: true,
      },
    });

    if (updatedPost.reports.length > 2) {
      const deletedReportedPost = await db.post.delete({
        where: {
          id: +postId,
        },
        include: {
          reports: true,
        },
      });

      return res.json({ deletedReportedPost, message: "Post was deleted" });
    }

    return res
      .status(200)
      .json({ message: "Post reported successfully", updatedPost });
  })
);

//get reports via province e
postRoute.get(
  "/post/reported/:province",
  isAuthenticated,
  isProvinceAdmin,
  async (req, res) => {
    const province = req.params.province;

    const reportedPosts = await db.post.findMany({
      where: {
        reports: {
          some: {
            AND: [{ post: { province } }],
          },
        },
      },
      include: {
        reports: true,
        user: true,
        photos: true,
      },
    });
    if (reportedPosts) {
      return res.status(200).json(reportedPosts);
    }
  }
);

//following posts
postRoute.get(
  "/following/posts",
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const limit: number = parseInt(req.query.limit as string) || 1;
    const regularOffset: number = parseInt(req.query.offset as string) || 0;
    const sharedOffset: number =
      parseInt(req.query.sharedOffset as string) || 0;
    const userId = req.session.user?.id;

    const followingIds = await db.followers.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });
    const followingUserIds = followingIds.map((entry) => entry.followingId);

    const regularPosts = await db.post.findMany({
      include: {
        photos: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: regularOffset,
      take: limit,
      where: {
        userId: {
          in: followingUserIds,
        },
      },
    });

    const regularPostsWithType = regularPosts.map((post) => ({
      ...post,
      type: "regular",
    }));

    const sharedPosts = await db.sharedPost.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: sharedOffset, // Use separate offset for shared posts
      take: limit,
      where: {
        userId: {
          in: followingUserIds,
        },
      },
    });

    const sharedPostsWithType = sharedPosts.map((sharedPost) => ({
      ...sharedPost,
      type: "shared",
    }));

    const allPosts = [...regularPostsWithType, ...sharedPostsWithType];

    // Sort combined posts by createdAt
    const sortedPosts = allPosts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.status(200).json(sortedPosts);
  })
);

//get reports via province e
postRoute.get(
  "/get-post/:userId",
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);

    const posts = await db.post.findMany({
      where: {
        userId: userId,
      },
      include: {
        photos: true,
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
    if (posts) {
      return res.status(200).json(posts);
    }
  })
);

postRoute.get(
  "/user/likes/:id",
  isAuthenticated,
  catchAsync(async (req: Request, res: Response) => {
    const userIdParam = req.params.id;
    const userId = parseInt(userIdParam);

    if (!userId) {
      throw new Error("Invalid user ID");
    }

    const likedPosts = await db.like.findMany({
      where: {
        userId: userId,
        postId: {
          not: null,
        },
      },
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
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(likedPosts);
  })
);

// postRoute.get("/testnudes", async (req, res) => {
//   try {
//     const response = await axios.get(
//       "https://api.sightengine.com/1.0/check.json",
//       {
//         params: {
//           url: "https://res.cloudinary.com/dmpip4nzo/image/upload/v1714672569/uploads/urawsjdjqym8gvg61t0b.jpg",

//           models: "nudity-2.0,offensive,gore",
//           api_user: "1265562336",
//           api_secret: "kEUrZw2vnrqS2XvArXXe77VCbvFf2k4j",
//         },
//       }
//     );
//     console.log(response.data);
//     res.json(response.data);
//   } catch (error) {
//     // handle error
//     if (axios.isAxiosError(error)) {
//       if (error.response) res.json(error.response.data);
//       else res.status(500).json({ error: error.message });
//     } else {
//       res.status(500).json({ error });
//     }
//   }
// });

export default postRoute;
