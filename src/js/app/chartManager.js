/**
 * @module ChartManager
 * @author Ovilia
 * @description manages charts
 */

define(function(require) {

    var echarts = require('echarts');
    require('echarts/chart/bar');
    require('echarts/chart/map');
    require('echarts/chart/heatmap');

    var MapOperator = require('mapOperator');

    var color = require('color');

    function ChartManager(chartDom, mapDom, location) {
        this.chartDom = chartDom;
        this.mapDom = mapDom;
        this.location = location;

        this.durationType = null;
        this.chartType = null;

        this.chart = null;
        this.mapOperator = null;
        this.map = null;

        this.defaultPos = [];
    }



    /**
     * init chart to dom
     */
    ChartManager.prototype.initChart = function() {
        this.chart = echarts.init(this.chartDom);
        this.updateChart(this.DurationType.day, this.ChartType.amount);
    };



    /**
     * init map to dom
     */
    ChartManager.prototype.initMap = function() {
        if (!this.mapOperator) {
            this.mapOperator = new MapOperator(this.mapDom);
        }
    };



    /**
     * duration type of statics charts
     * @typedef {DurationType}
     * @type {Object}
     */
    ChartManager.prototype.DurationType = {
        day: 'day',
        week: 'week',
        month: 'month',
        year: 'year'
    }

    /**
     * chart type of statics charts
     * @typedef {ChartType}
     * @type {Object}
     */
    ChartManager.prototype.ChartType = {
        amount: 'amount',
        history: 'history',
        hotspot: 'hotspot'
    }

    /**
     * change the duration and chart type of statics chart
     * @param  {DurationType} durationType duration type
     * @param  {ChartType} chartType chart type
     */
    ChartManager.prototype.updateChart = function(durationType, chartType) {
        if (durationType != this.durationType || chartType != this.chartType) {
            switch(chartType) {
                case this.ChartType.amount:
                    var option = this._getAmountOption(durationType);
                    this.chart.setOption(option, true);
                    break;

                case this.ChartType.history:
                    var option = this._getHistoryOption();
                    this.mapOperator.setOption(option);
                    break;

                case this.ChartType.hotspot:
                    var option = this._getHotspotOption();
                    break;

                default:
                    return;
            }
        }
    };

    /**
     * get chart option of amount chart
     * @param  {DurationType} durationType duration type
     * @return {Object} option
     */
    ChartManager.prototype._getAmountOption = function(durationType) {
        var xs = [];
        var discoverData = [];
        var victimData = [];

        switch(durationType) {
            case this.DurationType.day:
                var name = '今日';
                for (var i = 0; i < 24; ++i) {
                    xs.push(i + ':00');
                    var n1 = Math.max(0, Math.floor((i - 5) * (i - 5) / 20 + 10
                            - Math.random() * 50));
                    var n2 = Math.max(0, Math.floor((i - 5) * (i - 5) / 30 + 20
                            - Math.random() * i * i));
                    discoverData.push(n1);
                    victimData.push(n2);
                }
                break;

            case this.DurationType.week:
                var name = '本周';
                var weekdays = ['一', '二', '三', '四', '五', '六', '日'];
                for (var i = 0; i < 7; ++i) {
                    xs.push('星期' + weekdays[i]);
                    var n1 = Math.max(0, Math.floor((i - 5) * (i - 5) / 2 + 20
                            - Math.random() * 50));
                    var n2 = Math.max(0, Math.floor((i - 5) * (i - 5) / 3 + 50
                            - Math.random() * i * i));
                    discoverData.push(n1);
                    victimData.push(n2);
                }
                break;

            case this.DurationType.month:
                var name = '本月';
                for (var i = 0; i < 30; ++i) {
                    xs.push(i + '日');
                    var n1 = Math.max(0, Math.floor((i - 5) * (i - 5) * 2 + 10
                            - Math.random() * 50));
                    var n2 = Math.max(0, Math.floor((i - 5) * (i - 5) * 2 + 20
                            - Math.random() * i * i));
                    discoverData.push(n1);
                    victimData.push(n2);
                }
                break;

            case this.DurationType.year:
                var name = '今年';
                for (var i = 0; i < 12; ++i) {
                    xs.push(i + '月');
                    var n1 = Math.max(0, Math.floor((i - 5) * (i - 5) * 10 + 20
                            - Math.random() * 50));
                    var n2 = Math.max(0, Math.floor((i - 5) * (i - 5) * 22 + 50
                            - Math.random() * i * i));
                    discoverData.push(n1);
                    victimData.push(n2);
                }
                break;

            default:
                return;
        }

        return {
            color: color.colorSeries(),
            xAxis: [{
                type: 'category',
                data: xs,
                axisLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: color.text()
                    }
                },
                color: color.text(),
                splitLine: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                axisLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: color.text(),
                        align: 'left'
                    },
                    margin: 20
                },
                splitLine: {
                    show: false
                }
            }],
            legend: {
                data: ['发现人数', '传染人数'],
                y: 'bottom',
                textStyle: {
                    color: 'auto'
                }
            },
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'none'
                },
                zlevel: 10
            },
            grid: {
                x: 30,
                y: 25,
                x2: 20,
                y2: 50,
                borderWidth: 0                
            },
            series: [{
                name: '传染人数',
                type: 'bar',
                data: victimData,
                stack: 'all'
            }, {
                name: '发现人数',
                type: 'bar',
                data: discoverData,
                stack: 'all'
            }]
        };
    }

    /**
     * get chart option of history chart
     * @return {Object} option
     */
    ChartManager.prototype._getHistoryOption = function() {
        this.mapOperator.updateWithBaiduLocation(
            this.location.longitude,
            this.location.latitude
        );

        var heatData = [];
        for (var i = 0; i < 1000; ++i) {
            heatData.push([
                this.location.longitude + Math.random() * 0.5 - 0.4,
                this.location.latitude + Math.random() * 0.4 - 0.2,
                Math.floor(Math.random())
            ]);
        }
        for (var j = 0; j < 20; ++j) {
            var x = Math.random() * 0.25;
            var y = Math.random() * 0.4;
            var cnt = Math.random() * 10;
            for (var i = 0; i < cnt; ++i) {
                heatData.push([
                    this.location.longitude + Math.random() * 0.02 - 0.2 + x,
                    this.location.latitude + Math.random() * 0.01 - 0.3 + y,
                    1
                ]);
            }
        }

        var option = {
            color: color.colorSeries(),
            series: [{
                type: 'map',
                data: [],
                mapType: 'none',
                heatmap: {
                    data: heatData,
                    itemStyle: {
                        gradientColors: [{
                            offset: 0.4,
                            color: color.primary
                        }, {
                            offset: 0.6,
                            color: color.green
                        }, {
                            offset: 0.8,
                            color: color.yellow
                        }, {
                            offset: 1,
                            color: color.secondary
                        }],
                        minAlpha: 0.2
                    }
                }
            }]
        };

        return option;
    };

    /**
     * get chart option of hotspot chart
     * @return {Object} option
     */
    ChartManager.prototype._getHotspotOption = function() {

    };



    return ChartManager;
});
