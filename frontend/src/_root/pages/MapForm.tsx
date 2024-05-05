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
import { useUserContext } from "@/context/AuthContext";
import HeritageForm from "@/components/forms/HeritageForm";
import Carousel from "@/components/shared/Carousel";
import toast from "react-hot-toast";
import Loader from "@/components/shared/Loader";

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
  files: {
    id: number;
    url: string;
  }[];
}

interface ArchivePoint {
  description: string;
  files: string[];
  id: number;
  municipality: string;
  province: string;
  title: string;
  category: string;
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
  name: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  createdAt: string;
  files: {
    id: number;
    url: string;
  }[];
}

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGFkZXkiLCJhIjoiY2xyOWhjcW45MDFkZjJtbGRhM2toN2k4ZiJ9.STlq7rzxQrBIiH4BbrEvoA";

const server = "http://localhost:8000";

const MapForm: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  type SelectedMarkerType = Point | ArchivePoint | HeritagePoint | null;
  const [heritages, setHeritages] = useState<HeritagePoint[]>([]);
  const [archives, setArchives] = useState<ArchivePoint[]>([]);
  const [events, setEvents] = useState<Point[]>([]);
  const [heritage, setHeritage] = useState<HeritagePoint | null>(null);
  const [archive, setArchive] = useState<ArchivePoint | null>(null);
  const [event, setEvent] = useState<Point | null>(null);
  const [lng, setLng] = useState<number>(-70.9);
  const [lat, setLat] = useState<number>(42.35);
  const [zoom, setZoom] = useState<number>(9);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);
  const [parameter, setParameter] = useState("locations");
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${server}/${parameter}`, {
          credentials: "include",
        });

        const data = await response.json();
        if (response.ok) {
          if (parameter === "archives") {
            setArchives(data as ArchivePoint[]);
            setLoading(false);
          } else if (parameter === "heritages") {
            setHeritages(data as HeritagePoint[]);
            setLoading(false);
          } else {
            setEvents(data);
            setLoading(false);
          }
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

        if (parameter == "heritages") {
          {
            heritages.length > 0 &&
              heritages.forEach((item) => {
                const el = document.createElement("div");
                el.className = "marker";
                el.style.backgroundImage = `url(${item.files[0].url})`;

                el.style.width = "50px";
                el.style.height = "50px";

                const marker = new mapboxgl.Marker(el)
                  .setLngLat(item.location.coordinates)
                  .addTo(map);
                const popup = new mapboxgl.Popup({ offset: 25 });
                const popupContent = document.createElement("div");
                popupContent.innerHTML = `<span>${item.name}</span>`;
                popup.setDOMContent(popupContent);

                popup.addClassName(
                  "bg-white text-black text-sm m-0 font-semibold px-2 py-0 rounded-lg shadow-md"
                );

                marker.getElement().addEventListener("click", () => {
                  markerList.forEach((m) => {
                    const markerEl = m.getElement();
                    markerEl.style.width = "50px";
                    markerEl.style.height = "50px";
                  });

                  // Set clicked marker size
                  el.style.width = "75px";
                  el.style.height = "75px";

                  setHeritage(item);
                });

                el.addEventListener("mouseenter", () => {
                  el.style.width = "75px";
                  el.style.height = "75px";
                });

                el.addEventListener("mouseleave", () => {
                  el.style.width = "50px";
                  el.style.height = "50px";
                });

                markerList.push(marker);
              });
          }
        } else if (parameter === "archives") {
          {
            archives.length > 0 &&
              archives.forEach((item) => {
                const el = document.createElement("div");
                el.className = "marker";
                el.style.backgroundImage = `url("../public/assets/icons/archive-point.svg")`;

                el.style.width = "50px";
                el.style.height = "50px";

                const marker = new mapboxgl.Marker(el)
                  .setLngLat(item.location.coordinates)
                  .addTo(map);
                const popup = new mapboxgl.Popup({ offset: 25 });
                const popupContent = document.createElement("div");
                popupContent.innerHTML = `<span>${item.title}</span>`;
                popup.setDOMContent(popupContent);

                popup.addClassName(
                  "bg-white text-black text-sm m-0 font-semibold px-2 py-0 rounded-lg shadow-md"
                );

                marker.getElement().addEventListener("click", () => {
                  // Reset previous marker size
                  markerList.forEach((m) => {
                    const markerEl = m.getElement();
                    markerEl.style.width = "50px";
                    markerEl.style.height = "50px";
                  });

                  // Set clicked marker size
                  el.style.width = "75px";
                  el.style.height = "75px";

                  setArchive(item);
                });

                el.addEventListener("mouseenter", () => {
                  el.style.width = "75px";
                  el.style.height = "75px";
                });

                el.addEventListener("mouseleave", () => {
                  el.style.width = "50px";
                  el.style.height = "50px";
                });

                markerList.push(marker);
              });
          }
        } else {
          events.length > 0 &&
            events.forEach((item) => {
              const el = document.createElement("div");
              el.className = "marker";
              el.style.backgroundImage = `url("/assets/icons/event-point.svg")`;

              el.style.width = "50px";
              el.style.height = "50px";

              const marker = new mapboxgl.Marker(el)
                .setLngLat(item.location.coordinates)
                .addTo(map);
              const popup = new mapboxgl.Popup({ offset: 25 });
              const popupContent = document.createElement("div");
              popupContent.innerHTML = `<span>${item.title}</span>`;
              popup.setDOMContent(popupContent);

              popup.addClassName(
                "bg-white text-black text-sm m-0 font-semibold px-2 py-0 rounded-lg shadow-md"
              );

              marker.getElement().addEventListener("click", () => {
                // Reset previous marker size
                markerList.forEach((m) => {
                  const markerEl = m.getElement();
                  markerEl.style.width = "50px";
                  markerEl.style.height = "50px";
                });

                // Set clicked marker size
                el.style.width = "75px";
                el.style.height = "75px";

                setEvent(item);
              });

              el.addEventListener("mouseenter", () => {
                el.style.width = "75px";
                el.style.height = "75px";
              });

              el.addEventListener("mouseleave", () => {
                el.style.width = "50px";
                el.style.height = "50px";
              });

              markerList.push(marker);
            });
        }
        setMarkers(markerList);
      });

      return () => map.remove();
    }
  }, [archives, heritages, events]);

  const formatDateToWord = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  async function handleDeletePost(province: string, id: number) {
    const response = await fetch(`${server}/${province}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Deleted Successfully");
      return navigate(0);
    } else {
      toast.error("Failed to delete");
    }
  }

  return (
    <>
      <div className="top-0 bottom-0 w-full p-5 xs:p-0 relative">
        {loading && (
          <div className="h-full w-full flex items-center">
            <div className="flex flex-col flex-center gap-5 w-full">
              <img
                src="/assets/images/logo.svg"
                alt="loader"
                width={150}
                height={150}
                className="animate-spin"
              />
              <span className="text-lg font-bold capitalize">
                Displaying {parameter === "locations" ? "events" : parameter}
              </span>
            </div>
          </div>
        )}
        <div className="lg:w-1/2 xs:w-full absolute gap-2 flex items-center z-10 flex-col p-5">
          <div className="grid grid-cols-3 gap-2 w-full">
            <Button
              className={`h-full ${parameter === "locations" && "bg-blue-900 text-white"}`}
              onClick={() => {
                if (parameter === "locations") {
                  setLoading(false);
                } else {
                  setLoading(true);
                }
                setParameter("locations");
              }}
            >
              Events
            </Button>
            <Button
              className={`h-full ${parameter === "heritages" && "bg-blue-900 text-white"}`}
              onClick={() => {
                if (parameter === "heritages") {
                  setLoading(false);
                } else {
                  setLoading(true);
                }
                setParameter("heritages");
              }}
            >
              Heritages
            </Button>
            <Button
              className={`h-full ${parameter === "archives" && "bg-blue-900 text-white"}`}
              onClick={() => {
                if (parameter === "archives") {
                  setLoading(false);
                } else {
                  setLoading(true);
                }
                setParameter("archives");
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
              {user.role === "ADMIN" && parameter === "heritages" && (
                <Button className="bg-red-200 border border-gray-300 hover:bg-blue-800">
                  Add a heritage
                </Button>
              )}
            </SheetTrigger>
            <SheetContent className="min-w-[720px] max-h-full overflow-auto custom-scrollbar">
              <SheetHeader>
                <SheetTitle>Add a heritage</SheetTitle>
                <SheetDescription>
                  Add a cultural heritage based on the location you are administering.
                </SheetDescription>
              </SheetHeader>
              <HeritageForm provinceData={user.province} action="Create" />
            </SheetContent>
          </Sheet>
        </div>

        <div ref={mapContainer} className="h-full rounded-lg" />
        {parameter === "locations" && event && (
          <div className="absolute bg-white px-5 py-10 xs:py-5 shadow-lg rounded-lg lg:top-0 lg:right-0 xs:bottom-0 xs:top-48 h-full w-[450px] xs:max-w-screen-sm opacity-90">
            <div className="flex">
              <span className="border border-white border-b-black w-[400px] px-2 mb-5">
                <h3 className="font-bold my-2 text-2xl">{event.title}</h3>
              </span>
              <button
                onClick={() => setEvent(null)}
                className="absolute lg:top-8 lg:right-8 xs:right-10 xs:top-8"
              >
                <img src={"/assets/icons/close.svg"} />
              </button>
            </div>
            <h2 className="font-semibold mb-1">Date: {formatDateToWord(event.date)}</h2>
            <p className="font-semibold mb-1">{event.municipality}</p>
            <p className="mt-5 overflow-auto h-3/4">{event.details}</p>
          </div>
        )}
        {parameter === "archives" && archive && (
          <div className="absolute bg-white px-5 py-10 xs:py-5 shadow-lg rounded-lg lg:top-0 lg:right-0 xs:bottom-0 xs:top-48 h-full w-[450px] xs:max-w-screen-sm opacity-90">
            <div className="flex">
              <span className="border border-white border-b-black w-[400px] px-2 mb-5">
                <h3 className="font-bold my-2 text-2xl">{archive.title}</h3>
              </span>
              <button
                onClick={() => setArchive(null)}
                className="absolute lg:top-8 lg:right-8 xs:right-10 xs:top-8"
              >
                <img src={"/assets/icons/close.svg"} />
              </button>
            </div>
            <h2 className="font-regular mb-1">
              Date Created: {formatDateToWord(archive.createdAt)}
            </h2>
            <p className="font-semibold mb-1 capitalize">
              {archive.municipality} at {archive.province}
            </p>
            <span
              onClick={() => {
                const id = archive.id;
                navigate(`/archives/${archive.province}/${archive.category}/${id}`);
              }}
              className={`flex underline hover:text-blue-500 hover:cursor-pointer`}
            >
              Go to archive page
            </span>
            <p className="mt-5 overflow-auto h-3/4">{archive.description}</p>
          </div>
        )}
        {parameter === "heritages" && heritage && (
          <div className="absolute bg-white px-5 py-10 xs:py-5 shadow-lg rounded-lg lg:top-0 lg:right-0 xs:bottom-0 xs:top-48 h-full w-[450px] xs:max-w-screen-sm opacity-90">
            <div className="flex">
              <span className="border border-white border-b-black w-[400px] px-2 mb-5">
                <h3 className="font-bold my-2 text-2xl">{heritage.name}</h3>
              </span>
              <button
                onClick={() => setHeritage(null)}
                className="absolute lg:top-8 lg:right-8 xs:right-10 xs:top-8"
              >
                <img src={"/assets/icons/close.svg"} />
              </button>
            </div>
            <h2 className="font-semibold mb-1">Date: {formatDateToWord(heritage.createdAt)}</h2>
            <p className="font-semibold mb-1">
              {heritage.municipality} {heritage.province}
            </p>
            <p className="my-3 overflow-auto h-28">{heritage.description}</p>
            <div className="flex flex-col gap-2">
              {heritage.files.map((photo) => (
                <img key={photo.id} src={photo.url} alt="Image" />
              ))}
              {user.province === heritage.province && (
                <Button
                  onClick={() => {
                    handleDeletePost(heritage.province, heritage.id);
                  }}
                  variant="ghost"
                  className={`bg-red-200 w-full ${user.role === "ADMIN" ? "" : "hidden"}`}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default MapForm;
