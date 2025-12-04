import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { AvailabilityToggle } from "@/components/driver/AvailabilityToggle";
import { RideRequestCard } from "@/components/driver/RideRequestCard";
import { EarningsCard } from "@/components/driver/EarningsCard";
import { Map, LocationCoords, useReverseGeocode } from "@/components/Map";
import { toast } from "@/hooks/use-toast";
import { Star, TrendingUp, Shield, MapPin } from "lucide-react";

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const [hasRequest, setHasRequest] = useState(false);
  const [activeTrip, setActiveTrip] = useState(false);
  const [driverLocation, setDriverLocation] = useState<LocationCoords | null>(
    null
  );
  const [pickupLocation, setPickupLocation] = useState<LocationCoords | null>(
    null
  );
  const [dropoffLocation, setDropoffLocation] = useState<LocationCoords | null>(
    null
  );
  const [mapMode, setMapMode] = useState<"driver" | null>(null);
  const { reverseGeocode } = useReverseGeocode();

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      toast({
        title: "You're now online",
        description: "You'll receive ride requests from nearby riders.",
      });
      // Simulate incoming request after going online
      setTimeout(() => {
        if (!activeTrip) {
          setHasRequest(true);
        }
      }, 5000);
    } else {
      toast({
        title: "You're now offline",
        description: "You won't receive any ride requests.",
      });
      setHasRequest(false);
    }
  };

  const handleAcceptRide = () => {
    setHasRequest(false);
    setActiveTrip(true);
    toast({
      title: "Ride Accepted!",
      description: "Navigate to the pickup point to meet your rider.",
    });
  };

  const handleDeclineRide = () => {
    setHasRequest(false);
    toast({
      title: "Ride Declined",
      description: "You'll receive another request soon.",
    });
    // Simulate another request
    setTimeout(() => {
      if (isOnline && !activeTrip) {
        setHasRequest(true);
      }
    }, 8000);
  };

  const handleLocationSelect = async (coords: LocationCoords) => {
    try {
      const address = await reverseGeocode(coords);
      setDriverLocation(coords);
      setMapMode(null);

      toast({
        title: "Location Updated",
        description:
          address || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update location",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <section className="min-h-[calc(100vh-5rem)] py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Driver Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your availability and track your earnings
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* Availability Toggle */}
              <AvailabilityToggle
                isOnline={isOnline}
                onToggle={handleToggleOnline}
              />

              {/* Ride Request */}
              {hasRequest && (
                <RideRequestCard
                  pickup="123 Main Street, Downtown"
                  dropoff="456 Oak Avenue, Uptown"
                  distance="4.2 km"
                  fare="$18.50"
                  timeLeft={15}
                  onAccept={handleAcceptRide}
                  onDecline={handleDeclineRide}
                />
              )}

              {/* Earnings Card */}
              <EarningsCard
                todayEarnings="$127.50"
                totalRides={8}
                onlineHours="5h 32m"
              />

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl glass">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-warning fill-warning" />
                    <span className="text-sm text-muted-foreground">
                      Rating
                    </span>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">
                    4.92
                  </p>
                </div>
                <div className="p-4 rounded-xl glass">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-success" />
                    <span className="text-sm text-muted-foreground">
                      Acceptance
                    </span>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">
                    94%
                  </p>
                </div>
              </div>

              {/* Verification Badge */}
              <div className="p-4 rounded-xl bg-success/10 border border-success/20 flex items-center gap-3">
                <Shield className="w-6 h-6 text-success" />
                <div>
                  <p className="font-semibold text-foreground">
                    Verified Driver
                  </p>
                  <p className="text-xs text-muted-foreground">
                    All documents approved
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Map */}
            <div className="lg:col-span-2">
              {/* Map Mode Indicator */}
              {mapMode === "driver" && (
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-600 font-medium">
                    Click on the map to set your current location
                  </span>
                </div>
              )}

              {/* Map Container */}
              <div className="rounded-2xl overflow-hidden h-[400px] lg:h-[600px] border border-border shadow-lg mb-4">
                <Map
                  center={driverLocation || { lat: 28.6139, lng: 77.209 }}
                  zoom={13}
                  onLocationSelect={handleLocationSelect}
                  markers={[
                    ...(driverLocation
                      ? [
                          {
                            coords: driverLocation,
                            label: "Your Location",
                            color: "green",
                          },
                        ]
                      : []),
                    ...(pickupLocation
                      ? [
                          {
                            coords: pickupLocation,
                            label: "Pickup",
                            color: "blue",
                          },
                        ]
                      : []),
                    ...(dropoffLocation
                      ? [
                          {
                            coords: dropoffLocation,
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

              {/* Update Location Button */}
              {!activeTrip && (
                <button
                  onClick={() =>
                    setMapMode(mapMode === "driver" ? null : "driver")
                  }
                  className="mb-4 w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  {mapMode === "driver" ? "Cancel" : "Update My Location"}
                </button>
              )}

              {/* Active Trip Overlay */}
              {activeTrip && (
                <div className="p-4 rounded-xl glass-strong animate-slide-up">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Active Trip
                      </p>
                      <p className="font-display font-bold text-foreground">
                        En route to pickup
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTrip(false);
                        setPickupLocation(null);
                        setDropoffLocation(null);
                        toast({
                          title: "Trip Completed",
                          description: "You earned $18.50 from this trip!",
                        });
                      }}
                      className="px-4 py-2 rounded-lg bg-success text-success-foreground font-semibold hover:bg-success/90 transition-colors"
                    >
                      Complete Trip
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
