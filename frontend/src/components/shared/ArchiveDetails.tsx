import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow, TableHead } from "@/components/ui/table";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import ReactPlayer from "react-player";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import Loader from "./Loader";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "../ui/button";
import ArchiveForm from "../forms/ArchiveForm";
import { multiFormatDateString } from "@/lib/utils";
import { useMediaQuery } from "@react-hook/media-query";
import { municipalities, provincesTest } from "@/lib/provinces";

interface ArchiveData {
  id: number;
  title: string;
  description: string;
  municipality: string;
  files: File[];
  dateCreated: string;
  category: string;
}

interface File {
  url: string;
  filename: string;
}
const server ='http://localhost:8000'
const ArchiveDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { province } = useParams<{ province: string }>();
  const [archiveData, setArchiveData] = useState<ArchiveData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const updateIndex = ({ index: current }: { index: number }) => setIndex(current);
  const [index, setIndex] = React.useState(0);
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [provinceLabel, setProvinceLabel] = useState<string | undefined>();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    const label = provincesTest.find((item) => item.value === province)?.label;
    setProvinceLabel(label);
  }, [province]);

  useEffect(() => {
    const fetchArchiveData = async () => {
      try {
        const response = await fetch(`${server}/archive/${province}/${id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch archive data");
        }
        const data = await response.json();
        setArchiveData(data.data);
        console.log(archiveData);
      } catch (error) {
        console.error(error);
        
          setError( "Failed to fetch archive data");
 
      } finally {
        setLoading(false);
      }
    };

    fetchArchiveData();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-full">
        <div className="bg-red-200 w-full p-4 flex justify-between">
          {isMobile ? (
            <button className="hidden button-back" onClick={() => navigate(-1)}>
              Back
            </button>
          ) : (
            <button className="button-back" onClick={() => navigate(-1)}>
              Back
            </button>
          )}
          <h2 className="text-center font-bold text-2xl">Archives Details</h2>
          <div></div>
        </div>
        <div className="w-full m-auto p-10">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!archiveData) {
    return <div>Error: Archive data not available</div>;
  }

  const handleOpenLightbox = () => {
    setOpen(true);
  };

  //DELETE FUNCTION
  const deleteArchive = async (archiveId: number) => {
    try {
      const response = await fetch(`${server}/archive/${province}/${archiveId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete archive: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Archive deleted successfully:", data);
      // Redirect or perform any necessary action after successful deletion
      navigate(`/explore/${province}`);
    } catch (error) {
      console.error("Error deleting archive:", error);
      // Handle error (show message, etc.)
    }
  };

  return (
    <div className="w-full overflow-auto">
      <div className="bg-red-200 w-full p-4 flex justify-between">
        {isMobile ? (
          <></>
        ) : (
          <button className="button-back" onClick={() => navigate(-1)}>
            Back
          </button>
        )}
        <h2 className="text-center font-bold text-2xl p-2">Archives Details</h2>
        {user.role === "ADMIN" && user.province === province ? (
          <div className="px-3">
            <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
              <DrawerTrigger asChild>
                <Button className="w-1/2 add-archive-submit" onClick={() => setIsDrawerOpen(true)}>
                  Edit
                </Button>
              </DrawerTrigger>
              <DrawerContent className="min-h-[720px] max-h-[800px] bg-white">
                <div className="w-full flex px-4 flex-col">
                  <div className="flex justify-between">
                    <DrawerTitle className="font-bold text-lg">
                      Edit this archive from {provinceLabel ?? province}
                    </DrawerTitle>
                  </div>
                  <ArchiveForm provinceData={province} action="Update" archiveData={archiveData} />
                </div>
              </DrawerContent>
            </Drawer>

            <Button
              className="w-1/2 add-archive-cancel"
              onClick={() => deleteArchive(archiveData.id)}
            >
              Delete
            </Button>
          </div>
        ) : (
          <div className="bg-red-200"></div>
        )}
      </div>

      <div className="py-5 lg:px-10 sm:px-5">
        {isMobile ? (
          <Table className="mb-2">
            <TableBody>
              <TableRow className="border-2 hover:border-b-black">
                <TableCell className="font-bold w-1/5 border-2">Archive Id:</TableCell>
                <TableCell className="text-wrap w-full">{archiveData.id}</TableCell>
              </TableRow>
              <TableRow className="border-2 hover:border-b-black">
                <TableCell className="font-bold w-1/5 border-2">Title:</TableCell>
                <TableCell className="text-wrap w-full">{archiveData.title}</TableCell>
              </TableRow>
              <TableRow className="border-2 hover:border-b-black">
                <TableCell className="font-bold border-2">Date Created:</TableCell>
                <TableCell className="text-wrap w-full">
                  {multiFormatDateString(archiveData.dateCreated)}
                </TableCell>
              </TableRow>
              <TableRow className="border-2 hover:border-b-black">
                <TableCell className="font-bold border-2">Municipality:</TableCell>
                <TableCell className="text-wrap w-full">{archiveData.municipality}</TableCell>
              </TableRow>
              <TableRow className="border-2 hover:border-b-black">
                <TableCell className="font-bold border-2">Description:</TableCell>
                <TableCell className="text-wrap w-full">{archiveData.description}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <Table className="mb-2">
            <TableBody className="border-2">
              <TableRow className="border-2 bg-gray-200">
                <TableHead className="font-bold w-1/12 text-center border-2">Id</TableHead>
                <TableHead className="font-bold min-w-[100px] text-center border-2">
                  Date Created
                </TableHead>
                <TableHead className="font-bold w-2/12 text-center border-2">Location</TableHead>
                <TableHead className="font-bold w-full text-center border-2">
                  Title & Description
                </TableHead>
              </TableRow>
              <TableRow className="border-2">
                <TableCell className="font-bold text-center border-2">{archiveData.id}</TableCell>
                <TableCell className="font-bold text-center border-2">
                  {multiFormatDateString(archiveData.dateCreated)}
                </TableCell>
                <TableCell className="font-bold text-center border-2">
                  {archiveData.municipality &&
                    municipalities[province ?? ""]?.find(
                      (municipal) => municipal.value === archiveData.municipality
                    )?.label}
                  {archiveData.municipality && ", "}
                  {province && provincesTest.find((prov) => prov.value === province)?.label}
                </TableCell>
                <TableCell className="font-bold flex flex-col text-balance border-2">
                  <span className="font-bold text-base ">{archiveData.title}</span>
                  <span className="text-sm font-normal text-justify">
                    {archiveData.description}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}

        <div className="w-full m-auto p-2 text-center">
          <span className="font-bold text-lg">Files:</span>
        </div>
        <div className="w-full grid xl:grid-cols-4 lg:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1">
          {archiveData.files.map((file, index) => (
            <div key={index}>
              {file.url.endsWith(".pdf") && (
                <a
                  href={file.url}
                  target="_blank"
                  className="flex items-center border-2 p-2 gap-2 w-full rounded-xl border-white hover:border-red-200"
                >
                  <img
                    src="/public/assets/images/pdf-image.svg"
                    alt="PDF Icon"
                    height={100}
                    width={100}
                  />
                  <div className="text-center flex-col flex">
                    <span className="font-normal"> - Click to view or open pdf</span>
                  </div>
                </a>
              )}

              {file.url.endsWith(".jpg") && (
                <div
                  className="flex items-center border-2 p-2 gap-2 w-full rounded-xl border-white hover:border-red-200"
                  onClick={() => handleOpenLightbox()}
                >
                  <img
                    src={file.url}
                    alt="PDF Icon"
                    height={100}
                    width={100}
                    className="aspect-square"
                    onClick={() => handleOpenLightbox()}
                  />
                  <div className="text-center flex-col flex">
                    <span className="font-normal"> - Click to view or open image</span>
                  </div>
                </div>
              )}
              {file.url.endsWith(".png") && (
                <div
                  className="flex items-center border-2 p-2 gap-2 w-full rounded-xl border-white hover:border-red-200"
                  onClick={() => handleOpenLightbox()}
                >
                  <img
                    src={file.url}
                    alt="PDF Icon"
                    height={100}
                    width={100}
                    className="aspect-square"
                    onClick={() => handleOpenLightbox()}
                  />
                  <div className="text-center flex-col flex">
                    <span className="font-normal"> - Click to view or open image</span>
                  </div>
                </div>
              )}

              {file.url.endsWith(".mp4") && (
                <div>
                  <div
                    className="flex items-center border-2 p-2 gap-2 w-full rounded-xl border-white hover:border-red-200"
                    onClick={() => setSelectedVideoUrl(file.url)}
                  >
                    <img
                      src="/public/assets/images/videos-image.svg"
                      alt="PDF Icon"
                      height={100}
                      width={100}
                    />
                    <div className="text-center flex-col flex">
                      <span className="font-normal"> - Click to view or open video</span>
                    </div>
                  </div>

                  {selectedVideoUrl && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
                      <div className="relative">
                        <ReactPlayer url={file.url} controls width="100%" height="100%" />
                        <button
                          className="absolute top-2 right-2 text-white text-2xl cursor-pointer hover:blue-500"
                          onClick={() => {
                            setSelectedVideoUrl("");
                          }}
                        >
                          <img src={"/assets/icons/close.svg"} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={archiveData.files
          .filter((file) => file.url.endsWith(".jpg") || file.url.endsWith(".png"))
          .map((file) => ({ src: file.url }))}
      />
    </div>
  );
};

export default ArchiveDetails;
