import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState } from 'react';
import ReactMapGl, { Marker, Popup } from 'react-map-gl';

type Point = {
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
};

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGFkZXkiLCJhIjoiY2xyOWhjcW45MDFkZjJtbGRhM2toN2k4ZiJ9.STlq7rzxQrBIiH4BbrEvoA';

const MapForm = () => {
  const [mapData, setMapData] = useState<Point[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Point | null>(null);

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
      mapLib={mapboxgl}
      initialViewState={{
        longitude: 121.774,
        latitude: 13.8797,
        zoom: 5.1,
      }}
      style={{ height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      {mapData.map((item) => (
        <Marker
          key={item.id}
          latitude={item.location.coordinates[1]}
          
          longitude={item.location.coordinates[0]}
          onClick={() =>  {
            console.log('Marker clicked!')
            setSelectedMarker(item)
          }}
          style={{cursor: 'pointer'}}
        />
      ))}

      {selectedMarker && (
        <Popup
        longitude={selectedMarker.location.coordinates[0]}
        latitude={selectedMarker.location.coordinates[1]}
        onClose={() => setSelectedMarker(null)}
        closeOnClick={false}
      >
        <div style={{
          padding: '20px',
          background: 'white',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        }}>
          <h3 style={{ marginBottom: '5px' }}>{selectedMarker.title}</h3>
          <p>{selectedMarker.details}</p>
        </div>
      </Popup>
      )}
    </ReactMapGl>
  );
};

export default MapForm;
