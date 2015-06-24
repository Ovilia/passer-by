define(function(require) {

    var $ = Dom7;

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
            this._log('Geo location is not supported.',
                    true);
        } else {
            this._log('Geo location is supported.');

            this.location.getLocation(function(latitude, longitude, pos) {
                that._log('latitude: ' + latitude + ', longitude: ' + longitude);
                // update map position
                that.exploreMap.updateLocation(longitude, latitude);
            }, function(e) {
                that._log('Fail to get location. Please try opening GPS.', true);
                that._log(e);
            });
        }
        
    }



    /**
     * Write log to log panel for debug
     * @param {*} everything to be logged
     * @param {bool} isAlert if use app alert to screen
     */
    Passerby.prototype._log = function(obj, isAlert) {
        if (this._isDebug) {
            Dom7('#log').append('<p>' + JSON.stringify(obj) + '</p>');
            console.log(obj);
            if (isAlert) {
                this.f7.alert(obj);
            }
        }
    }

    

    return Passerby;
});
