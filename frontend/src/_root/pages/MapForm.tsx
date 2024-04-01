import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Marker } from "mapbox-gl";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { municipalities, provincesTest } from "@/lib/provinces";

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
      <div className="sidebar-1 gap-2 xs:gap-1 p-1 xs:m-1 xs:flex xs:top-2 xs:justify-center xs:px-10">
        <Button
          className={`h-6 ${parameter === "locations" && "bg-blue-700"}`}
          onClick={() => {
            setParameter("locations");
            setSelectedMarker(null);
          }}
        >
          Events
        </Button>
        <Button
          className={`h-6 ${parameter === "heritages" && "bg-blue-700"}`}
          onClick={() => {
            setParameter("heritages");
            setSelectedMarker(null);
          }}
        >
          Heritages
        </Button>
        <Button
          className={`h-6 ${parameter === "archives" && "bg-blue-700"}`}
          onClick={() => {
            setParameter("archives");
            setSelectedMarker(null);
          }}
        >
          Archives
        </Button>
      </div>
      <div className="sidebar text-[10px] xs:hidden">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
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
