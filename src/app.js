const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

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
        name: 'Bubbles'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page',
        name: 'Bubbles'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Page',
        name: 'Bubbles',
        message: 'Helpful hint: Randers *LOVES* cheeseburgers!'
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
                forecast: forecastData,
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
        name: 'Bubbles',
        errorMessage: 'Help article not found.'
    });
})

app.get('*', (req,res) => {
    res.render('404', {
        title: '404',
        name: 'Bubbles',
        errorMessage:'Page not found.'
    });
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
