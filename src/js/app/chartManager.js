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
        spread: 'spread'
    }

    /**
     * change the duration and chart type of statics chart
     * @param  {DurationType} durationType duration type
     * @param  {ChartType} chartType chart type
     */
    ChartManager.prototype.updateChart = function(durationType, chartType) {
        var that = this;
        if (durationType != this.durationType || chartType != this.chartType) {
            switch(chartType) {
                case this.ChartType.amount:
                    var option = this._setAmountOption(durationType);
                    break;

                case this.ChartType.history:
                    this._setHistoryOption();
                    break;

                case this.ChartType.spread:
                    var option = this._setSpreadOption(durationType);
                    break;

                default:
                    return;
            }
        }
    };

    /**
     * set chart option of amount chart
     * @param  {DurationType} durationType duration type
     * @return {Object} option
     */
    ChartManager.prototype._setAmountOption = function(durationType) {
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
                for (var i = 1; i < 31; ++i) {
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
                for (var i = 1; i <= 12; ++i) {
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

        var option = {
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
        this.chart.setOption(option, true);
    }

    /**
     * set chart option of history chart
     */
    ChartManager.prototype._setHistoryOption = function() {
        this.mapOperator.updateWithBaiduLocation(
            this.location.longitude,
            this.location.latitude
        );

        var that = this;
        Dom7.getJSON('res/json/heatmap.json', function(heatData) {
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
                                offset: 0.6,
                                color: color.primary
                            }, {
                                offset: 0.8,
                                color: color.green
                            }, {
                                offset: 0.95,
                                color: color.yellow
                            }, {
                                offset: 1,
                                color: color.secondary
                            }],
                            minAlpha: 0.2,
                            unifyValue: 2
                        }
                    }
                }]
            };

            that.mapOperator.setOption(option, true);
        });
    };

    /**
     * set chart option of hotspot chart
     */
    ChartManager.prototype._setSpreadOption = function(durationType) {
        var time = [];
        switch(durationType) {
            case this.DurationType.day:
                for (var i = 0; i < 24; ++i) {
                    time.push(i + ':00');
                }
                break;

            case this.DurationType.week:
                var weekdays = ['一', '二', '三', '四', '五', '六', '日'];
                for (var i = 0; i < 7; ++i) {
                    time.push('星期' + weekdays[i]);
                }
                break;

            case this.DurationType.month:
                for (var i = 1; i < 30; ++i) {
                    time.push(i + '日');
                }
                break;

            case this.DurationType.year:
                for (var i = 1; i <= 12; ++i) {
                    time.push(i + '月');
                }
                break;

            default:
                return null;
        }

        var that = this;
        Dom7.getJSON('res/json/meet.json', function(data) {
            var generations = [];
            var userCnt = 10;
            for (var gid = 0; gid < 1; ++gid) {
                var generation = [];
                for (var mid = 0, mlen = data.length; mid < mlen; ++mid) {
                    var meets = generation[data[mid].uid1];
                    if (!meets) {
                        generation[data[mid].uid1] = [];
                    }
                    generation[data[mid].uid1].push(mid);
                }
                generations.push(generation);
            }
            console.log(generations);

            var geoCoord = [];
            for (var gid = 0; gid < 1; ++gid) {
                var generation = generations[gid];
                for (var uid = 0, ulen = generation.length; uid < ulen; ++uid) {
                    for (var mid = 0, mlen = generation[uid].length; mid < mlen; ++mid) {
                        var id = generation[uid][mid];
                        geoCoord.push([{
                            geoCoord: [
                                data[generation[uid][0]].lng1,
                                data[generation[uid][0]].lat1
                            ]
                        }, {
                            geoCoord: [
                                data[id].lng1,
                                data[id].lat1
                            ]
                        }]);
                    }
                }
            }

            var option = {
                color: color.colorSeries(),
                series: [{
                    name: '第0代',
                    type: 'map',
                    mapType: 'none',
                    data: [{}],

                    markLine : {
                        smooth: true,
                        effect: {
                            show: true,
                            scaleSize: 1,
                            period: 30,
                            color: '#fff',
                            shadowBlur: 10
                        },
                        itemStyle: {
                            normal: {
                                borderWidth:1,
                                lineStyle: {
                                    type: 'solid',
                                    shadowBlur: 10
                                }
                            }
                        },
                        data: geoCoord
                    }
                }]
            };
            that.mapOperator.setOption(option, true);
        });
    };



    return ChartManager;
});
