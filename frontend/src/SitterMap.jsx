import { useState, useEffect } from 'react';
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = "pk.eyJ1IjoiZWxkZW5zY3JvbGwiLCJhIjoiY21rYms1YXM0MDVmNDNocHg2ZGFhbzlieCJ9.E-Xr_7ci487dKKxlXMNSHA"; 

export default function SitterMap({ sitters, selectedSitter, onSelectSitter }) {
  const [viewState, setViewState] = useState({
    longitude: -95.7129, // Center of USA
    latitude: 37.0902,
    zoom: 3
  });

  // Auto-center map when sitters are found
  useEffect(() => {
    if (sitters.length > 0) {
      setViewState({
        longitude: sitters[0].longitude,
        latitude: sitters[0].latitude,
        zoom: 11 // closer zoom
      });
    }
  }, [sitters]);

  return (
    <div className="h-full w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {/* Render Markers for each Sitter */}
        {sitters.map((sitter) => (
          <Marker
            key={sitter.id}
            longitude={sitter.longitude}
            latitude={sitter.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onSelectSitter(sitter);
            }}
          >
            <div className="cursor-pointer text-4xl hover:scale-110 transition-transform">
                🐶
            </div>
          </Marker>
        ))}

        {/* If a sitter is selected, show a radius circle*/}
        {selectedSitter && (
          <Source 
            id="sitter-data" 
            type="geojson" 
            data={{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [selectedSitter.longitude, selectedSitter.latitude]
              }
            }}
          >
            <Layer
              id="point-radius"
              type="circle"
              paint={{
                'circle-radius': 100, // Visual size in pixels
                'circle-color': '#3b82f6', // Blue
                'circle-opacity': 0.2,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#2563eb'
              }}
            />
          </Source>
        )}

        {/* Popup Logic */}
        {selectedSitter && (
          <Popup
            longitude={selectedSitter.longitude}
            latitude={selectedSitter.latitude}
            anchor="top"
            onClose={() => onSelectSitter(null)}
          >
            <div className="p-2 text-center">
              <h3 className="font-bold text-lg">{selectedSitter.email.split('@')[0]}</h3>
              <p className="text-gray-500 text-sm">Rate: $20/hr</p>
              <button 
                className="mt-2 bg-blue-600 text-white text-xs px-3 py-1 rounded"
              >
                Selected
              </button>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}