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
        
        if (this.geo) {
            this.geo.getCurrentPosition(function (pos) {
                var latitude = pos.coords.latitude;
                var longitude = pos.coords.longitude;
                if (success) {
                    that.latitude = latitude;
                    that.longitude = longitude;
                    success(latitude, longitude, pos);
                }
            }, function (e) {
                if (error) {
                    error(e);
                }
            }, {
                timeout: 30000
            });
        }
    }

    return Location;
});
