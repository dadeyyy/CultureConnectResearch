import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { multiFormatDateString } from '@/lib/utils';
import { municipalities, provincesTest } from '@/lib/provinces';
import { filterInappropriateWords } from '@/lib/CaptionFilter';
import Carousel from '@/components/shared/Carousel';
import PostStats from '@/components/shared/PostStats';
import toast from 'react-hot-toast';
import Loader from '@/components/shared/Loader';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

interface ReportsProps {
  post: PostProps;
}

interface Report {
  id: number;
  postId: number;
  userId: number;
  reportReason: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PostProps {
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
  reports: Report[];
  user: {
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
    email: string;
    firstName: string;
    id: number;
    lastName: string;
    password: string;
    role: string;
    updatedAt: string;
    username: string;
  };
  reportCount: number;
}
const server = process.env.REACT_APP_BACKEND_PORT || 'http://localhost:8000'
const Reports = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [reportedPosts, setReportedPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    const fetchReportedPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${server}/post/reported/${user.province}`,
          {
            credentials: 'include',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        console.log(data);
        // Check if data is an array
        if (Array.isArray(data)) {
          setReportedPosts(data);
        } else {
          console.error('Data received from API is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching reported posts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user.role === 'ADMIN') {
      fetchReportedPosts();
    }
  }, [user.role, user.province]);

  if (user.role === 'USER') {
    return (
      <div className="bg-red-200 w-full overflow-auto text-center grid justify-items-center items-center">
        <div className="text-2xl font-bold flex flex-col items-center">
          <span>You are not authorized to open this.</span>
          <Button
            className="w-1/2 hover:bg-red-400 hover:text-white"
            onClick={() => {
              navigate(-1);
            }}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  async function handleDeletePost(postId: number) {
    setProgress(true);
    try {
      const response = await fetch(`${server}/post/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Post deleted successfully');
        navigate('/home');
      } else {
        const data = await response.json();
        console.error('DELETE request failed:', data);
        toast.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    } finally {
      setProgress(false);
    }
  }

  console.log(reportedPosts);

  return (
    <div className="flex flex-1 overflow-y-scroll custom-scrollbar">
      <div className="explore-container">
        <div className=" w-full h-16 text-center p-3 sticky">
          <span className="text-xl font-bold">Reported Posts</span>
          {progress && (
            <div className="w-full">
              <Box sx={{ width: '100%' }}>
                <LinearProgress />
              </Box>
            </div>
          )}
        </div>
        <div className="w-full flex flex-col items-center gap-5 h-full py-5 ">
          {loading ? (
            <Loader />
          ) : (
            reportedPosts.map((reportedPost) => (
              <div
                key={reportedPost.id}
                className="w-full flex flex-col xs:gap-2 items-center"
              >
                <div className="w-full p-2 border rounded-xl bg-red-200 flex flex-col">
                  <span className="w-full justify-start flex">
                    <span className="font-bold mr-5">Number of Reports: </span>
                    {reportedPost.reportCount}
                  </span>

                  {reportedPost.reports.map((data) => (
                    <span key={data.id} className="w-full justify-start flex">
                      <span className="font-bold mr-5">
                        Reason of Reports:{' '}
                      </span>{' '}
                      <span className="capitalize">{data.reportReason}</span>
                    </span>
                  ))}
                  <div className="w-full bg-white rounded-lg p-5">
                    <div className="flex-between">
                      <div className="flex items-center gap-3">
                        <Link to={`/profile/${reportedPost.user.id}`}>
                          <img
                            src={
                              reportedPost?.user.avatarUrl ||
                              '/assets/icons/profile-placeholder.svg'
                            }
                            alt="user"
                            className="w-8 h-8 lg:w-12 lg:h-12 object-cover rounded-full"
                          />
                        </Link>

                        <div className="flex flex-col">
                          <div className="flex flex-row text-center gap-2">
                            <p className="base-medium lg:body-bold text-dark-1">
                              {reportedPost.user.firstName}{' '}
                              {reportedPost.user.lastName}
                            </p>
                            {user.id === reportedPost?.user.id &&
                              user.role === `ADMIN` && (
                                <Badge className="bg-green-300 font-light text-xs border border-gray-300">
                                  {user.province}
                                </Badge>
                              )}
                          </div>
                          <div className="flex gap-2 text-dark-3">
                            <p className="subtle-regular lg:text-xs">
                              {multiFormatDateString(reportedPost.createdAt)}
                            </p>
                            <p className="subtle-regular lg:text-xs">
                              {'In '}
                              {reportedPost?.municipality &&
                                municipalities[reportedPost.province]?.find(
                                  (municipal) =>
                                    municipal.value ===
                                    reportedPost.municipality
                                )?.label}
                              {', '}
                              {reportedPost?.province &&
                                provincesTest.find(
                                  (province) =>
                                    province.value === reportedPost.province
                                )?.label}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link to={`/posts/${reportedPost.id}`}>
                      <div className="small-medium lg:base-medium py-5">
                        <p>{filterInappropriateWords(reportedPost.caption)}</p>
                      </div>
                    </Link>
                    <Carousel photos={reportedPost?.photos || []} />
                    {/* <PostStats
                      postId={reportedPost.id}
                      userId={user.id}
                      type="regular"
                    /> */}
                    {/* <Comments postId={reportedPost.id} action="home" /> */}
                  </div>
                  <Button
                    className="bg-red-500 hover:scale-110 hover:bg-red-900 hover:text-white w-full"
                    onClick={() => handleDeletePost(reportedPost.id)}
                  >
                    Delete this post
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="home-creators">
        <span className="text-sm">
          <span className="hover:underline cursor-pointer m-1">
            Terms of Service
          </span>
          <span className="hover:underline cursor-pointer m-1">
            Privacy Policy
          </span>
          <span className="hover:underline cursor-pointer m-1"> About</span>
          <div>
            <span className="m-1">© 2024 CultureConnect.</span>
          </div>
        </span>
      </div>
    </div>
  );
};

export default Reports;
