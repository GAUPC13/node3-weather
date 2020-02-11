const request = require('request');

const geocode = (zipcode, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${zipcode}.json?limit=1&access_token=pk.eyJ1IjoiYmVuZGVyMjAzMyIsImEiOiJjazY3OXluZWUwMGJ5M2tzNThqNXY3b2VuIn0.fG9Hd2oYxc0jxBPlCKgxDQ`;

    request({url, json:true}, (error, {body} = {}) => {
        if (error) {
            callback('Unable to connect to mapbox location services!', undefined); 
        } else if(body.message || body.features.length === 0) {
            callback('Unable to find location.  Verify your search terms.', undefined);
        } else {
            const [long, lat] = body.features[0].center;
            callback(undefined,{
                lat: lat,
                long: long,
                location: body.features[0].place_name
            });
        }
    });
}

module.exports = geocode;