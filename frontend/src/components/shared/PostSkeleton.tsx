import { Skeleton } from "../ui/skeleton";

const PostSkeleton = () => {
  return (
    <>
      <div className="flex flex-col space-y-2 xs:w-96 lg:w-full p-2">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full bg-gray-500" />
          <div className="space-y-2 ">
            <Skeleton className="h-7 w-[250px]  bg-gray-500" />
            <Skeleton className="h-5 w-[200px]  bg-gray-500" />
          </div>
        </div>
        <Skeleton className="h-10 w-full bg-gray-500" />
        <Skeleton className="h-[550px] w-full bg-gray-500" />
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-4 w-full bg-gray-500" />
          <Skeleton className="h-4 w-full bg-gray-500" />
          <Skeleton className="h-4 w-full bg-gray-500" />
        </div>
      </div>
      <div className="flex flex-col space-y-2 xs:w-96 lg:w-full p-2">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-20 w-20 rounded-full bg-gray-500" />
          <div className="space-y-2 ">
            <Skeleton className="h-7 w-[250px]  bg-gray-500" />
            <Skeleton className="h-5 w-[200px]  bg-gray-500" />
          </div>
        </div>
        <Skeleton className="h-10 w-full bg-gray-500" />
        <Skeleton className="h-[550px] w-full bg-gray-500" />
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-4 w-full bg-gray-500" />
          <Skeleton className="h-4 w-full bg-gray-500" />
          <Skeleton className="h-4 w-full bg-gray-500" />
        </div>
      </div>
    </>
  );
};

export default PostSkeleton;
