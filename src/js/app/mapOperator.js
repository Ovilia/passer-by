/**
 * @module MapOperator
 * @author Ovilia
 * @description ECharts and Baidu Map related operations.
 */

define(function(require) {

    var Player = require('player');

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
        this.markerMe.setPosition(point);
    };



    /**
     * update players on the map
     * @param  {Array.<Player>|<Player>} players list of players, 
     *                                           or a single player
     */
    MapOperator.prototype.updatePlayers = function(players) {
        window.map = this.map;
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
        var container = BMapExt.getEchartsContainer();

        var startPoint = {
            x: 115,
            y: 38
        };
        // set my position marker
        this.markerMe = new BMap.Marker(startPoint);
        this.map.addOverlay(this.markerMe);
        // this.markerMe.setAnimation(BMAP_ANIMATION_BOUNCE);

        // set map position
        this.updateLocation(startPoint.x, startPoint.y);
        this.map.enableScrollWheelZoom(true);


        this.shitIcon = new BMap.Icon('./img/shit.gif', new BMap.Size(32, 32));
    };



    return MapOperator;
});
