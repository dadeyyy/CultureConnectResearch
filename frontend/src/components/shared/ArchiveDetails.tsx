import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Loader from './Loader';
import { useUserContext } from '@/context/AuthContext';
import { Button } from '../ui/button';

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
  const updateIndex = ({ index: current }: { index: number }) =>
    setIndex(current);
  const [index, setIndex] = React.useState(0);
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    const fetchArchiveData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/archive/${province}/${id}`,
          {
            credentials: 'include',
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch archive data');
        }
        const data = await response.json();
        console.log(data.data);
        setArchiveData(data.data);
      } catch (error: any) {
        console.error(error);
        setError(error.message || 'Failed to fetch archive data');
      } finally {
        setLoading(false);
      }
    };

    fetchArchiveData();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-full">
        <div className="bg-red-100 w-full p-2 flex justify-between">
          <button
            className="border-2 hover:border-black ease-in-out duration-300 rounded-lg p-2"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
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

  return (
    <div className="w-full overflow-auto">
      <div className="bg-red-100 w-full p-2 flex justify-between">
        <button
          className="border-2 hover:border-black ease-in-out duration-300 rounded-lg p-2"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
        {user.role === 'ADMIN' ? (
          <div className="px-3">
            <Button className="w-1/2 add-archive-submit ">Edit</Button>
            <Button className="w-1/2 add-archive-cancel ">Delete</Button>
          </div>
        ) : (
          ''
        )}
      </div>
      <div className="p-5">
        <Table className="mb-2">
          <TableBody>
            <TableRow className="border-2 hover:border-b-black">
              <TableCell className="font-bold w-1/5 border-2">
                Archive Id:
              </TableCell>
              <TableCell>{archiveData.id}</TableCell>
            </TableRow>
            <TableRow className="border-2 hover:border-b-black">
              <TableCell className="font-bold w-1/5 border-2">Title:</TableCell>
              <TableCell>{archiveData.title}</TableCell>
            </TableRow>
            <TableRow className="border-2 hover:border-b-black">
              <TableCell className="font-bold border-2">
                Municipality:
              </TableCell>
              <TableCell>{archiveData.municipality}</TableCell>
            </TableRow>
            <TableRow className="border-2 hover:border-b-black">
              <TableCell className="font-bold border-2">Description:</TableCell>
              <TableCell>{archiveData.description}</TableCell>
            </TableRow>
            <TableRow className="border-2 hover:border-b-black">
              <TableCell className="font-bold border-2">
                Date Created:
              </TableCell>
              <TableCell>{archiveData.dateCreated}</TableCell>
            </TableRow>

            {archiveData.files.some((file) => file.url.endsWith('.pdf')) && (
              <TableRow>
                <TableCell className="font-bold">PDF:</TableCell>
                <TableCell>
                  {archiveData.files.map(
                    (file, index) =>
                      file.url.endsWith('.pdf') && (
                        <div key={index}>
                          <a href={file.url} download={file.filename}>
                            {file.filename}
                          </a>
                        </div>
                      )
                  )}
                </TableCell>
              </TableRow>
            )}

            {archiveData.files.some(
              (file) => file.url.endsWith('.jpg') || file.url.endsWith('.png')
            ) && (
              <TableRow>
                <TableCell className="font-bold">Image(s):</TableCell>
                <TableCell>
                  <div className="w-full flex flex-wrap">
                    {archiveData.files
                      .filter(
                        (file) =>
                          file.url.endsWith('.jpg') || file.url.endsWith('.png')
                      )
                      .map((file, index) => (
                        <div key={index} className="w-full px-2 mb-4">
                          <Carousel className="max-w-lg mx-auto">
                            <CarouselContent>
                              <CarouselItem>
                                <div className="p-1">
                                  <Card className="min-w-full ">
                                    <CardContent className="flex items-center justify-center p-6 min-w-full">
                                      <img
                                        src={file.url}
                                        onClick={() => handleOpenLightbox()}
                                        width="300"
                                        key={index}
                                        style={{
                                          margin: '2px',
                                          objectFit: 'cover',
                                        }}
                                        alt=""
                                      />
                                    </CardContent>
                                  </Card>
                                </div>
                              </CarouselItem>
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                          </Carousel>
                        </div>
                      ))}
                  </div>
                </TableCell>
              </TableRow>
            )}

            {archiveData.files.some((file) => file.url.endsWith('.mp4')) && (
              <TableRow>
                <TableCell className="font-bold">Video(s):</TableCell>
                <TableCell>
                  <div className="w-full flex flex-wrap">
                    {archiveData.files.map(
                      (file, index) =>
                        file.url.endsWith('.mp4') && (
                          <div key={index}>
                            <video
                              controls
                              src={file.url}
                              className="w-full aspect-square"
                            />
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
          .filter(
            (file) => file.url.endsWith('.jpg') || file.url.endsWith('.png')
          )
          .map((file) => ({ src: file.url }))}
      />
    </div>
  );
};

export default ArchiveDetails;
