import { useState, useEffect } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import { walkPath } from './walkPath'; // Import the data
import 'mapbox-gl/dist/mapbox-gl.css';


const MAPBOX_TOKEN = "pk.eyJ1IjoiZWxkZW5zY3JvbGwiLCJhIjoiY21rYms1YXM0MDVmNDNocHg2ZGFhbzlieCJ9.E-Xr_7ci487dKKxlXMNSHA"; 

export default function ActiveWalk() {
  const [viewState, setViewState] = useState({
    longitude: -73.9975,
    latitude: 40.747,
    zoom: 15
  });

  // State to track the dog position
  const [currentStep, setCurrentStep] = useState(0);
  const [completedPath, setCompletedPath] = useState([]);

  // Move the icon every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        // Stop if we finished the walk
        if (prev >= walkPath.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000); // 1 second per step

    return () => clearInterval(interval);
  }, []);

  // Update the blue Line whenever the dog moves
  useEffect(() => {
    setCompletedPath(walkPath.slice(0, currentStep + 1));
  }, [currentStep]);

  const currentPosition = walkPath[currentStep];

  // GeoJSON Data for the blue Line
  const routeData = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: completedPath // only draw up to where the dog is
    }
  };

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow z-10 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Live Walk Tracking</h1>
          <p className="text-green-600 font-medium animate-pulse">● Live Now</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-sm">Duration</p>
          <p className="font-mono font-bold text-xl">00:{currentStep < 10 ? `0${currentStep}` : currentStep}</p>
        </div>
      </div>

      {/* map */}
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', flex: 1 }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {/* the blue path line */}
        <Source id="route-source" type="geojson" data={routeData}>
          <Layer
            id="route-line"
            type="line"
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
            paint={{
              'line-color': '#3b82f6', // blue
              'line-width': 5,
              'line-opacity': 0.8
            }}
          />
        </Source>

        {/* the dog icon */}
        <Marker
          longitude={currentPosition[0]}
          latitude={currentPosition[1]}
          anchor="bottom"
        >
          <div className="text-4xl transition-all duration-1000 ease-linear">
            🐕
          </div>
        </Marker>
      </Map>
    </div>
  );
}