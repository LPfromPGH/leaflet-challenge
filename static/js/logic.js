//Store the API
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
//perform a Get request to pull the data
d3.json(queryUrl).then(function (data) {

    createFeatures(data.features);

});

function createFeatures(earthquakeData) {

//Define a function that will run for each feature. Add a popup for a little razzle dazzle

    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);

    }
// Create the earthquake layer from the JSON data
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });
// Send them quakes to the map
    createMap(earthquakes);

}
// Create the base layers
function createMap(earthquakes){
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });
//Create the base map
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };
    //Create the overlays
    let overlayMaps = {
        Earthquakes: earthquakes
    };
//create the map, centered on Pittsburgh
    let myMap = L.map("map", {
        center: [
            40.44, -79.99
        ],
        zoom: 3,
        layers: [street, earthquakes]
    });
// create a control layer
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addto(myMap);

}