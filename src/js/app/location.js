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
                    that.getBaiduLocation(longitude, latitude, function(x, y) {
                        success(x, y, pos);
                    });
                }
            }, function (e) {
                if (error) {
                    error(e);
                }
            }, {
                timeout: 30000,
                enableHighAccuracy: true,
                maximumAge: 0
            });
        }
    }



    /**
     * get geo location from device detected position to baidu position
     * @param  {number} longitude                      longitude
     * @param  {number} latitude                       latitude
     * @param  {callback} success                      success callback function
     * @param  {callback} error                        error callback function
     */
    Location.prototype.getBaiduLocation = function(
        longitude, latitude,
        success, error)
    {
        var that = this;
        // Dom7.ajax({
        //     url: 'http://api.map.baidu.com/geoconv/v1',
        //     // crossDomain: true,
        //     data: {
        //         coords: [longitude, latitude],
        //         from: 1,
        //         to: 5,
        //         ak: 'ZUONbpqGBsYGXNIYHicvbAbM',
        //     },
        //     dataType: 'jsonp',
        //     jsonp: 'callback',
        //     jsonpCallback: '?',
        //     success: function(data) {
        //         if (data.status === 0) {
        //             that.latitude = latitude;
        //             that.longitude = longitude;

        //             if (success) {
        //                 success(data.result[0].x, data.result[0].y);
        //             }
        //         } else {
        //             if (error) {
        //                 error(data.status);
        //             }
        //         }
        //     },
        //     error: function(xhr, status) {
        //         if (error) {
        //             error(status);
        //         }
        //     }
        // });
    }

    return Location;
});
