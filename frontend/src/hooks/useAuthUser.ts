import { useAuth } from "@/context/AuthContext";

export const useAuthUser = () => {
  const auth = useAuth();
  return {
    ...auth,
    isRider: auth.user?.role === "rider",
    isDriver: auth.user?.role === "driver",
    isAdmin: auth.user?.role === "admin",
  };
};
