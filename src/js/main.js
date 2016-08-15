'use strict';

/*
 * Initialize map
 */
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
var baseLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
var compareLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
baseLayer.addTo(map);
compareLayer.addTo(map);

/*
 * Add Layer swiper
 */
var swipeLyrConf = {base:{layer:baseLayer,clip:null},compare:{layer:compareLayer,clip:null}};
/*var lyrSwiper = L.control.layerSwiper({
	orientation:'v',
	ratio:0.5,
	swipeLyrConf:swipeLyrConf
}).addTo(map);*/

var lyrSwiper = L.control.layerSwiper({
	orientation:'v',
	position:'topleft',
	ratio:0.5,
	swipeLyrConf:swipeLyrConf
}).addTo(map);