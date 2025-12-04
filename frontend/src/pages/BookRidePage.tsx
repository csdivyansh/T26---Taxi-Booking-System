import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { LocationInput } from "@/components/booking/LocationInput";
import { RideTypeSelector } from "@/components/booking/RideTypeSelector";
import { Map, LocationCoords, useReverseGeocode } from "@/components/Map";
import { ArrowRight, Clock, Shield, Loader2, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LocationData {
  coords: LocationCoords;
  address: string;
}

export default function BookRidePage() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupCoords, setPickupCoords] = useState<LocationCoords | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<LocationCoords | null>(
    null
  );
  const [selectedRide, setSelectedRide] = useState("economy");
  const [isSearching, setIsSearching] = useState(false);
  const [driverFound, setDriverFound] = useState(false);
  const [mapMode, setMapMode] = useState<"pickup" | "dropoff" | null>(null);
  const { reverseGeocode } = useReverseGeocode();

  const baseFare = 12.5;

  const handleLocationSelect = async (coords: LocationCoords) => {
    try {
      const address = await reverseGeocode(coords);

      if (mapMode === "pickup") {
        setPickup(
          address || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
        );
        setPickupCoords(coords);
        setMapMode(null);
      } else if (mapMode === "dropoff") {
        setDropoff(
          address || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
        );
        setDropoffCoords(coords);
        setMapMode(null);
      }

      toast({
        title: "Location Selected",
        description:
          address ||
          "Coordinates: " +
            `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not get address for location",
        variant: "destructive",
      });
    }
  };

  const handleBookRide = () => {
    if (!pickup || !dropoff) {
      toast({
        title: "Missing Information",
        description: "Please enter both pickup and drop-off locations.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    // Simulate driver search
    setTimeout(() => {
      setIsSearching(false);
      setDriverFound(true);
      toast({
        title: "Driver Found!",
        description: "Alex K. is on the way. ETA: 3 minutes.",
      });
    }, 3000);
  };

  return (
    <Layout>
      <section className="min-h-[calc(100vh-5rem)] py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 h-full">
            {/* Booking Form */}
            <div className="order-2 lg:order-1">
              <div className="glass-strong rounded-2xl p-6 md:p-8 h-full">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Book Your Ride
                </h1>
                <p className="text-muted-foreground mb-8">
                  Enter your locations and choose your ride type
                </p>

                {/* Map Mode Indicator */}
                {mapMode && (
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 mb-6 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-600 font-medium">
                      Click on the map to select{" "}
                      {mapMode === "pickup" ? "pickup" : "drop-off"} location
                    </span>
                  </div>
                )}

                {/* Location Inputs */}
                <div className="space-y-4 mb-8">
                  <div className="relative">
                    <LocationInput
                      type="pickup"
                      value={pickup}
                      onChange={setPickup}
                      placeholder="Enter pickup location"
                    />
                    <button
                      onClick={() =>
                        setMapMode(mapMode === "pickup" ? null : "pickup")
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-secondary rounded-lg transition-colors"
                      title="Select from map"
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-border" />
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
                    </div>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <div className="relative">
                    <LocationInput
                      type="dropoff"
                      value={dropoff}
                      onChange={setDropoff}
                      placeholder="Enter drop-off location"
                    />
                    <button
                      onClick={() =>
                        setMapMode(mapMode === "dropoff" ? null : "dropoff")
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-secondary rounded-lg transition-colors"
                      title="Select from map"
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  </div>
                </div>

                {/* Ride Type Selector */}
                <div className="mb-8">
                  <RideTypeSelector
                    selected={selectedRide}
                    onSelect={setSelectedRide}
                    baseFare={baseFare}
                  />
                </div>

                {/* Trip Info */}
                {pickup && dropoff && (
                  <div className="p-4 rounded-xl bg-secondary mb-6 animate-fade-in">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          Estimated Time
                        </span>
                      </div>
                      <span className="font-display font-semibold text-foreground">
                        ~15 min
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-success" />
                        <span className="text-sm text-muted-foreground">
                          Safety Features
                        </span>
                      </div>
                      <span className="text-sm text-success">Active</span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <Button
                  variant="hero"
                  size="xl"
                  className="w-full"
                  onClick={handleBookRide}
                  disabled={isSearching || driverFound || mapMode !== null}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Finding Driver...
                    </>
                  ) : driverFound ? (
                    "Driver On The Way!"
                  ) : mapMode ? (
                    "Select Location"
                  ) : (
                    <>
                      Confirm Booking
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>

                {/* Safety Note */}
                <p className="text-center text-xs text-muted-foreground mt-4">
                  Your safety is our priority. All drivers are verified and
                  trips are monitored.
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="order-1 lg:order-2 h-[300px] lg:h-auto">
              <div className="rounded-2xl overflow-hidden h-full min-h-[300px] lg:min-h-[600px] border border-border shadow-lg">
                <Map
                  center={pickupCoords || { lat: 28.6139, lng: 77.209 }}
                  zoom={13}
                  onLocationSelect={handleLocationSelect}
                  markers={[
                    ...(pickupCoords
                      ? [
                          {
                            coords: pickupCoords,
                            label: "Pickup",
                            color: "blue",
                          },
                        ]
                      : []),
                    ...(dropoffCoords
                      ? [
                          {
                            coords: dropoffCoords,
                            label: "Drop-off",
                            color: "red",
                          },
                        ]
                      : []),
                  ]}
                  height="100%"
                  interactive={mapMode !== null}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
