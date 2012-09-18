var map;
var coords = [];
var proj = L.Projection.Mercator;

function initMap() {
    
    // New leaflet Map
    map = new L.Map('map', {
        doubleClickZoom: false
    });
    
    // var southWest = new L.LatLng(27.821, -82.617);
    // var northEast = new L.LatLng(27.861, -82.583);
//         
    // var bounds = new L.LatLngBounds(southWest, northEast);
    // map.setMaxBounds(bounds);
    
    // Initial location
    var intialPoint = new L.LatLng(27.841845, -82.598578);
    
    // var geojsonFeature = {
        // "type": "Feature",
        // "properties": {
            // "name": "Weedon Island Preserve",
            // "amenity": "Cultural Resource",
            // "popupContent": "Welcome to Weedon Island Preserve!"
        // },
        // "geometry": {
            // "type": "Point",
            // "coordinates": [-82.598578, 27.841845]
        // }
    // };
    
    // OSM
    var streetMapUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var streetMapLayer = new L.TileLayer(streetMapUrl, { maxZoom: 19, attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' });
    
    // Set the intitial zoom level and center location
    map.setView(intialPoint, 14);
    map.addLayer(streetMapLayer);
    
    var weedonBounds = new L.AgsDynamicLayer(
        'http://23.21.173.219/ArcGIS/rest/services/WeedonBounds/MapServer'
        );
    map.addLayer(weedonBounds);
    // Create feature editor for use in the function below
    var editFeatures = L.geoJson().addTo(map);
    // editFeatures.addData(geojsonFeature);
    
    // Function to add points to the map on click
    function addPoint(e) {
        
        var thisPoint = {
            "type": "Feature",
            "properties": {
                "name": "Weedon Island Preserve",
                "amenity": "Cultural Resource",
                "popupContent": "This shard is located at " + e.latlng.toString()
            },
            "geometry": {
                "type": "Point",
                "coordinates": [e.latlng.lng, e.latlng.lat]
            }
        }
        
        editFeatures.addData(thisPoint);
    }
    
    map.on('click', addPoint);
    
    $('#clear-button').click(function() {
        editFeatures.clearLayers();
        
    });
    
    // On click event for the calculate button
    // Project coordinates and call the node.js service
    $('#calculateButton').click(function() {
        editFeatures.eachLayer(function(layer) {
            console.log(proj.project(layer.getLatLng()));
            coord = proj.project(layer.getLatLng());
            northing = coord.x;
            easting = coord.y;
            coords.push([northing,easting]);
        });
        
        $.ajax({
            url: 'http://nodeppa-kas673.rhcloud.com/nndist',
            cache: false,
            data: {
                coordinates: JSON.stringify(coords)
                },
            dataType: "jsonp",
            success: function(responseData) {
                console.log(responseData);
                coords = [];
                // alert(responseData);
                $("#results-content").html('<p>Mean nearest neighbor distance:    ' + responseData + ' meters</p>');
                $("#results-link").click();
            }
        });
        
    });
    
}