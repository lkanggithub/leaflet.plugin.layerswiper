# Leaflet layer swipe plug-in

## Features:
* Swipe two leaflet layers with draggable swipe bar
* Swipe two leaflet layers in horizontal/vertical orientation
* Switch swipe orientation through clicking layer swipe control (default: on topright of leaflet map control)

## Usage:
    /*
    * Initialize leaflet map
    */
    var map = L.map('map');
    
    /*
    * Initialize two leaflet layers (base layer + layer) for comparison
    */
    var baseLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
    var layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    baseLayer.addTo(map);
    layer.addTo(map);
    
    /*
    * Add layer swipe as leaflet map plug-in (with ini Options)
    */
    var swipeLyrConf = 
    {
      base:{layer:baseLayer,clip:null},
      compare:{layer:layer,clip:null}
    };
    
    var lyrSwiper = L.control.layerSwiper(
    {
      id:'lyrSwiper',
      title:'lyrSwiper',
      position:'topright',
      orientation:'v',
      ratio:0.5,
      swipeLyrConf:swipeLyrConf
    }
    ).addTo(map);
  
## ini Options:
*	`id`: id of layer swipe plug-in
*	`title`: title of layer swipe plug-in
*	`position`: layer swipe plug-in's relative position with leaflet map, default is `topright` Please refer leaflet [API] (http://leafletjs.com/reference.html#control-positions).
*	`orientation`: layer swipe orientation. Options include `h` (horizontal, default), `v` (vertical) and `n` (none). Specifically, `h`: swipe layers with horizontal bar.  `v`: swipe layers with vertical bar.  `n`: no layer swipe. Default is `h (horizontal)`.
*	`ratio`: initial ratio of layers to be compared. For example, ratio: 0.4 means 40% left layers/60% right layer or 40% top layer/60% bottom layer. Default is `0.5`.
*	`swipeLyrConf`: configuration of layer swipe plug-in

