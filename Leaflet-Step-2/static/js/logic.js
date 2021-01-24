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
    faultlineUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

    // Retrieve earthquake data
    d3.json(url, function (earthquakeData) {
        d3.json(faultlineUrl, function (faultlineData) {
            // Sending our earthquakes data to the createMap function
            createMap(earthquakeData.features, faultlineData.features);
        });

    });
}

// Creates map with earthquake data
function createMap(earthquakes, faultlineData) {

    // Defining information to be displayed on clicking the markers on the map
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h2>Magnitude:" + feature.properties.mag + "</h2><h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    

    // Creating a GeoJSON layer with the retrieved data
    var earthquakelayer = L.geoJSON(earthquakes, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.properties.mag),
                color: "black",
                weight: 1,
                opacity: 0.75,
                fillOpacity: 0.65
            });
        },
        onEachFeature: onEachFeature
    }).addTo(myMap);

    var faultlineLayer = L.geoJSON(faultlineData, {
        color: "#fba200"
    }) 

    // Display legend at bottom right corner of the map
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (myMap) {

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