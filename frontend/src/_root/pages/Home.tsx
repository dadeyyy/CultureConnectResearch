import PostCard from "@/components/shared/PostCard";
import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";

const Home = () => {
  const dummyPosts = [
    {
      creator: {
        id: 1,
        name: "John Doe",
        imageUrl: "/assets/icons/profile-placeholder.svg",
      },
      $id: "123456",
      $createdAt: "2023-01-01T12:00:00Z",
      location: "City",
      caption: "Lorem ipsum dolor sit amet.",
      tags: ["tag1", "tag2"],
      imageUrl: "/assets/dummy-image.jpg",
    },
  ];

  const dummyCreators = [
    {
      id: 1,
      name: "John Doe",
      imageUrl: "/assets/icons/profile-placeholder.svg",
      username: "nyenyenye",
    },
  ];

  const isPostLoading = false;
  const isErrorPosts = false;

  const isUserLoading = false;
  const isErrorCreators = false;

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
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

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !dummyCreators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {dummyCreators.map((dummyCreator) => (
              <li key={dummyCreator.id}>
                <UserCard user={dummyCreator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
