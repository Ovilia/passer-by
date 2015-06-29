/**
 * @module ChartManager
 * @author Ovilia
 * @description manages charts
 */

define(function(require) {

    var echarts = require('echarts');
    require('echarts/chart/bar');

    function ChartManager(chartDom) {
        this.chartDom = chartDom;

        this.durationType = null;
    }



    /**
     * init chart to dom
     */
    ChartManager.prototype.init = function() {
        this.chart = echarts.init(this.chartDom);
        this.changeDuration(this.DurationType.day);
        window.chart = this;
    };



    /**
     * duration type of statics chart
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
     * change the duration type of statics chart
     * @param  {DurationType} duration duration type
     */
    ChartManager.prototype.changeDuration = function(duration) {
        if (duration != this.durationType) {
            var xs = [];
            var discoverData = [];
            var victimData = [];

            switch(duration) {
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

           var option = {
                title: {
                    text: name + '发现/传染人数',
                    x: 'center'
                },
                xAxis: [{
                    type: 'category',
                    data: xs
                }],
                yAxis: [{
                    type: 'value'
                }],
                legend: {
                    data: ['发现人数', '传染人数'],
                    y: 'bottom'
                },
                tooltip : {
                    trigger: 'axis'
                },
                grid: {
                    x: 40,
                    y: 40,
                    x2: 20,
                    y2: 50
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
    };



    return ChartManager;
});
