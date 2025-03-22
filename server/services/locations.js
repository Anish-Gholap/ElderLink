
let locationsCache = null
let lastFetchTime = null
const CACHE_TTL = 60 * 60 * 1000 // 1 hour in ms

function parseDescription(description) {
    const result = {};
    // Extract all key-value pairs from the HTML table
    const pattern = /<th>(.*?)<\/th>\s*<td>(.*?)<\/td>/g;
    let match;

    while ((match = pattern.exec(description)) !== null) {
        const key = match[1];
        const value = match[2];
        result[key] = value;
    }

    return result;
}

const fetchLocationsFromAPI = async () => {
    const datasetId = "d_f706de1427279e61fe41e89e24d440fa"
    const url = "https://api-open.data.gov.sg/v1/public/api/datasets/" + datasetId + "/poll-download"

    try {
        let response = await fetch(url)
        if (!response.ok) {
            throw new Error('Failed to fetch poll-download-data')
        }

        const jsonData = await response.json()
        if (jsonData['code'] !== 0) {
            throw new Error(jsonData['errMsg'])
        }

        const fetchUrl = jsonData['data']['url']
        response = await fetch(fetchUrl)
        if (!response.ok) {
            throw new Error('Failed to fetch inner data')
        }

        const text = await response.text()
        const data = JSON.parse(text)

        const ccData = data.features.map(feature => {
            return parseDescription(feature.properties.Description);
        })

        // Now you can access the name and other fields
        const ccNames = ccData.map(data => data.NAME);
        console.log("Community club names:", ccNames);

        return ccNames


    } catch(e) {
        console.error(e)
    }
}

const initializeCache = async () => {
    await refreshCache()
}

const refreshCache = async () => {
    try {
        locationsCache = await fetchLocationsFromAPI()
        lastFetchTime = Date.now()
        console.log('Locations cache refreshed successfully')

    } catch (error) {
        console.error('Failed to refresh locations cache: ', error)
        if (!locationsCache) throw error
    }
}

const getLocations = async () => {
    if (!locationsCache || Date.now() - lastFetchTime > CACHE_TTL) {
        await refreshCache()
    }

    return locationsCache
}

module.exports = {
    initializeCache,
    refreshCache,
    getLocations
}