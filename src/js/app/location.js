/**
 * @module Location
 * @author Ovilia
 * @description Geo location detecting.
 */

define(function(require) {

    /**
     * init and displays the map
     */
    function Location() {
        this.geo = navigator.geolocation || xwalk.experimental.geolocation;

        this.latitude = null;
        this.longitude = null;

        this._fakeLocations = [];
        this._fakeLocationId = 0;
    }



    /**
     * check if geolocation is available for the device
     * @return {bool} if is available
     */
    Location.prototype.check = function() {
        return this.geo !== undefined;
    }



    /**
     * get current geo location, timeout after 30 seconds
     * @callback success provides latitude and longitude when get position 
     *           successfully
     * @callback error return error when fail to get position
     */
    Location.prototype.getLocation = function(success, error) {
        var that = this;
        if (this._fakeLocations.length === 0) {
            this._getFakeLocation(function() {
                var pos = that._fakeLocations[that._fakeLocationId];
                that.longitude = pos[0];
                that.latitude = pos[1];
                success(pos[0], pos[1]);
                ++that._fakeLocationId;
            });
        } else {
            var pos = this._fakeLocations[this._fakeLocationId];
            this.longitude = pos[0];
            this.latitude = pos[1];
            success(pos[0], pos[1]);
            this._fakeLocationId += 5;
            if (this._fakeLocationId === this._fakeLocations.length) {
                this._fakeLocationId = 0;
            }
        }
        // var that = this;
        // if (this.geo) {
        //     this.geo.getCurrentPosition(function (pos) {
        //         var latitude = pos.coords.latitude;
        //         var longitude = pos.coords.longitude;
        //         if (success) {
        //             that.latitude = latitude;
        //             that.longitude = longitude;
        //             if (success) {
        //                 success(longitude, latitude);
        //             }
        //         }
        //     }, function (e) {
        //         // TODO: fake position
        //         that.longitude = 121.51 + Math.random() * 0.01;
        //         that.latitude = 30.99 + Math.random() * 0.01;
        //         if (success) {
        //             success(that.longitude, that.latitude);
        //         }

        //         if (error) {
        //             error(e);
        //         }
        //     }, {
        //         timeout: 30000,
        //         enableHighAccuracy: true,
        //         maximumAge: 0
        //     });
        // }
    }



    /**
     * get fake location for debug
     * @param {Function} callback callback function when get location
     */
    Location.prototype._getFakeLocation = function(callback) {
        var that = this;
        Dom7.getJSON('res/json/location.json', function(data) {
            that._fakeLocations = data;

            if (callback) {
                callback();
            }
        });
    }

    return Location;
});
