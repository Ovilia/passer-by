define(function(require) {

    var $ = Dom7;
    var Player = require('player');

    /**
     * Passerby app logics.
     */
    function Passerby() {
        var that = this;

        this._isDebug = true;

        // init framework7
        this.f7 = new Framework7();
        var mainView = this.f7.addView('.view-main', {
            dynamicNavbar: true
        });

        var MapOperator = require('mapOperator');
        var Location = require('location');

        // map in explore page
        this.exploreMap = new MapOperator($('#explore-chart')[0]);

        // geo location
        this.location = new Location();
        var isLocationSupported = this.location.check();
        if (!isLocationSupported) {
            this._log('Geo location is not supported.', true);
        } else {
            this._log('Geo location is supported.');
            this.updateLocation();
        }

        // players
        this.players = [];
    }



    /**
     * update geo location and update the explore map
     */
    Passerby.prototype.updateLocation = function() {
        var that = this;

        this.location.getLocation(function(latitude, longitude, pos) {
            that._log('latitude: ' + latitude + ', longitude: ' + longitude);
            // update map position
            that.exploreMap.updateLocation(longitude, latitude);

            // fake players for debug
            that._fakePlayers(20);
            that.exploreMap.updatePlayers(that.players);

            that.updatePlayers();
        }, function(e) {
            that._log('Fail to get location. Please try opening GPS.', true);
            that._log(e);
        });
    };



    /**
     * update player positions and update the map
     */
    Passerby.prototype.updatePlayers = function() {
        var that = this;

        this._updatePlayersHandler = setTimeout(function() {
            that._fakePlayersMoved(0, 0);
            that.exploreMap.updatePlayers(that.players);
            that.updatePlayers();
        }, 200);
    }


    /**
     * write log to log panel for debug
     * @param {*} everything to be logged
     * @param {bool} isAlert if use app alert to screen
     */
    Passerby.prototype._log = function(obj, isAlert) {
        if (this._isDebug) {
            $('#log').append('<p>' + JSON.stringify(obj) + '</p>');
            console.log(obj);
            if (isAlert) {
                this.f7.alert(obj);
            }
        }
    };



    /**
     * make fake players for test
     * @param  {number} cnt number of players
     */
    Passerby.prototype._fakePlayers = function(cnt) {
        if (this.location.latitude != null) {
            this.players = [];
            for (var i = cnt - 1; i >= 0; --i) {
                var id = (cnt - i).toString();
                var latitude = this.location.latitude
                        + (Math.random() - 0.5) * 0.01;
                var longitude = this.location.longitude
                        + (Math.random() - 0.5) * 0.01;
                this.players.push(new Player(id, longitude, latitude));
            }
        }
    };



    /**
     * moves fake players for test
     * @param  {number} deleteCnt number of players to be deleted randomly
     * @param  {number} newCnt    number of players to be added randomly
     */
    Passerby.prototype._fakePlayersMoved = function(deleteCnt, newCnt) {
        var len = this.players.length;

        // randomly delete some players
        var deletedCnt = 0;
        for (var i = len - 1; i >= 0 && deletedCnt < deleteCnt; --i) {
            if (this.players[i]) {
                delete this.players[i];
                ++deletedCnt;
            }
        }

        // update postions to those not deleted
        for (var i = len - 1 - deleteCnt; i >= 0; --i) {
            if (this.players[i]) {
                this.players[i].longitude += (Math.random() - 0.5) * 0.0005;
                this.players[i].latitude += (Math.random() - 0.5) * 0.0005;
            }
        }

        // add new players
        var playId = Math.floor(Math.random() * 1000);
        if (this.location.latitude != null) {
            for (var i = newCnt - 1; i >= 0; --i) {
                var latitude = this.location.latitude
                        + (Math.random() - 0.5) * 0.01;
                var longitude = this.location.longitude
                        + (Math.random() - 0.5) * 0.01;
                this.players.push(new Player((++playId).toString(),
                        longitude, latitude));
            }
        }
    }

    

    return Passerby;
});
