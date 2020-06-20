// create background for map
// let light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
// 	attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
// 	maxZoom: 18,
// 	accessToken: API_KEY
// });
// Creates dark background for map
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
});

let map = L.map('mapid', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
})

// adds both tile layers to the map
let baseMaps = {
    "Dark": dark,
    "Satellite": satelliteStreets,
    Streets: streets
};

// Makes the earthquake layer
let earthquakes = new L.layerGroup();
let plates = new L.layerGroup();

// This contains the overlays that will remain visible
let overlays = {
    "Tectonic Plates": plates,
    Earthquakes: earthquakes
};


// Adds layers control and basemaps control for user
L.control.layers(baseMaps, overlays).addTo(map);

// Adds GeoJSON data
let quakelink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let platelink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
// returns the style data for every earthquake
// we pass the magnitude as a param into getColor and getRadius
function styleInfo(feature) {
    return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
    };
}

// Gets the color of the earthquake based on mag
function getColor(magnitude) {
    if (magnitude > 5) {
        return "#ea2c2c";
    }
    if (magnitude > 4) {
        return "#ea822c";
    }
    if (magnitude > 3) {
        return "#ee9c00";
    }
    if (magnitude > 2) {
        return "#eecc00";
    }
    if (magnitude > 1) {
        return "#d4ee00";
    }
    return "#98ee00";
}

// Gets the radius of the earthquake based on magnitude
function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 4;
}

// Gets the GeoJSON data for map
d3.json(quakelink).then(function (data) {
    // Creates geoJSON layer for map
    L.geoJson(data, {
        // Makes circle markers
        pointToLayer: function (feature, latlng) {
            console.log(data);
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        // Makes popup
        onEachFeature: function (feature, layer) {
            layer.bindPopup('Magnitude: ' + feature.properties.mag
                + "<br>" + "Location: " + feature.properties.place + "</br>");
        }
    }).addTo(earthquakes);
    earthquakes.addTo(map);
});

// Creates legend at bottom right
let legend = L.control({
    position: "bottomright"
});

// Adds legend data
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    const magnitudes = [0, 1, 2, 3, 4, 5];
    const colors = [
        "#98ee00",
        "#d4ee00",
        "#eecc00",
        "#ee9c00",
        "#ea822c",
        "#ea2c2c"
    ];

    // Loops through intervals and gets colors for each interval
    for (var i = 0; i < magnitudes.length; i++) {
        // logs then adds color from colors array
        console.log(colors[i]);
        div.innerHTML +=
            "<i style='background: " + colors[i] + "'></i> " +
            magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
    }
    return div;
};

legend.addTo(map);

// Gets the GeoJSON data for map
d3.json(platelink).then(function (data) {
    // Creates geoJSON layer for map
    L.geoJson(data, {
        color: "#7B68EE",
        weight: 2
    }).addTo(plates);
    plates.addTo(map);
});