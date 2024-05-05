import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import { usePostContext } from "@/context/ForYouContext";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowCard from "@/components/shared/followCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGl, { Marker } from "react-map-gl";
import { Label } from "@radix-ui/react-label";
import { Link } from "react-router-dom";
import { multiFormatDateString } from "@/lib/utils";
import Peoples from "@/components/shared/Peoples";
import { Button } from "@/components/ui/button";
import PostSkeleton from "@/components/shared/PostSkeleton";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGFkZXkiLCJhIjoiY2xyOWhjcW45MDFkZjJtbGRhM2toN2k4ZiJ9.STlq7rzxQrBIiH4BbrEvoA";

type Post = {
  id: number;
  caption: string;
  createdAt: string;
  municipality: string;
  photos: {
    id: number;
    url: string;
    filename: string;
    postId: number;
  }[];
  province: string;
  updatedAt: string;
  user: {
    avatarUrl: string | null;
    createdAt: string;
    firstName: string;
    id: number;
    lastName: string;
    role: string;
    username: string;
    province?: string;
  };
  tags: string[];
};

type UserProps = {
  id: number;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  province: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  interest: string[];
};

type ArchiveProps = {
  id: number;
  title: string;
  description: string;
  province: string;
  municipality: string;
  location: {
    type: string;
    coordinates: number[];
  };
  category: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
};

type CalendarProps = {
  id: number;
  title: string;
  municipality: string;
  details: string;
  location: {
    type: string;
    coordinates: number[];
  };
  startDate: string;
  endDate: string | null;
  repeat: string;
  createdAt: string;
  updatedAt: string;
  provinceId: string;
};

type SearchResult = {
  posts: Post[];
  users: UserProps[];
  archives: ArchiveProps[];
  events: CalendarProps[];
};

type Recommendation = {
  like: Post[];
  interest: Post[];
};
const server = "http://localhost:8000";
const Explore = () => {
  const [searchValue, setSearchValue] = useState("");
  const { user } = useUserContext();
  // const { postData, isPostLoading, error, fetchPosts } = usePostContext();
  const [searchResults, setSearchResults] = useState<SearchResult>();
  const [isLoading, setIsLoading] = useState(false);
  const [likeData, setLikeData] = useState<Post[]>([]);
  const [interestData, setInterestData] = useState<Post[]>([]);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReco = async () => {
      try {
        const response = await fetch(`${server}/algorithm`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setLikeData(data.like);
        setIsPostLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Something went wrong while fetching posts. Please try again later.");
        setIsPostLoading(false);
      }
    };
    fetchReco();
  }, []);

  useEffect(() => {
    const fetchReco = async () => {
      try {
        const response = await fetch(`${server}/interest`, {
          credentials: "include",
        });
        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setInterestData(data.interest);
        setIsPostLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Something went wrong while fetching suggested posts. Please try again later.");
        setIsPostLoading(false);
      }
    };
    fetchReco();
  }, []);

  const searchItems = async (searchValue: string) => {
    setIsLoading(true);
    try {
      const encodedSearchValue = encodeURIComponent(searchValue);
      const response = await fetch(`${server}/search?query=${encodedSearchValue}`, {
        credentials: "include",
      });
      const data: SearchResult = await response.json();
      setSearchResults(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const formatDateToWord = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };
  console.log(interestData);

  return (
    <div className="flex flex-1 overflow-y-scroll custom-scrollbar">
      <div className="explore-container">
        <div className="explore-inner_container">
          <h2 className="h3-bold md:h2-bold w-full">Explore</h2>
          <div className="flex gap-1 w-full rounded-lg bg-gray-200 items-center">
            <Input
              type="text"
              placeholder="Search"
              className="explore-search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button
              className="bg-transparent hover:bg-blue-200"
              onClick={() => {
                searchItems(searchValue);
              }}
            >
              <img src="/assets/icons/explore.svg" width={24} height={24} alt="search" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col w-full py-2">
          {isLoading && <Loader />}
          {!searchResults ? (
            <>
              <span className="text-xl font-bold m-auto">For you</span>
              <hr className="border-2 border-gray-500 w-1/3 m-auto" />
              {likeData.length > 0 && (
                <>
                  <div className="home-posts">
                    <span className="text-lg font-semibold text-start w-full">
                      Based on your likes:
                    </span>
                    {isPostLoading ? (
                      <Loader />
                    ) : (
                      <>
                        <ul className="flex flex-col flex-1 gap-9 w-full">
                          {likeData.map((post) => (
                            <li key={post.id} className="flex justify-center w-full">
                              <PostCard post={post} userId={user.id} />
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </>
              )}
              {interestData.length > 0 ? (
                <>
                  <div className="home-posts">
                    <span className="text-lg font-semibold text-start w-full">
                      Based on your interests:
                    </span>
                    {isPostLoading ? (
                      <Loader />
                    ) : (
                      <>
                        <ul className="flex flex-col flex-1 gap-9 w-full">
                          {interestData.map((post) => (
                            <li key={post.id} className="flex justify-center w-full">
                              <PostCard post={post} userId={user.id} />
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <PostSkeleton />
              )}
            </>
          ) : (
            <Tabs defaultValue="posts" className="w-full ">
              <TabsList className="grid w-full grid-cols-4 h-12">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="archives">Archives</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>
              <TabsContent value="posts">
                <Card>
                  <CardHeader>
                    <CardTitle>Posts results: </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {!searchResults ? (
                      <Loader />
                    ) : searchResults.posts.length > 0 ? (
                      <ul className="flex flex-col flex-1 gap-9 w-full">
                        {searchResults.posts.map((post) => (
                          <li key={post.id} className="flex justify-center w-full">
                            <PostCard post={post} userId={user.id} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No search results found.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="users">
                <Card>
                  <CardHeader>
                    <CardTitle>Users results: </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {!searchResults ? (
                      <Loader />
                    ) : searchResults.users.length > 0 ? (
                      <ul className="flex flex-col flex-1 gap-9 w-full">
                        {searchResults.users.map((user) => (
                          <li key={user.id} className="flex justify-center w-full">
                            <FollowCard userId={user.id.toString()} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No search results found.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="archives">
                <Card>
                  <CardHeader>
                    <CardTitle>Archives results: </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {!searchResults ? (
                      <Loader />
                    ) : searchResults.archives.length > 0 ? (
                      <ul className="flex flex-col flex-1 gap-2 w-full">
                        {searchResults.archives.map((archive) => (
                          <li key={archive.id} className="flex justify-center w-full">
                            <Link
                              to={`/archives/${archive.province}/${archive.category}/${archive.id}`}
                              className="w-full"
                            >
                              <div className="px-2 py-2 border hover:rounded-md w-full border-transparent border-b-black  hover:border-black ease-in-out duration-300 flex gap-3">
                                <img src={"/assets/icons/archive-icon-2.svg"} width={40} />
                                <div>
                                  <h2 className="text-md font-bold">{archive.title}</h2>
                                  <p className="text-sm">
                                    Date Created: {multiFormatDateString(archive.createdAt)}
                                  </p>
                                  <p className="text-sm capitalize">
                                    Municipality: {archive.municipality}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No search results found.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="events">
                <Card>
                  <CardHeader>
                    <CardTitle>Events results: </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {!searchResults ? (
                      <Loader />
                    ) : searchResults.events.length > 0 ? (
                      <div>
                        <Accordion type="single" collapsible className="w-full">
                          {searchResults.events.map((event) => (
                            <AccordionItem value={event.id.toString()} key={event.id}>
                              <AccordionTrigger>{event.title}</AccordionTrigger>
                              <AccordionContent className="flex flex-col gap-2">
                                <span className="font-semibold">
                                  {event.endDate === null
                                    ? formatDateToWord(event.startDate)
                                    : `${formatDateToWord(event.startDate)} to ${formatDateToWord(
                                        event.endDate
                                      )}`}
                                </span>
                                <span>{event.details}</span>
                                <div className="flex flex-col h-full">
                                  <Label className="font-semibold">Map: </Label>
                                  <ReactMapGl
                                    mapLib={import("mapbox-gl")}
                                    initialViewState={{
                                      longitude: event?.location.coordinates[0],
                                      latitude: event?.location.coordinates[1],
                                      zoom: 10,
                                    }}
                                    style={{ width: "100%", height: 250 }}
                                    mapStyle="mapbox://styles/mapbox/streets-v9"
                                  >
                                    <Marker
                                      latitude={event.location.coordinates[1] || 0}
                                      longitude={event.location.coordinates[0] || 0}
                                    />
                                  </ReactMapGl>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    ) : (
                      <p>No search results found.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      <div className="home-creators custom-scrollbar overflow-x-auto gap-2">
        <Peoples />
      </div>
    </div>
  );
};

export default Explore;
