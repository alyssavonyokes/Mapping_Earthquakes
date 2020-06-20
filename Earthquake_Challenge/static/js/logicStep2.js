let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});
// create background for map
// let light = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
// 	attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
// 	maxZoom: 18,
// 	accessToken: API_KEY
// });

let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
	attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});
//Creates dark background for map
// let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
// 	attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
// 	maxZoom: 18,
// 	accessToken: API_KEY
// });


// adds both tile layers to the map
let baseMaps = {
	"Streets": streets,
	"Satellite": satelliteStreets
};

let map = L.map('mapid', {
	center: [39.5, -98.5],
	zoom: 3,
	layers: [streets]
})

// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps).addTo(map);

// Adds GeoJSON data
let earthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


function styleInfo(feature) {
	return {
		opacity: 1,
		fillOpacity: 1,
		fillColor: "#ffae42",
		color: "#000000",
		radius: getRadius(feature.properties.mag),
		stroke: true,
		weight: 0.5
	};
}
//Gets the radius of the earthquake based on magnitude
function getRadius(magnitude) {
	if (magnitude === 0) {
		return 1;
	}
	return magnitude * 4;
}
// Gets the GeoJSON data for map
d3.json(earthquakes).then(function (data) {
	// Creates geoJSON layer for map
	L.geoJson(data, {
		// Makes circle markers
		pointToLayer: function (feature, latlng) {
			console.log(data);
			return L.circleMarker(latlng);
		},
		style: styleInfo
		// Makes popup
		// onEachFeature: function (feature, layer) {
		// 	layer.bindPopup('Magnitude: ' + feature.properties.mag
		// 	+ "<br>" + "Location: " + feature.properties.place + "</br>");
		// }
	}).addTo(map);
});

// Coordinates for a line
// let line = [
// 	[33.9416, -118.4085],
// 	[37.6213, -122.3790],
// 	[40.7899, -111.9791],
// 	[47.4502, -122.3088]
// ];

// Makes a yellow line connecting the coordinates
// L.polyline(line, {
// 	color: "yellow"
//  }).addTo(map);

// // Get data from cities.js
// let cityData = cities;

// Loops through each city and makes markers
// cityData.forEach(function(city) {
// 	console.log(city)
// 	L.circleMarker(city.location, {
//         radius: city.population / 100000
//     })
// 	.bindPopup("<h2>" + city.city + ", " + city.state + "</h2> <hr> <h3>Population " + city.population + "</h3>")
//   .addTo(map);
// });