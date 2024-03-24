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
import ArchiveForm from "@/components/forms/ArchiveForm";
import Loader from "@/components/shared/Loader";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [provinceLabel, setProvinceLabel] = useState<string | undefined>();
  const [loading, isLoading] = useState(true);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

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
          isLoading(false);
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

  console.log(province);

  return (
    <div className="w-full">
      <div className="bg-red-200 w-full p-5 flex justify-between">
        <h2 className="text-center font-bold text-2xl">{provinceLabel ?? province} Archives</h2>
        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="border-2 hover:border-blue-500"
              onClick={() => setIsDrawerOpen(true)}
            >
              Add Archive
            </Button>
          </DrawerTrigger>
          <DrawerContent className="min-h-[720px] max-h-[800px] bg-white">
            <div className="w-full flex px-4 flex-col">
              <div className="flex justify-between">
                <DrawerTitle className="font-bold text-lg">
                  Add an archive in {provinceLabel}
                </DrawerTitle>
              </div>
              <ArchiveForm closeDrawer={closeDrawer} provinceData={province} action="Create" />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {loading ? (
        <div className="p-5">
          <Loader />
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default ArchiveProvince;
