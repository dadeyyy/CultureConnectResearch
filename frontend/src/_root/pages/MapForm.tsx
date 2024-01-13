import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ReactMapGl from 'react-map-gl';

mapboxgl.accessToken =
  'pk.eyJ1IjoiZGFkZXkiLCJhIjoiY2xyOWhjcW45MDFkZjJtbGRhM2toN2k4ZiJ9.STlq7rzxQrBIiH4BbrEvoA';

const MapForm = () => {
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
    />
  );
};

export default MapForm;
