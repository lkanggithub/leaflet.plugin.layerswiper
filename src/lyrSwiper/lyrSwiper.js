L.Control.layerSwiper = L.Control.extend({
    options: {
        id: "layerSwiper",
        title: 'Layer Swiper',
        position: 'topright',
        orientation: 'h',
        ratio:0.5,
        swipeLyrConf: null
    },
    
    initialize: function (options) {
        L.setOptions(this, options);
        this._swipeLyrConf = this.options.swipeLyrConf || null;
        this._swipeOrinConf = ['h','v','n'];
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
        this._lyrSwipeBar = L.DomUtil.create('div', '', this._lyrSwipeBarContainer);
        this._lyrSwipeBarImg = L.DomUtil.create('div', '', this._lyrSwipeBar);
        var swipeLyrFunc;
        if(this.options.orientation.toLowerCase()!='n'){
        	if(this.options.orientation.toLowerCase()=='h'){
	        	this._swipeOrin = 'h';
	        	swipeLyrFunc = this._swipeLyrH;
				var nw = map.containerPointToLayerPoint([0, 0]);
				var se = map.containerPointToLayerPoint(map.getSize());
				var clipY = nw.y + (se.y - nw.y) * this._ratio;
				var clipStyle = 'clip:rect(' + [nw.y, se.x, clipY, nw.x].join('px,') + 'px)';
	        	this._swipeLyrConf.base.clip = clipStyle;
        	}else if(this.options.orientation.toLowerCase()=='v'){
	        	this._swipeOrin = 'v';
	        	swipeLyrFunc = this._swipeLyrV;        	
				var nw = map.containerPointToLayerPoint([0, 0]);
				var se = map.containerPointToLayerPoint(map.getSize());
				var clipX = nw.x + (se.x - nw.x) * this._ratio;
				var clipStyle = 'clip:rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
	        	this._swipeLyrConf.base.clip = clipStyle;
        	}
			var swipeLyrConf = this._swipeLyrConf;
			$('#lyrSwipeBar').draggable({containment:map.getContainer(),drag:function(){swipeLyrFunc.call(this,lyrSwipeBar,swipeLyrConf);},stop:function(){swipeLyrFunc.call(this,lyrSwipeBar,swipeLyrConf);}}).css('-ms-touch-action', 'none');
		    lyrSwipeBarContainer.addEventListener('mouseover', function () {
		        map.dragging.disable();
		        this.style.opacity=0.5;
		    });
		    lyrSwipeBarContainer.addEventListener('mouseout', function () {
		        map.dragging.enable();
		    	this.style.opacity=1;
		    });
			map.on('move', function(){
				swipeLyrFunc.call(this,lyrSwipeBar,swipeLyrConf);
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
	    this._classPrefix = 'leaflet-control-lyrSwipeBarContainer';
        L.DomUtil.addClass(this._lyrSwipeBarContainer, this._classPrefix+'-'+this._swipeOrin);
    },
    
    _toggleCtrl: function(){
    	var idx = this._swipeOrinConf.indexOf(this._swipeOrin);
    	if(idx==this._swipeOrinConf.length-1){
    		idx = 0;
    	}else{
    		idx = idx+1;
    	}
    	this._swipeOrin = this._swipeOrinConf[idx];
    	this._sliderLink.innerHTML = this._swipeOrin;
    	var swipeLyrFunc;
        if(this._swipeOrin=='h' || this._swipeOrin=='v'){
        	if(this._swipeOrin=='h'){
        		if(L.DomUtil.hasClass(this._lyrSwipeBarContainer,this._classPrefix+'-v')){
        			L.DomUtil.removeClass(this._lyrSwipeBarContainer,this._classPrefix+'-v');
        			this._lyrSwipeBarContainer.style.left=null;
        		}else if(L.DomUtil.hasClass(this._lyrSwipeBarContainer,this._classPrefix+'-n')){
        			L.DomUtil.removeClass(this._lyrSwipeBarContainer,this._classPrefix+'-n');
        		}
        		L.DomUtil.addClass(this._lyrSwipeBarContainer,this._classPrefix+'-'+this._swipeOrin);
	        	swipeLyrFunc = this._swipeLyrH;
				var nw = map.containerPointToLayerPoint([0, 0]);
				var se = map.containerPointToLayerPoint(map.getSize());
				var clipY = nw.y + (se.y - nw.y) * this._ratio;
				var clipStyle = 'clip:rect(' + [nw.y, se.x, clipY, nw.x].join('px,') + 'px)';
	        	this._swipeLyrConf.base.clip = clipStyle;
	        	this._lyrSwipeBarContainer.style.top=this._swipeLyrConf.base.clip.split(',')[2];
        	}else{
        		if(L.DomUtil.hasClass(this._lyrSwipeBarContainer,this._classPrefix+'-h')){
        			L.DomUtil.removeClass(this._lyrSwipeBarContainer,this._classPrefix+'-h');
        			this._lyrSwipeBarContainer.style.top=null;
        		}else if(L.DomUtil.hasClass(this._lyrSwipeBarContainer,this._classPrefix+'-n')){
        			L.DomUtil.removeClass(this._lyrSwipeBarContainer,this._classPrefix+'-n');
        		}
        		L.DomUtil.addClass(this._lyrSwipeBarContainer,this._classPrefix+'-'+this._swipeOrin);
	        	swipeLyrFunc = this._swipeLyrV;	        	
				var nw = map.containerPointToLayerPoint([0, 0]);
				var se = map.containerPointToLayerPoint(map.getSize());
				var clipX = nw.x + (se.x - nw.x) * this._ratio;
				var clipStyle = 'clip:rect(' + [nw.y, clipX, se.y, nw.x].join('px,') + 'px)';
	        	this._swipeLyrConf.base.clip = clipStyle;
	        	this._lyrSwipeBarContainer.style.left=this._swipeLyrConf.base.clip.split(',')[1];
        	}
	        $('#lyrSwipeBar').draggable({containment:map.getContainer(),drag:function(){swipeLyrFunc.call(this,lyrSwipeBar,swipeLyrConf);},stop:function(){swipeLyrFunc.call(this,lyrSwipeBar,swipeLyrConf);}}).css('-ms-touch-action', 'none');
			map.on('move', function(){
				swipeLyrFunc.call(this,lyrSwipeBar,swipeLyrConf);
			});
			swipeLyrFunc(lyrSwipeBar,swipeLyrConf);
        }else{
    		if(L.DomUtil.hasClass(this._lyrSwipeBarContainer,this._classPrefix+'-v')){
    			swipeLyrFunc = this._swipeLyrV;
    			L.DomUtil.removeClass(this._lyrSwipeBarContainer,this._classPrefix+'-v');
    			this._lyrSwipeBarContainer.style.left=null;
    		}
    		else if(L.DomUtil.hasClass(this._lyrSwipeBarContainer,this._classPrefix+'-h')){
    			swipeLyrFunc = this._swipeLyrH;
    			L.DomUtil.removeClass(this._lyrSwipeBarContainer,this._classPrefix+'-h');
    			this._lyrSwipeBarContainer.style.top=null;
    		}
    		L.DomUtil.addClass(this._lyrSwipeBarContainer,this._classPrefix+'-'+this._swipeOrin);
			this._swipeLyrConf.base.layer._container.setAttribute('style','');
        }
    },
    
    _swipeLyrH: function(swipeBar,swipeLyrConf){
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