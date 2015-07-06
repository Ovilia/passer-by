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
        var ChartManager = require('chartManager');



        /**
         * explore page
         */
        this.players = [];

        // map in explore page
        this.exploreMap = new MapOperator($('#explore-chart')[0]);

        // geo location
        this.isUpdatingLocation = true;
        this.location = new Location();
        var isLocationSupported = this.location.check();
        if (!isLocationSupported) {
            this._log('Geo location is not supported.', true);
        } else {
            this._log('Geo location is supported.');
            this.updateLocationStart();
        }

        $('#tab-explore').on('show', function() {
            that.updateLocationStart();
        });



        /**
         * statics page
         */
        $('#tab-statics').on('show', function() {
            if (!that.staticsChart) {
                that.staticsChart = new ChartManager($('#statics-chart')[0],
                        $('#statics-map')[0], that.location);

                that.staticsChart.initChart();
            }
            that.updateLocationStop();

            $('#staticsDurationSelect').on('change', function() {
                var chart = $('#staticsChartSelect').val();
                that.staticsChart.updateChart(this.value, chart);
            });

            $('#staticsChartSelect').on('change', function() {
                var duration = $('#staticsDurationSelect').val();
                if (this.value === that.staticsChart.ChartType.amount) {
                    $('#statics-map').hide();
                    $('#statics-chart').show();
                } else {
                    $('#statics-chart').hide();
                    $('#statics-map').show();

                    that.staticsChart.initMap();
                }
                that.staticsChart.updateChart(duration, this.value);
            });
        });
    }



    /**
     * update my location constantly
     */
    Passerby.prototype.updateLocationStart = function() {
        this.isUpdatingLocation = true;
        this._updateLocation();

        var that = this;
        this._updateLocationHandler = setTimeout(function() {
            that.updateLocationStart();
        }, 5000);
    };


    /**
     * stop updating my location
     */
    Passerby.prototype.updateLocationStop = function() {
        if (this._updateLocationHandler) {
            clearTimeout(this._updateLocationHandler);
            this._updateLocationHandler = null;
        }
        this.isUpdatingLocation = false;
    };



    /**
     * update player positions and update the map
     */
    Passerby.prototype.updatePlayers = function() {
        if (this.players.length === 0) {
            this._fakePlayers(10);
        }
        this._fakePlayersMoved(2, 2);
        this.exploreMap.updatePlayers(this.players, this.location);
    };



    /*****************************************************************
     *                       private functions                       *
     *****************************************************************/

    /**
     * update geo location once and update the explore map
     */
    Passerby.prototype._updateLocation = function() {
        if (!this.isUpdatingLocation) {
            return;
        }
        var that = this;
        this.location.getLocation(function(longitude, latitude) {
            // that._log('latitude: ' + latitude + ', longitude: ' + longitude);
            // update map position
            that.location.location = longitude;
            that.location.latitude = latitude;
            that.exploreMap.updateLocation(that.location);

            that.updatePlayers();
        }, function(e) {
            that._log('Fail to get location. Please try opening GPS.', true);
            that._log(e);
        });
    };

    /*****************************************************************
     *                    end of private functions                   *
     *****************************************************************/



    /*****************************************************************
     *                        debug functions                        *
     *****************************************************************/

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
                // this.f7.alert(obj);
            }
        }
    };



    /**
     * make faking players for test
     * @param  {number} cnt number of players
     */
    Passerby.prototype._fakePlayers = function(cnt) {
        if (this.location.latitude != null) {
            this.players = [];
            for (var i = cnt - 1; i >= 0; --i) {
                var id = (cnt - i).toString();
                var latitude = this.location.latitude
                        + (Math.random() - 0.5) * 0.1;
                var longitude = this.location.longitude
                        + (Math.random() - 0.5) * 0.1;
                this.players.push(new Player(id, longitude, latitude));
            }
        }
    };



    /**
     * moves faking players for test
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
                this.players[i].longitude += (Math.random() - 0.5) * 0.01;
                this.players[i].latitude += (Math.random() - 0.5) * 0.01;
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

    /*****************************************************************
     *                    end of debug functions                     *
     *****************************************************************/

    

    return Passerby;
});
