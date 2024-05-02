// EditPost.tsx

import { useParams } from "react-router-dom";
import { getPostById, DummyPost } from "@/dummy/dummy";
import Loader from "@/components/shared/Loader";

import { useEffect, useState } from "react";

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<DummyPost | undefined>(undefined); // Specify the type explicitly
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostById(id);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        {/* <PostForm action="Update" post={post} /> */}
      </div>
    </div>
  );
};

export default EditPost;
