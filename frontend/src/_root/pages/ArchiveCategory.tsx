import ArchiveComponent from "@/components/shared/ArchiveComponent";
import { provincesTest, provincesWithImage } from "@/lib/provinces";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "@/components/shared/Loader";

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
  createdAt: string;
}
[];

const server = process.env.REACT_APP_BACKEND_PORT || 'http://localhost:8000'

const ArchiveCategory = () => {
  const { province, category } = useParams<{ province: string; category: string }>();
  const [archives, setArchives] = useState<ArchiveProps[]>([]);
  const [provinceLabel, setProvinceLabel] = useState<string | undefined>();
  const [loading, isLoading] = useState(true);

  useEffect(() => {
    const label = provincesTest.find((item) => item.value === province)?.label;
    setProvinceLabel(label);
  }, [province]);

  console.log(province);
  console.log(category);

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await fetch(`${server}/archives/${province}/${category}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setArchives(data);
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
        </div>
      </div>

      {loading ? (
        <div className="p-5">
          <Loader />
        </div>
      ) : (
        <div className="bg-red w-full h-2/3 overflow-auto pb-5  bg-gradient-to-r from-cyan-100 to-blue-100">
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
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <BreadcrumbLink href={`/archives/${province}/${category}`} className="capitalize">
                    {category}
                  </BreadcrumbLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="archive-province-container">
            {archives.length > 0 ? (
              archives.map((archive) => (
                <ArchiveComponent
                  createdAt={archive.createdAt}
                  key={archive.id}
                  category={archive.category}
                  id={archive.id}
                  municipality={archive.municipality}
                  title={archive.title}
                  province={province}
                />
              ))
            ) : (
              <p>No archives found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveCategory;
