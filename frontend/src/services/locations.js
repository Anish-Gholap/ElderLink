/**
 * Used by leaflet to display the event location on the minimap
 */
import axios from "axios";

// Cache to avoid repeated API calls
const locationCache = {
    allLocations: null,
    byName: {}
};

/**
 * Fetch all locations from the API
 * @returns {Promise<Array>} Array of location objects
 */
export const fetchAllLocations = async () => {
    // Return from cache if available
    if (locationCache.allLocations) {
        return locationCache.allLocations;
    }

    try {
        const response = await fetch('/api/locations');

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const locations = await response.json();

        // Cache the results
        locationCache.allLocations = locations;

        // Also cache by name for quick lookup
        locations.forEach(location => {
            locationCache.byName[location.name] = location;
        });

        return locations;
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
};

/**
 * Find a location by its name
 * @param {string} locationName - The name of the location to find
 * @returns {Promise<Object|null>} - The location object or null if not found
 */
export const findLocationByName = async (locationName) => {
    // Check the cache first
    if (locationCache.byName[locationName]) {
        return locationCache.byName[locationName];
    }

    // If not in cache, fetch all locations
    if (!locationCache.allLocations) {
        await fetchAllLocations();
    }

    // Try exact match
    if (locationCache.byName[locationName]) {
        return locationCache.byName[locationName];
    }

    // Try case-insensitive match as fallback
    const allLocations = locationCache.allLocations || [];
    const location = allLocations.find(loc =>
        loc.name.toLowerCase() === locationName.toLowerCase()
    );

    if (location) {
        // Update cache
        locationCache.byName[locationName] = location;
        return location;
    }

    // If still not found, try partial match
    const partialMatch = allLocations.find(loc =>
        locationName.toLowerCase().includes(loc.name.toLowerCase()) ||
        loc.name.toLowerCase().includes(locationName.toLowerCase())
    );

    if (partialMatch) {
        // Update cache
        locationCache.byName[locationName] = partialMatch;
        return partialMatch;
    }

    return null;
};

export const getLocationNames = async () => {
    try {
        const response = await axios.get('/api/locations/names')
        console.log(response.data[0])

        return response.data.filter(location => {
            const locationString = String(location).toLowerCase()
            return !locationString.includes('(u/c)') &&
              !locationString.includes('(pending u/c)') &&
              !locationString.includes('(pending relocation)')
        })
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            throw error.response.data.error
        } else {
            throw new Error('Failed to fetch location names')
        }
    }
}