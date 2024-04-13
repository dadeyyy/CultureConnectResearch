import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Marker } from "mapbox-gl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { municipalities, provincesTest } from "@/lib/provinces";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Point {
  id: number;
  title: string;
  municipality: string;
  details: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  date: string;
  createdAt: string;
  updatedAt: string;
  provinceId: string;
}

interface ArchivePoint {
  description: string;
  files: string[];
  id: number;
  municipality: string;
  province: string;
  title: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  createdAt: string;
}

interface HeritagePoint {
  description: string;
  id: number;
  municipality: string;
  province: string;
  title: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  createdAt: string;
}

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGFkZXkiLCJhIjoiY2xyOWhjcW45MDFkZjJtbGRhM2toN2k4ZiJ9.STlq7rzxQrBIiH4BbrEvoA";

const MapForm: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [mapData, setMapData] = useState<Point[]>([]);
  type SelectedMarkerType = Point | ArchivePoint | HeritagePoint | null;

  const [selectedMarker, setSelectedMarker] = useState<SelectedMarkerType>(null);
  const [lng, setLng] = useState<number>(-70.9);
  const [lat, setLat] = useState<number>(42.35);
  const [zoom, setZoom] = useState<number>(9);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [parameter, setParameter] = useState("locations");
  const navigate = useNavigate();

  console.log(parameter);
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`http://localhost:8000/${parameter}`, {
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
          setMapData(data);
        } else {
          console.log(data.error);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchLocations();
  }, [parameter]);

  useEffect(() => {
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v9",
        center: [121.774, 12.8797],
        zoom: 5.1,
        accessToken: mapboxgl.accessToken,
      });

      map.on("move", () => {
        setLng(parseFloat(map.getCenter().lng.toFixed(4)));
        setLat(parseFloat(map.getCenter().lat.toFixed(4)));
        setZoom(parseFloat(map.getZoom().toFixed(2)));
      });

      map.on("load", () => {
        const markerList: mapboxgl.Marker[] = [];
        mapData.forEach((item) => {
          const el = document.createElement("div");
          el.className = "marker";
          if (parameter === "locations") {
            el.style.backgroundImage = `url("../public/assets/icons/event-point.svg")`;
          } else if (parameter === "archives") {
            el.style.backgroundImage = `url("../public/assets/icons/archive-point.svg")`;
          }

          const marker = new mapboxgl.Marker(el).setLngLat(item.location.coordinates).addTo(map);
          marker.getElement().addEventListener("click", () => {
            setSelectedMarker(item);
          });
        });
        setMarkers(markerList);
      });
      return () => map.remove();
    }
  }, [mapData]);

  const formatDateToWord = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="top-0 bottom-0 w-full p-5 xs:p-0 relative">
      <div className="lg:w-1/2 xs:w-full absolute gap-2 flex items-center z-10  flex-col p-5">
        <div className="grid grid-cols-3 gap-2 w-full">
          <Button
            className={`h-full ${parameter === "locations" && "bg-blue-900 text-white"}`}
            onClick={() => {
              setParameter("locations");
              setSelectedMarker(null);
            }}
          >
            Events
          </Button>
          <Button
            className={`h-full ${parameter === "heritages" && "bg-blue-900 text-white"}`}
            onClick={() => {
              setParameter("heritages");
              setSelectedMarker(null);
            }}
          >
            Heritages
          </Button>
          <Button
            className={`h-full ${parameter === "archives" && "bg-blue-900 text-white"}`}
            onClick={() => {
              setParameter("archives");
              setSelectedMarker(null);
            }}
          >
            Archives
          </Button>
        </div>
        <div className="text-[10px] lg:block bg-neutral-200 px-3 py-1 lg:text-base xs:text-sm font-semibold rounded-xl border-gray-500 border">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-red-200 border border-gray-300 hover:bg-blue-800">
              Add a heritage
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-blue-200 min-w-[450px]">
            <SheetHeader>
              <SheetTitle>Add a heritage</SheetTitle>
              <SheetDescription>
                Add a cultural heritage based on the location you are administering.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Province
                </Label>
                <Input id="username" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Municipality
                </Label>
                <Input id="username" className="col-span-3" />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit">Add heritage</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <div ref={mapContainer} className="h-full rounded-lg" />
      {selectedMarker && (
        <div className="absolute bg-white px-5 py-10 xs:py-5 shadow-lg rounded-lg lg:top-0 lg:right-0 xs:bottom-0 xs:top-48 h-full w-[450px] xs:max-w-screen-sm opacity-70">
          <div className="flex">
            <span className="border border-white border-b-black w-[400px] px-2 mb-5">
              <h3 className="font-bold my-2 text-2xl">{selectedMarker.title}</h3>
            </span>
            <button
              onClick={() => setSelectedMarker(null)}
              className="absolute lg:top-8 lg:right-8 xs:right-10 xs:top-8"
            >
              <img src={"/assets/icons/close.svg"} />
            </button>
          </div>

          {parameter === "locations" ? (
            <>
              {"date" in selectedMarker && selectedMarker.date && (
                <h2 className="font-semibold mb-1">
                  Date: {formatDateToWord(selectedMarker.date)}
                </h2>
              )}
              <p className="font-semibold mb-1">
                {selectedMarker.municipality}
                {"provinceId" in selectedMarker && selectedMarker.provinceId
                  ? ` at ${selectedMarker.provinceId}`
                  : ""}
              </p>
              {selectedMarker && "details" in selectedMarker && (
                <p className="mt-5 overflow-auto h-3/4">{selectedMarker.details}</p>
              )}
            </>
          ) : (
            <>
              {"createdAt" in selectedMarker && selectedMarker.createdAt && (
                <h2 className="font-regular mb-1">
                  Date Created: {formatDateToWord(selectedMarker.createdAt)}
                </h2>
              )}

              <p className="font-semibold mb-1">
                {"province" in selectedMarker && selectedMarker.province
                  ? `Municipality of ${
                      selectedMarker.municipality &&
                      municipalities[selectedMarker.province]?.find(
                        (municipal) => municipal.value === selectedMarker.municipality
                      )?.label
                    } in ${
                      selectedMarker.province &&
                      provincesTest.find((province) => province.value === selectedMarker.province)
                        ?.label
                    }`
                  : ""}
              </p>
              {selectedMarker && "province" in selectedMarker && (
                <span
                  onClick={() => {
                    const id = selectedMarker.id;
                    navigate(`/explore/${selectedMarker.province}/archive/${id}`);
                  }}
                  className={`flex underline hover:text-blue-500 hover:cursor-pointer${
                    parameter === "heritages" ? "hidden" : ""
                  }`}
                >
                  Go to archive page
                </span>
              )}
              {selectedMarker && "description" in selectedMarker && (
                <p className="mt-5 overflow-auto h-3/4">{selectedMarker.description}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MapForm;
