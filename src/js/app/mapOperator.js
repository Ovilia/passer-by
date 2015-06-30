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

        this.markerMe = null;

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
    }



    /**
     * update geo location in map
     * @param  {number} latitude  latitude of geo location 
     * @param  {number} longitude longitude of geo location
     */
    MapOperator.prototype.updateLocation = function(longitude, latitude) {
        var point = new BMap.Point(longitude, latitude);
        this.map.centerAndZoom(point, 15);
        // update markerMe
        if (!this.markerMe) {
            this._initMyMarker({
                x: longitude,
                y: latitude
            });
        }
        this.markerMe.setPosition(point);
    };



    /**
     * update players on the map
     * @param  {Array.<Player>|<Player>} players list of players, 
     *                                           or a single player
     */
    MapOperator.prototype.updatePlayers = function(players) {
        if (players instanceof Player) {
            this.updatePlayers([players]);
            return;
        }

        // flag markerPlayers to be not exist this time
        for (var j = this.markerPlayers.length - 1; j >= 0; --j) {
            if (this.markerPlayers[j]) {
                this.markerPlayers[j]._isOnMap = false;
            }
        }
        for (var i = players.length - 1; i >= 0; --i) {
            if (!players[i]) {
                continue;
            }
            var wasOnMap = false;
            for (var j = this.markerPlayers.length - 1; j >= 0; --j) {
                if (this.markerPlayers[j]
                        && this.markerPlayers[j].player === players[i]) {
                    // this player is currently on the map, update position
                    var point = new BMap.Point(players[i].longitude, 
                            players[i].latitude);
                    this.markerPlayers[j].marker.setPosition(point);
                    // update markerPlayers to be exist this time
                    this.markerPlayers[j]._isOnMap = true;
                    // marker this player to be existed last time
                    wasOnMap = true;
                    break;
                }
            }
            if (!wasOnMap) {
                // a new player on map
                var pos = new BMap.Point(players[i].longitude, 
                        players[i].latitude);
                var marker = new BMap.Marker(pos, {
                    icon: this.shitIcon
                });
                this.map.addOverlay(marker);
                this.markerPlayers.push({
                    player: players[i],
                    marker: marker,
                    _isOnMap: true
                });
            }
        }
        // removes markerPlayers from the map and arrary 
        // that do not exist this time
        for (var j = this.markerPlayers.length - 1; j >= 0; --j) {
            if (this.markerPlayers[j] && !this.markerPlayers[j]._isOnMap) {
                this.map.removeOverlay(this.markerPlayers[j].marker);
                delete this.markerPlayers[j];
            }
        }
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



    /**
     * init map
     */
    MapOperator.prototype._init = function() {
        var BMapExt = new this.BMapExtension(this.mapDom, BMap, this.echarts, {
            enableMapClick: false
        });
        this.map = BMapExt.getMap();

        // this._setMapStyle();

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
                "color": color.backLighter
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
        }];

        this.map.setMapStyle({
            styleJson: style
        });
    };

    return MapOperator;
});
