import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import Loader from "./Loader";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "../ui/button";
import ArchiveForm from "../forms/ArchiveForm";
import { provincesTest } from "@/lib/provinces";

interface ArchiveData {
  id: number;
  title: string;
  description: string;
  municipality: string;
  files: File[];
  dateCreated: string;
}

interface File {
  url: string;
  filename: string;
}

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
        const response = await fetch(`http://localhost:8000/archive/${province}/${id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch archive data");
        }
        const data = await response.json();
        console.log(data.data);
        setArchiveData(data.data);
      } catch (error: any) {
        console.error(error);
        setError(error.message || "Failed to fetch archive data");
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
          <button className="button-back" onClick={() => navigate(-1)}>
            Back
          </button>
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
      const response = await fetch(`http://localhost:8000/archive/${province}/${archiveId}`, {
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
        <button className="button-back" onClick={() => navigate(-1)}>
          Back
        </button>
        <h2 className="text-center font-bold text-2xl">Archives Details</h2>
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
                  <ArchiveForm
                    closeDrawer={closeDrawer}
                    provinceData={province}
                    action="Update"
                    archiveData={archiveData}
                  />
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

      <div className="p-5">
        <Table className="mb-2">
          <TableBody>
            <TableRow className="border-2 hover:border-b-black">
              <TableCell className="font-bold w-1/5 border-2">Archive Id:</TableCell>
              <TableCell>{archiveData.id}</TableCell>
            </TableRow>
            <TableRow className="border-2 hover:border-b-black">
              <TableCell className="font-bold w-1/5 border-2">Title:</TableCell>
              <TableCell>{archiveData.title}</TableCell>
            </TableRow>
            <TableRow className="border-2 hover:border-b-black">
              <TableCell className="font-bold border-2">Municipality:</TableCell>
              <TableCell>{archiveData.municipality}</TableCell>
            </TableRow>
            <TableRow className="border-2 hover:border-b-black">
              <TableCell className="font-bold border-2">Description:</TableCell>
              <TableCell>{archiveData.description}</TableCell>
            </TableRow>
            <TableRow className="border-2 hover:border-b-black">
              <TableCell className="font-bold border-2">Date Created:</TableCell>
              <TableCell>{archiveData.dateCreated}</TableCell>
            </TableRow>

            {archiveData.files.some((file) => file.url.endsWith(".pdf")) && (
              <TableRow>
                <TableCell className="font-bold">PDF:</TableCell>
                <TableCell>
                  {archiveData.files.map(
                    (file, index) =>
                      file.url.endsWith(".pdf") && (
                        <div key={index}>
                          <a
                            href={file.url}
                            download={file.url}
                            className="flex items-center border-2 p-2 gap-2 w-96 rounded-xl border-white hover:border-red-200"
                          >
                            <img
                              src="/public/assets/images/pdf-image.svg"
                              alt="PDF Icon"
                              height={100}
                              width={100}
                            />
                            <div className="text-center flex-col flex">
                              <span className="font-bold">{file.filename}</span>
                              <span> - Click to download</span>
                            </div>
                          </a>
                        </div>
                      )
                  )}
                </TableCell>
              </TableRow>
            )}

            {archiveData.files.some(
              (file) => file.url.endsWith(".jpg") || file.url.endsWith(".png")
            ) && (
              <TableRow>
                <TableCell className="font-bold">Image(s):</TableCell>
                <TableCell>
                  <div className="w-full flex flex-wrap">
                    <Carousel className="max-w-lg mx-auto">
                      <CarouselContent>
                        {/* Map each image to a separate CarouselItem */}
                        {archiveData.files
                          .filter((file) => file.url.endsWith(".jpg") || file.url.endsWith(".png"))
                          .map((file, index) => (
                            <CarouselItem key={index}>
                              <Card className="min-w-full ">
                                <CardContent className="flex items-center justify-center p-6 min-w-full">
                                  <img
                                    src={file.url}
                                    onClick={() => handleOpenLightbox()}
                                    width="300"
                                    style={{
                                      margin: "2px",
                                      objectFit: "cover",
                                    }}
                                    alt=""
                                  />
                                </CardContent>
                              </Card>
                            </CarouselItem>
                          ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {archiveData.files.some((file) => file.url.endsWith(".mp4")) && (
              <TableRow>
                <TableCell className="font-bold">Video(s):</TableCell>
                <TableCell>
                  <div className="w-full flex flex-wrap">
                    {archiveData.files.map(
                      (file, index) =>
                        file.url.endsWith(".mp4") && (
                          <div key={index}>
                            <video controls src={file.url} className="w-full aspect-square" />
                          </div>
                        )
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Render Lightbox component with slides */}
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
