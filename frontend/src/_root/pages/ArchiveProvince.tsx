import { provincesTest, provincesWithImage } from "@/lib/provinces";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ArchiveForm from "@/components/forms/ArchiveForm";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { multiFormatDateString } from "@/lib/utils";

interface ArchiveData {
  id: number;
  title: string;
  description: string;
  category: string;
  province: string;
  municipality: string;
  createdAt: string;
}

const server = process.env.REACT_APP_BACKEND_PORT || 'http://localhost:8000'

const ArchiveProvince = () => {
  const { province } = useParams<{ province: string }>();
  const [archives, setArchives] = useState<ArchiveData[]>([]);
  const [provinceLabel, setProvinceLabel] = useState<string | undefined>();
  const [loading, isLoading] = useState(true);
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [counts, setCounts] = useState<{
    documentCount: number;
    artifactCount: number;
    monumentCount: number;
  }>({
    documentCount: 0,
    artifactCount: 0,
    monumentCount: 0,
  });
  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await fetch(`${server}/archive-count/${province}`, {
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
        const response = await fetch(`${server}/recent/${province}`, {
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

  const provinceImage = provincesWithImage.find((item) => item.value === province)?.image;

  return (
    <div className="w-full">
      <div className="archive-header items-center">
        <img
          src={provinceImage}
          alt="image province"
          className="object-cover opacity-50 inset-0 w-full h-full"
        />
        <div className="absolute flex flex-col p-5 items-center">
          <h2 className="text-center font-bold text-5xl p-2">
            {provinceLabel ?? province} Archives
          </h2>
          <Sheet>
            <SheetTrigger asChild>
              {user.role === "ADMIN" && user.province === province ? (
                <Button variant="outline" className="add-archive">
                  Add Archive
                </Button>
              ) : (
                <div className="bg-red-200"></div>
              )}
            </SheetTrigger>
            <SheetContent className="min-h-[720px] max-h-[800px] bg-white" side={"bottom"}>
              <div className="w-full flex px-4 flex-col">
                <div className="flex justify-between">
                  <SheetHeader>
                    <SheetTitle className="font-bold text-lg">
                      Add an archive in {provinceLabel}
                    </SheetTitle>
                  </SheetHeader>
                </div>
                <ArchiveForm provinceData={province} action="Create" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {loading ? (
        <div className="p-5">
          <Loader />
        </div>
      ) : (
        <div className="bg-red w-full h-2/3 overflow-auto">
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
            <div className="h-full flex flex-col p-5">
              <span className="border border-transparent border-b-gray-400 text-2xl">
                Recently Added
              </span>
              <div className="p-2">
                <ul>
                  <hr className="border-2 w-1/3 border-blue-400 rounded-" />
                  {archives.length > 0 ? (
                    archives.map((archive) => (
                      <li
                        className="flex flex-row border border-transparent border-y-gray-400 gap-4 p-2 hover:text-blue-500 cursor-pointer"
                        onClick={() => {
                          navigate(`/archives/pampanga/document/${archive.id}`);
                        }}
                      >
                        <img src={"/assets/icons/archive-icon-2.svg"} width={25} />
                        <span className="text-base">
                          <p className="font-bold">{archive.title}</p>
                          <p className="text-sm">
                            Created {multiFormatDateString(archive.createdAt)} -{" "}
                            <span className="capitalize">{archive.municipality}</span>
                          </p>
                          <p className="text-xs">Category: {archive.category}</p>
                        </span>
                      </li>
                    ))
                  ) : (
                    <p>No archives found.</p>
                  )}
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
