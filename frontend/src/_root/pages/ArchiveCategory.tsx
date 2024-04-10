import ArchiveComponent from "@/components/shared/ArchiveComponent";
import { provincesTest } from "@/lib/provinces";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
category: string;
  description: string;
  files: string[];
  id: number;
  municipality: string;
  title: string;
}

const ArchiveCategory = () => {
  const { province } = useParams<{ province: string}>();
  const [archives, setArchives] = useState<ArchiveProps[]>([]);
  const [provinceLabel, setProvinceLabel] = useState<string | undefined>();
  const [loading, isLoading] = useState(true);
  const { user } = useUserContext();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 640px)");

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

  console.log(province);

  return (
    <div className="w-full">
      <div className="bg-red-200 w-full p-4 flex justify-start">
        {isMobile ? (
          <></>
        ) : (
          <button className="button-back" onClick={() => navigate(-1)}>
            Back
          </button>
        )}
        <h2 className="text-center font-bold text-2xl p-2">{provinceLabel ?? province} Archives</h2>
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
                  <BreadcrumbLink href={`/archives/${province}`}>{province}</BreadcrumbLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <BreadcrumbLink href={`/archives/${province}/`}>{province}</BreadcrumbLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="archive-province-container">
            {archives.map((archive) => (
              <ArchiveComponent
                key={archive.id}
                category={archive.category}
                id={archive.id}
                municipality={archive.municipality}
                title={archive.title}
                province={province}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveCategory;
