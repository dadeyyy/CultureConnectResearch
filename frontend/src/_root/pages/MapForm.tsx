import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Marker } from "mapbox-gl";

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

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGFkZXkiLCJhIjoiY2xyOWhjcW45MDFkZjJtbGRhM2toN2k4ZiJ9.STlq7rzxQrBIiH4BbrEvoA";

const MapForm: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [mapData, setMapData] = useState<Point[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Point | null>(null);
  const [lng, setLng] = useState<number>(-70.9);
  const [lat, setLat] = useState<number>(42.35);
  const [zoom, setZoom] = useState<number>(9);
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:8000/locations", {
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
  }, []);

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
        // Add markers to the map
        const markerList: mapboxgl.Marker[] = [];
        mapData.forEach((item) => {
          const marker = new mapboxgl.Marker().setLngLat(item.location.coordinates).addTo(map);
          markerList.push(marker);
          // Add a click event listener to each marker
          marker.getElement().addEventListener("click", () => {
            setSelectedMarker(item);
            // Set all markers to default color
            markerList.forEach((m) => {
              m.getElement().style.color = "";
            });
            // Change color of clicked marker
            marker.getElement().style.color = "red";
          });
        });
        setMarkers(markerList);
      });

      map.on("move", () => {
        setLng(map.getCenter().lng.toFixed(4));
        setLat(map.getCenter().lat.toFixed(4));
        setZoom(map.getZoom().toFixed(2));
      });

      // Clean up the map when the component is unmounted
      return () => map.remove();
    }
  }, [mapData]);

  const formatDateToWord = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="top-0 bottom-0 w-full p-5 relative">
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="h-full rounded-lg" />
      {selectedMarker && (
        <div className="absolute bg-white p-10 shadow-lg rounded-lg top-0 right-0 h-full w-[350px] opacity-70">
          <h3 className="font-bold my-2 text-2xl">{selectedMarker.title}</h3>
          <h2 className="font-semibold mb-1">Date: {formatDateToWord(selectedMarker.date)}</h2>
          <p className="font-semibold mb-1">
            {selectedMarker.municipality} at {selectedMarker.provinceId}
          </p>
          <p className="mt-5 overflow-auto h-3/4">{selectedMarker.details}</p>
          <button
            onClick={() => setSelectedMarker(null)}
            className="text-blue-500 hover:underline mt-2 bottom-0 left-0"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default MapForm;
