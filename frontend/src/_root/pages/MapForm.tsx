import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import ReactMapGl, { Marker } from 'react-map-gl';

type Point = {
  type: string
  coordinates: [number, number]
}

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGFkZXkiLCJhIjoiY2xyOWhjcW45MDFkZjJtbGRhM2toN2k4ZiJ9.STlq7rzxQrBIiH4BbrEvoA';

const MapForm = () => {
  const [mapData, setMapData] = useState<Point[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://localhost:8000/locations', {
          credentials: 'include',
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
  return (
    <ReactMapGl
      mapLib={import('mapbox-gl')}
      initialViewState={{
        longitude: 121.774,
        latitude: 13.8797,
        zoom: 5.1,
      }}
      style={{ height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      {mapData.map((item) => (
        <Marker latitude={item.coordinates[1]} longitude={item.coordinates[0]}>
          
        </Marker>
      ))}
    </ReactMapGl>
  );
};

export default MapForm;
