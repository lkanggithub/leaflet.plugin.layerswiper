// var ShowMethods = function getAllMethods(object) {
    // return Object.getOwnPropertyNames(object).filter(function(property) {
        // return typeof object[property] == 'function';
    // });
// };

var viewCenter = [37.0, -92.5];
var viewSouthWest = L.latLng(24.0, -125.0);
var viewNorthEast = L.latLng(50.0, -60.0);
var viewBounds = L.latLngBounds(viewSouthWest, viewNorthEast);
var map = L.map('map', {
    zoom: 5,
    minZoom: 4,
    center: viewCenter,
    maxBounds: viewBounds
});

/*
 * Initialize map
 */
var mapAttrCtrl = map.attributionControl;
mapAttrCtrl._container.innerHTML = 'Leaflet layer swiper plug-in demo |  <a href="mailto:lkang3@masonlive.gmu.edu">Contact author</a>';
var baseLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
var compareLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
baseLayer.addTo(map);
compareLayer.addTo(map);

/*
 * Add Layer swiper
 */
swipeLyrConf = {base:{layer:baseLayer,clip:null},compare:{layer:compareLayer,clip:null}};
var lyrSwiper = L.control.layerSwiper({
	orientation:'v',
	ratio:0.5,
	swipeLyrConf:swipeLyrConf
}).addTo(map);