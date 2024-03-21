import ArchiveComponent from "@/components/shared/ArchiveComponent";
import { provincesTest } from "@/lib/provinces";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
];

interface ArchiveProps {
  description: string;
  files: string[];
  id: number;
  municipality: string;
  title: string;
}

const ArchiveProvince = () => {
  const { province } = useParams<{ province: string }>();
  const [archives, setArchives] = useState<ArchiveProps[]>([]);
  const [provinceLabel, setProvinceLabel] = useState<string | undefined>();
  const [goal, setGoal] = useState(350);

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await fetch(`http://localhost:8000/archive/${province}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setArchives(data.data);
        } else {
          throw new Error("Failed to fetch archives");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchArchives();
  }, [province]);

  useEffect(() => {
    const label = provincesTest.find((item) => item.value === province)?.label;
    setProvinceLabel(label);
  }, [province]);

  return (
    <div className="w-full">
      <div className="bg-red-200 w-full p-5 flex justify-between">
        <h2>{provinceLabel ?? province} Archives</h2>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Add Archive</Button>
          </DrawerTrigger>
          <DrawerContent className="min-h-[720px] bg-white">
            <div className="bg-red-200 w-full p-5 flex justify-end">
              <DrawerHeader>
                <DrawerTitle>Move Goal</DrawerTitle>
                <DrawerDescription>Set your daily activity goal.</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-0">
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full"
                    onClick={() => onClick(-10)}
                    disabled={goal <= 200}
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Decrease</span>
                  </Button>
                  <div className="flex-1 text-center">
                    <div className="text-7xl font-bold tracking-tighter">{goal}</div>
                    <div className="text-[0.70rem] uppercase text-muted-foreground">
                      Calories/day
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full"
                    onClick={() => onClick(10)}
                    disabled={goal >= 400}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Increase</span>
                  </Button>
                </div>
              </div>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="archive-province-container">
        {archives.map((archive) => (
          <ArchiveComponent
            key={archive.id}
            description={archive.description}
            files={archive.files}
            id={archive.id}
            municipality={archive.municipality}
            title={archive.title}
            province={province}
          />
        ))}
      </div>
    </div>
  );
};

export default ArchiveProvince;
