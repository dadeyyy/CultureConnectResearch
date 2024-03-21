import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ArchiveData {
  id: number;
  title: string;
  description: string;
  municipality: string;
  files: string[];
}

const ArchiveDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { province } = useParams<{ province: string }>();
  const [archiveData, setArchiveData] = useState<ArchiveData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArchiveData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/archive/${province}/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch archive data");
        }
        const data = await response.json();
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!archiveData) {
    return <div>Error: Archive data not available</div>;
  }

  return (
    <div className="w-full">
      <div className="bg-red-100 w-full p-2 flex justify-between">
        <button
          className="border-2 hover:border-black ease-in-out duration-300 rounded-lg p-2"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
      <div className="p-5">
        <Table className="mb-2">
          <TableBody>
            <TableRow className="border-2 hover:border-b-black">
              <TableCell className="font-bold w-1/4">Title</TableCell>
              <TableCell>{archiveData.title}</TableCell>
            </TableRow>
            <TableRow className="border-2 hover:border-b-black">
              <TableCell className="font-bold">Municipality</TableCell>
              <TableCell>{archiveData.municipality}</TableCell>
            </TableRow>
            <TableRow className="border-2 hover:border-b-black">
              <TableCell className="font-bold">Description</TableCell>
              <TableCell>{archiveData.description}</TableCell>
            </TableRow>

            <TableRow></TableRow>
          </TableBody>
        </Table>

        <Carousel className="w-full max-w-lg mx-auto">
          <CarouselContent>
            {Array.from({ length: 5 }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">{index + 1}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default ArchiveDetails;
