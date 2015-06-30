/**
 * manages color theme of chart
 */
define(function(require) {
    function Color() {
        this._primary = '#58FAFF';
        this._secondary = '#FF6B76';
        this._back = '#212838';
        this._grayLight = '#CCC';
        this._grayLightest = '#EFEFFE';
        this._backLighter = '#4C5580'
    }



    /**
     * get primary color
     * @return {string} hex primary color
     */
    Color.prototype.primary = function() {
        return this._primary;
    };

    /**
     * get secondary color
     * @return {string} hex secondary color
     */
    Color.prototype.secondary = function() {
        return this._secondary;
    };

    /**
     * get color array for series
     * @return {Array.<string>} arrary of series colors
     */
    Color.prototype.colorSeries = function() {
        return [this._primary, this._secondary];
    }

    /**
     * get text color
     * @return {string} hex text color
     */
    Color.prototype.text = function() {
        return this._grayLight;
    }

    /**
     * get grid color
     * @return {string} hex grid color
     */
    Color.prototype.grid = function() {
        return this._backLighter;
    }

    return new Color();
});
