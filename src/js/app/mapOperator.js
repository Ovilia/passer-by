/**
 * @module MapOperator
 * @author Ovilia
 * @description ECharts and Baidu Map related operations.
 */

define(function(require) {

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
        this.markerMe.setAnimation(BMAP_ANIMATION_BOUNCE);

        // set map position
        this.updateLocation(startPoint.x, startPoint.y);
        this.map.enableScrollWheelZoom(true);

        var myChart = BMapExt.initECharts(container);
        BMapExt.setOption({});
    };



    return MapOperator;
});
