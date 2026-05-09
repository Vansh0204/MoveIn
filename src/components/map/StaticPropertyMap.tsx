"use client";

import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const createPin = (color: string) => {
  return L.divIcon({
    className: 'custom-pin',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

export default function StaticPropertyMap({ propCoords, collegeCoords }: { propCoords: [number, number], collegeCoords: [number, number] }) {
  const center: [number, number] = [
    (propCoords[0] + collegeCoords[0]) / 2,
    (propCoords[1] + collegeCoords[1]) / 2
  ];

  return (
    <>
      <style jsx global>{`
        .static-map-tiles { filter: grayscale(20%) contrast(0.95); }
        .custom-pin { background: transparent; border: none; }
      `}</style>
      <MapContainer 
        center={center} 
        zoom={15} 
        zoomControl={false} 
        dragging={false} 
        scrollWheelZoom={false} 
        doubleClickZoom={false}
        touchZoom={false}
        className="w-full h-full"
      >
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
          className="static-map-tiles"
        />
        <Marker position={propCoords} icon={createPin('#1D6B5A')} />
        <Marker position={collegeCoords} icon={createPin('#C8A96E')} />
        <Polyline positions={[propCoords, collegeCoords]} color="#C8A96E" dashArray="5, 8" weight={3} opacity={0.8} />
      </MapContainer>
    </>
  );
}
