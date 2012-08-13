var map;

function initMap() {
    // Leaflet Map
    map = new L.Map('map');
    
    // Initial location
    var intialPoint = new L.LatLng(27.841845, -82.598578);
    
    var geojsonFeature = {
        "type": "Feature",
        "properties": {
            "name": "Weedon Island Preserve",
            "amenity": "Cultural Resource",
            "popupContent": "Welcome to Weedon Island Preserve!"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-82.598578, 27.841845]
        }
    };
    
    // OSM
    var streetMapUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var streetMapLayer = new L.TileLayer(streetMapUrl, { maxZoom: 19, attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>' });

    map.setView(intialPoint, 14);
    map.addLayer(streetMapLayer);
    
    var editFeatures = L.geoJson().addTo(map);
    editFeatures.addData(geojsonFeature);
}