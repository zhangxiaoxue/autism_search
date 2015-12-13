var autismMap = {
    map: null,
    infowindow: null,
    mapScale: 5,
    markerColor: '#C6463D',
    markerScale: 7,
    markerStrokeWeight: 3,
    markers: {},
    serviceTypeId: null,
    serviceType: null,
    state: null,
    colors: ['#C6463D','#3498db','#9b59b6','#FC6042','#3E4651','#F1654C','#00B5B5','#BB3658','#43353D','#3D8EB9','#EB6361',
        '#D6523C','#BB3658','#FCB941','#3D8EB9','#6C8784','#87766C','#8bc34a','#44B39D','#BF4A67','#5af158','#b2ff59','#eeff41',
        '#ffeb3b','#ffc107','#ff9800','#ff5722','#ffff00','#ffd740','#ffab40','#ff6e40'],
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
        var map = new google.maps.Map(document.getElementById('google-container'), {
            center: {lat: 39.000, lng: -97.650},
            zoom: autismMap.mapScale,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            /*panControl: false,
            zoomControl: false,
            mapTypeControl: false,
            streetViewControl: false,*/
            disableDefaultUI: true,
            styles: autismMap.getStyle()
        });

        var infowindow = new google.maps.InfoWindow({
            maxWidth: 300
        });

        this.map = map;
        this.infowindow = infowindow;

        this.initCustomControl();
        this.initSearchBox();

        autismMap.showMyLocation(callback);

        autismMap.initFilter();

    },
    initCustomControl: function(){
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

        //add custom buttons for current location
        function MyLocationControl(controlDiv, map){

            var controlUImyLocation = document.getElementById('cd-my-location');
            controlDiv.appendChild(controlUImyLocation);

            google.maps.event.addDomListener(controlUImyLocation, 'click', function(){
                autismMap.showMyLocation();
            });
        }

        var myLocationControlDiv = document.createElement('div');
        var myLocationControl = new MyLocationControl(myLocationControlDiv, map);

        map.controls[google.maps.ControlPosition.LEFT_TOP].push(myLocationControlDiv);
        //insert the zoom div on the top left of the map
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(zoomControlDiv);
    },
    initSearchBox: function(){
        var map = this.map;

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchControlDiv = document.createElement('div');
        searchControlDiv.appendChild(input);
        searchControlDiv.style.overflow = 'visible';

        var searchBox = new google.maps.places.SearchBox(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
            searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }

            // Clear out the old markers.
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                    var icon = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };

                    // Create a marker for each place.
                    markers.push(new google.maps.Marker({
                        map: map,
                        icon: icon,
                        title: place.name,
                        position: place.geometry.location
                    }));
                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }

                autismMap.showMarkerByGeo(place.geometry.location.lat(), place.geometry.location.lng());

            });

            autismMap.initFilter();
            map.fitBounds(bounds);
        });

        map.controls[google.maps.ControlPosition.RIGHT_TOP].push(searchControlDiv);
    },
    showMyLocation: function(callback){
        var callback = callback || function(){};
        var map = this.map;
        var infowindow = this.infowindow;

        NProgress.start();

        // Try HTML5 geolocation.
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                //my current location
                var marker = new google.maps.Marker({
                    position: pos,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        //fillColor: '#18bfe3',
                        fillColor: '#4285F4',
                        fillOpacity: 1,
                        strokeColor: '#fff',
                        strokeOpacity: 1,
                        strokeWeight: 2
                    },
                    map: map
                });

                infowindow.setContent('<div class="info-content"><strong>You are here</strong></div>');
                infowindow.open(map, marker);
                map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                map.setZoom(11);

                marker.addListener('mouseover', function() {
                    infowindow.setContent('<div class="info-content"><strong>You are here</strong></div>');
                    infowindow.open(map, marker);
                });

                autismMap.showMarkerByGeo(position.coords.latitude, position.coords.longitude);

                //hide loading bar
                NProgress.done();
                callback();

            }, function() {
                autismMap.handleLocationError(true, infowindow, map.getCenter());
            });

        } else {
            // Browser doesn't support Geolocation
            autismMap.handleLocationError(false, infowindow, map.getCenter());
        }
    },
    addMarker: function(data, color, serviceTypeId){
        var map = this.map;
        var infowindow = this.infowindow;
        var color = color || this.markerColor;
        var serviceTypeId = serviceTypeId || 1;
        this.markers[serviceTypeId] = [];

        data.forEach(function(org) {
            var contentString = template('tpl-info-content', {org: org});

            //console.log(org);
            var marker = new google.maps.Marker({
                place: {
                    location: {lat: org[1], lng: org[0]},
                    query: org[5]
                },
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: autismMap.markerScale,
                    fillColor: color,
                    fillOpacity: 0.8,
                    strokeColor: color,
                    strokeOpacity: 1,
                    strokeWeight: autismMap.markerStrokeWeight
                },
                //icon: marker_url,
                // Attributions help users find your site again.
                attribution: {
                    source: 'Autism Organization Search',
                    webUrl: 'http://autism.xxzhang.info'
                },
                map: map
            });

            marker.addListener('mouseover', function () {
                infowindow.setContent(contentString);
                infowindow.open(map, marker);
            });

            marker.addListener('click', function () {
                infowindow.close();

                //get the detail of current program
                var id = org[2];
                $.getJSON('lib/get_organization_by_id.php', {id: id}, function (resp) {
                    if (resp.status == 0) {
                        console.log('error: get_organization_by_id.php');
                        return;
                    }
                    var $panel = $('#panel-detail');


                    var data = resp.data;
                    $('.panel-cnt', $panel)
                        .html(template('tpl-detail-content', {org: data[0]}));

                    $panel.fadeIn();

                    $('#cd-zoom-in, #cd-zoom-out, #cd-my-location').css('marginLeft', 355);

                });
                infowindow.open(map, marker);
            });

            autismMap.markers[serviceTypeId].push(marker);

        });
    },
    removeMarkerByServiceType: function(serviceTypeId){
        var targetMarkers = this.markers[serviceTypeId];
        targetMarkers.forEach(function(item){
            item.setMap(null);
        });
    },
    //this is a callback funtion, so we cannot use this to refer autismMap object
    showMarkerByType: function(color, serviceType, serviceTypeId){
        var state = autismMap.state;
        var service_type = serviceType || autismMap.serviceType;
        var service_type_id = serviceTypeId || autismMap.serviceTypeId;
        var color = color || autismMap.markerColor;

        if(service_type == undefined && service_type == ''){
            return;
        }

        $.getJSON('lib/get_organization_by_service.php?q='+service_type + '&state=' + state, function(resp){
            if(resp.status == 0){
                console.log('error: lib/get_organization_by_service.php?q='+service_type);
                return;
            }

            if(resp.data.length !== 0){
                autismMap.addMarker(resp.data, color, service_type_id);
            }else{
                alert('Sorry, there is no organization of the selected service type in current state. You can try the neighbor state.');
            }

        });
    },
    handleLocationError: function(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
    },
    showMarkerByGeo: function(lat, lng) {

        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(lat, lng);
        var region = {};

        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                //console.log(results);
                if (results[1]) {
                    var indice=0;
                    for (var j=0; j<results.length; j++)
                    {
                        if (results[j].types[0]=='locality')
                        {
                            indice=j;
                            break;
                        }
                    }
                    console.log(results[j]);
                    for (var i=0; i<results[j].address_components.length; i++)
                    {
                        if (results[j].address_components[i].types[0] == "locality") {
                            //this is the object you are looking for
                            city = results[j].address_components[i];
                        }
                        if (results[j].address_components[i].types[0] == "administrative_area_level_1") {
                            //this is the object you are looking for
                            region = results[j].address_components[i];
                        }
                        if (results[j].address_components[i].types[0] == "country") {
                            //this is the object you are looking for
                            country = results[j].address_components[i];
                        }
                    }

                    //alert(city.long_name + " || " + region.long_name + " || " + country.short_name)

                    //return region.short_name;
                    autismMap.state = region.short_name;
                    autismMap.showMarkerByType();

                } else {
                    return '';
                    console.log("No results found");
                }
                //}
            } else {
                alert("Geocoder failed due to: " + status);
            }
        });
    },
    initFilter: function(){
        $.getJSON('lib/get_service_group.php', function(resp){
            if(resp.status == 0){
                console.log('error: lib/get_service_group.php');
                return;
            }

            var data = resp.data;
            var $filter = $('#filter-service-type');

            $("#select-service", $filter)
                .html(template('tpl-select-service', {data: data, colors: autismMap.colors}))
                .closest('.service-type').css('max-height', $(window).height()-50-42-20-50-40);

            $filter.fadeIn();

            $filter.off('click', '.group-name');
            $filter.off('click', '.help');
            $filter.off('click', '.clear');
            $filter.off('change', 'input[type=checkbox]');
            $filter
                .on('click', '.group-name', function(e){
                    e.preventDefault();

                    var $item = $(this).parent();
                    $item.siblings().removeClass('active');
                    $item.toggleClass('active');

                })
                .on('change', 'input[type=checkbox]', function(){
                    var $this = $(this);
                    var $circle = $this.parent().find('i');

                    if($this.prop('checked') && $this.val()){
                        var color = $circle.data('color');
                        autismMap.showMarkerByType(color, $this.val(), $this.data('id'));
                        $circle.css({color: color});
                    }else{
                        autismMap.removeMarkerByServiceType($this.data('id'));
                        $circle.css({color: '#e0e0e0'});
                    }

                    var $item = $(this).closest('.service-group');
                    var count = $item.find('input:checked').length;
                    if(count !== 0){
                        $item.find('.selected-num').text(count);
                    }else{
                        $item.find('.selected-num').text('');
                    }
                })
                .on('click', '.help', function(e){
                    e.preventDefault();
                    $('#service-type-help').fadeIn();
                })
                .on('click', '.clear', function(e){
                    e.preventDefault();
                    $filter.find('input:checked').prop( "checked", false).trigger('change');
                });

            //filter help modal
            $('#service-type-help').html(template('tpl-service-type-help', {data: resp.data}));


        });
    }
};