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
                    var option = this._getAmountOption(durationType);
                    this.chart.setOption(option, true);
                    break;

                case this.ChartType.history:
                    this._getHistoryOption(function(option) {
                        that.mapOperator.setOption(option, true);
                    });
                    break;

                case this.ChartType.spread:
                    var option = this._getSpreadOption(durationType);
                    that.mapOperator.setOption(option, true);
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
     * @param {Function} callback callback when get option
     */
    ChartManager.prototype._getHistoryOption = function(callback) {
        this.mapOperator.updateWithBaiduLocation(
            this.location.longitude,
            this.location.latitude
        );

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

            if (callback) {
                callback(option);
            }
        });
    };

    /**
     * get chart option of hotspot chart
     * @return {Object} option
     */
    ChartManager.prototype._getSpreadOption = function(durationType) {
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

        var option = {
            color: color.colorSeries(),
            series : [
                {
                    name:'北京',
                    type:'map',
                    mapType: 'none',
                    data:[{}],

                    markLine : {
                        smooth:true,
                        effect : {
                            show: true,
                            scaleSize: 1,
                            period: 30,
                            color: '#fff',
                            shadowBlur: 10
                        },
                        itemStyle : {
                            normal: {
                                borderWidth:1,
                                lineStyle: {
                                    type: 'solid',
                                    shadowBlur: 10
                                }
                            }
                        },
                        data : [
                            [{
                                geoCoord: [121.65, 31.14]
                            },
                            {
                                geoCoord: [121.22, 31.21]
                            }],
                            [{
                                geoCoord: [121.57, 31.17]
                            },
                            {
                                geoCoord: [123.57, 31.15]
                            }]
                        ]
                    }
                }
            ]
            // timeline: {
            //     data: time,
            //     autoPlay: true,
            //     playInterval: 1000
            // },
            // animation: false,
            // series: [{
            //     name: 'first',
            //     type: 'map',
            //     mapType: 'none',
            //     roam: true,
            //     smooth: true,
            //     data:[],
            //     hoverable: false,
            //     markLine: {
            //         clickable: false,
            //         // effect: {
            //         //     show: true
            //         // },
            //         itemStyle: {
            //             normal: {
            //                 borderWidth: 1,
            //                 lineStyle: {
            //                     type: 'solid',
            //                     shadowBlur: 10
            //                 }
            //             }
            //         },
            //         data: [
            //             [{name:'上海', value: 10, smoothness:0.2}, {name:'广州',value:95}]
            //         ]
            //     },
            //     geoCoord: {
            //         '上海': [121.4648,31.2891],
            //         '广州': [113.5107,23.2196],
            //         '北京': [116.4551,40.2539]
            //     }
            // }]
        };

        return option;
    };



    return ChartManager;
});
