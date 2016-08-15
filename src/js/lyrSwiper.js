L.Control.layerSwiper = L.Control.extend({
    options: {
        id: "layerSwiper",
        title: 'Image swiper',
        position: 'topright',
        orientation: 'h',
        ratio:0.5,
        swipeLyrConf: null
    },
    
    initialize: function (options) {
        L.setOptions(this, options);
        this._swipeLyrConf = this.options.swipeLyrConf || null;
        this._swipeOrinConf = ['h','v'];
    	this._ratio = this.options.ratio;
    },
    
    onAdd: function (map) {
        this._initCtrl();
        return this._container;
    },
    
    _initCtrl: function () {
        var className = 'leaflet-control-lyrSwiper';
        this._container = L.DomUtil.create('div', className);
        L.DomEvent.disableClickPropagation(this._container);
        this._sliderLink = L.DomUtil.create('a', className + '-toggle', this._container);
        this._sliderLink.setAttribute("title", this.options.title);
		L.DomEvent.on(this._sliderLink, 'click', this._toggleCtrl, this);
		this._lyrSwipeBarContainer = L.DomUtil.create('div', '', map.getContainer());
        var lyrSwipeBarContainer = this._lyrSwipeBarContainer;
        L.DomEvent.disableClickPropagation(lyrSwipeBarContainer);
        lyrSwipeBarContainer.setAttribute('id', 'lyrSwipeBar');
        this._lyrSwipeBar = L.DomUtil.create('div', 'bar', lyrSwipeBarContainer);
        L.DomUtil.create('div', 'handle', this._lyrSwipeBar);

        var swipeLyrFunc;
        if(this.options.orientation.toLowerCase()!='n'){
        	if(this.options.orientation.toLowerCase()=='h'){
	        	this._swipeOrin = 'h';
	        	lyrSwipeBarContainer.innerHTML='<div class="bar"><div class="handle"><i class="fa fa-arrows-v" aria-hidden="true"></i></div><span class="top">Top layer</span><span class="bottom">Bottom layer</span></div>';
	        	swipeLyrFunc = this._swipeLyrH;
				var nw = map.containerPointToLayerPoint([0, 0]);
				var se = map.containerPointToLayerPoint(map.getSize());
				var clipY = nw.y + (se.y - nw.y) * this._ratio;
				var clipStyle = 'clip:rect(' + [nw.y, se.x, clipY, nw.x].join('px,') + 'px)';
	        	this._swipeLyrConf.base.clip = clipStyle;
        	}else if(this.options.orientation.toLowerCase()=='v'){
	        	this._swipeOrin = 'v';
	        	lyrSwipeBarContainer.innerHTML='<div class="bar"><div class="handle"><i class="fa fa-arrows-h" aria-hidden="true"></i></div><span class="left">Left layer</span><span class="right">Right layer</span></div>';
	        	swipeLyrFunc = this._swipeLyrV;        	
				var nw = map.containerPointToLayerPoint([0, 0]);
				var se = map.containerPointToLayerPoint(map.getSize());
				var clipX = nw.x + (se.x - nw.x) * this._ratio;
				var clipStyle = 'clip:rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
	        	this._swipeLyrConf.base.clip = clipStyle;
        	}
			var swipeLyrConf = this._swipeLyrConf;
			$('#lyrSwipeBar').draggable({
				containment:map.getContainer(),
				drag:function(){swipeLyrFunc.call(this,this,swipeLyrConf);},
				stop:function(){swipeLyrFunc.call(this,this,swipeLyrConf);}}).css('-ms-touch-action', 'none');
		    lyrSwipeBarContainer.addEventListener('mouseover', function () {
		        map.dragging.disable();
		        this.style.opacity=0.5;
		    });
		    lyrSwipeBarContainer.addEventListener('mouseout', function () {
		        map.dragging.enable();
		        this.style.opacity=1.0;
		    });
			map.on('move', function(){
				swipeLyrFunc.call(this,lyrSwipeBarContainer,swipeLyrConf);
			});
			if(this._swipeOrin=='v'){
				lyrSwipeBarContainer.style.left=this._swipeLyrConf.base.clip.split(',')[1];
			}else if(this._swipeOrin=='h'){
				lyrSwipeBarContainer.style.top=this._swipeLyrConf.base.clip.split(',')[2];
			}
	    	swipeLyrFunc(lyrSwipeBarContainer,swipeLyrConf);
        }else{
        	this._swipeOrin = 'n';
        }
        this._sliderLink.innerHTML = this._swipeOrin;
        this._sliderLink.innerHTML = '<i class="fa fa-map-o" aria-hidden="true"></i>';
	    this._classPrefix = 'leaflet-control-lyrSwipeBarContainer';
        L.DomUtil.addClass(lyrSwipeBarContainer, this._classPrefix+'-'+this._swipeOrin);
    },
    
    _toggleCtrl: function(){
    	var lyrSwipeBarContainer = this._lyrSwipeBarContainer;
    	var idx = this._swipeOrinConf.indexOf(this._swipeOrin);
    	if(idx==this._swipeOrinConf.length-1){
    		idx = 0;
    	}else{
    		idx = idx+1;
    	}
    	this._swipeOrin = this._swipeOrinConf[idx];
    	var swipeLyrFunc;
        if(this._swipeOrin=='h' || this._swipeOrin=='v'){
        	if(this._swipeOrin=='h'){
        		this._sliderLink.innerHTML = '<i class="fa fa-map-o fa-rotate-270" aria-hidden="true"></i>';
        		if(L.DomUtil.hasClass(lyrSwipeBarContainer,this._classPrefix+'-v')){
        			L.DomUtil.removeClass(lyrSwipeBarContainer,this._classPrefix+'-v');
        			lyrSwipeBarContainer.style.left=null;
        		}else if(L.DomUtil.hasClass(lyrSwipeBarContainer,this._classPrefix+'-n')){
        			L.DomUtil.removeClass(lyrSwipeBarContainer,this._classPrefix+'-n');
        		}
        		L.DomUtil.addClass(lyrSwipeBarContainer,this._classPrefix+'-'+this._swipeOrin);
        		lyrSwipeBarContainer.innerHTML='<div class="bar"><div class="handle"><i class="fa fa-arrows-v" aria-hidden="true"></i></div><span class="top">Top layer</span><span class="bottom">Bottom layer</span></div>';
	        	swipeLyrFunc = this._swipeLyrH;
				var nw = map.containerPointToLayerPoint([0, 0]);
				var se = map.containerPointToLayerPoint(map.getSize());
				var clipY = nw.y + (se.y - nw.y) * this._ratio;
				var clipStyle = 'clip:rect(' + [nw.y, se.x, clipY, nw.x].join('px,') + 'px)';
	        	this._swipeLyrConf.base.clip = clipStyle;
	        	lyrSwipeBarContainer.style.top=this._swipeLyrConf.base.clip.split(',')[2];
        	}else{
        		this._sliderLink.innerHTML = '<i class="fa fa-map-o" aria-hidden="true"></i>';
        		if(L.DomUtil.hasClass(lyrSwipeBarContainer,this._classPrefix+'-h')){
        			L.DomUtil.removeClass(lyrSwipeBarContainer,this._classPrefix+'-h');
        			lyrSwipeBarContainer.style.top=null;
        		}else if(L.DomUtil.hasClass(lyrSwipeBarContainer,this._classPrefix+'-n')){
        			L.DomUtil.removeClass(lyrSwipeBarContainer,this._classPrefix+'-n');
        		}
        		L.DomUtil.addClass(lyrSwipeBarContainer,this._classPrefix+'-'+this._swipeOrin);
        		lyrSwipeBarContainer.innerHTML='<div class="bar"><div class="handle"><i class="fa fa-arrows-h" aria-hidden="true"></i></div><span class="left">Left layer</span><span class="right">Right layer</span></div>';
	        	swipeLyrFunc = this._swipeLyrV;
				var nw = map.containerPointToLayerPoint([0, 0]);
				var se = map.containerPointToLayerPoint(map.getSize());
				var clipX = nw.x + (se.x - nw.x) * this._ratio;
				var clipStyle = 'clip:rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
	        	this._swipeLyrConf.base.clip = clipStyle;
	        	lyrSwipeBarContainer.style.left=this._swipeLyrConf.base.clip.split(',')[1];
        	}
	        $('#lyrSwipeBar').draggable({
	        	containment:map.getContainer(),
	        	drag:function(){swipeLyrFunc.call(this,this,swipeLyrConf);},
	        	stop:function(){swipeLyrFunc.call(this,this,swipeLyrConf);}}).css('-ms-touch-action', 'none');
			var swipeLyrConf = this._swipeLyrConf;
	        map.on('move', function(){
				swipeLyrFunc.call(this,lyrSwipeBarContainer,swipeLyrConf);
			});
			swipeLyrFunc(lyrSwipeBarContainer,this._swipeLyrConf);
        }
    },
    
    _swipeLyrH: function(swipeBar,swipeLyrConf){
    	$(swipeBar).draggable("option","axis","y");
		var tmpLyr = swipeLyrConf.base.layer;
		if(tmpLyr!=null){
			var nw = map.containerPointToLayerPoint([0, 0]);
			var se = map.containerPointToLayerPoint(map.getSize());
			var swipeBarY = Number(swipeBar.style.top.substring(0,swipeBar.style.top.lastIndexOf('px')));
			var clipY = nw.y + swipeBarY;
			var clipStyle = 'clip:rect(' + [nw.y, se.x, clipY, nw.x].join('px,') + 'px)';
			tmpLyr._container.setAttribute('style','display: block;' + clipStyle);
			swipeLyrConf.base.clip = clipStyle;
			tmpLyr.setZIndex(2);
			
		}
    },
    
    _swipeLyrV: function(swipeBar,swipeLyrConf){
    	$(swipeBar).draggable("option","axis","x");
		var tmpLyr = swipeLyrConf.base.layer;
		if(tmpLyr!=null){
			var nw = map.containerPointToLayerPoint([0, 0]);
		    var se = map.containerPointToLayerPoint(map.getSize());
		    var swipeBarX = Number(swipeBar.style.left.substring(0,swipeBar.style.left.lastIndexOf('px')));
		    var clipX = nw.x + swipeBarX;
		    var clipStyle = 'clip:rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
		    tmpLyr._container.setAttribute('style','display: block;' + clipStyle);
			swipeLyrConf.base.clip = clipStyle;
			tmpLyr.setZIndex(2);
		}
    },
});
L.control.layerSwiper = function (f, options) {
    return new L.Control.layerSwiper(f, options);
};