// frontend/lib/locationService.ts

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

class LocationService {
  private static instance: LocationService;

  private constructor() {}

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Request user's location using browser geolocation API
   */
  public async requestLocation(): Promise<LocationData | null> {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      console.log("Geolocation is not supported");
      return null;
    }

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        }
      );

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      // Try to get city and country from reverse geocoding
      try {
        const cityCountry = await this.reverseGeocode(
          locationData.latitude,
          locationData.longitude
        );
        locationData.city = cityCountry.city;
        locationData.country = cityCountry.country;
      } catch (error) {
        console.log("Could not get city/country info:", error);
      }

      return locationData;
    } catch (error: any) {
      console.error("Error getting location:", error);
      if (error.code === 1) {
        console.log("User denied location permission");
      } else if (error.code === 2) {
        console.log("Location unavailable");
      } else if (error.code === 3) {
        console.log("Location request timeout");
      }
      return null;
    }
  }

  /**
   * Reverse geocode coordinates to get city and country using Nominatim (OpenStreetMap)
   */
  private async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<{ city?: string; country?: string }> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
        {
          headers: {
            "User-Agent": "AuraMatch Dating App",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Reverse geocoding failed");
      }

      const data = await response.json();
      const address = data.address;

      return {
        city:
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          address.county,
        country: address.country,
      };
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return {};
    }
  }

  /**
   * Save location to backend
   */
  public async saveLocation(
    token: string,
    locationData: LocationData
  ): Promise<boolean> {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/api/auth/location`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          locationCity: locationData.city,
          locationCountry: locationData.country,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save location");
      }

      return true;
    } catch (error) {
      console.error("Error saving location:", error);
      return false;
    }
  }

  /**
   * Check if user has location data
   */
  public async hasLocation(token: string): Promise<boolean> {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/api/auth/location`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.hasLocation;
    } catch (error) {
      console.error("Error checking location:", error);
      return false;
    }
  }
}

export const locationService = LocationService.getInstance();
