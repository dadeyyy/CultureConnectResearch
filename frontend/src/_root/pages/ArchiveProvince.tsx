import { provincesTest } from "@/lib/provinces";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import ArchiveForm from "@/components/forms/ArchiveForm";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { useMediaQuery } from "@react-hook/media-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
  const { user } = useUserContext();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [counts, setCounts] = useState<{
    documentCount: number;
    artifactCount: number;
    monumentCount: number;
  }>({
    documentCount: 0,
    artifactCount: 0,
    monumentCount: 0,
  });

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await fetch(`http://localhost:8000/archive-count/${province}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setCounts(data);
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

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await fetch(`http://localhost:8000/archive/${province}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
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

  const handleHistoricalDocumentsClick = () => {
    navigate(`/archives/${province}/document`);
  };

  const handleArtifactsClick = () => {
    navigate(`/archives/${province}/artifact`);
  };

  const handleMonumentsClick = () => {
    navigate(`/archives/${province}/monument`);
  };

  return (
    <div className="w-full">
      <div className="bg-red-200 w-full p-4 flex justify-between">
        {isMobile ? (
          <></>
        ) : (
          <button className="button-back" onClick={() => navigate(-1)}>
            Back
          </button>
        )}
        <h2 className="text-center font-bold text-2xl p-2">{provinceLabel ?? province} Archives</h2>
        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <DrawerTrigger asChild>
            {user.role === "ADMIN" && user.province === province ? (
              <Button
                variant="outline"
                className="add-archive"
                onClick={() => setIsDrawerOpen(true)}
              >
                Add Archive
              </Button>
            ) : (
              <div className="bg-red-200"></div>
            )}
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
        <div className="bg-red w-full">
          <Breadcrumb className="px-5 py-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <BreadcrumbLink href="/archives">Archives</BreadcrumbLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <BreadcrumbLink href={`/archives/${province}`}>{provinceLabel}</BreadcrumbLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className=" w-full grid grid-cols-2 gap-10 px-5">
            <div className="h-[500px] flex flex-col p-5">
              <span className="border border-transparent border-b-gray-400 text-2xl">
                Archive Categories
              </span>
              <hr className="border-2 w-1/3 border-blue-400 rounded-" />
              <div className="p-2">
                <ul className="text-lg">
                  <li
                    className="flex flex-row hover:text-blue-500 cursor-pointer"
                    onClick={handleHistoricalDocumentsClick}
                  >
                    <img src={"/assets/icons/chevron-right.svg"} width={25} />
                    <span>Historical Documents ({counts.documentCount})</span>
                  </li>
                  <li
                    className="flex flex-row hover:text-blue-500 cursor-pointer"
                    onClick={handleArtifactsClick}
                  >
                    <img src={"/assets/icons/chevron-right.svg"} width={25} />
                    <span>Pictures of Artifacts ({counts.artifactCount})</span>
                  </li>
                  <li
                    className="flex flex-row hover:text-blue-500 cursor-pointer"
                    onClick={handleMonumentsClick}
                  >
                    <img src={"/assets/icons/chevron-right.svg"} width={25} />
                    <span>Monuments and Buildings ({counts.monumentCount})</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="h-[500px]  flex flex-col p-5">
              <span className="border border-transparent border-b-gray-400 text-2xl">
                Recently Added
              </span>
              <hr className="border-2 w-1/3 border-blue-400 rounded-" />
              <div className="p-2">
                <ul>
                  <li className="flex flex-row border border-transparent border-y-gray-400 gap-2 p-2">
                    <img src={"/assets/icons/archive-icon-2.svg"} width={25} />
                    <span className="text-base">
                      <p>
                        What Disasters Can Teach Us About Good System Design and problematic child
                      </p>
                    </span>
                  </li>
                  <li className="flex flex-row border border-transparent border-y-gray-400 gap-2 p-2">
                    <img src={"/assets/icons/archive-icon-2.svg"} width={25} />
                    <span className="text-base">
                      <p>
                        What Disasters Can Teach Us About Good System Design and problematic child
                      </p>
                    </span>
                  </li>
                  <li className="flex flex-row border border-transparent border-y-gray-400 gap-2 p-2">
                    <img src={"/assets/icons/archive-icon-2.svg"} width={25} />
                    <span className="text-base">
                      <p>
                        What Disasters Can Teach Us About Good System Design and problematic child
                      </p>
                    </span>
                  </li>
                  <li className="flex flex-row border border-transparent border-y-gray-400 gap-2 p-2">
                    <img src={"/assets/icons/archive-icon-2.svg"} width={25} />
                    <span className="text-base">
                      <p>
                        What Disasters Can Teach Us About Good System Design and problematic child
                      </p>
                    </span>
                  </li>
                  <li className="flex flex-row border border-transparent border-y-gray-400 gap-2 p-2">
                    <img src={"/assets/icons/archive-icon-2.svg"} width={25} />
                    <span className="text-base">
                      <p>
                        What Disasters Can Teach Us About Good System Design and problematic child
                      </p>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* <div className="archive-province-container">
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
          </div> */}
        </div>
      )}
    </div>
  );
};

export default ArchiveProvince;
