/**
 * manages color theme of chart
 */
define(function(require) {
    function Color() {
        this.primary = '#58FAFF';
        this.secondary = '#FF6B76';

        this.yellow = '#FFF158';
        this.green = '#83FF58';

        this.back = '#212838';
        this.backLight = '#343f58';
        this.backLighter = '#475678';

        this.grayLight = '#CCC';
        this.grayLightest = '#EFEFFE';
    }



    /**
     * get color array for series
     * @return {Array.<string>} arrary of series colors
     */
    Color.prototype.colorSeries = function() {
        return [this.primary, this.secondary];
    }

    /**
     * get text color
     * @return {string} hex text color
     */
    Color.prototype.text = function() {
        return this.grayLight;
    }

    return new Color();
});
