import express from "express";
import { db } from "../utils/db.server.js";
import { isAuthenticated } from "../middleware/middleware.js";
import { mostLikedProvince } from "../utils/mostLikedProvince.js";
import ContentBasedRecommender from "content-based-recommender-ts";

const algoRoute = express.Router();

const recommender = new ContentBasedRecommender({
  minScore: 0.1,
  maxSimilarDocs: 100,
  maxVectorSize: 2000,
  debug: true,
});

// algoRoute.get("/content/:id", async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const currentUser = parseInt(userId);

//     // Find user
//     const userLikes = await db.user.findUnique({
//       where: {
//         id: currentUser,
//       },
//       include: {
//         likes: true,
//       },
//     });

//     if (!userLikes) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const userLikesId = userLikes.likes.map((userLike) => userLike.postId);

//     const filteredUserLikesId = userLikesId
//       .filter((id) => id !== null)
//       .map(Number)
//       .sort((a, b) => b - a);

//     const lastId = filteredUserLikesId[filteredUserLikesId.length - 1];
//     console.log(
//       "length-1",
//       filteredUserLikesId[filteredUserLikesId.length - 1]
//     );
//     console.log("index-0", filteredUserLikesId[0]);
//     if (filteredUserLikesId.length === 0) {
//       return res
//         .status(204)
//         .json({ message: "No liked posts found for the user" });
//     }

//     const recentPost = await db.post.findMany({
//       select: {
//         id: true,
//       },
//       where: {
//         id: lastId,
//       },
//       take: 1,
//     });

//     console.log(filteredUserLikesId);
//     console.log(
//       "recent post: ",
//       recentPost.map((post) => post.id)
//     );
//     const recentPostStrint = recentPost.map((post) => post.id);
//     const similarDocuments = recommender.getSimilarDocuments(
//       recentPostStrint.toString()
//     );
//     similarDocuments.map((id) => {
//       console.log(id.id);
//     });
//     console.log(similarDocuments);
//     res.status(200).json({
//       success: true,
//       message: "Content-based recommender trained successfully.",
//       similarDocuments: similarDocuments,
//     });
//   } catch (error) {
//     console.error("Error while training content-based recommender:", error);
//     res.status(500).json({ success: false, message: "Internal server error." });
//   }
// });

algoRoute.get("/algorithm", isAuthenticated, async (req, res) => {
  try {
    const currentUser = req.session.user?.id;

    const posts = await db.post.findMany({
      select: {
        id: true,
        caption: true,
        tags: true,
      },
    });

    const documents = posts.map((post) => ({
      id: post.id.toString(),
      content: post.caption,
    }));

    recommender.train(documents);

    // Find user
    // const userLikes = await db.user.findUnique({
    //   where: {
    //     id: currentUser,
    //   },
    //   include: {
    //     likes: true,
    //   },
    // });

    // if (!userLikes) {
    //   return res.status(404).json({ error: "User not found" });
    // }

    // // Get all postId
    // const userLikesId = userLikes.likes.map((userLike) => userLike.postId);

    // // Filter out null values from userLikesId
    // const filteredUserLikesId = userLikesId.filter((id) => id !== null) as number[];

    // if (filteredUserLikesId.length === 0) {
    //   return res.status(204).json({ message: "No liked posts found for the user" });
    // }

    // const userPostProvinces = await db.post.findMany({
    //   where: {
    //     id: {
    //       in: filteredUserLikesId,
    //     },
    //   },
    // });

    // const provinces = userPostProvinces.map((post) => post.province);

    // const mostLikedProvinces = mostLikedProvince(provinces);

    const userLikes = await db.user.findUnique({
      where: {
        id: currentUser,
      },
      include: {
        likes: true,
      },
    });

    if (!userLikes) {
      return res.status(404).json({ error: "User not found" });
    }

    const userLikesId = userLikes.likes.map((userLike) => userLike.postId);

    const filteredUserLikesId = userLikesId
      .filter((id) => id !== null)
      .map(Number)
      .sort((a, b) => b - a);

    const lastId = filteredUserLikesId[0];

    if (filteredUserLikesId.length === 0) {
      return res
        .status(204)
        .json({ message: "No liked posts found for the user" });
    }

    const recentPost = await db.post.findMany({
      select: {
        id: true,
      },
      where: {
        id: lastId,
      },
      take: 1,
    });

    console.log(filteredUserLikesId);
    console.log("length-1", filteredUserLikesId[0]);
    console.log("index-0", filteredUserLikesId[0]);
    console.log(
      "recent post: ",
      recentPost.map((post) => post.id)
    );
    const recentPostStrint = recentPost.map((post) => post.id);
    const similarDocuments = recommender.getSimilarDocuments(
      recentPostStrint.toString()
    );
    similarDocuments.map((id) => {
      console.log(+id.id);
    });

    const postIds = similarDocuments.map((id) => +id.id);

    const suggestedPosts = await db.post.findMany({
      where: {
        id: {
          in: postIds,
          notIn: filteredUserLikesId,
        },
      },
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
      take: 5,
      include: {
        user: true,
        photos: true,
      },
    });

    console.log("Post id", postIds);
    console.log(suggestedPosts);
    const user = await db.user.findUnique({
      where: { id: currentUser },
      select: { interest: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userInterests = user.interest || [];

    const recommendedPosts = await db.post.findMany({
      where: {
        OR: userInterests.flatMap((interest) => [
          { tags: { has: interest } },
          { caption: { contains: interest, mode: "insensitive" } },
          { province: { contains: interest, mode: "insensitive" } },
          { municipality: { contains: interest, mode: "insensitive" } },
        ]),
        id: {
          notIn: filteredUserLikesId,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        photos: true,
        user: true,
      },
      distinct: ["id"],
    });

    res.status(200).json({ like: suggestedPosts, interest: recommendedPosts });
  } catch (error) {
    console.error("Error in algorithm route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

algoRoute.get("/search", async (req, res) => {
  const { query } = req.query;
  const queryString = query as string;
  try {
    const searchResults = await db.$transaction([
      db.post.findMany({
        where: {
          OR: [
            { caption: { contains: queryString, mode: "insensitive" } },
            { province: { contains: queryString, mode: "insensitive" } },
            { municipality: { contains: queryString, mode: "insensitive" } },
            { tags: { has: queryString } },
          ],
        },
        include: {
          photos: true,
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      db.user.findMany({
        where: {
          OR: [
            { username: { contains: queryString, mode: "insensitive" } },
            {
              firstName: {
                contains: queryString.split(" ")[0],
                mode: "insensitive",
              },
            }, // Search for firstName
            {
              lastName: {
                contains: queryString.split(" ")[1],
                mode: "insensitive",
              },
            }, // Search for lastName
            {
              AND: [
                {
                  firstName: {
                    contains: queryString.split(" ")[0],
                    mode: "insensitive",
                  },
                },
                {
                  lastName: {
                    contains: queryString.split(" ")[1],
                    mode: "insensitive",
                  },
                },
              ],
            },
          ],
        },
      }),
      db.archive.findMany({
        where: {
          OR: [
            { title: { contains: queryString, mode: "insensitive" } },
            { description: { contains: queryString, mode: "insensitive" } },
            { province: { contains: queryString, mode: "insensitive" } },
            { municipality: { contains: queryString, mode: "insensitive" } },
          ],
        },
      }),
      db.calendar.findMany({
        where: {
          OR: [
            { title: { contains: queryString, mode: "insensitive" } },
            { details: { contains: queryString, mode: "insensitive" } },
            { municipality: { contains: queryString, mode: "insensitive" } },
            { provinceId: { contains: queryString, mode: "insensitive" } },
          ],
        },
      }),
    ]);

    res.json({
      posts: searchResults[0],
      users: searchResults[1],
      archives: searchResults[2],
      events: searchResults[3],
    });
  } catch (error) {
    console.error("Error in search route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

algoRoute.get("/recommended", isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User ID not found in session" });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { interest: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userInterests = user.interest || [];

    const recommendedPosts = await db.post.findMany({
      where: {
        OR: userInterests.flatMap((interest) => [
          { tags: { has: interest } },
          { caption: { contains: interest, mode: "insensitive" } },
          { province: { contains: interest, mode: "insensitive" } },
          { municipality: { contains: interest, mode: "insensitive" } },
        ]),
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        photos: true,
        user: true,
      },
      distinct: ["id"],
    });

    res.status(200).json({ recommendedPosts });
  } catch (error) {
    console.error("Error fetching recommended posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
export default algoRoute;
