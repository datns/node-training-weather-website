const express = require('express');
const path = require('path');
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

// Define paths for Express config
const app = express();
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "DDns"
  })
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "DDns"
  })
});

app.get("/help", ((req, res) => {
  res.render("help", {
    helpText: "This is a helpful text.",
    title: "Help",
    name: "DDns"
  });
}));

app.get('/weather', (req, res) => {
  const address = req.query.address;
  if (!address) {
      return res.send({
          error: "You must provide an address"
      });
  }
  geocode(address, (error, { latitude, longitude, location } = {}) => {
    if (error)
      return res.send({
        error
      });
    forecast(latitude, longitude, (error, forecastData) => {
      if (error)
        return res.send({ error });
      return res.send({
        forecast: forecastData,
        location,
        address
      })
    })
  });
});

app.get("/help/*", (req, res) => {
    res.render("404", {
        text: "Help article not found.",
        title: "404",
        name: "DDns"
    })
});

app.get("*", (req, res) => {
    res.render("404", {
        text: "Page not found.",
        title: "404",
        name: "DDns"
    })
});

app.listen(port, () => {
  console.log('Server is up on port 3000.')
});

