import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import { usePostContext } from "@/context/ForYouContext";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowCard from "@/components/shared/followCard";
import ArchiveComponent from "@/components/shared/ArchiveComponent";
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

const Explore = () => {
  const [searchValue, setSearchValue] = useState("");
  const { user } = useUserContext();
  const { postData, isPostLoading, error, fetchPosts } = usePostContext();
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult>();

  const visiblePosts = showAllPosts ? postData : postData.slice(0, 2);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const searchItems = async () => {
      try {
        const response = await fetch(`http://localhost:8000/search?query=${searchValue}`, {
          credentials: "include",
        });
        const data: SearchResult = await response.json();
        setSearchResults(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    searchItems();
  }, [searchValue]);

  const formatDateToWord = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="flex flex-1 overflow-y-scroll custom-scrollbar">
      <div className="explore-container">
        <div className="explore-inner_container">
          <h2 className="h3-bold md:h2-bold w-full">Explore</h2>
          <div className="flex gap-1 px-4 w-full rounded-lg bg-gray-200">
            <img src="/assets/icons/explore.svg" width={24} height={24} alt="search" />
            <Input
              type="text"
              placeholder="Search"
              className="explore-search"
              value={searchValue}
              onChange={(e) => {
                const { value } = e.target;
                setSearchValue(value);
              }}
            />
          </div>
        </div>
        <div className="flex flex-col w-full py-2">
          {searchValue === "" ? (
            <>
              {postData.length > 0 && (
                <>
                  <span className="text-xl font-bold m-auto">For you</span>
                  <hr className="border-2 border-gray-500 w-1/3 m-auto" />
                  <div className="home-posts">
                    <span className="text-lg font-semibold">Based on your likes:</span>
                    {isPostLoading ? (
                      <Loader />
                    ) : error ? (
                      <div className="error-container">
                        <p className="body-medium text-dark-1">Error: {error}</p>
                      </div>
                    ) : (
                      <>
                        <ul className="flex flex-col flex-1 gap-9 w-full">
                          {visiblePosts.map((post) => (
                            <li key={post.id} className="flex justify-center w-full">
                              <PostCard post={post} userId={user.id} />
                            </li>
                          ))}
                        </ul>
                        {postData.length > 2 && !showAllPosts && (
                          <button
                            className="text-blue-500 hover:underline mt-4"
                            onClick={() => setShowAllPosts(true)}
                          >
                            See More
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <Tabs defaultValue="posts" className="w-full ">
              <TabsList className="grid w-full grid-cols-4">
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
                            <AccordionItem value={event.id.toString()}>
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

      <div className="home-creators">
        <span className="text-sm">
          <span className="hover:underline cursor-pointer m-1">Terms of Service</span>
          <span className="hover:underline cursor-pointer m-1">Privacy Policy</span>
          <span className="hover:underline cursor-pointer m-1"> About</span>
          <div>
            <span className="m-1">© 2024 CultureConnect.</span>
          </div>
        </span>
      </div>
    </div>
  );
};

export default Explore;
