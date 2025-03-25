const fetchCCFromAPI = async () => {
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

        // CC Names only
        // const ccData = data.features.map(feature => {
        //     return parseDescription(feature.properties.Description);
        // })
        //
        // const ccNames = ccData.map(data => data.NAME);
        // //console.log("Community club names:", ccNames);

        // CC Names and Coordinates
        return data.features.map(feature => {
            const description = parseDescription(feature.properties.Description)
            const coordinates = feature.geometry.coordinates

            return {
                name: description.NAME,
                address: {
                    postalCode: description.ADDRESSPOSTALCODE,
                    street: description.ADDRESSSTREETNAME,
                    block: description.ADDRESSBLOCKHOUSENUMBER
                },
                coordinates: {
                    latitude: coordinates[1],
                    longitude: coordinates[0]
                },
                description: description.DESCRIPTION
            }
        })

    } catch(e) {
        console.error(e)
    }
}


function parseDescription(description) {
    const result = {};

    const pattern = /<th>(.*?)<\/th>\s*<td>(.*?)<\/td>/g;
    let match;

    while ((match = pattern.exec(description)) !== null) {
        const key = match[1];
        result[key] = match[2];
    }

    return result;
}


module.exports = {
    fetchCCFromAPI
}