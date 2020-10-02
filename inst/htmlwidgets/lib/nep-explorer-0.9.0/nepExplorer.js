(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory(require('d3'), require('webcharts')))
        : typeof define === 'function' && define.amd
        ? define(['d3', 'webcharts'], factory)
        : ((global = global || self), (global.nepExplorer = factory(global.d3, global.webCharts)));
})(this, function(d3$1, webcharts) {
    'use strict';

    if (typeof Object.assign != 'function') {
        Object.defineProperty(Object, 'assign', {
            value: function assign(target, varArgs) {
                if (target == null) {
                    // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var to = Object(target);

                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];

                    if (nextSource != null) {
                        // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }

                return to;
            },
            writable: true,
            configurable: true
        });
    }

    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
            value: function value(predicate) {
                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this); // 2. Let len be ? ToLength(? Get(O, 'length')).

                var len = o.length >>> 0; // 3. If IsCallable(predicate) is false, throw a TypeError exception.

                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                } // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.

                var thisArg = arguments[1]; // 5. Let k be 0.

                var k = 0; // 6. Repeat, while k < len

                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, � kValue, k, O �)).
                    // d. If testResult is true, return kValue.
                    var kValue = o[k];

                    if (predicate.call(thisArg, kValue, k, o)) {
                        return kValue;
                    } // e. Increase k by 1.

                    k++;
                } // 7. Return undefined.

                return undefined;
            }
        });
    }

    if (!Array.prototype.findIndex) {
        Object.defineProperty(Array.prototype, 'findIndex', {
            value: function value(predicate) {
                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

                var len = o.length >>> 0; // 3. If IsCallable(predicate) is false, throw a TypeError exception.

                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                } // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.

                var thisArg = arguments[1]; // 5. Let k be 0.

                var k = 0; // 6. Repeat, while k < len

                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, � kValue, k, O �)).
                    // d. If testResult is true, return k.
                    var kValue = o[k];

                    if (predicate.call(thisArg, kValue, k, o)) {
                        return k;
                    } // e. Increase k by 1.

                    k++;
                } // 7. Return -1.

                return -1;
            }
        });
    }

    Math.log10 = Math.log10 =
        Math.log10 ||
        function(x) {
            return Math.log(x) * Math.LOG10E;
        };

    d3$1.selection.prototype.moveToFront = function() {
        return this.each(function() {
            this.parentNode.appendChild(this);
        });
    };

    d3$1.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;

            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };

    function layout(element) {
        var containers = {
            main: d3$1
                .select(element)
                .append('div')
                .classed('wc-framework', true)
        }; // column: left

        containers.leftColumn = containers.main
            .append('div')
            .classed('wc-column wc-column--left', true); // section: controls

        containers.controls = containers.leftColumn
            .append('div')
            .classed('wc-section wc-section--controls', true); // column: right

        containers.rightColumn = containers.main
            .append('div')
            .classed('wc-column wc-column--right', true); // section: population

        containers.population = containers.rightColumn
            .append('div')
            .classed('wc-section wc-section--population', true); // component: kdigo scatter plot

        containers.kdigo = containers.population
            .append('div')
            .classed('wc-component wc-component--kdigo', true); // header

        containers.kdigoHeader = containers.kdigo
            .append('div')
            .classed('wc-header wc-header--kdigo-scatter-plot', true)
            .text('KDIGO Scatter Plot'); // content

        containers.kdigoScatterPlot = containers.kdigo
            .append('div')
            .classed('wc-subcomponent wc-subcomponent--kdigo-scatter-plot', true);
        containers.kdigoLegend = containers.kdigoScatterPlot
            .append('div')
            .classed('wc-subcomponent__legend', true); // section: participant

        containers.participant = containers.rightColumn
            .append('div')
            .classed('wc-section wc-section--participant', true); // component: details

        containers.detailsContainer = containers.participant
            .append('div')
            .classed('wc-component wc-component--details-container', true); // header

        containers.detailsHeader = containers.detailsContainer
            .append('div')
            .classed('wc-header wc-header--details', true);
        containers.detailsHeaderText = containers.detailsHeader
            .append('span')
            .classed('wc-header__text', true)
            .text('Click a point to view participant details.');
        containers.detailsClear = containers.detailsHeader
            .append('button')
            .classed('wc-header__button wc-component__details-clear wc-hidden', true)
            .text('Clear'); // content

        containers.detailsParticipant = containers.detailsContainer
            .append('ul')
            .classed('wc-subcomponent wc-subcomponent__details-participant wc-hidden', true); // component: time series

        containers.timeSeries = containers.participant
            .append('div')
            .classed('wc-component wc-component--time-series wc-hidden', true);
        return containers;
    }

    function styles() {
        var styles = [
            '.wc-framework {',
            '    width: 100%;',
            '    display: inline-block;',
            '}',
            '.wc-hidden {',
            '    display: none !important;',
            '}',
            '.wc-invisible {',
            '    visibility: hidden;',
            '}',
            '.wc-column {',
            '    display: inline-block;',
            '}',
            '.wc-section {',
            '    display: inline-block;',
            '    width: 100%;',
            '}',
            '.wc-component {',
            '    display: inline-block;',
            '    width: 100%;',
            '}',
            '.wc-header {',
            '    border-top: 2px solid black;',
            '    border-bottom: 2px solid black;',
            '    padding: 0.2em;',
            '    font-weight: bold;',
            '}',
            '.wc-subcomponent {',
            '    width: 50%;',
            '    min-width: 500px;',
            '}',
            '.wc-chart {',
            '    width: 80%;',
            '    min-width: 400px;',
            '    display: inline-block;',
            '}',
            /***--------------------------------------------------------------------------------------\
      column: left
      \--------------------------------------------------------------------------------------***/
            '.wc-column--left {',
            '    width: 20%;',
            '}',
            /****---------------------------------------------------------------------------------\
        section: controls
      \---------------------------------------------------------------------------------****/
            '.wc-section--controls {',
            '}',
            '.control-group {',
            '    width: 100%;',
            '}',
            '.changer {',
            '    width: 200px !important;',
            '}',
            '.wc-subheader {',
            '    border-top: 1px solid black;',
            '    border-bottom: 1px solid black;',
            '    margin-right: 1em;',
            '    margin-bottom: 1em;',
            '}',
            '.wc-subheader__text {',
            '    display: block;',
            '}',
            '.wc-subheader__content {',
            '    font-size: .8em;',
            '}',
            /***--------------------------------------------------------------------------------------\
      column: right
      \--------------------------------------------------------------------------------------***/
            '.wc-column--right {',
            '    width: 78%;',
            '    float: right;',
            '}',
            /****---------------------------------------------------------------------------------\
        section: population
      \---------------------------------------------------------------------------------****/
            '.wc-section--population {',
            '}',
            /*****----------------------------------------------------------------------------\
        component: kdigo scatter plot
      \----------------------------------------------------------------------------*****/
            '.wc-component--kdigo {',
            '}',
            '.wc-subcomponent--kdigo-scatter-plot {',
            '    position: relative;',
            '}',
            '.wc-subcomponent--kdigo-scatter-plot circle.wc-hover-mark,',
            '.wc-subcomponent--kdigo-scatter-plot circle.wc-data-mark {',
            '    cursor: pointer;',
            '}',
            '.wc-subcomponent--kdigo-scatter-plot .wc-hysteresis-point-container circle.wc-hover-mark,',
            '.wc-subcomponent--kdigo-scatter-plot .wc-hysteresis-point-container circle.wc-data-mark {',
            '    cursor: default;',
            '}',
            '.wc-subcomponent--kdigo-scatter-plot circle.wc-data-mark {', //'    stroke: black;',
            //'    fill-opacity: 1;',
            '    stroke-width: 1;',
            '}',
            'circle.wc-data-mark.wc-highlighted,',
            'circle.wc-hysteresis-point.wc-highlighted,',
            'circle.wc-data-mark.wc-selected {',
            '    stroke-width: 3;',
            '    stroke: black;',
            '}',
            'circle.wc-data-mark.wc-deemphasized:not(.wc-highlighted) {',
            '    stroke-opacity: .25;',
            '    fill-opacity: .25;',
            '}',
            '.kdigo-stage {',
            '    stroke: black;',
            '}',
            '.wc-subcomponent--kdigo-scatter-plot .tick line {',
            '    stroke-opacity: .4;',
            '}',
            '.wc-subcomponent--kdigo-scatter-plot .legend--kdigo {',
            '    height: 20px;',
            '    margin: 8px 0px;',
            '}',
            '.wc-subcomponent__legend {',
            '    position: absolute;', //'    top: 14;',
            //'    bottom: 0;',
            '    left: 80%;',
            '    width: 100%;',
            '}',
            '.wc-subcomponent__legend .wc-chart {',
            '    width: 100%;',
            '}',
            '.wc-subcomponent__legend .interactivity {',
            '    display: none;',
            '}',
            '.wc-subcomponent__legend table {',
            '    border-collapse: collapse;',
            '}',
            '.wc-subcomponent__legend thead {',
            '    border-top: 2px solid #999;',
            '    border-bottom: 2px solid #999;',
            '}',
            '.wc-subcomponent__legend thead tr {',
            '    padding: 0.1em;',
            '}',
            '.wc-subcomponent__legend tbody tr:last-child {',
            '    border-top: 2px solid #999;',
            '}',
            '.wc-subcomponent__legend tbody td {',
            '    text-align: center;',
            '    font-size: 0.9em;',
            '    padding: 0 0.5em 0 0.5em;',
            '}',
            /****---------------------------------------------------------------------------------\
        section: participant
      \---------------------------------------------------------------------------------****/
            '.wc-section--participant {',
            '}',
            /*****----------------------------------------------------------------------------\
        component: details
      \----------------------------------------------------------------------------*****/
            '.wc-component__details-clear {',
            '    margin: 0.5em;',
            '}',
            '.wc-subcomponent__details-participant {',
            '    list-style: none;',
            '    padding: 0;',
            '    width: 100%;',
            '}',
            '.wc-details__li {',
            '    display: inline-block;',
            '    text-align: center;',
            '    padding: 0.5em;',
            '}',
            '.wc-details__label {',
            '    font-size: 0.8em;',
            '}',
            '.wc-details__value {',
            '}',
            /*****----------------------------------------------------------------------------\
        component: time series
      \----------------------------------------------------------------------------*****/
            '.wc-diff .wc-hover-line {',
            '    stroke: #fff;',
            '    stroke-width: 16;',
            '    stroke-opacity: 0;',
            '}',
            '.wc-diff .wc-visible-line {',
            '    stroke-width: 2;',
            '    stroke: #8E4C6A;',
            '    stroke-dasharray: 3 3;',
            '}',
            '.wc-diff .wc-visible-line.wc-hovered {',
            '    stroke-dasharray: 0;',
            '}',
            '.wc-component--time-series .axis-title {',
            '    font-size: 14px;',
            '    font-weight: bold;',
            '}',
            '.wc-chart-container {',
            '    position: relative;',
            '}',
            '.legend--time-series {',
            '    position: absolute;',
            '    left: 80%;',
            '    width: 100%;',
            '}',
            '.legend--time-series .legend-item {',
            '    float: left;',
            '    clear: left;',
            '    margin-right: 0 !important;',
            '    height: 14px;',
            '}',
            '.legend--time-series .legend-mark-text {',
            '    display: none;',
            '}',
            '.legend--time-series .legend-label {',
            '    font-size: 12px;',
            '}',
            '.legend--time-series .legend-color-block {',
            '}',
            '.legend--time-series .legend-mark {',
            '    transform: translate(0,2px);',
            '    stroke-width: 4;',
            '}',
            '.wc-reference-lines {',
            '    cursor: help;',
            '}',
            '.wc-reference-line {',
            '    x1: 0;',
            '    stroke: #999;',
            '    stroke-dasharray: 3 3;',
            '}',
            '.wc-reference-label {',
            '    text-anchor: end;',
            '    alignment-baseline: baseline;',
            '    fill: #999;',
            '}'
        ];
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = styles.join('\n');
        document.getElementsByTagName('head')[0].appendChild(style);
        return style;
    }

    function round(value) {
        var _float = parseFloat(value);

        if (_float === NaN) return NaN;

        var _int = parseInt(value);

        if (_float === _int) return _int;
        return _float < 1
            ? Math.round(_float * 1000) / 1000
            : _float < 10
            ? Math.round(_float * 100) / 100
            : _float < 100
            ? Math.round(_float * 10) / 10
            : Math.round(_float);
    }

    function addVariables(_ref) {
        var settings = _ref.settings.synced,
            data = _ref.data.data;
        data.forEach(function(d) {
            d.id = d[settings.id_col];
            d.visit = d[settings.visit_col];
            d.visitn = parseFloat(d[settings.visitn_col]);
            d.studyday = parseFloat(d[settings.studyday_col]);
            d.measure = d[settings.measure_col];
            d.result = round(d[settings.value_col]);
            d.unit = d[settings.unit_col];
            d.lln = parseFloat(d[settings.normal_col_low]);
            d.uln = parseFloat(d[settings.normal_col_high]);
            d.baseline = d[settings.baseline_col];
        });
        return data;
    }

    function _typeof(obj) {
        '@babel/helpers - typeof';

        if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
            _typeof = function(obj) {
                return typeof obj;
            };
        } else {
            _typeof = function(obj) {
                return obj &&
                    typeof Symbol === 'function' &&
                    obj.constructor === Symbol &&
                    obj !== Symbol.prototype
                    ? 'symbol'
                    : typeof obj;
            };
        }

        return _typeof(obj);
    }

    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }

        return obj;
    }

    function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);

        if (Object.getOwnPropertySymbols) {
            var symbols = Object.getOwnPropertySymbols(object);
            if (enumerableOnly)
                symbols = symbols.filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(object, sym).enumerable;
                });
            keys.push.apply(keys, symbols);
        }

        return keys;
    }

    function _objectSpread2(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i] != null ? arguments[i] : {};

            if (i % 2) {
                ownKeys(Object(source), true).forEach(function(key) {
                    _defineProperty(target, key, source[key]);
                });
            } else if (Object.getOwnPropertyDescriptors) {
                Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
            } else {
                ownKeys(Object(source)).forEach(function(key) {
                    Object.defineProperty(
                        target,
                        key,
                        Object.getOwnPropertyDescriptor(source, key)
                    );
                });
            }
        }

        return target;
    }

    function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
    }

    function _toConsumableArray(arr) {
        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
    }

    function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

            return arr2;
        }
    }

    function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
    }

    function _iterableToArray(iter) {
        if (
            Symbol.iterator in Object(iter) ||
            Object.prototype.toString.call(iter) === '[object Arguments]'
        )
            return Array.from(iter);
    }

    function _iterableToArrayLimit(arr, i) {
        if (
            !(
                Symbol.iterator in Object(arr) ||
                Object.prototype.toString.call(arr) === '[object Arguments]'
            )
        ) {
            return;
        }

        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);

                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i['return'] != null) _i['return']();
            } finally {
                if (_d) throw _e;
            }
        }

        return _arr;
    }

    function _nonIterableSpread() {
        throw new TypeError('Invalid attempt to spread non-iterable instance');
    }

    function _nonIterableRest() {
        throw new TypeError('Invalid attempt to destructure non-iterable instance');
    }

    // https://stackoverflow.com/a/43053803
    function cartesianProduct(a, b) {
        var f = function f(a, b) {
            var _ref;

            return (_ref = []).concat.apply(
                _ref,
                _toConsumableArray(
                    a.map(function(d) {
                        return b.map(function(e) {
                            return [].concat(d, e);
                        });
                    })
                )
            );
        };

        for (
            var _len = arguments.length, c = new Array(_len > 2 ? _len - 2 : 0), _key = 2;
            _key < _len;
            _key++
        ) {
            c[_key - 2] = arguments[_key];
        }

        return b ? cartesianProduct.apply(void 0, [f(a, b)].concat(c)) : a;
    }

    function getExtremum(visitWindows, extremum, variable) {
        return visitWindows.length
            ? d3[extremum](visitWindows, function(visitWindow) {
                  return visitWindow[variable];
              })
            : null;
    }

    function defineParticipantLevelData(_ref) {
        var settings = _ref.settings.synced,
            data = _ref.data.data;
        var participantLevel = d3
            .nest()
            .key(function(d) {
                return d.id;
            })
            .key(function(d) {
                return d.measure;
            })
            .rollup(function(data) {
                // visit comparisons
                var studydays = _toConsumableArray(
                    new Set(
                        data.map(function(d) {
                            return d.studyday;
                        })
                    ).values()
                );

                var visitWindows = cartesianProduct(studydays, studydays)
                    .filter(function(d) {
                        return d[1] > d[0];
                    }) // && d[1] - d[0] <= settings.visit_window) // visit 2 is later than visit 1 and the difference between the visits is less than or equal to the visit window
                    .map(function(visitWindow) {
                        var visit_window = visitWindow[1] - visitWindow[0];
                        var in_window = visit_window <= settings.visit_window;
                        var vis1 = data.find(function(d) {
                            return d.studyday === visitWindow[0];
                        });
                        var vis2 = data.find(function(d) {
                            return d.studyday === visitWindow[1];
                        });
                        var chg = vis2.result - vis1.result;
                        var pchg =
                            vis1.result > 0 ? round((vis2.result / vis1.result - 1) * 100) : null;
                        var pchg_inv = pchg !== null ? pchg * -1 : null;
                        return {
                            visitWindow: visitWindow,
                            studyday1: visitWindow[0],
                            studyday2: visitWindow[1],
                            visit_window: visit_window,
                            in_window: in_window,
                            vis1: vis1,
                            vis2: vis2,
                            chg: chg,
                            pchg: pchg,
                            pchg_inv: pchg_inv
                        };
                    });
                var insideVisitWindow = visitWindows.filter(function(visitWindow) {
                    return visitWindow.in_window;
                }); // baseline comparison

                var baseline = data.find(function(d) {
                    return Array.isArray(settings.baseline_value)
                        ? settings.baseline_value.includes(d.baseline)
                        : settings.baseline_value === d.baseline;
                });
                data.forEach(function(d) {
                    d.baseline_result = baseline ? baseline.result : null;
                    d.chg = baseline ? d.result - baseline.result : null;
                    d.pchg =
                        baseline && baseline.result > 0
                            ? round((d.result / baseline.result - 1) * 100)
                            : null;
                    d.pchg_inv = d.pchg !== null ? d.pchg * -1 : null;
                    d.xuln = d.result > 0 && d.uln > 0 ? round(d.result / d.uln) : null;
                });
                var datum = {
                    data: data,
                    visitWindows: visitWindows,
                    min: d3.min(data, function(d) {
                        return d.result;
                    }),
                    max: d3.max(data, function(d) {
                        return d.result;
                    }),
                    // extreme change from baseline
                    min_chg_b: getExtremum(data, 'min', 'chg'),
                    max_chg_b: getExtremum(data, 'max', 'chg'),
                    min_pchg_b: getExtremum(data, 'min', 'pchg'),
                    max_pchg_b: getExtremum(data, 'max', 'pchg'),
                    // extreme change between visits
                    min_chg: getExtremum(insideVisitWindow, 'min', 'chg'),
                    max_chg: getExtremum(insideVisitWindow, 'max', 'chg'),
                    min_pchg: getExtremum(insideVisitWindow, 'min', 'pchg'),
                    max_pchg: getExtremum(insideVisitWindow, 'max', 'pchg')
                };
                datum.min_pchg_b_inv = datum.min_pchg_b !== null ? datum.min_pchg_b * -1 : null;
                datum.max_pchg_b_inv = datum.max_pchg_b !== null ? datum.max_pchg_b * -1 : null;
                datum.min_pchg_inv = datum.min_pchg !== null ? datum.min_pchg * -1 : null;
                datum.max_pchg_inv = datum.max_pchg !== null ? datum.max_pchg * -1 : null;
                return datum;
            })
            .entries(data); // Capture measure-level results at participant level.

        var measures = ['creat', 'cystatc', 'egfr_creat', 'egfr_cystatc'];
        var results = ['chg', 'pchg', 'pchg_inv'];
        participantLevel.forEach(function(d) {
            var datum = data.find(function(di) {
                return di[settings.id_col] === d.key;
            }); // participant details

            settings.filters.forEach(function(filter) {
                d[filter.value_col] = datum[filter.value_col];
            });
            settings.details.forEach(function(detail) {
                d[detail.value_col] = datum[detail.value_col];
            }); // x- and y-axis

            measures.forEach(function(measure) {
                results.forEach(function(result) {
                    var measure_result = ''.concat(measure, '_').concat(result);
                    var measure_datum = d.values.find(function(di) {
                        return di.key === settings.measure_values[measure];
                    });
                    d[measure_result] = measure_datum
                        ? measure_datum.values['max_'.concat(result)]
                        : null;
                });
            }); // color

            d.creat_fn = d.creat_chg >= 0.3 ? 1 : 0;
            d.cystatc_fn = d.cystatc_chg >= 0.3 ? 1 : 0;
        });
        return participantLevel;
    }

    function clearParticipant() {
        if (
            this.nepExplorer.participant === undefined ||
            this.nepExplorer.data.participant !== undefined
        ) {
            var containers = this.nepExplorer.containers;
            delete this.nepExplorer.data.participant;
            delete this.visitPath;
            delete this.visitPoints;
            containers.detailsHeaderText.text('Click a point to view participant details.');
            containers.detailsClear.classed('wc-hidden', true);
            containers.detailsParticipant
                .classed('wc-hidden', true)
                .selectAll('*')
                .remove();
            containers.timeSeries.classed('wc-hidden', true);
            this.svg
                .selectAll('circle.wc-data-mark')
                .classed('wc-deemphasized', false)
                .classed('wc-selected', false);
            this.containers.hysteresisPlot.selectAll('*').remove();
        }
    }

    function konamiCode(callback) {
        // a key map of allowed keys
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            65: 'a',
            66: 'b'
        }; // the 'official' Konami Code sequence

        var konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a']; // a variable to remember the 'position' the user has reached so far.

        var konamiCodePosition = 0; // add keydown event listener

        document.addEventListener('keydown', function(e) {
            // get the value of the key code from the key map
            var key = allowedKeys[e.keyCode]; // get the value of the required key from the konami code

            var requiredKey = konamiCode[konamiCodePosition]; // compare the key with the required key

            if (key == requiredKey) {
                // move to the next key in the konami code sequence
                konamiCodePosition++; // if the last key is reached, activate cheats

                if (konamiCodePosition == konamiCode.length) {
                    callback();
                    konamiCodePosition = 0;
                }
            } else {
                konamiCodePosition = 0;
            }
        });
    }

    function addEventListeners() {
        var _this = this;

        this.containers.detailsClear.on('click', function() {
            delete _this.participant;
            clearParticipant.call(_this.kdigoScatterPlot);
        });
        konamiCode(function() {
            _this.settings.synced.display_voronoi = !_this.settings.synced.display_voronoi;

            _this.kdigoScatterPlot.draw();
        });
    }

    function init(data, participant) {
        // data manipulation
        this.data = {
            data: data
        };
        addVariables(this);
        this.data.participants = defineParticipantLevelData(this); // Attach participant value.

        this.participant = participant !== undefined ? participant : null; // Initialize KDIGO scatter plot.

        this.kdigoScatterPlot.nepExplorer = this;
        this.kdigoScatterPlot.init(this.data.participants); // Add event listeners.

        addEventListeners.call(this);
    }

    function destroy() {}

    function renderer() {
        return {
            // data mappings
            id_col: 'USUBJID',
            visit_col: 'VISIT',
            visitn_col: 'VISITNUM',
            studyday_col: 'DY',
            measure_col: 'TEST',
            value_col: 'STRESN',
            unit_col: 'STRESU',
            normal_col_low: 'STNRLO',
            normal_col_high: 'STNRHI',
            baseline_col: 'ABLFL',
            // value mappings
            measure_values: {
                // creatinine-based measures
                creat: 'Creatinine',
                egfr_creat: 'eGFR',
                // cystatin C-based measures
                cystatc: 'Cystatin C',
                egfr_cystatc: 'eGFRcys',
                // kidney function-related measures
                bun: 'Blood Urea Nitrogen',
                sodium: 'Sodium',
                k: 'Potassium',
                bicarb: 'Bicarbonate',
                cl: 'Chloride',
                phos: 'Phosphorus',
                ca: 'Calcium',
                // blood pressure
                diabp: 'Diastolic Blood Pressure',
                sysbp: 'Systolic Blood Pressure',
                // albumin/creatinine
                alb: 'Albumin',
                albcreat: 'Albumin/Creatinine'
            },
            // renderer settings
            filters: [
                {
                    value_col: 'ARM',
                    label: 'Treatment Group'
                },
                {
                    value_col: 'AGEGRP',
                    label: 'Age Group'
                },
                {
                    value_col: 'SEX',
                    label: 'Sex'
                },
                {
                    value_col: 'RACE',
                    label: 'Race'
                }
            ],
            groups: [
                {
                    value_col: 'ARM',
                    label: 'Treatment Group'
                },
                {
                    value_col: 'AGEGRP',
                    label: 'Age Group'
                },
                {
                    value_col: 'SEX',
                    label: 'Sex'
                },
                {
                    value_col: 'RACE',
                    label: 'Race'
                }
            ],
            details: [
                {
                    value_col: 'AGE',
                    label: 'Age'
                }
            ],
            baseline_value: 'Y',
            visit_window: 7,
            kdigo_criteria: [
                {
                    label: 'No AKI',
                    x: -Infinity,
                    y: -Infinity,
                    color: 'white'
                },
                {
                    label: 'Stage 1 AKI',
                    x: 50,
                    y: 25,
                    color: '#ffffbf'
                },
                {
                    label: 'Stage 2 AKI',
                    x: 100,
                    y: 50,
                    color: '#fdae61'
                },
                {
                    label: 'Stage 3 AKI',
                    x: 200,
                    y: 75,
                    color: '#d73027'
                }
            ],
            kdigo_dc_criteria: [
                {
                    label: 'No AKI',
                    x: -Infinity,
                    y: -Infinity,
                    color: 'white'
                },
                {
                    label: 'Stage 1 AKI',
                    x: 50,
                    y: 0.3,
                    color: '#ffffbf'
                },
                {
                    label: 'Stage 2 AKI',
                    x: 100,
                    y: 0.7,
                    color: '#fdae61'
                },
                {
                    label: 'Stage 3 AKI',
                    x: 200,
                    y: 1.2,
                    color: '#d73027'
                }
            ]
        };
    }

    function kdigoScatterPlot() {
        return {
            x: {
                column: 'creat_pchg',
                type: 'log',
                label: 'Creatinine Percent Change',
                format: ',1d' //domain: [1, null]
            },
            y: {
                column: 'egfr_creat_pchg_inv',
                type: 'log',
                label: 'eGFR Percent Change',
                format: ',1d' //domain: [0, null]
            },
            marks: [
                {
                    type: 'circle',
                    per: ['key'],
                    tooltip: '[key]: $x,$y',
                    radius: 4,
                    attributes: {}
                }
            ],
            color_by: null,
            legend: {
                location: 'bottom',
                mark: 'circle'
            },
            //resizable: false,
            aspect: 1.25,
            gridlines: 'xy',
            margin: {
                top: 14,
                right: 0,
                left: 50,
                bottom: 0
            },
            title: 'KDIGO Scatter Plot'
        };
    }

    function baseline(settings) {
        // Map settings.baseline (an object with properties [ value_col  ] and [ values ]) to settings.baseline_col and settings.baseline_value.
        if (settings.baseline) {
            if (
                settings.baseline.value_col &&
                settings.baseline.value_col !== settings.baseline_col
            )
                settings.baseline_col = settings.baseline.value_col;
            if (settings.baseline.values && settings.baseline.values !== settings.baseline_value)
                settings.baseline_value = settings.baseline.values;
        }

        return [settings.baseline_col, settings.baseline_value];
    }

    function details(settings) {
        // Define default details.
        var details = [
            {
                value_col: settings.id_col,
                label: 'Subject Identifier'
            },
            {
                value_col: 'kdigo',
                label: 'KDIGO'
            }
        ]; // Add filters to default details.

        if (settings.filters)
            settings.filters.forEach(function(filter) {
                var obj = {
                    value_col: filter.value_col ? filter.value_col : filter,
                    label: filter.label
                        ? filter.label
                        : filter.value_col
                        ? filter.value_col
                        : filter
                };
                if (
                    details.find(function(detail) {
                        return detail.value_col === filter.value_col;
                    }) === undefined
                )
                    details.push(obj);
            }); // Add groups to default details.

        if (settings.groups)
            settings.groups
                .filter(function(group) {
                    return group.value_col !== 'NONE';
                })
                .forEach(function(group) {
                    var obj = {
                        value_col: group.value_col ? group.value_col : filter,
                        label: group.label
                            ? group.label
                            : group.value_col
                            ? group.value_col
                            : filter
                    };
                    if (
                        details.find(function(detail) {
                            return detail.value_col === obj.value_col;
                        }) === undefined
                    )
                        details.push(obj);
                }); // Convert details to array to array if needed

        if (!(settings.details instanceof Array))
            settings.details = typeof settings.details === 'string' ? [settings.details] : []; // Use default details if detailsIf [settings.details] is not specified:

        if (settings.details) {
            //If [settings.details] is specified:
            //Allow user to specify an array of columns or an array of objects with a column property
            //and optionally a column label.
            settings.details.forEach(function(detail) {
                if (
                    details
                        .map(function(d) {
                            return d.value_col;
                        })
                        .indexOf(detail.value_col ? detail.value_col : detail) === -1
                )
                    details.push({
                        value_col: detail.value_col ? detail.value_col : detail,
                        label: detail.label
                            ? detail.label
                            : detail.value_col
                            ? detail.value_col
                            : detail
                    });
            });
        }

        return details;
    }

    function syncKdigoScatterPlot(settings) {
        var _syncBaseline = baseline(settings);

        var _syncBaseline2 = _slicedToArray(_syncBaseline, 2);

        settings.baseline_col = _syncBaseline2[0];
        settings.baseline_value = _syncBaseline2[1];
        settings.details = details(settings);
        return settings;
    }

    function merge(value, replacement) {
        if (value === undefined) return replacement;
        if (replacement === undefined) return value;

        if (_typeof(value) !== _typeof(replacement)) {
            console.warn(
                'Type difference in merge():\nValue: [ '
                    .concat(JSON.stringify(value), ' ]\nReplacement: [ ')
                    .concat(JSON.stringify(replacement), ' ]')
            );
            return value || replacement;
        }

        if (_typeof(replacement) !== 'object') return replacement;

        if (Array.isArray(value)) {
            var array = [];

            for (var i = 0; i < Math.max(value.length, replacement.length); i++) {
                array[i] = merge(value[i], replacement[i]);
            }

            return array;
        }

        var obj = {};

        for (
            var _i = 0,
                _arr = [].concat(
                    _toConsumableArray(Object.keys(value)),
                    _toConsumableArray(Object.keys(replacement))
                );
            _i < _arr.length;
            _i++
        ) {
            var property = _arr[_i];
            obj[property] = merge(value[property], replacement[property]);
        }

        return obj;
    }

    function creat_cystatc() {
        return {
            title: 'Percent Change from Baseline',
            measures: ['creat', 'cystatc'],
            reference_lines: [
                {
                    y: 0,
                    label: 'Baseline',
                    tooltip: function tooltip(chart) {
                        return chart.filtered_data
                            .filter(function(d) {
                                return Array.isArray(chart.config.baseline_value)
                                    ? chart.config.baseline_value.includes(d.baseline)
                                    : chart.config.baseline_value === d.baseline;
                            })
                            .map(function(d) {
                                return ''.concat(d.measure, ': ').concat(d.result);
                            })
                            .join('\n');
                    }
                }
            ],
            y: {
                column: 'pchg',
                label: '%'
            },
            diff: true
        };
    }

    function egfr() {
        return {
            title: 'Change from Baseline',
            measures: ['egfr_creat', 'egfr_cystatc'],
            reference_lines: [
                {
                    y: 0,
                    label: 'Baseline',
                    tooltip: function tooltip(chart) {
                        return chart.filtered_data
                            .filter(function(d) {
                                return Array.isArray(chart.config.baseline_value)
                                    ? chart.config.baseline_value.includes(d.baseline)
                                    : chart.config.baseline_value === d.baseline;
                            })
                            .map(function(d) {
                                return ''.concat(d.measure, ': ').concat(d.result);
                            })
                            .join('\n');
                    }
                }
            ],
            y: {
                column: 'chg',
                label: 'mL/min/1.73m²'
            },
            diff: true
        };
    }

    function uln() {
        return {
            title: 'Standardized Lab Values',
            measures: ['bun', 'sodium', 'k', 'bicarb', 'cl', 'phos', 'ca'],
            reference_lines: [
                {
                    y: 1,
                    label: 'ULN',
                    tooltip: function tooltip(chart) {
                        return d3
                            .nest()
                            .key(function(d) {
                                return d.measure;
                            })
                            .rollup(function(data) {
                                return d3.median(data, function(d) {
                                    return d.uln;
                                });
                            })
                            .entries(chart.filtered_data)
                            .map(function(d) {
                                return ''.concat(d.key, ': ').concat(d.values);
                            })
                            .join('\n');
                    }
                }
            ],
            y: {
                column: 'xuln',
                label: '[xULN]',
                domain: [0, 3]
            }
        };
    }

    function bp() {
        return {
            title: 'Blood Pressure',
            measures: ['sysbp', 'diabp'],
            reference_lines: [
                {
                    y: 80,
                    label: 'Ideal Diastolic BP',
                    tooltip: '80 mmHg'
                },
                {
                    y: 120,
                    label: 'Ideal Systolic BP',
                    tooltip: '120 mmHg'
                }
            ],
            y: {
                column: 'result',
                label: 'mmHg',
                domain: [80, 120]
            }
        };
    }

    function albcreat() {
        return {
            title: 'Albumin/Creatinine Ratio',
            measures: ['albcreat'],
            reference_lines: [
                {
                    y: 0,
                    label: 'A1 Albuminuria',
                    tooltip: '0-<30 mg/g'
                },
                {
                    y: 30,
                    label: 'A2 Albuminuria',
                    tooltip: '30-<300 mg/g'
                },
                {
                    y: 300,
                    label: 'A3 Albuminuria',
                    tooltip: '>=300 mg/g'
                }
            ],
            y: {
                column: 'result',
                label: 'mg/g',
                domain: [0, 30]
            }
        };
    }

    var timeSeriesCharts = {
        creat_cystatc: creat_cystatc,
        egfr: egfr,
        uln: uln,
        bp: bp,
        albcreat: albcreat
    };

    function timeSeries(chart) {
        var customSettings = timeSeriesCharts[chart]();
        var commonSettings = {
            x: {
                column: 'studyday',
                type: 'linear',
                label: 'Study Day',
                format: ',1d'
            },
            y: {
                type: 'linear',
                format: '.1f'
            },
            marks: [
                {
                    type: 'line',
                    per: ['measure'],
                    tooltip: '$x,$y'
                },
                {
                    type: 'circle',
                    per: ['measure', 'studyday'],
                    tooltip: '$x,$y'
                }
            ],
            color_by: 'measure',
            colors: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#a65628', '#f781bf'],
            legend: {
                label: '',
                location: 'right',
                mark: 'line'
            },
            gridlines: 'xy',
            //resizable: false,
            aspect: 4,
            margin: {
                top: 14,
                right: 0,
                left: 50,
                bottom: 0
            }
        };
        var settings = merge(commonSettings, customSettings);
        settings.chart = chart;
        return settings;
    }

    function syncSettings(settings) {
        return settings;
    }

    function controlInputs() {
        return [
            {
                type: 'dropdown',
                label: 'X-axis',
                description: 'From baseline',
                option: 'x.column',
                values: ['creat_pchg', 'cystatc_pchg'],
                require: true
            },
            {
                type: 'dropdown',
                label: 'Y-axis',
                description: 'From baseline',
                option: 'y.column',
                values: [
                    'egfr_creat_pchg_inv',
                    'egfr_cystatc_pchg_inv',
                    'creat_chg',
                    'cystatc_chg'
                ],
                require: true
            },
            {
                type: 'dropdown',
                label: 'Axis Type',
                description: 'log or linear',
                options: ['x.type', 'y.type'],
                values: ['log', 'linear'],
                require: true
            },
            {
                type: 'number',
                label: 'Visit Window',
                description: 'number of days between visits in which to calculate change',
                option: 'visit_window'
            }
        ];
    }

    function syncControlInputs(controlInputs, settings) {
        // Add filters to default controls.
        if (Array.isArray(settings.filters) && settings.filters.length > 0) {
            settings.filters.forEach(function(filter, i) {
                var filterObj = {
                    type: 'subsetter',
                    label: filter.label || filter.value_col || filter,
                    description: null,
                    value_col: filter.value_col || filter,
                    multiple: true
                };
                controlInputs.splice(i, 0, filterObj);
            });
        } // Add group control.

        if (Array.isArray(settings.groups) && settings.groups.length > 0) {
            controlInputs.splice(controlInputs.length - 1, 0, {
                type: 'dropdown',
                label: 'Group',
                description: 'Grouping variable',
                options: ['color_by', 'legend.label'],
                values: settings.groups.map(function(group) {
                    return group.value_col || group;
                })
            });
        }

        return controlInputs;
    }

    var configuration = {
        renderer: renderer,
        kdigoScatterPlot: kdigoScatterPlot,
        syncKdigoScatterPlot: syncKdigoScatterPlot,
        timeSeries: timeSeries,
        timeSeriesCharts: timeSeriesCharts,
        syncTimeSeries: syncSettings,
        controlInputs: controlInputs,
        syncControlInputs: syncControlInputs
    };

    function onInit() {}

    function groupControls() {
        this.controls.controlGroups = this.controls.wrap
            .selectAll('.control-group')
            .attr('class', function(d) {
                return 'control-group control-group--'.concat(d.type);
            }); // group filters

        this.controls.filters = this.controls.controlGroups.filter(function(d) {
            return d.type === 'subsetter';
        });
        this.controls.filtersHeader = this.controls.wrap
            .insert('div', '.control-group--subsetter')
            .classed('wc-subheader', true);
        this.controls.filtersHeader
            .append('span')
            .classed('wc-subheader__text', true)
            .text('Filters');
        this.controls.popCount = this.controls.filtersHeader
            .append('span')
            .classed('wc-subheader__content', true); // group other controls

        this.controls.settings = this.controls.controlGroups.filter(function(d) {
            return d.type !== 'subsetter';
        });

        if (this.controls.settings.size()) {
            this.controls.settingsHeader = this.controls.wrap
                .insert('div', '.control-group--dropdown')
                .classed('wc-subheader', true);
            this.controls.settingsHeader
                .append('span')
                .classed('wc-subheader__text', true)
                .text('Settings');
        }
    }

    function updateOptionText(options, callback) {
        options.each(function(d) {
            var option = d3.select(this);
            option.attr('value', d);
            var optionText = callback(d);
            option.text(optionText);
        });
    }

    function addChangeEventListener(select) {
        var chart = this;
        select.on('change', function(d) {
            var _this = this;

            var value = select.selectAll('option:checked').attr('value');

            if (Array.isArray(d.options)) {
                d.options.forEach(function(option) {
                    return chart.controls.stringAccessor(chart.config, option, _this.value);
                });
            } else {
                chart.controls.stringAccessor(chart.config, d.option, this.value);
            }

            chart.draw();
        });
    }

    function labelOptions() {
        var chart = this;
        this.controls.settings.each(function(d) {
            if (d.type === 'dropdown') {
                var controlGroup = d3.select(this);
                var select = controlGroup.selectAll('select');
                var options = select.selectAll('option');

                switch (d.label) {
                    case 'X-axis':
                        updateOptionText.call(chart, options, function(text) {
                            var result = text.substring(text.search(/_.?chg/) + 1);
                            var measure =
                                chart.config.measure_values[text.replace('_'.concat(result), '')];
                            return ''.concat(measure, ' ').concat(
                                result
                                    .replace(/^chg$/, 'Change')
                                    .replace(/^pchg$/, 'Percent Increase')
                                    .replace(/^pchg_inv$/, 'Percent Decrease')
                            );
                        });
                        addChangeEventListener.call(chart, select);
                        break;

                    case 'Y-axis':
                        updateOptionText.call(chart, options, function(text) {
                            var result = text.substring(text.search(/_.?chg/) + 1);
                            var measure =
                                chart.config.measure_values[text.replace('_'.concat(result), '')];
                            return ''.concat(measure, ' ').concat(
                                result
                                    .replace(/^chg$/, 'Change')
                                    .replace(/^pchg$/, 'Percent Increase')
                                    .replace(/^pchg_inv$/, 'Percent Decrease')
                            );
                        });
                        addChangeEventListener.call(chart, select);
                        break;

                    case 'Group':
                        updateOptionText.call(chart, options, function(text) {
                            return text !== 'None'
                                ? chart.config.groups.find(function(group) {
                                      return group.value_col === text;
                                  }).label
                                : 'None';
                        });
                        addChangeEventListener.call(chart, select);
                        break;
                }
            }
        });
    }

    function updateVisitWindow() {
        var chart = this;
        this.controls.visitWindow = this.controls.wrap
            .selectAll('.control-group')
            .filter(function(d) {
                return d.label === 'Visit Window';
            });
        this.controls.visitWindow.selectAll('input').on('change', function() {
            console.log('Visit window: '.concat(this.value));
            chart.nepExplorer.settings.synced.visit_window = this.value;
            chart.nepExplorer.data.participants = defineParticipantLevelData(chart.nepExplorer);
            chart.draw();
        });
    }

    function addChartContainer(name) {
        var propertyName = name
            .toLowerCase()
            .split(' ')
            .map(function(str, i) {
                return i === 0 ? str : str.substring(0, 1).toUpperCase() + str.substring(1);
            })
            .join('');
        var className = name
            .toLowerCase()
            .split(' ')
            .join('-');
        this.containers[propertyName] = this.svg
            .append('g')
            .classed('wc-chart-customization wc-chart-customization--'.concat(className), true);
    }

    function addChartContainers() {
        this.containers = {};
        addChartContainer.call(this, 'origin');
        addChartContainer.call(this, 'voronoi diagram');
        addChartContainer.call(this, 'hysteresis plot');
    }

    function onLayout() {
        groupControls.call(this);
        labelOptions.call(this);
        updateVisitWindow.call(this);
        addChartContainers.call(this);
    }

    function removeNonpositiveRecords() {
        var _this = this;

        this.raw_data =
            this.config.x.type === 'log'
                ? this.nepExplorer.data.participants.filter(function(d) {
                      return d[_this.config.y.column] > 0 && d[_this.config.x.column] > 0;
                  })
                : this.nepExplorer.data.participants;
    }

    function setAxisLabels() {
        var _this = this;

        ['x', 'y'].forEach(function(axis) {
            _this.config[axis].result = _this.config[axis].column.substring(
                _this.config[axis].column.search(/_.?chg/) + 1
            );
            _this.config[axis].measure =
                _this.config.measure_values[
                    _this.config[axis].column.replace('_'.concat(_this.config[axis].result), '')
                ];
            _this.config[axis].label = ''.concat(_this.config[axis].measure, ' ').concat(
                _this.config[axis].result
                    .replace(/^chg$/, 'Change')
                    .replace(/^pchg$/, 'Percent Increase')
                    .replace(/^pchg_inv$/, 'Percent Decrease')
            );
        });
    }

    function identifyCriteria() {
        this.config.criteria = /_chg/.test(this.config.y.column)
            ? this.config.kdigo_dc_criteria // absolute change
            : this.config.kdigo_criteria; // percent change

        this.nepExplorer.containers.kdigoHeader.text(
            this.config.criteria === this.config.kdigo_criteria
                ? 'KDIGO Scatter Plot'
                : 'KDIGO-DC Scatter Plot'
        );
    }

    function addVariables$1() {
        var _this = this;

        this.nepExplorer.data.participants.forEach(function(participant) {
            // defineKdigoStage
            var kdigo = _this.config.criteria
                .slice()
                .sort(function(a, b) {
                    return b.x - a.x;
                })
                .find(function(criterion) {
                    return (
                        criterion.x <= participant[_this.config.x.column] ||
                        criterion.y <= participant[_this.config.y.column]
                    );
                });

            participant.kdigo = kdigo
                ? kdigo.label.replace(/stage_(\d)/, 'Stage $1 AKI').replace('no_aki', 'No AKI')
                : '???'; // identifyMissingParticipants

            var x = participant.values.find(function(measure) {
                return measure.key === _this.config.x.measure;
            });
            var y = participant.values.find(function(measure) {
                return measure.key === _this.config.y.measure;
            }); // missing a measure

            participant.missingResult = x === undefined || y === undefined; // results only at one visit

            participant.singleVisit =
                !participant.missingResult &&
                ((x !== undefined &&
                    x.values.data.filter(function(d) {
                        return !isNaN(d.result);
                    }).length === 1) ||
                    (y !== undefined &&
                        y.values.data.filter(function(d) {
                            return !isNaN(d.result);
                        }).length === 1)); // results outside visit window

            var xVisitWindow =
                x !== undefined
                    ? d3.min(x.values.visitWindows, function(visitWindow) {
                          return visitWindow.studyday2 - visitWindow.studyday1;
                      })
                    : undefined;
            var yVisitWindow =
                y !== undefined
                    ? d3.min(y.values.visitWindows, function(visitWindow) {
                          return visitWindow.studyday2 - visitWindow.studyday1;
                      })
                    : undefined;
            participant.outsideWindow =
                !participant.singleVisit &&
                (xVisitWindow > _this.config.visit_window ||
                    yVisitWindow > _this.config.visit_window); // log axis and nonpositive maximal change

            participant.nonPositiveChange =
                !participant.outsideWindow &&
                _this.config.x.type === 'log' &&
                (participant[_this.config.x.column] <= 0 ||
                    participant[_this.config.y.column] <= 0);
            participant.status = participant.missingResult
                ? 'Missing result'
                : participant.singleVisit
                ? 'Single visit'
                : participant.nonPositiveChange
                ? 'Nonpositive change'
                : participant.outsideWindow
                ? 'Outside visit window'
                : participant.kdigo;
        });
    }

    function updateGrouping() {
        var _this = this;

        if (this.config.color_by && this.config.color_by !== 'None') {
            this.config.color_dom = _toConsumableArray(
                new Set(
                    this.nepExplorer.data.participants.map(function(participant) {
                        return participant[_this.config.color_by];
                    })
                ).values()
            ).sort();
            this.config.legend.order = this.config.color_dom.slice();
            this.config.legend.label = this.config.groups.find(function(group) {
                return group.value_col === _this.config.color_by;
            }).label;
        } else {
            delete this.config.color_dom;
            delete this.config.legend.order;
            this.config.legend.label = 'All Participants';
        }
    }

    function onPreprocess() {
        removeNonpositiveRecords.call(this);
        setAxisLabels.call(this);
        identifyCriteria.call(this);
        addVariables$1.call(this);
        updateGrouping.call(this);
    }

    function onDatatransform() {}

    function detachParticipant() {
        var _this = this;

        if (
            this.nepExplorer.participant !== undefined &&
            !this.filtered_data.find(function(d) {
                return d.key === _this.nepExplorer.participant;
            })
        )
            // user updates filters
            delete this.nepExplorer.participant;
    }

    function updatePopCount() {
        var _this = this;

        this.nepExplorer.data.filtered = this.nepExplorer.data.participants;
        this.filters.forEach(function(filter) {
            _this.nepExplorer.data.filtered = _this.nepExplorer.data.filtered.filter(function(d) {
                return Array.isArray(filter.val)
                    ? filter.val.includes(d[filter.col])
                    : filter.val === d[filter.col];
            });
        });
        this.controls.popCount.html(
            "<span class = 'numerator'>"
                .concat(
                    this.nepExplorer.data.filtered.length,
                    "</span> of <span class = 'numerator'>"
                )
                .concat(this.nepExplorer.data.participants.length, '</span> participants selected.')
        );
    }

    function updateDomains() {
        this.x_dom[0] = Math.min(this.x_dom[0], this.config.y.type === 'log' ? 1 : 0);
        this.x_dom[1] = Math.max(
            this.x_dom[1],
            d3.max(this.config.criteria, function(criterion) {
                return criterion.x;
            })
        );
        this.y_dom[0] = Math.min(this.y_dom[0], this.config.y.type === 'log' ? 1 : 0);
        this.y_dom[1] = Math.max(
            this.y_dom[1],
            d3.max(this.config.criteria, function(criterion) {
                return criterion.y;
            })
        );
    }

    function onDraw() {
        detachParticipant.call(this);
        clearParticipant.call(this);
        updatePopCount.call(this);
        updateDomains.call(this);
        this.svg.selectAll('.wc-hover-mark').remove();
    }

    function metadata() {
        var _this = this;

        var metadata = this.config.criteria
            .slice()
            .sort(function(a, b) {
                return a.x - b.x;
            })
            .map(function(d, i) {
                var next =
                    i < _this.config.criteria.length - 1
                        ? _this.config.criteria[i + 1]
                        : {
                              x: _this.x_dom[1],
                              y: _this.y_dom[1]
                          };
                d.dimensions = [
                    [_this.x_dom[0], next.x],
                    [_this.y_dom[0], next.y]
                ];
                return d;
            })
            .reverse();
        return metadata;
    }

    function drawKdigoStages() {
        var _this = this;

        this.svg.selectAll('.kdigo-stages').remove();
        var g = this.svg.insert('g', '.axis').classed('kdigo-stages', true);
        var metadata$1 = metadata.call(this);
        var rects = g
            .selectAll('rect')
            .data(metadata$1)
            .enter()
            .append('rect')
            .classed('kdigo-stage', true)
            .attr({
                x: function x(d) {
                    return _this.x(d.dimensions[0][0]);
                },
                y: function y(d) {
                    return _this.y(d.dimensions[1][1]);
                },
                width: function width(d) {
                    return _this.x(d.dimensions[0][1]) - _this.x(d.dimensions[0][0]);
                },
                height: function height(d) {
                    return _this.y(d.dimensions[1][0]) - _this.y(d.dimensions[1][1]);
                },
                fill: function fill(d) {
                    return d.color;
                },
                'clip-path': 'url(#'.concat(this.id, ')')
            });
        rects.append('title').text(function(d) {
            return d.label;
        });
    }

    function drawOrigin() {
        this.containers.origin.selectAll('*').remove();

        if (this.x_dom[0] < 0) {
            this.containers.origin
                .append('line')
                .classed('wc-origin wc-origin--x', true)
                .attr({
                    x1: this.x(0),
                    x2: this.x(0),
                    y1: 0,
                    y2: this.plot_height,
                    stroke: 'black',
                    'stroke-width': 2
                });
        }

        if (this.y_dom[0] < 0) {
            this.containers.origin
                .append('line')
                .classed('wc-origin wc-origin--y', true)
                .attr({
                    x1: 0,
                    x2: this.plot_width,
                    y1: this.y(0),
                    y2: this.y(0),
                    stroke: 'black',
                    'stroke-width': 2
                });
        }
    }

    function drawVoronoiDiagram() {
        var _this = this;

        var mark = this.marks.find(function(mark) {
            return mark.type === 'circle';
        });
        this.containers.voronoiDiagram.selectAll('*').remove(); // add hysteresis plot points to voronoi data

        var markData =
            this.nepExplorer.participant && this.config.title === 'KDIGO Scatter Plot'
                ? mark.data.concat(
                      this.nepExplorer.data.participant.visits.filter(function(d, i) {
                          return i !== 0;
                      })
                  )
                : mark.data; // voronoi requires a unique set of coordinates

        var uniquePoints = markData.reduce(function(uniqueValues, d) {
            var existingValue = uniqueValues.find(function(di) {
                return di.values.x === d.values.x && di.values.y === d.values.y;
            });
            return existingValue ? uniqueValues : [].concat(_toConsumableArray(uniqueValues), [d]);
        }, []); // voronoi generator

        var voronoiGenerator = d3.geom
            .voronoi()
            .x(function(d) {
                return _this.x(d.values.x);
            })
            .y(function(d) {
                return _this.y(d.values.y);
            })
            .clipExtent([
                [0, 0],
                [this.plot_width, this.plot_height]
            ]); // pass coordinates to voronoi generator

        var voronoiData = voronoiGenerator(uniquePoints); // add clipPaths for each voronoi partition

        var voronoiClipPaths = this.containers.voronoiDiagram
            .append('defs')
            .selectAll('clipPath')
            .data(voronoiData)
            .enter()
            .append('clipPath')
            .attr({
                class: function _class(d) {
                    return 'wc-voronoi__cell';
                },
                id: function id(d) {
                    return 'wc-voronoi__cell--'.concat(
                        d.point.key.toLowerCase().replace(/ /g, '-')
                    );
                }
            })
            .append('path')
            .attr({
                d: function d(_d) {
                    return 'M'.concat(_d.join(','), 'Z');
                }
            }); // add gigantic circles on top of each point to make hovering easier

        mark.groups.selectAll('.wc-hover-mark').remove();
        var hoverMarks = mark.groups
            .filter(function(d) {
                return (
                    _this.x_dom[0] <= d.values.x &&
                    d.values.x <= _this.x_dom[1] &&
                    _this.y_dom[0] <= d.values.y &&
                    d.values.y <= _this.y_dom[1]
                );
            })
            .append('circle')
            .classed('wc-hover-mark', true)
            .attr('clip-path', function(d) {
                return 'url(#wc-voronoi__cell--'.concat(
                    d.key.toLowerCase().replace(/ /g, '-'),
                    ')'
                );
            })
            .style('clip-path', function(d) {
                return 'url(#wc-voronoi__cell--'.concat(
                    d.key.toLowerCase().replace(/ /g, '-'),
                    ')'
                );
            })
            .attr('cx', function(d) {
                return _this.x(d.values.x);
            })
            .attr('cy', function(d) {
                return _this.y(d.values.y);
            })
            .attr('r', 50)
            .style('fill', 'lightblue')
            .style('pointer-events', 'all')
            .style('fill-opacity', 0); // add paths for each voronoi partition to view voronoi diagram

        this.svg.selectAll('path.voronoi-partition').remove();

        if (this.nepExplorer.settings.synced.display_voronoi) {
            var voronoiCells = this.containers.voronoiDiagram
                .selectAll('path.voronoi-partition')
                .data(voronoiData)
                .enter()
                .insert('path', ':first-child')
                .attr({
                    class: function _class(d) {
                        return 'voronoi-partition';
                    },
                    d: function d(_d2) {
                        return 'M'.concat(_d2.join(','), 'Z');
                    }
                })
                .style({
                    fill: 'none',
                    stroke: 'black',
                    'pointer-events': 'all'
                });
        }
    }

    function updateTooltips() {
        var chart = this;
        var mark = this.marks.find(function(mark) {
            return mark.type === 'circle';
        });
        mark.groups.each(function(d, i) {
            var title = d3.select(this).selectAll('title');
            var participant = d.values.raw[0];
            var x = participant.values.find(function(value) {
                return value.key === chart.config.x.measure;
            }).values;
            var xVisitWindow = x.visitWindows.find(function(visitWindow) {
                return visitWindow[chart.config.x.result] === d.values.x;
            });
            var xVis1 = xVisitWindow.vis1;
            var xVis2 = xVisitWindow.vis2;
            var y = participant.values.find(function(value) {
                return value.key === chart.config.y.measure;
            }).values;
            var yVisitWindow = y.visitWindows.find(function(visitWindow) {
                return visitWindow[chart.config.y.result] === d.values.y;
            });
            var yVis1 = yVisitWindow.vis1;
            var yVis2 = yVisitWindow.vis2;
            title.text(
                [
                    'Participant ID: '.concat(d.key),
                    'KDIGO: '.concat(participant.kdigo),
                    ''
                        .concat(chart.config.x.label, ': ')
                        .concat(d.values.x, ' (')
                        .concat(xVis1.result, ' > ')
                        .concat(xVis2.result, ')'),
                    ''
                        .concat(chart.config.y.label, ': ')
                        .concat(d.values.y, ' (')
                        .concat(yVis1.result, ' > ')
                        .concat(yVis2.result, ')'),
                    ''
                        .concat(chart.config.x.measure, ' visit window: ')
                        .concat(xVis1.studyday, ' > ')
                        .concat(xVis2.studyday, ' (')
                        .concat(xVis1.visit, ' > ')
                        .concat(xVis2.visit, ')'),
                    ''
                        .concat(chart.config.y.measure, ' visit window: ')
                        .concat(yVis1.studyday, ' > ')
                        .concat(yVis2.studyday, ' (')
                        .concat(yVis1.visit, ' > ')
                        .concat(yVis2.visit, ')')
                ].join('\n')
            );
        });
    }

    function addPointHover() {
        this.marks
            .find(function(mark) {
                return mark.type === 'circle';
            })
            .groups.selectAll('circle')
            .on('mouseover', function(d) {
                d3.select(this.parentNode)
                    .select('.wc-data-mark')
                    .classed('wc-highlighted', true);
            })
            .on('mouseout', function(d) {
                d3.select(this.parentNode)
                    .select('.wc-data-mark')
                    .classed('wc-highlighted', false);
            });

        if (this.containers.hasOwnProperty('hysteresisPlot')) {
            this.containers.hysteresisPlot
                .selectAll('circle')
                .on('mouseover', function(d) {
                    d3.select(this.parentNode)
                        .select('.wc-hysteresis-point')
                        .classed('wc-highlighted', true);
                })
                .on('mouseout', function(d) {
                    d3.select(this.parentNode)
                        .select('.wc-hysteresis-point')
                        .classed('wc-highlighted', false);
                });
        }
    }

    function highlightPoint() {
        var _this = this;

        this.marks
            .find(function(mark) {
                return mark.type === 'circle';
            })
            .circles.classed('wc-deemphasized', function(d) {
                return d.key !== _this.nepExplorer.participant;
            })
            .classed('wc-selected', function(d) {
                return d.key === _this.nepExplorer.participant;
            });
    }

    function defineVisitLevelData() {
        var _this = this;

        var x_data = this.nepExplorer.data.participant.values.find(function(d) {
            return d.key === _this.config.x.measure;
        }).values.data;
        var x_studydays = x_data.map(function(d) {
            return d.studyday;
        });
        var y_data = this.nepExplorer.data.participant.values.find(function(d) {
            return d.key === _this.config.y.measure;
        }).values.data;
        var y_studydays = y_data.map(function(d) {
            return d.studyday;
        });
        var studydays = x_studydays.filter(function(studyday) {
            return y_studydays.includes(studyday);
        }); // Get coordinates by study day.

        var visits = studydays
            .map(function(studyday) {
                var visitObj = {
                    studyday: studyday
                }; // Get visit value.

                visitObj.visit = _this.config.visit_col
                    ? x_data.find(function(d) {
                          return d.studyday === studyday;
                      })[_this.config.visit_col]
                    : null;
                visitObj.visitn = _this.config.visitn_col
                    ? x_data.find(function(d) {
                          return d.studyday === studyday;
                      })[_this.config.visitn_col]
                    : null; // Get x coordinate.

                var xMatch = x_data.find(function(d) {
                    return d.studyday === studyday;
                });
                visitObj.x = xMatch[_this.config.x.result];

                if (visitObj.x < _this.x_dom[0]) {
                    visitObj.xClamped = _this.x_dom[0];
                    visitObj.xIsClamped = '<';
                } else if (visitObj.x > _this.x_dom[1]) {
                    visitObj.xClamped = _this.x_dom[1];
                    visitObj.xIsClamped = '>';
                } else {
                    visitObj.xClamped = visitObj.x;
                    visitObj.xIsClamped = '';
                } // Get y coordinate.

                var yMatch = y_data.find(function(d) {
                    return d.studyday === studyday;
                });
                visitObj.y = yMatch[_this.config.y.result];

                if (visitObj.y < _this.y_dom[0]) {
                    visitObj.yClamped = _this.y_dom[0];
                    visitObj.yIsClamped = '<';
                } else if (visitObj.y > _this.y_dom[1]) {
                    visitObj.yClamped = _this.y_dom[1];
                    visitObj.yIsClamped = '>';
                } else {
                    visitObj.yClamped = visitObj.y;
                    visitObj.yIsClamped = '';
                } // Get color value.

                if (_this.config.color_by)
                    visitObj[_this.config.color_by] = x_data[0][_this.config.color_by]; // Get KDIGO stage.

                var kdigo = _this.config.criteria
                    .slice()
                    .sort(function(a, b) {
                        return b.x - a.x;
                    })
                    .find(function(criterion) {
                        return criterion.x <= visitObj.x || criterion.y <= visitObj.y;
                    });

                visitObj.kdigo = kdigo
                    ? kdigo.label.replace(/stage_(\d)/, 'Stage $1 AKI').replace('no_aki', 'No AKI')
                    : '???'; // for voronoi diagram

                visitObj.values = {
                    x: visitObj.x,
                    y: visitObj.y
                };
                visitObj.key = 'study-day-'.concat(studyday);
                return visitObj;
            })
            .sort(function(a, b) {
                return a.studyday - b.studyday;
            })
            .filter(function(d) {
                return !isNaN(d.x) && !isNaN(d.y);
            });
        return visits;
    }

    function drawPath() {
        var _this = this;

        // Define path.
        var line = d3.svg
            .line()
            .x(function(d) {
                return _this.x(d.xClamped);
            })
            .y(function(d) {
                return _this.y(d.yClamped);
            }); // Draw path.

        var visitPath = this.containers.hysteresisPlot
            .append('path')
            .attr('class', 'participant-visits')
            .datum(this.nepExplorer.data.participant.visits)
            .attr('d', line)
            .attr('stroke', function(d) {
                return _this.colorScale(_this.nepExplorer.data.participant[_this.config.color_by]);
            })
            .attr('stroke-width', '2px')
            .attr('fill', 'none'); // Animate path.

        var totalLength = visitPath.node().getTotalLength();
        visitPath
            .attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(2000)
            .ease('linear')
            .attr('stroke-dashoffset', 0);
        return visitPath;
    }

    function drawPoints() {
        var _this = this;

        var chart = this;
        var visitContainers = this.containers.hysteresisPlot
            .selectAll('g.wc-hysteresis-point-container')
            .data(this.nepExplorer.data.participant.visits)
            .enter()
            .append('g')
            .classed('wc-hysteresis-point-container', true);
        visitContainers.each(function(d) {
            var visitContainer = d3.select(this);
            var x = chart.x(d.xClamped);
            var y = chart.y(d.yClamped);
            var color = chart.colorScale(d[chart.config.color_by]);
            var width = 5; // clamped on the left or right side of the chart

            if (['<', '>'].includes(d.xIsClamped))
                visitContainer
                    .append('polygon')
                    .classed('wc-hysteresis-point--clamped wc-hysteresis-point--clamped--x', true)
                    .attr({
                        points: [
                            [x, y],
                            [x, y],
                            [x, y]
                        ],
                        fill: color
                    })
                    .transition()
                    .delay(2000)
                    .duration(200)
                    .attr({
                        points: [
                            [x, y - width],
                            [d.xIsClamped === '<' ? x - width : x + width, y],
                            [x, y + width]
                        ]
                    }); // clamped on the bottom or top of the chart

            if (['<', '>'].includes(d.yIsClamped))
                visitContainer
                    .append('polygon')
                    .classed('wc-hysteresis-point--clamped wc-hysteresis-point--clamped--y', true)
                    .attr({
                        points: [
                            [x, y],
                            [x, y],
                            [x, y]
                        ],
                        fill: color
                    })
                    .transition()
                    .delay(2000)
                    .duration(200)
                    .attr({
                        points: [
                            [x - width, y],
                            [x + width, y],
                            [x, d.yIsClamped === '<' ? y + width : y - width]
                        ]
                    }); // not clamped

            if (!d.xIsClamped && !d.yIsClamped)
                visitContainer
                    .append('circle')
                    .classed('wc-hysteresis-point', true)
                    .attr({
                        cx: x,
                        cy: y,
                        r: 0,
                        fill: color,
                        stroke: color,
                        'stroke-width': 1
                    })
                    .transition()
                    .delay(2000)
                    .duration(200)
                    .attr({
                        r: chart.config.marks.find(function(mark) {
                            return mark.type === 'circle';
                        }).radius
                    }); // add gigantic circles on top of each point to make hovering easier

            visitContainer
                .append('circle')
                .classed('wc-hover-mark', true)
                .attr('clip-path', function(d) {
                    return 'url(#wc-voronoi__cell--'.concat(
                        d.key.toLowerCase().replace(/ /g, '-'),
                        ')'
                    );
                })
                .style('clip-path', function(d) {
                    return 'url(#wc-voronoi__cell--'.concat(
                        d.key.toLowerCase().replace(/ /g, '-'),
                        ')'
                    );
                })
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 50)
                .style('fill', 'lightblue')
                .style('pointer-events', 'all')
                .style('fill-opacity', 0);
        }); //custom titles for points on mouseover

        visitContainers.append('title').text(function(d) {
            var studyDay_label = 'Study day: ' + d.studyday + '\n';
            var visitn_label = d.visitn ? 'Visit Number: ' + d.visitn + '\n' : '';
            var visit_label = d.visit ? 'Visit: ' + d.visit + '\n' : '';
            var x_label = _this.config.x.label + ': ' + d3.format('0.3f')(d.x) + '\n';
            var y_label = _this.config.y.label + ': ' + d3.format('0.3f')(d.y);
            var kdigo_label = d.kdigo ? '\nKDIGO: ' + d.kdigo : '';
            return studyDay_label + visit_label + visitn_label + x_label + y_label + kdigo_label;
        });
        return visitContainers;
    }

    function drawHysteresisPlot() {
        this.nepExplorer.data.participant.visits = defineVisitLevelData.call(this);
        this.containers.hysteresisPlot.selectAll('*').remove();
        this.visitPath = drawPath.call(this);
        this.visitPoints = drawPoints.call(this);
    }

    function updateDetailsHeader() {
        this.nepExplorer.containers.detailsHeaderText.text('Participant Details');
    }

    function displayClearButton() {
        this.nepExplorer.containers.detailsClear.classed('wc-hidden', false);
    }

    function displayParticipantDetails() {
        var nepExplorer = this.nepExplorer;
        nepExplorer.containers.detailsParticipant
            .classed('wc-hidden', false)
            .selectAll('li')
            .remove();
        var lis = nepExplorer.containers.detailsParticipant
            .selectAll('li')
            .data(nepExplorer.settings.synced.details)
            .enter()
            .append('li')
            .classed('wc-details__li', true);
        lis.append('div')
            .classed('wc-details__label', true)
            .text(function(d) {
                return d.label;
            });
        lis.append('div')
            .classed('wc-details__value', true)
            .text(function(d) {
                return nepExplorer.data.participant[d.value_col];
            });
    }

    function drawTimeSeriesCharts() {
        var nepExplorer = this.nepExplorer;
        nepExplorer.containers.timeSeries.classed('wc-hidden', false);

        var _loop = function _loop(name) {
            var chart = nepExplorer.charts[name];
            var chartMeasures = chart.config.measures.map(function(measure) {
                return nepExplorer.settings.synced.measure_values[measure];
            });
            var chartData = d3.merge(
                nepExplorer.data.participant.values
                    .filter(function(d) {
                        return chartMeasures.includes(d.key);
                    })
                    .map(function(d) {
                        return d.values.data;
                    })
            );

            if (chartData.length) {
                if (chart.initialized) chart.draw(chartData);
                else {
                    chart.nepExplorer = nepExplorer;
                    chart.init(chartData);
                }
            } else {
                delete nepExplorer.charts[chart];
                console.warn(
                    '[ '.concat(
                        measures.join(', '),
                        ' ] do not exist in the data. The associated chart will not be displayed.'
                    )
                );
            }
        };

        for (var name in nepExplorer.charts) {
            _loop(name);
        }
    }

    function displayParticipant() {
        var nepExplorer = this.nepExplorer;

        if (nepExplorer.participant) {
            nepExplorer.data.participant = nepExplorer.data.participants.find(function(d) {
                return d.key === nepExplorer.participant;
            });
            highlightPoint.call(this);
            drawHysteresisPlot.call(this);
            updateDetailsHeader.call(this);
            displayClearButton.call(this);
            displayParticipantDetails.call(this);
            drawTimeSeriesCharts.call(this);
        }
    }

    function addPointClick() {
        var _this = this;

        this.marks
            .find(function(mark) {
                return mark.type === 'circle';
            })
            .groups.selectAll('circle')
            .on('click', function(d) {
                // Attach participant value.
                _this.nepExplorer.participant = d.key;
                displayParticipant.call(_this);
            });
    }

    function addKdigoLegend() {
        var _this = this;

        this.kdigoSummary = this.config.criteria
            .slice()
            .reverse()
            .map(function(stage) {
                var datum = _objectSpread2({}, stage);

                datum.n = _this.nepExplorer.data.filtered
                    .filter(function(d) {
                        return !d.missingMeasure && !d.singleVisit && !d.nonPositiveChange;
                    })
                    .filter(function(d) {
                        return d.kdigo === datum.label;
                    }).length;
                datum.rate = datum.n / _this.nepExplorer.data.participants.length;
                datum.pct = d3.format('.1%')(datum.rate);
                return datum;
            });
        this.statusSummary = d3
            .nest()
            .key(function(d) {
                return d.status;
            })
            .rollup(function(data) {
                var datum = {
                    label: data[0].status,
                    n: data.length
                };
                datum.rate = data.length / _this.nepExplorer.data.filtered.length;
                datum.pct = d3.format('.1%')(datum.rate);
                return datum;
            })
            .entries(this.nepExplorer.data.filtered)
            .map(function(d) {
                return Object.assign(d, d.values);
            })
            .sort(function(a, b) {
                return a.label < b.label ? -1 : 1;
            });
        var totalRow = {
            label: 'Total',
            n: this.nepExplorer.data.filtered.length
        };
        totalRow.rate = totalRow.n / this.nepExplorer.data.participants.length;
        totalRow.pct = d3.format('.1%')(totalRow.rate);
        var summary = [].concat(
            _toConsumableArray(this.kdigoSummary),
            _toConsumableArray(
                this.statusSummary.filter(function(d) {
                    return !_this.config.criteria
                        .map(function(stage) {
                            return stage.label;
                        })
                        .includes(d.label);
                })
            ),
            [totalRow]
        );

        if (this.kdigoLegend) {
            this.kdigoLegend.config.headers[0] =
                this.config.criteria === this.config.kdigo_criteria ? 'KDIGO' : 'KDIGO-DC';
            this.kdigoLegend.draw(summary);
        } else {
            this.kdigoLegend = webcharts.createTable(
                this.nepExplorer.containers.kdigoLegend.node(),
                {
                    cols: ['label', 'n', 'pct'],
                    headers: ['KDIGO', '#', '%'],
                    searchable: false,
                    sortable: false,
                    pagination: false,
                    exportable: false,
                    applyCSS: false
                }
            );
            this.kdigoLegend.kdigoChart = this;
            this.kdigoLegend.on('init', function() {
                this.initialized = true;
            });
            this.kdigoLegend.on('draw', function() {
                var _this2 = this;

                d3.select(this.div).style('top', this.kdigoChart.margin.top);
                this.wrap
                    .selectAll('tbody td')
                    .filter(function(d) {
                        return d.col === 'label';
                    })
                    .style({
                        background: function background(d) {
                            return _this2.data.raw.find(function(di) {
                                return di[d.col] === d.text;
                            }).color;
                        }
                    });
            });
            this.kdigoLegend.init(summary);
        }
    }

    function moveLegend() {
        //d3.select(this.div).node().appendChild(
        this.legend.classed('legend--kdigo', true).style('margin-left', this.margin.left); //        .node()
        //);
    }

    function onResize() {
        drawKdigoStages.call(this);
        drawOrigin.call(this);
        updateTooltips.call(this);
        displayParticipant.call(this); // draw hysteresis plot before voronoi digram to provide hysteresis plot points to voronoi digram

        drawVoronoiDiagram.call(this); // add voronoi diagram after hysteresis plot to include hysteresis plot points in voronoi diagram

        addPointHover.call(this); // add point hover after voronoi diagram to include hover marks in mouseover and mouseout event listeners

        addPointClick.call(this); // add point click after voronoi diagram to include hover marks in click event listener

        addKdigoLegend.call(this);
        moveLegend.call(this);
    }

    function onDestroy() {}

    var kdigoScatterPlotCallbacks = {
        onInit: onInit,
        onLayout: onLayout,
        onPreprocess: onPreprocess,
        onDatatransform: onDatatransform,
        onDraw: onDraw,
        onResize: onResize,
        onDestroy: onDestroy
    };

    function onInit$1() {
        this.initialized = true;
    }

    function addChartContainers$1() {
        this.containers = {};
        addChartContainer.call(this, 'voronoi diagram');
    }

    function onLayout$1() {
        addChartContainers$1.call(this);
    }

    function onPreprocess$1() {}

    function onDatatransform$1() {}

    function setYDomain() {
        var _this = this;

        if (this.config.chart === 'uln')
            this.y_dom[1] = Math.max(
                this.config.y.domain[1],
                d3.max(this.filtered_data, function(d) {
                    return d[_this.config.y.column];
                })
            );

        if (this.config.chart === 'bp') {
            this.y_dom[0] = Math.min(
                this.config.y.domain[0],
                d3.min(this.filtered_data, function(d) {
                    return d[_this.config.y.column];
                })
            );
            this.y_dom[1] = Math.max(
                this.config.y.domain[1],
                d3.max(this.filtered_data, function(d) {
                    return d[_this.config.y.column];
                })
            );
        }

        if (this.config.chart === 'albcreat')
            this.y_dom[1] = Math.max(
                this.config.y.domain[1],
                d3.max(this.filtered_data, function(d) {
                    return d[_this.config.y.column];
                })
            );
    }

    function onDraw$1() {
        setYDomain.call(this);
    }

    function increaseYAxisTicks() {
        var yAxis = this.svg.select('g.y.axis');
        yAxis.selectAll('.tick').remove();
        this.yAxis.ticks(4);
        yAxis.call(this.yAxis);
        this.drawGridlines();
    }

    function drawReferenceLine() {
        var _this = this;

        this.svg.selectAll('.wc-reference-lines').remove();

        if (this.config.reference_lines) {
            var g = this.svg.insert('g', '.point-supergroup').classed('wc-reference-lines', true);
            var reference_lines = this.config.reference_lines.filter(function(reference_line) {
                return _this.y_dom[0] <= reference_line.y && reference_line.y <= _this.y_dom[1];
            }); // lines

            g.selectAll('line')
                .data(reference_lines)
                .enter()
                .append('line')
                .classed('wc-reference-line', true)
                .attr({
                    x2: this.plot_width,
                    y1: function y1(d) {
                        return _this.y(d.y);
                    },
                    y2: function y2(d) {
                        return _this.y(d.y);
                    }
                })
                .append('title')
                .classed('wc-reference-tooltip', true)
                .text(function(d) {
                    return typeof d.tooltip === 'string' ? d.tooltip : d.tooltip(_this);
                }); // labels

            g.selectAll('text')
                .data(reference_lines)
                .enter()
                .append('text')
                .classed('wc-reference-label', true)
                .attr({
                    x: this.plot_width,
                    y: function y(d) {
                        return _this.y(d.y);
                    },
                    dy: -4
                })
                .text(function(d) {
                    return d.label;
                })
                .append('title')
                .classed('wc-reference-tooltip', true)
                .text(function(d) {
                    return typeof d.tooltip === 'string' ? d.tooltip : d.tooltip(_this);
                });
        }
    }

    function drawDifference() {
        var _this = this;

        this.svg.selectAll('.wc-diffs').remove();

        if (this.config.diff) {
            var g = this.svg.append('g').classed('wc-diffs', true);
            var mark = this.marks.find(function(mark) {
                return mark.type === 'circle';
            });
            var matches = d3
                .nest()
                .key(function(d) {
                    return d.total;
                })
                .rollup(function(data) {
                    var datum = {
                        n: data.length
                    };

                    if (data.length > 1) {
                        datum.measure1 = data[0].values.raw[0].measure;
                        datum.y1 = data[0].values.y;
                        datum.result1 = data[0].values.raw[0].result;
                        datum.measure2 = data[1].values.raw[0].measure;
                        datum.y2 = data[1].values.y;
                        datum.result2 = data[1].values.raw[0].result;
                        datum.diff = datum.y2 - datum.y1;
                    }

                    return datum;
                })
                .entries(mark.data)
                .filter(function(d) {
                    return d.values.n > 1;
                });
            var diffs = g
                .selectAll('g')
                .data(matches)
                .enter()
                .append('g')
                .classed('wc-diff', true);
            diffs
                .append('line')
                .classed('wc-visible-line', true)
                .attr({
                    x1: function x1(d) {
                        return _this.x(+d.key);
                    },
                    x2: function x2(d) {
                        return _this.x(+d.key);
                    },
                    y1: function y1(d) {
                        return _this.y(d.values.y1);
                    },
                    y2: function y2(d) {
                        return _this.y(d.values.y2);
                    }
                });
            var hoverLines = diffs
                .append('line')
                .classed('wc-hover-line', true)
                .attr({
                    x1: function x1(d) {
                        return _this.x(+d.key);
                    },
                    x2: function x2(d) {
                        return _this.x(+d.key);
                    },
                    y1: function y1(d) {
                        return _this.y(d.values.y1);
                    },
                    y2: function y2(d) {
                        return _this.y(d.values.y2);
                    }
                });
            hoverLines.append('title').text(function(d) {
                return 'Study Day: '
                    .concat(d.key, '\n')
                    .concat(d.values.measure1, ': ')
                    .concat(d.values.y1, ' (')
                    .concat(d.values.result1, ')\n')
                    .concat(d.values.measure2, ': ')
                    .concat(d.values.y2, ' (')
                    .concat(d.values.result2, ')\nDifference: ')
                    .concat(d.values.diff);
            });
            hoverLines
                .on('mouseover', function(d) {
                    d3.select(this.parentNode)
                        .select('.wc-visible-line')
                        .classed('wc-hovered', true);
                })
                .on('mouseout', function(d) {
                    d3.select(this.parentNode)
                        .select('.wc-visible-line')
                        .classed('wc-hovered', false);
                });
        }
    }

    function updateTooltips$1() {
        var chart = this;
        var mark = this.marks.find(function(mark) {
            return mark.type === 'circle';
        });
        mark.groups.each(function(d, i) {
            var title = d3.select(this).selectAll('title');
            var datum = d.values.raw[0];
            var variables = [
                {
                    value_col: 'studyday',
                    label: 'Study Day'
                },
                {
                    value_col: 'visit',
                    label: 'Visit'
                },
                {
                    value_col: 'visitn',
                    label: 'Visit Number'
                },
                {
                    value_col: 'measure',
                    label: 'Measure'
                },
                {
                    value_col: 'result',
                    label: 'Result'
                }
            ];

            if (
                datum.baseline !== chart.config.baseline_value &&
                !isNaN(datum.baseline_result) &&
                datum.baseline_result !== null
            ) {
                variables.push({
                    value_col: 'baseline_result',
                    label: 'Baseline Result'
                });
                variables.push({
                    value_col: 'chg',
                    label: 'Change from Baseline'
                });
                variables.push({
                    value_col: 'pchg',
                    label: 'Percent Change from Baseline'
                });
            }

            if (datum.xuln !== null)
                variables.push({
                    value_col: 'xuln',
                    label: 'Result xULN'
                });
            var tooltip = variables
                .map(function(variable) {
                    return ''.concat(variable.label, ': ').concat(datum[variable.value_col]);
                })
                .join('\n');
            title.text(tooltip);
        });
    }

    function moveLegend$1() {
        this.div.appendChild(this.legend.classed('legend--time-series', true).node());
    }

    function onResize$1() {
        increaseYAxisTicks.call(this);
        drawVoronoiDiagram.call(this);
        drawReferenceLine.call(this);
        drawDifference.call(this);
        addPointHover.call(this);
        updateTooltips$1.call(this);
        moveLegend$1.call(this);
    }

    function onDestroy$1() {}

    var timeSeriesCallbacks = {
        onInit: onInit$1,
        onLayout: onLayout$1,
        onPreprocess: onPreprocess$1,
        onDatatransform: onDatatransform$1,
        onDraw: onDraw$1,
        onResize: onResize$1,
        onDestroy: onDestroy$1
    };

    function nepExplorer() {
        var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'body';
        var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var nepExplorer = {
            element: element,
            containers: layout(element),
            styles: styles(),
            settings: {
                user: settings
            },
            charts: {},
            init: init,
            destroy: destroy
        }; // settings

        nepExplorer.settings.merged = Object.assign(
            {},
            configuration.renderer(),
            configuration.kdigoScatterPlot(),
            nepExplorer.settings.user
        );
        nepExplorer.settings.synced = configuration.syncKdigoScatterPlot(
            nepExplorer.settings.merged
        ); // controls

        nepExplorer.settings.controls = {
            inputs: configuration.syncControlInputs(
                configuration.controlInputs(),
                nepExplorer.settings.synced
            )
        };
        nepExplorer.controls = webcharts.createControls(
            nepExplorer.containers.controls.node(),
            nepExplorer.settings.controls
        ); // chart

        nepExplorer.kdigoScatterPlot = webcharts.createChart(
            nepExplorer.containers.kdigoScatterPlot.node(),
            nepExplorer.settings.synced,
            nepExplorer.controls
        );

        for (var callback in kdigoScatterPlotCallbacks) {
            nepExplorer.kdigoScatterPlot.on(
                callback.substring(2).toLowerCase(),
                kdigoScatterPlotCallbacks[callback]
            );
        } // time series

        Object.keys(configuration.timeSeriesCharts).forEach(function(chart) {
            var container = nepExplorer.containers.timeSeries
                .append('div')
                .classed(
                    'wc-subcomponent wc-subcomponent--chart wc-subcomponent--time-series-chart wc-subcomponent--'.concat(
                        chart
                    ),
                    true
                );
            var mergedSettings = Object.assign(
                {},
                configuration.renderer(),
                configuration.timeSeries(chart) //nepExplorer.settings.user
            ); //const syncedSettings = configuration.syncTimeSeries(mergedSettings);

            nepExplorer.containers[''.concat(chart, 'Container')] = container;
            nepExplorer.containers[''.concat(chart, 'Header')] = nepExplorer.containers[
                ''.concat(chart, 'Container')
            ]
                .append('div')
                .classed('wc-header wc-header--'.concat(chart), true)
                .text(mergedSettings.title); //.text(syncedSettings.title);

            nepExplorer.containers[chart] = container
                .append('div')
                .classed('wc-chart-container wc-chart-container--'.concat(chart), true);
            var timeSeries = webcharts.createChart(
                nepExplorer.containers[chart].node(),
                mergedSettings //syncedSettings
            );

            for (var _callback in timeSeriesCallbacks) {
                timeSeries.on(_callback.substring(2).toLowerCase(), timeSeriesCallbacks[_callback]);
            }

            nepExplorer.charts[chart] = timeSeries;
        });
        return nepExplorer;
    }

    return nepExplorer;
});
