import { Skeleton } from "@/components/ui/skeleton";
import { useUserContext } from "@/context/AuthContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type peopleProps = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  province?: string;
  avatarUrl: string;
  email: string;
}[];
const server = process.env.REACT_APP_BACKEND_PORT || 'http://localhost:8000'
const Admins = () => {
  const [people, setPeople] = useState<peopleProps>([]);
  const [peopleLoad, setPeopleLoad] = useState(false);

  useEffect(() => {
    const fetchPeople = async () => {
      setPeopleLoad(true);
      try {
        const response = await fetch(`${server}/admins-users`, {
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

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0) : "";
    const lastInitial = lastName ? lastName.charAt(0) : "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  return (
    <div className="w-full px-2">
      <div className="text-lg font-bold py-5">List of Province Admins</div>

      <Accordion type="single" collapsible className="w-full">
        {people.map((person) => (
          <AccordionItem value={person.id} key={person.id}>
            <AccordionTrigger className="capitalize">{person.province}</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row gap-2">
                <Avatar>
                  <AvatarImage src={person.avatarUrl} alt={`profile-pictre`} />
                  <AvatarFallback>{getInitials(person.firstName, person.lastName)}</AvatarFallback>
                </Avatar>
                <div className="items-center flex-col">
                  <div className="flex items-center">
                    <span className="font-bold">
                      {person.firstName} {person.lastName}
                    </span>
                    <span>@{person.username}</span>
                  </div>
                  <span>{person.email}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Admins;
