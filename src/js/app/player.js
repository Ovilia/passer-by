/**
 * @module Player
 * @author Ovilia
 * @description A player on the map
 */

define(function(require) {

    function Player(id, longitude, latitude) {
        this.id = id;
        this.longitude = longitude;
        this.latitude = latitude;

        this.isMet = false;
    }



    return Player;
});
