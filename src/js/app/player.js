/**
 * @module Player
 * @author Ovilia
 * @description A player on the map
 */

define(function(require) {

    /**
     * a player on the map
     * @param {number} id        identity of a player
     * @param {number} longitude longitude of baidu map
     * @param {number} latitude  latitude of baidu map
     */
    function Player(id, longitude, latitude) {
        this.id = id;
        this.longitude = longitude;
        this.latitude = latitude;

        this.isMet = false;
    }



    /**
     * get geo position of this player
     * @return {Array.<number>} longitude and latitude in an arrary
     */
    Player.prototype.getGeo = function() {
        return [this.longitude, this.latitude];
    }

    return Player;
});
