var overviewMap = {
    map: null,
    infowindow: null,
    mapScale: 4,
    strokeColor: '#2D313F',
    strokeWeight: 1.5,
    //colors: ['#e1e7ec','#81a0c1','#5085bc','#3171bb','#2c478e','#273d56','#2f2c52'],
    colors: ['#e1e7ec','#81a0c1','#5085bc','#225f92','#003c6c','#002653','#00123c'],
    getStyle: function(){
        var	main_color = '#2d313f',
            saturation_value= -20,
            brightness_value= 5;

        return [
            {
                //set saturation for the labels on the map
                elementType: "labels",
                stylers: [
                    {saturation: saturation_value}
                ]
            },
            {	//poi stands for point of interest - don't show these lables on the map
                featureType: "poi",
                elementType: "labels",
                stylers: [
                    {visibility: "off"}
                ]
            },
            {
                //don't show highways lables on the map
                featureType: 'road.highway',
                elementType: 'labels',
                stylers: [
                    {visibility: "off"}
                ]
            },
            {
                //don't show local road lables on the map
                featureType: "road.local",
                elementType: "labels.icon",
                stylers: [
                    {visibility: "off"}
                ]
            },
            {
                //don't show arterial road lables on the map
                featureType: "road.arterial",
                elementType: "labels.icon",
                stylers: [
                    {visibility: "off"}
                ]
            },
            {
                //don't show road lables on the map
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [
                    {visibility: "off"}
                ]
            },
            //style different elements on the map
            {
                featureType: "transit",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "poi",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "poi.government",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "poi.sport_complex",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "poi.attraction",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "poi.business",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "transit",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "transit.station",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "landscape",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]

            },
            {
                featureType: "road",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "road.highway",
                elementType: "geometry.fill",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [
                    { hue: main_color },
                    { visibility: "on" },
                    { lightness: brightness_value },
                    { saturation: saturation_value }
                ]
            }
        ];
    },
    init: function(callback) {
        var that = this;
        var callback = callback || function(){};
        var map = new google.maps.Map(document.getElementById('google-container'), {
            center: {lat: 39.000, lng: -97.650},
            zoom: overviewMap.mapScale,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            styles: overviewMap.getStyle()
        });

        var infowindow = new google.maps.InfoWindow({
            maxWidth: 300
        });

        map.data.addListener('mouseover', function (event) {
            var data = {
                state: event.feature.getProperty("NAME"),
                count: event.feature.getProperty("count")
            };

            infowindow.setContent(template('tpl-info-content', {data: data}));
            infowindow.setPosition(event.latLng);
            infowindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
            infowindow.open(map);

            map.data.revertStyle();
            map.data.overrideStyle(event.feature, {
                strokeWeight: 3,
                strokeOpacity: 1
            });
        });

        map.data.addListener('mouseout', function(event) {
            infowindow.close();
            map.data.revertStyle();
        });

        this.map = map;
        this.infowindow = infowindow;

        this.initCustomControl();
        this.showLayer(callback);
    },
    initCustomControl: function(){
        var that = this;
        var map = this.map;

        //add custom buttons for the zoom-in/zoom-out on the map
        function CustomZoomControl(controlDiv, map) {
            //grap the zoom elements from the DOM and insert them in the map
            var controlUIzoomIn= document.getElementById('cd-zoom-in'),
                controlUIzoomOut= document.getElementById('cd-zoom-out');
            controlDiv.appendChild(controlUIzoomIn);
            controlDiv.appendChild(controlUIzoomOut);

            // Setup the click event listeners and zoom-in or out according to the clicked element
            google.maps.event.addDomListener(controlUIzoomIn, 'click', function() {
                map.setZoom(map.getZoom()+1)
            });
            google.maps.event.addDomListener(controlUIzoomOut, 'click', function() {
                map.setZoom(map.getZoom()-1)
            });
        }

        var zoomControlDiv = document.createElement('div');
        var zoomControl = new CustomZoomControl(zoomControlDiv, map);
        //insert the zoom div on the top left of the map
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(zoomControlDiv);

        var legend = document.getElementById('legend');
        var div = document.createElement('div');
        div.innerHTML = template('tpl-legend', {colors: that.colors, strokeColor: that.strokeColor});
        legend.appendChild(div);

        map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
            legend);
    },
    showLayer: function(callback){
        var that = this;
        $.getJSON('data/org_count.json', function(resp){

            $.getJSON('data/states.json', function(geojson){

                that.map.data.addGeoJson(geojson);

                that.map.data.setStyle(function(feature) {
                    console.log(feature);
                    var state = feature.getProperty('NAME');
                    var count = 0;
                    var colorIndex = 0;

                    $.each(resp, function(key, value){
                        if(value.name == state){
                            count = value.count;
                            return;
                        }
                    });

                    if(count > 0 && count < 500) {
                        colorIndex = 1;
                    }else if(count >= 500 && count < 1000){
                        colorIndex = 2;
                    }else if(count >= 1000 && count < 1500) {
                        colorIndex = 3;
                    }else if(count >= 1500 && count < 2000) {
                        colorIndex = 4;
                    }else if(count >= 2000 && count < 2500) {
                        colorIndex = 5;
                    }else if(count > 2500){
                        colorIndex = 6;
                    }

                    feature.setProperty('count', count);

                    return {
                        fillColor: that.colors[colorIndex],
                        fillOpacity: 0.7,
                        strokeColor: that.strokeColor,
                        strokeWeight: that.strokeWeight,
                        strokeOpacity: 0.8
                    };

                });

                callback();

            });

        });
    }

};