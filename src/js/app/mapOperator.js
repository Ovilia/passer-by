/**
 * @module MapOperator
 * @author Ovilia
 * @description ECharts and Baidu Map related operations.
 */

define(function(require) {

    var Player = require('player');
    var color = require('color');

    /**
     * init and displays the map
     * @param  {HTMLElement} mapDom DOM element to display the map.
     */
    function MapOperator(mapDom) {
        this.echarts = require('echarts');
        this.BMapExtension = require('bmap');

        this.mapDom = mapDom;
        this.map = null;
        this.mapZoom = 16;

        this.markerMe = null;
        this.markerArea = null;

        this.MEET_DISTANCE = 500; // meters when we think two players meet

        /**
         * @typedef {MarkerPlayer}
         * @type {object}
         * @property {Player} player player instance
         * @property {BMap.Marker} marker marker of Baidu Map
         */
        /**
         * array of players with markers
         * @type {MarkerPlayer}
         */
        this.markerPlayers = [];

        this._init();
        window.map = this;
    }



    /**
     * set option to map
     * @param {object} option echart option
     */
    MapOperator.prototype.setOption = function(option) {
        this.BMapExt.setOption(option);
    };



    /**
     * update geo location in map, and update location instance with baidu location
     * @param  {Location} location location instance
     */
    MapOperator.prototype.updateLocation = function(location) {
        var that = this;
        this.getBaiduLocation(
            location.longitude,
            location.latitude,

            function(longitude, latitude) {
                location.longitude = longitude;
                location.latitude = latitude;
                that.updateWithBaiduLocation(longitude, latitude);
            }
        );
    };



    /**
     * get geo location in baidu map
     * @param {number} longitude longitude from geo device
     * @param {number} latitude latitude from geo device
     * @param {Function} callback  callback function when get location
     */
    MapOperator.prototype.getBaiduLocation = function(longitude, latitude, callback) {
        var gpsPoint = new BMap.Point(longitude, latitude);
        var that = this;
        BMap.Convertor.translate(gpsPoint, 0, function(point) {
            if (callback) {
                callback(point.lng, point.lat);
            }
        });
    };



    /**
     * update marker in map with baidu location
     * @param  {number} longitude longitude in baidu map
     * @param  {number} latitude  latitude in baidu map
     */
    MapOperator.prototype.updateWithBaiduLocation = function(longitude, latitude) {
        // update markerMe
        if (!this.markerMe) {
            this._initMyMarker({
                x: longitude,
                y: latitude
            });
        }
        var baiduPoint = new BMap.Point(longitude, latitude);
        this.markerMe.setPosition(baiduPoint);
        this.markerArea.setCenter(baiduPoint);

        this.map.centerAndZoom(baiduPoint, this.map.getZoom());
    }



    /**
     * update players on the map
     * @param {Array.<Player>} players list of player
     * @param {Location} location location object
     */
    MapOperator.prototype.updatePlayers = function(players, location) {
        var IS_MET = 1;
        var IS_NOT_MET = 0;
        // player markPoint
        var data = [[], []];
        // player geo location in baidu map
        var geo = [{}, {}];

        var myPoint = new BMap.Point(location.longitude, location.latitude);

        for (var i = 0, l = players.length; i < l; ++i) {
            if (!players[i]) {
                continue;
            }

            var name = players[i].id.toString();

            // check if player is met
            var point = new BMap.Point(players[i].longitude, players[i].latitude);
            var distance = this.map.getDistance(myPoint, point);
            if (distance < this.MEET_DISTANCE) {
                // set player to meet
                players[i].isMet = true;
            }

            var seriesId = players[i].isMet ? IS_MET : IS_NOT_MET;
            geo[seriesId][name] = players[i].getGeo();
            data[seriesId].push({
                name: name,
                value: 1
            });
        }

        var option = {
            series: [{
                geoCoord: geo[IS_MET],
                type: 'map',
                mapType: 'none',
                data: [],
                markPoint: {
                    symbol: 'circle',
                    effect: {
                        show: true,
                        color: color.secondary
                    },
                    data: data[IS_MET],
                    clickable: false
                }
            }, {
                geoCoord: geo[IS_NOT_MET],
                type: 'map',
                mapType: 'none',
                data: [],
                markPoint: {
                    symbol: 'circle',
                    effect: {
                        show: true,
                        color: color.primary
                    },
                    data: data[IS_NOT_MET],
                    clickable: false
                }
            }]
        }

        this.BMapExt.setOption(option);
    };



    /**
     * removes all player markers from the map
     */
    MapOperator.prototype.removeAllPlayers = function() {
        for (var j = this.markerPlayers.length - 1; j >= 0; --j) {
            if (this.markerPlayers[j]) {
                this.map.removeOverlay(this.markerPlayers[j].marker);
            }
        }
        this.markerPlayers = [];
    }



    /*****************************************************************
     *                       private functions                       *
     *****************************************************************/

    /**
     * init map
     */
    MapOperator.prototype._init = function() {
        this.BMapExt = new this.BMapExtension(this.mapDom, BMap, this.echarts, {
            enableMapClick: false
        });
        this.map = this.BMapExt.getMap();
        var container = this.BMapExt.getEchartsContainer();
        this.BMapExt.initECharts(container);
        this.BMapExt.setOption({});

        this._initConvertor();

        this._setMapStyle();

        this.map.enableScrollWheelZoom(true);
        this.map.centerAndZoom('上海');
    };



    /**
     * set a marker at my position
     */
    MapOperator.prototype._initMyMarker = function(point) {
        // set my position marker
        this.markerMe = new BMap.Marker(point);
        this.map.addOverlay(this.markerMe);
        // this.markerMe.setAnimation(BMAP_ANIMATION_BOUNCE);
        
        this.markerArea = new BMap.Circle(point, this.MEET_DISTANCE, {
            fillColor: color.secondary,
            fillOpacity: 0.1,
            strokeColor: color.secondary,
            strokeOpacity: 0.2
        });
        this.map.addOverlay(this.markerArea);
    };



    /**
     * init baidu map geo location convertor
     * method from http://developer.baidu.com/map/jsdemo/demo/convertor.js
     */
    MapOperator.prototype._initConvertor = function() {
        function load_script(xyUrl, callback){
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = xyUrl;
            script.onload = script.onreadystatechange = function(){
                if((!this.readyState || this.readyState === "loaded" 
                        || this.readyState === "complete")){
                    callback && callback();
                    // Handle memory leak in IE
                    script.onload = script.onreadystatechange = null;
                    if (head && script.parentNode) {
                        head.removeChild(script);
                    }
                }
            };
            // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
            head.insertBefore(script, head.firstChild);
        }

        function translate(point, type, callback){
            var callbackName = 'cbk_' + Math.round(Math.random() * 10000);
            var xyUrl = "http://api.map.baidu.com/ag/coord/convert?from=" + type 
                    + "&to=4&x=" + point.lng + "&y=" + point.lat 
                    + "&callback=BMap.Convertor." + callbackName;
            load_script(xyUrl);
            BMap.Convertor[callbackName] = function(xyResult){
                delete BMap.Convertor[callbackName];
                var point = new BMap.Point(xyResult.x, xyResult.y);
                callback && callback(point);
            }
        }

        BMap.Convertor = {};
        BMap.Convertor.translate = translate;
    };



    /**
     * set map theme to dark
     */
    MapOperator.prototype._setMapStyle = function() {
        var style = [{
            "featureType": "land",
            "elementType": "all",
            "stylers": {
                "color": color.back
            }
        }, {
            "featureType": "green",
            "elementType": "all",
            "stylers": {
                "color": color.backLight
            }
        }, {
            "featureType": "water",
            "elementType": "all",
            "stylers": {
                "color": color.backLighter
            }
        }, {
            "featureType": "manmade",
            "elementType": "all",
            "stylers": {
                "color": color.backLight
            }
        }, {
            "featureType": "road",
            "elementType": "all",
            "stylers": {
                "color": color.backLight
            }
        }, {
            "featureType": "building",
            "elementType": "all",
            "stylers": {
                "color": "#000000"
            }
        }, {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999"
            }
        }, {
            "featureType": "boundary",
            "elementType": "all",
            "stylers": {
                "color": color.backLight
            }
        }, {
            "featureType": "subway",
            "elementType": "geometry",
            "stylers": {
                "color": color.backLighter
            }
        }, {
            "featureType": "subway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#ffffff"
            }
        }, {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "label",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999"
            }
        }];

        this.map.setMapStyle({
            styleJson: style
        });
    };

    return MapOperator;
});
