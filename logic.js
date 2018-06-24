var myMap = L.map("map", {
	center: [19.8968, -155.5828],
    zoom: 9
});

magnitude_colors = ["yellowgreen","yellow","gold","lightsalmon", "coral", "orange","darkorange","red","firebrick"]

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
var light = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		id: 'mapbox.light',
		accessToken: 'pk.eyJ1IjoiZ2NoYW4wNyIsImEiOiJjamlkdjl0bWswNnhpM2tueGNnb245ZGNvIn0.fPGa7mkeY8R8yRg_ga6uOw',
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    }).addTo(myMap)


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);

function createMarkers(response) {

    console.log("response: ",response);
    console.log(response.features[0]);
    console.log("Magnitude: ", response.features[0].properties.mag);
    console.log("Longitude: ", response.features[0].geometry.coordinates[0]);
    console.log("Latitude: ", response.features[0].geometry.coordinates[1]);
    console.log("Number of Earthquakes :", response.features.length)


    for (var i = 0; i <response.features.length; i++){
        var earthquake = response.features[i];
        
        if (earthquake.geometry.coordinates[0] && earthquake.geometry.coordinates[1]) {
            
            //Magnitude is earthquake.properties.mag
            var marker = L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
                color: magnitude_colors[Math.floor(earthquake.properties.mag)],
                fillColor: magnitude_colors[Math.floor(earthquake.properties.mag)],
                fillOpacity: 0.70,
                radius: earthquake.properties.mag*4000             
            });
            marker.addTo(myMap);

            marker.bindPopup("<h3>" + earthquake.properties.title +"<h3>"+"<h3> Magnitude: " + earthquake.properties.mag + "<h3>");
         }

        }
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
    
        labels = ["<M1","M1","M2","M3","M4","M5","M6","M7", ">M8"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitude_colors.length; i++) {
        div.innerHTML +=
            '<i style="background:' + magnitude_colors[i] + '"></i> ' + '<br>'+
            labels[i] + '<br>'
    }

    return div;
};

legend.addTo(myMap);

