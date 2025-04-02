import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const EventLocationMap = ({ locationData, height = 200 }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        // Check if map container and location data are available
        if (!mapRef.current || !locationData) return;

        // Clean up existing map instance if it exists
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        // Extract coordinates from the location data
        const coords = [
            locationData.coordinates.latitude,
            locationData.coordinates.longitude
        ];

        // Create the map instance
        mapInstanceRef.current = L.map(mapRef.current).setView(coords, 15);

        // Add the OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);

        // Add a marker for the event location
        const marker = L.marker(coords).addTo(mapInstanceRef.current);

        // Create a popup with location details
        const popupContent = `
      <strong>${locationData.name}</strong><br>
      ${locationData.address.block} ${locationData.address.street}<br>
      Singapore ${locationData.address.postalCode}
    `;

        marker.bindPopup(popupContent).openPopup();

        // Cleanup function to destroy the map when component unmounts
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [locationData]);

    return (
        <div
            ref={mapRef}
            style={{
                height: `${height}px`,
                width: '100%',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 16px 32px rgba(0,0,0,0.2)',
                border: '1px solid #ccc'
            }}
        />
    );
};

export default EventLocationMap;