import { Skeleton } from "@/components/ui/skeleton";
import { useUserContext } from "@/context/AuthContext";

import { useEffect, useState } from "react";
import FollowCard from "./followCard";
type peopleProps = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  province?: string;
  avatarUrl: string;
}[];

const Peoples = () => {
  const [people, setPeople] = useState<peopleProps>([]);
  const [peopleLoad, setPeopleLoad] = useState(false);
  const { user, isLoading } = useUserContext();

  useEffect(() => {
    const fetchPeople = async () => {
      setPeopleLoad(true);
      try {
        const response = await fetch(`http://localhost:8000/peoples`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPeople(data.people);
        setPeopleLoad(false);
      } catch (error) {
        console.log(error);
        setPeopleLoad(false);
      }
    };

    fetchPeople();
  }, []);

  return (
    <>
      <div className="flex gap-1 items-center mt-5 hover:cursor-pointer">
        <img
          src={
            isLoading
              ? "/assets/icons/profile-placeholder.svg"
              : user.imageUrl || "/assets/icons/profile-placeholder.svg"
          }
          alt="profile picture"
          className="h-12 w-12 rounded-full bg-cover"
        />
        <div
          className="flex flex-col"
          onClick={() => {
            window.location.href = `/profile/${user.id}`;
          }}
        >
          {isLoading || !user.id ? (
            <p>Loading...</p>
          ) : (
            <>
              <p className="font-bold text-regular">
                {user.firstName} {user.lastName}
              </p>
              <p className="small-regular text-light-3">@{user.username}</p>
            </>
          )}
        </div>
      </div>
      <h3 className="font-bold text-base">People you may know</h3>
      {peopleLoad === true ? (
        <>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px] bg-gray-400" />
              <Skeleton className="h-4 w-[200px] bg-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full bg-gray-400" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px] bg-gray-400" />
              <Skeleton className="h-4 w-[200px] bg-gray-400" />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {people.map((person) => (
              <div
                key={person.id}
                className="flex items-center space-x-4 cursor-pointer"
              >
                <FollowCard userId={person.id} />
              </div>
            ))}
          </div>
        </>
      )}
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
    </>
  );
};

export default Peoples;
