import PostCard from "@/components/shared/PostCard";
import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { dummyPosts } from "@/dummy/dummy";

const Home = () => {
  const isPostLoading = false;
  const isErrorPosts = false;

  const isErrorCreators = false;

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-dark-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-dark-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !dummyPosts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {/* Render PostCard components with dummy data */}
              {dummyPosts.map((dummyPost) => (
                <li key={dummyPost.$id} className="flex justify-center w-full">
                  <PostCard post={dummyPost} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
      </div> */}
    </div>
  );
};

export default Home;
