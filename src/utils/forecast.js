const request = require('request');

const forecast = (lat, long, callback) => {

    const url = `https://api.darksky.net/forecast/bc22ee6c896cabd352117ca1240f9e47/${lat},${long}`;

    request({url, json:true}, (error, {body}) => {
        if (error) {
            callback('Unable to connect to weather service', undefined);
        } else if (body.error) {
            callback('Unable to find location.', undefined);
        } else {
            callback(undefined, {
                currently: `It is currently ${body.currently.temperature} F degrees out.  There is a ${body.currently.precipProbability}% chance of rain.`,
                timeStamp: Date(body.currently.time)
            });
        }
    });
}

module.exports = forecast;