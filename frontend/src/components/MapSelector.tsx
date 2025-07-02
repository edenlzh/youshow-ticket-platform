import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

function MapSelector({ value, onChange }: {
  value: { lat: number; lng: number };
  onChange: (coords: { lat: number; lng: number }) => void;
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY",
  });

  if (!isLoaded) return <div>Map Loading...</div>;

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  return (
    <GoogleMap
      center={value}
      zoom={14}
      mapContainerStyle={{ width: "400px", height: "300px" }}
      onClick={handleMapClick}
    >
      <Marker position={value} />
    </GoogleMap>
  );
}

export default MapSelector;