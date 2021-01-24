/*******************************
 * USER DEFINED FUNCTIONS
 *******************************/

// Returns color based on magnitude 
function getColor(magnitude) {
    return magnitude >= 5 ? '#253494' :
        magnitude >= 4 ? '#2c7fb8' :
        magnitude >= 3 ? '#41b6c4' :
        magnitude >= 2 ? '#7fcdbb' :
        magnitude >= 1 ? '#c7e9b4' :
        '#ffffcc';
}

// Returns radius based on magnitude
function getRadius(magnitude) {
    return magnitude * 3;
}

// Retrieves the data and calls the function that creates map
function getEarthquakeData() {

    // URL to get the GeoJSON information for "All Earthquakes in Past 7 Days"
    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

    // Retrieve earthquake data
    d3.json(url, function(earthquakeData) {
        // Sending our earthquakes data to the createMap function
        createMap(earthquakeData.features);
    });
}

// Creates map with earthquake data
function createMap(earthquakes) {

    // Defining information to be displayed on clicking the markers on the map
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h2>Magnitude:" + feature.properties.mag + "</h2><h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    // Create a map object
    var myMap = L.map("map", {
        center: [15.5994, -28.6731],
        zoom: 2
    });

    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 20,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    }).addTo(myMap);

    // Creating a GeoJSON layer with the retrieved data
    L.geoJSON(earthquakes, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.properties.mag),
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.65
            });
        },
        onEachFeature: onEachFeature
    }).addTo(myMap);

    // Display legend at bottom right corner of the map
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function(myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            mags = [0, 1, 2, 3, 4, 5];

        // loop through magnitude intervals and generate a label with a colored square for each interval
        for (var i = 0; i < mags.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(mags[i]) + '"></i> ' +
                mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
        }

        return div;
    };
    legend.addTo(myMap);
}

/*******************************
 * ON PAGE LOAD
 *******************************/

getEarthquakeData();