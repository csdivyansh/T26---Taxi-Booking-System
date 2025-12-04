import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export interface LocationCoords {
  lat: number;
  lng: number;
}

interface MapProps {
  center?: LocationCoords;
  zoom?: number;
  onLocationSelect?: (coords: LocationCoords, address: string) => void;
  markers?: Array<{
    id: string;
    coords: LocationCoords;
    label: string;
    color?: string;
  }>;
  height?: string;
  interactive?: boolean;
}

// Component to handle map clicks
const MapClickHandler: React.FC<{
  onLocationSelect?: (coords: LocationCoords) => void;
  interactive: boolean;
}> = ({ onLocationSelect, interactive }) => {
  useMapEvents({
    click(e) {
      if (interactive && onLocationSelect) {
        onLocationSelect({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      }
    },
  });
  return null;
};

// Custom marker icon creator
const createMarkerIcon = (color: string = "blue") => {
  const colors: { [key: string]: string } = {
    blue: "#3b82f6",
    red: "#ef4444",
    green: "#22c55e",
    purple: "#a855f7",
  };

  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background-color: ${colors[color] || colors.blue};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background-color: white;
        border-radius: 50%;
      "></div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export const Map: React.FC<MapProps> = ({
  center = { lat: 28.6139, lng: 77.209 }, // Default to New Delhi
  zoom = 13,
  onLocationSelect,
  markers = [],
  height = "400px",
  interactive = true,
}) => {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationCoords | null>(null);

  const handleLocationSelect = (coords: LocationCoords) => {
    setSelectedLocation(coords);
    // Reverse geocoding to get address (optional)
    if (onLocationSelect) {
      const address = `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
      onLocationSelect(coords, address);
    }
  };

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      style={{ height, width: "100%", borderRadius: "0.5rem" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler
        onLocationSelect={handleLocationSelect}
        interactive={interactive}
      />

      {/* Selected location marker */}
      {selectedLocation && (
        <Marker
          position={[selectedLocation.lat, selectedLocation.lng]}
          icon={createMarkerIcon("blue")}
        >
          <Popup>
            <div className="text-center">
              <p className="font-semibold">Selected Location</p>
              <p className="text-sm text-gray-600">
                {selectedLocation.lat.toFixed(4)},{" "}
                {selectedLocation.lng.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Custom markers */}
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.coords.lat, marker.coords.lng]}
          icon={createMarkerIcon(marker.color || "green")}
        >
          <Popup>
            <div className="text-center">
              <p className="font-semibold">{marker.label}</p>
              <p className="text-sm text-gray-600">
                {marker.coords.lat.toFixed(4)}, {marker.coords.lng.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

// Hook for reverse geocoding (converts coordinates to address)
export const useReverseGeocode = () => {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const reverseGeocode = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      setAddress(
        data.address?.road ||
          data.address?.city ||
          `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      );
    } catch (error) {
      console.error("Geocoding error:", error);
      setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } finally {
      setLoading(false);
    }
  };

  return { address, loading, reverseGeocode };
};

export default Map;
