//Store the API
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
//perform a Get request to pull the data
d3.json(queryUrl).then(function (data) {
  //  console.log(data);

    createFeatures(data.features);

});
function markerSize(magnitude) {
    return magnitude * 20000;
};

function chooseColor(depth) {
  if (depth < 10) return "#0000FF";
  else if (depth < 25) return "yellow";
  else if (depth < 50) return "orange";
  else if (depth < 75) return "orangered";
  else if (depth < 100) return "red";
  else return "#800080";
}

function createFeatures(earthquakeData) {

//Define a function that will run for each feature. Add a popup for a little razzle dazzle

    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);

    }
// Create the earthquake layer from the JSON data
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,

        pointToLayer: function(feature, latlng) {
           var markers = {
            radius: markerSize(feature.properties.mag),
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.9,
            color: "black",
            stroke: true,
            weight: 0.4
           }
           return L.circle(latlng,markers);
        }
    });


// Send them quakes to the map
 createMap(earthquakes);

}
// Create the base layers
function createMap(earthquakes){
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });
//Create the base map
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };
    //Create the overlays
    var overlayMaps = {
        Earthquakes: earthquakes
    };
//create the map, centered on Pittsburgh
    var myMap = L.map("map", {
        center: [
            40.44, -79.99
        ],
        zoom: 2,
        layers: [street, earthquakes]
    });
// create a control layer
//    L.control.layers(baseMaps, overlayMaps, {
//        collapsed: false
//    });
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
        depth = [0, 10, 25, 50, 75, 100];

        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"

        for (var i = 0; i < depth.length; i++) {
          div.innerHTML +=
            '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i+1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');

        }
        return div;
    };
        legend.addTo(myMap)
};