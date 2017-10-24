/**
 * Add charts to the page with ajax.
 *
 * @param {object} element
 * @param {object} config
 *
 * @return {object}
 */
window.Chart = (function(element, config) {
    'use strict';

    var version = '1.1.1';

    var highchart;

    var settings = {
        id:     null,
        url:    null,
        chart:  null,
        series: null,
        titles: {}
    };

    var attributes = {
        url:        'chart-url',
        title:      'chart-title',
        xAxisTitle: 'chart-xaxis-title',
        yAxisTitle: 'chart-yaxis-title',
        zAxisTitle: 'chart-zaxis-title',
        preset:     'chart-preset',
        dynamic:    'chart-dynamic'
    };

    var functions = {
        /**
         * Get the element.
         * Get the url from the element.
         * Then get the json data.
         */
        init: function() {
            if (!element || !element.attr('id')) {
                return;
            }

            settings.id = element.attr('id');
            settings.preset = element.data(attributes.preset);
            settings.url = element.data(attributes.url);
            settings.dynamic = element.data(attributes.dynamic);
            settings.title = element.data(attributes.title);
            settings.titles.xAxis = element.data(attributes.xAxisTitle);
            settings.titles.yAxis = element.data(attributes.yAxisTitle);
            settings.titles.zAxis = element.data(attributes.zAxisTitle);

            $.getJSON(settings.url, functions.addChart);
        },

        /**
         * Add a chart.
         *
         * @param {object} series
         */
        addChart: function(series) {
            settings.chart = $.extend({}, config['all'], config[settings.preset] || {});

            settings.series = series;

            highchart = Highcharts.chart(
                settings.id,
                settings.chart
            );

            $.each(settings.series, functions.addSeries);
            $.each(settings.titles, functions.setTitle);

            if(settings.title) {
                highchart.setTitle({
                    text: settings.title
                });
            }
        },

        /**
         * Add the series name and data.
         *
         * @param {number} index
         * @param {object} serie
         */
        addSeries: function(index, serie) {
            if(settings.dynamic) {
                highchart.addSeries(serie);

                return;
            }

            if(serie.name) {
                if(!highchart.series[index]) {
                    return;
                }

                highchart.series[index].update({
                    name: serie.name
                }, false);
            }

            highchart.series[index].setData(serie.data);
        },

        /**
         * Set the chart titles.
         *
         * @param {string} key
         * @param {string} title
         */
        setTitle: function(key, title) {
            if(highchart[key]) {
                highchart[key][0].setTitle({
                    text: title
                });
            }
        },

        /**
         * Update chart.
         *
         * @param {object} values
         */
        updateChart: function(values) {
            highchart.update(values);
        },

        /**
         * Filter the chart.
         *
         * @param {string} axis
         * @param {object} values
         * @param {number} index
         */
        filterChart: function(axis, values, index) {
            var axisIndex = index;

            if(!axisIndex) {
                axisIndex = 0;
            }

            highchart[axis][axisIndex].update(values);
        }
    };

    return {
        settings: settings,
        add:      functions.addChart,
        filter:   functions.filterChart,
        update:   functions.updateChart,
        init:     functions.init,
        version:  version
    };
});
