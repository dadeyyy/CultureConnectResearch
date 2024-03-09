import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Marker, Popup } from "mapbox-gl";

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
        mapData.forEach((item) => {
          new mapboxgl.Marker()
            .setLngLat(item.location.coordinates)
            .addTo(map)
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `<h3 style="font-weight: bold; font-size: 1.5em;">${item.title}</h3>
                <h2 style="font-weight: 500; font-size: 1.25em;">• ${formatDateToWord(
                  item.date
                )}</h2><p>${item.details}</p>`
              )
            )
            .addTo(map);
        });
      });

      // Handle marker click events
      map.on("click", "markers", (e) => {
        if (e.features && e.features.length > 0) {
          const clickedMarker = e.features[0].properties as Point;
          setSelectedMarker(clickedMarker);
        }
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
    <div className="top-0 bottom-0 w-full p-5">
      <div ref={mapContainer} className="h-full rounded-lg" />
      {selectedMarker && (
        <div>
          <h3 className="font-bold mb-2">{selectedMarker.title}</h3>
          <p>{selectedMarker.details}</p>
        </div>
      )}
    </div>
  );
};

export default MapForm;
