const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

const appAuthor = "GAUPC13";

// define paths for express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// setup handlebars engine and views location
app.set('view engine','hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: appAuthor
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: appAuthor
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: appAuthor,
        message: 'Enter a zipcode or city name to find the current weather there.'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "Location missing!"
        });
    }
    geocode(req.query.address,(geoError, {lat, long, location} = {}) => {
        if (geoError) {
            return res.send({
                error: geoError
            });
        }
    
        forecast(lat, long, (forecastError, forecastData) => {
            if (forecastError) {
                return res.send({
                    error: forecastError
                });
            }

            res.send({
                location: location,
                forecast: forecastData.currently,
                timeStamp: forecastData.timeStamp,
                icon: forecastData.icon,
                address: req.query.address
            });
        });
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: "You must provide a search term"
        })
    }

    res.send({
        products: []
    });
});

app.get('/help/*', (req,res) => {
    res.render('404', {
        title: '404',
        name: appAuthor,
        errorMessage: 'Help article not found.'
    });
})

app.get('*', (req,res) => {
    res.render('404', {
        title: '404',
        name: 'Gaupc13',
        errorMessage:'Page not found.'
    });
})

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});
