(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? (module.exports = factory(require('webcharts')))
        : typeof define === 'function' && define.amd
        ? define(['webcharts'], factory)
        : (global.hepexplorer = factory(global.webCharts));
})(this, function(webcharts) {
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

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, 'length')).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, � kValue, k, O �)).
                    // d. If testResult is true, return kValue.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return kValue;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return undefined.
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

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, � kValue, k, O �)).
                    // d. If testResult is true, return k.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return k;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return -1.
                return -1;
            }
        });
    }

    (function() {
        if (typeof window.CustomEvent === 'function') return false;

        function CustomEvent(event, params) {
            params = params || { bubbles: false, cancelable: false, detail: null };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }

        window.CustomEvent = CustomEvent;
    })();

    // https://github.com/wbkd/d3-extended
    d3.selection.prototype.moveToFront = function() {
        return this.each(function() {
            this.parentNode.appendChild(this);
        });
    };

    d3.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };

    var _typeof =
        typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
            ? function(obj) {
                  return typeof obj;
              }
            : function(obj) {
                  return obj &&
                      typeof Symbol === 'function' &&
                      obj.constructor === Symbol &&
                      obj !== Symbol.prototype
                      ? 'symbol'
                      : typeof obj;
              };

    var defineProperty = function(obj, key, value) {
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
    };

    /*------------------------------------------------------------------------------------------------\
      Clone a variable (http://stackoverflow.com/a/728694).
    \------------------------------------------------------------------------------------------------*/

    function clone(obj) {
        var copy;

        //Handle the 3 simple types, and null or undefined
        if (null == obj || 'object' != (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)))
            return obj;

        //Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        //Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        //Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    function settings() {
        return {
            //LB domain settings
            id_col: 'USUBJID',
            studyday_col: 'DY',
            value_col: 'STRESN',
            measure_col: 'TEST',
            normal_col_low: null,
            normal_col_high: 'STNRHI',
            visit_col: null,
            visitn_col: null,

            //DM domain settings
            group_cols: null,
            filters: null,
            details: null,

            //EX domain settings
            exposure_stdy_col: 'EXSTDY',
            exposure_endy_col: 'EXENDY',
            exposure_trt_col: 'EXTRT',
            exposure_dose_col: 'EXDOSE',
            exposure_dosu_col: 'EXDOSU',

            //analysis settings
            analysisFlag: {
                value_col: null,
                values: []
            },
            baseline: {
                value_col: null, //synced with studyday_col in syncsettings()
                values: [0]
            },
            calculate_palt: false,
            paltFlag: {
                value_col: null,
                values: []
            },
            measure_values: {
                ALT: 'Aminotransferase, alanine (ALT)',
                AST: 'Aminotransferase, aspartate (AST)',
                TB: 'Total Bilirubin',
                ALP: 'Alkaline phosphatase (ALP)'
            },
            add_measures: false,
            x_options: 'all',
            x_default: 'ALT',
            y_options: ['TB'],
            y_default: 'TB',
            point_size_options: 'all',
            point_size_default: 'Uniform',
            cuts: {
                TB: {
                    relative_baseline: 4.8,
                    relative_uln: 2
                },
                ALP: {
                    relative_baseline: 3.8,
                    relative_uln: 1
                },
                nrRatio: {
                    relative_baseline: 5,
                    relative_uln: 5
                },
                rRatio: {
                    relative_baseline: 5,
                    relative_uln: 5
                },
                defaults: {
                    relative_baseline: 3.8,
                    relative_uln: 3
                }
            },
            imputation_methods: {
                ALT: 'data-driven',
                AST: 'data-driven',
                TB: 'data-driven',
                ALP: 'data-driven'
            },
            imputation_values: null,
            display: 'relative_uln', //or "relative_baseline"
            plot_max_values: true,
            plot_day: null, //set in onLayout/initStudyDayControl
            display_options: [
                {
                    label: 'Upper limit of normal adjusted (eDish)',
                    value: 'relative_uln'
                },
                { label: 'Baseline adjusted (mDish)', value: 'relative_baseline' }
            ],
            measureBounds: [0.01, 0.99],
            populationProfileURL: null,
            participantProfileURL: null,
            r_ratio_filter: true,
            r_ratio: [0, null],
            visit_window: 30,
            title: 'Hepatic Safety Explorer',
            downloadLink: true,
            filters_multiselect: true,
            warningText:
                "This graphic has been thoroughly tested, but is not validated. Any clinical recommendations based on this tool should be confirmed using your organization's standard operating procedures.",

            //all values set in onLayout/quadrants/*.js
            quadrants: [
                {
                    label: "Possible Hy's Law Range",
                    position: 'upper-right',
                    dataValue: 'xHigh:yHigh',
                    count: null,
                    total: null,
                    percent: null
                },
                {
                    label: 'Hyperbilirubinemia',
                    position: 'upper-left',
                    dataValue: 'xNormal:yHigh',
                    count: null,
                    total: null,
                    percent: null
                },
                {
                    label: "Temple's Corollary",
                    position: 'lower-right',
                    dataValue: 'xHigh:yNormal',
                    count: null,
                    total: null,
                    percent: null
                },
                {
                    label: 'Normal Range',
                    position: 'lower-left',
                    dataValue: 'xNormal:yNormal',
                    count: null,
                    total: null,
                    percent: null
                }
            ],

            //Standard webcharts settings
            x: {
                column: null, //set in onPreprocess/updateAxisSettings
                label: null, // set in onPreprocess/updateAxisSettings,
                type: 'linear',
                behavior: 'raw',
                format: '.2f'
                //domain: [0, null]
            },
            y: {
                column: null, // set in onPreprocess/updateAxisSettings,
                label: null, // set in onPreprocess/updateAxisSettings,
                type: 'linear',
                behavior: 'raw',
                format: '.2f'
                //domain: [0, null]
            },
            marks: [
                {
                    per: [], // set in syncSettings()
                    type: 'circle',
                    summarizeY: 'mean',
                    summarizeX: 'mean',
                    attributes: { 'fill-opacity': 0 }
                }
            ],
            gridlines: 'xy',
            color_by: null, //set in syncSettings
            max_width: 600,
            aspect: 1,
            legend: { location: 'top' },
            margin: { right: 25, top: 25, bottom: 75 }
        };
    }

    //Replicate settings in multiple places in the settings object
    function syncSettings(settings$$1) {
        var defaults = settings();
        settings$$1.marks[0].per[0] = settings$$1.id_col;

        //set grouping config
        if (typeof settings$$1.group_cols == 'string') {
            settings$$1.group_cols = [
                { value_col: settings$$1.group_cols, label: settings$$1.group_cols }
            ];
        }

        if (!(settings$$1.group_cols instanceof Array && settings$$1.group_cols.length)) {
            settings$$1.group_cols = [{ value_col: 'NONE', label: 'None' }];
        } else {
            settings$$1.group_cols = settings$$1.group_cols.map(function(group) {
                return {
                    value_col: group.value_col || group,
                    label: group.label || group.value_col || group
                };
            });

            var hasNone =
                settings$$1.group_cols
                    .map(function(m) {
                        return m.value_col;
                    })
                    .indexOf('NONE') > -1;
            if (!hasNone) {
                settings$$1.group_cols.unshift({ value_col: 'NONE', label: 'None' });
            }
        }

        if (settings$$1.group_cols.length > 1) {
            settings$$1.color_by = settings$$1.group_cols[1].value_col
                ? settings$$1.group_cols[1].value_col
                : settings$$1.group_cols[1];
        } else {
            settings$$1.color_by = 'NONE';
        }

        //make sure filters is an Array
        if (!(settings$$1.filters instanceof Array)) {
            settings$$1.filters =
                typeof settings$$1.filters == 'string' ? [settings$$1.filters] : [];
        }

        //Define default details.
        var defaultDetails = [{ value_col: settings$$1.id_col, label: 'Subject Identifier' }];
        if (settings$$1.filters) {
            settings$$1.filters.forEach(function(filter) {
                var obj = {
                    value_col: filter.value_col ? filter.value_col : filter,
                    label: filter.label
                        ? filter.label
                        : filter.value_col
                        ? filter.value_col
                        : filter
                };

                if (
                    defaultDetails.find(function(f) {
                        return f.value_col == obj.value_col;
                    }) == undefined
                ) {
                    defaultDetails.push(obj);
                }
            });
        }

        if (settings$$1.group_cols) {
            settings$$1.group_cols
                .filter(function(f) {
                    return f.value_col != 'NONE';
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
                        defaultDetails.find(function(f) {
                            return f.value_col == obj.value_col;
                        }) == undefined
                    ) {
                        defaultDetails.push(obj);
                    }
                });
        }

        //parse details to array if needed
        if (!(settings$$1.details instanceof Array)) {
            settings$$1.details =
                typeof settings$$1.details == 'string' ? [settings$$1.details] : [];
        }

        //If [settings.details] is not specified:
        if (!settings$$1.details) settings$$1.details = defaultDetails;
        else {
            //If [settings.details] is specified:
            //Allow user to specify an array of columns or an array of objects with a column property
            //and optionally a column label.
            settings$$1.details.forEach(function(detail) {
                if (
                    defaultDetails
                        .map(function(d) {
                            return d.value_col;
                        })
                        .indexOf(detail.value_col ? detail.value_col : detail) === -1
                )
                    defaultDetails.push({
                        value_col: detail.value_col ? detail.value_col : detail,
                        label: detail.label
                            ? detail.label
                            : detail.value_col
                            ? detail.value_col
                            : detail
                    });
            });
            settings$$1.details = defaultDetails;
        }

        // If settings.analysisFlag is null
        if (!settings$$1.analysisFlag) settings$$1.analysisFlag = { value_col: null, values: [] };
        if (!settings$$1.analysisFlag.value_col) settings$$1.analysisFlag.value_col = null;
        if (!(settings$$1.analysisFlag.values instanceof Array)) {
            settings$$1.analysisFlag.values =
                typeof settings$$1.analysisFlag.values == 'string'
                    ? [settings$$1.analysisFlag.values]
                    : [];
        }

        // If settings.paltFlag is null
        if (!settings$$1.paltFlag) settings$$1.paltFlag = { value_col: null, values: [] };
        if (!settings$$1.paltFlag.value_col) settings$$1.paltFlag.value_col = null;
        if (!(settings$$1.paltFlag.values instanceof Array)) {
            settings$$1.paltFlag.values =
                typeof settings$$1.paltFlag.values == 'string' ? [settings$$1.paltFlag.values] : [];
        }

        //if it is null, set settings.baseline.value_col to settings.studyday_col.
        if (!settings$$1.baseline) settings$$1.baseline = { value_col: null, values: [] };
        if (!settings$$1.baseline.value_col)
            settings$$1.baseline.value_col = settings$$1.studyday_col;
        if (!(settings$$1.baseline.values instanceof Array)) {
            settings$$1.baseline.values =
                typeof settings$$1.baseline.values == 'string' ? [settings$$1.baseline.values] : [];
        }

        //merge in default measure_values if user hasn't specified changes
        Object.keys(defaults.measure_values).forEach(function(val) {
            if (!settings$$1.measure_values.hasOwnProperty(val))
                settings$$1.measure_values[val] = defaults.measure_values[val];
        });

        //check for 'all' in x_, y_ and point_size_options, but keep track if all options are used for later
        var allMeasures = Object.keys(settings$$1.measure_values);
        settings$$1.x_options_all = settings$$1.x_options == 'all';
        if (settings$$1.x_options == 'all') settings$$1.x_options = allMeasures;
        settings$$1.y_options_all = settings$$1.y_options == 'all';
        if (settings$$1.y_options == 'all') settings$$1.y_options = allMeasures;
        settings$$1.point_size_options_all = settings$$1.point_size_options == 'all';
        if (settings$$1.point_size_options == 'all') settings$$1.point_size_options = allMeasures;

        //parse x_ and y_options to array if needed
        if (!(settings$$1.x_options instanceof Array)) {
            settings$$1.x_options =
                typeof settings$$1.x_options == 'string' ? [settings$$1.x_options] : [];
        }

        if (!(settings$$1.y_options instanceof Array)) {
            settings$$1.y_options =
                typeof settings$$1.y_options == 'string' ? [settings$$1.y_options] : [];
        }

        //set starting values for axis and point size settings.
        settings$$1.point_size =
            settings$$1.point_size_options.indexOf(settings$$1.point_size_default) > -1
                ? settings$$1.point_size_default
                : settings$$1.point_size_default == 'rRatio'
                ? 'rRatio'
                : 'Uniform';
        settings$$1.x.column =
            settings$$1.x_options.indexOf(settings$$1.x_default) > -1
                ? settings$$1.x_default
                : settings$$1.x_options[0];
        settings$$1.y.column =
            settings$$1.y_options.indexOf(settings$$1.y_default) > -1
                ? settings$$1.y_default
                : settings$$1.y_options[0];

        // track initial Cutpoint  (lets us detect when cutpoint should change)
        settings$$1.cuts.x = settings$$1.x.column;
        settings$$1.cuts.y = settings$$1.y.column;
        settings$$1.cuts.display = settings$$1.display;

        // Confirm detault cuts are set
        settings$$1.cuts.defaults = settings$$1.cuts.defaults || defaults.cuts.defaults;
        settings$$1.cuts.defaults.relative_uln =
            settings$$1.cuts.defaults.relative_uln || defaults.cuts.defaults.relative_uln;
        settings$$1.cuts.defaults.relative_baseline =
            settings$$1.cuts.defaults.relative_baseline || defaults.cuts.defaults.relative_baseline;

        // keep default cuts if user hasn't provided an alternative
        var cutMeasures = Object.keys(settings$$1.cuts);
        Object.keys(defaults.cuts).forEach(function(m) {
            if (cutMeasures.indexOf(m) == -1) {
                settings$$1.cuts[m] = defaults.cuts[m];
            }
        });

        return settings$$1;
    }

    function controlInputs() {
        return [
            {
                type: 'number',
                label: 'R Ratio Range',
                description: 'Filter points based on R ratio [(ALT/ULN) / (ALP/ULN)]',
                option: 'r_ratio[0]'
            },
            {
                type: 'number',
                label: null, //combined with r_ratio[0] control in formatRRatioControl()
                description: null,
                option: 'r_ratio[1]'
            },
            {
                type: 'dropdown',
                label: 'Group',
                description: 'Grouping variable',
                options: ['color_by'],
                start: null, // set in syncControlInputs()
                values: ['NONE'], // set in syncControlInputs()
                require: true
            },
            {
                type: 'dropdown',
                label: 'Display Type',
                description: 'Relative or absolute axes',
                options: ['displayLabel'],
                start: null, // set in syncControlInputs()
                values: null, // set in syncControlInputs()
                require: true
            },
            {
                type: 'radio',
                option: 'plot_max_values',
                label: 'Plot Style',
                values: [true, false],
                relabels: ['Max Values', 'By Study Day']
            },
            {
                type: 'number',
                label: 'Study Day',
                description: null, //set in onDraw/updateStudyDaySlider
                option: 'plot_day'
            },
            {
                type: 'dropdown',
                label: 'X-axis Measure',
                description: null, // set in syncControlInputs()
                option: 'x.column',
                start: null, // set in syncControlInputs()
                values: null, //set in syncControlInptus()
                require: true
            },
            {
                type: 'number',
                label: null, // set in syncControlInputs
                description: 'X-axis Reference Line',
                option: null // set in syncControlInputs
            },
            {
                type: 'dropdown',
                label: 'Y-axis Measure',
                description: null, // set in syncControlInputs()
                option: 'y.column',
                start: null, // set in syncControlInputs()
                values: null, //set in syncControlInptus()
                require: true
            },
            {
                type: 'number',
                label: null, // set in syncControlInputs
                description: 'Y-axis Reference Line',
                option: null // set in syncControlInputs
            },
            {
                type: 'dropdown',
                label: 'Point Size',
                description: 'Parameter to set point radius',
                options: ['point_size'],
                start: null, // set in syncControlInputs()
                values: ['Uniform', 'rRatio', 'nrRatio'],
                require: true
            },
            {
                type: 'dropdown',
                label: 'Axis Type',
                description: 'Linear or Log Axes',
                options: ['x.type', 'y.type'],
                start: null, // set in syncControlInputs()
                values: ['linear', 'log'],
                require: true
            },
            {
                type: 'number',
                label: 'Highlight Points Based on Timing',
                description: 'Fill points with max values less than X days apart',
                option: 'visit_window'
            }
        ];
    }

    //Map values from settings to control inputs
    function syncControlInputs(controlInputs, settings) {
        ////////////////////////
        // Group control
        ///////////////////////

        var groupControl = controlInputs.find(function(controlInput) {
            return controlInput.label === 'Group';
        });

        //sync start value
        groupControl.start = settings.color_by; //sync start value

        //sync values
        settings.group_cols
            .filter(function(group) {
                return group.value_col !== 'NONE';
            })
            .forEach(function(group) {
                groupControl.values.push(group.value_col);
            });

        //drop the group control if NONE is the only option
        if (settings.group_cols.length == 1)
            controlInputs = controlInputs.filter(function(controlInput) {
                return controlInput.label != 'Group';
            });

        //////////////////////////
        // x-axis measure control
        //////////////////////////

        // drop the control if there's only one option
        if (settings.x_options.length === 1)
            controlInputs = controlInputs.filter(function(controlInput) {
                return controlInput.option !== 'x.column';
            });
        else {
            //otherwise sync the properties
            var xAxisMeasureControl = controlInputs.find(function(controlInput) {
                return controlInput.option === 'x.column';
            });

            //xAxisMeasureControl.description = settings.x_options.join(', ');
            xAxisMeasureControl.start = settings.x.column;
            xAxisMeasureControl.values = settings.x_options;
        }

        //////////////////////////////////
        // x-axis reference line control
        //////////////////////////////////

        var xRefControl = controlInputs.find(function(controlInput) {
            return controlInput.description === 'X-axis Reference Line';
        });
        xRefControl.label = settings.x_options[0] + ' Cutpoint';
        xRefControl.option = 'settings.cuts.' + [settings.x.column] + '.' + [settings.display];

        ////////////////////////////
        // y-axis measure control
        ////////////////////////////

        // drop the control if there's only one option
        if (settings.y_options.length === 1)
            controlInputs = controlInputs.filter(function(controlInput) {
                return controlInput.option !== 'y.column';
            });
        else {
            //otherwise sync the properties
            var yAxisMeasureControl = controlInputs.find(function(controlInput) {
                return controlInput.option === 'y.column';
            });
            //  yAxisMeasureControl.description = settings.y_options.join(', ');
            yAxisMeasureControl.start = settings.y.column;
            yAxisMeasureControl.values = settings.y_options;
        }

        //////////////////////////////////
        // y-axis reference line control
        //////////////////////////////////

        var yRefControl = controlInputs.find(function(controlInput) {
            return controlInput.description === 'Y-axis Reference Line';
        });
        yRefControl.label = settings.y_options[0] + ' Cutpoint';

        yRefControl.option = 'settings.cuts.' + [settings.y.column] + '.' + [settings.display];

        //////////////////////////////////
        // R ratio filter control
        //////////////////////////////////

        //drop the R Ratio control if r_ratio_filter is false
        if (!settings.r_ratio_filter) {
            controlInputs = controlInputs.filter(function(controlInput) {
                return ['r_ratio[0]', 'r_ratio[1]'].indexOf(controlInput.option) == -1;
            });
        }

        //////////////////////////////////
        // Point size control
        //////////////////////////////////

        var pointSizeControl = controlInputs.find(function(ci) {
            return ci.label === 'Point Size';
        });

        pointSizeControl.start = settings.point_size;

        settings.point_size_options.forEach(function(d) {
            pointSizeControl.values.push(d);
        });

        //drop the pointSize control if NONE is the only option
        if (settings.point_size_options.length == 0)
            controlInputs = controlInputs.filter(function(controlInput) {
                return controlInput.label != 'Point Size';
            });

        //////////////////////////////////
        // Display control
        //////////////////////////////////

        controlInputs.find(function(controlInput) {
            return controlInput.label === 'Display Type';
        }).values = settings.display_options.map(function(m) {
            return m.label;
        });

        //////////////////////////////////
        // Add filters to inputs
        //////////////////////////////////
        if (settings.filters && settings.filters.length > 0) {
            var otherFilters = settings.filters.map(function(filter) {
                filter = {
                    type: 'subsetter',
                    value_col: filter.value_col ? filter.value_col : filter,
                    label: filter.label
                        ? filter.label
                        : filter.value_col
                        ? filter.value_col
                        : filter,
                    multiple: settings.filters_multiselect
                };
                return filter;
            });
            return d3.merge([otherFilters, controlInputs]);
        } else return controlInputs;
    }

    var configuration = {
        settings: settings,
        syncSettings: syncSettings,
        controlInputs: controlInputs,
        syncControlInputs: syncControlInputs
    };

    function checkMeasureDetails() {
        var chart = this;
        var config = this.config;
        var measures = d3
            .set(
                this.raw_data.map(function(d) {
                    return d[config.measure_col];
                })
            )
            .values()
            .sort();
        var specifiedMeasures = Object.keys(config.measure_values).map(function(e) {
            return config.measure_values[e];
        });
        var missingMeasures = [];
        Object.keys(config.measure_values).forEach(function(d) {
            if (measures.indexOf(config.measure_values[d]) == -1) {
                missingMeasures.push(config.measure_values[d]);
                delete config.measure_values[d];
            }
        });
        var nMeasuresRemoved = missingMeasures.length;
        if (nMeasuresRemoved > 0)
            console.warn(
                'The data are missing ' +
                    (nMeasuresRemoved === 1 ? 'this measure' : 'these measures') +
                    ': ' +
                    missingMeasures.join(', ') +
                    '.'
            );

        //automatically add Measures if requested
        if (config.add_measures) {
            measures.forEach(function(m, i) {
                if (specifiedMeasures.indexOf(m) == -1) {
                    config.measure_values['m' + i] = m;
                }
            });
        }

        // add measures for nrRatio and rRatio
        config.measure_values.nrRatio = 'nrRatio';
        config.measure_values.rRatio = 'rRatio';

        //check that x_options, y_options and size_options all have value keys/values in measure_values
        var valid_options = Object.keys(config.measure_values);
        var all_settings = ['x_options', 'y_options', 'point_size_options'];
        all_settings.forEach(function(setting) {
            // remove invalid options
            config[setting].forEach(function(option) {
                if (valid_options.indexOf(option) == -1) {
                    delete config[options][option];
                    console.warn(
                        option +
                            " wasn't found in the measure_values index and has been removed from config." +
                            setting +
                            '. This may cause problems with the chart.'
                    );
                }
            });

            // update the control input settings
            var controlLabel =
                setting == 'x_options'
                    ? 'X-axis Measure'
                    : setting == 'y_options'
                    ? 'Y-axis Measure'
                    : 'Point Size';
            var input = chart.controls.config.inputs.find(function(ci) {
                return ci.label == controlLabel;
            });

            if (input) {
                //only update this if the input settings exist - axis inputs with only one value are deleted
                // add options for controls requesting 'all' measures
                if (config[setting + '_all']) {
                    var point_size_options = d3.merge([['Uniform'], valid_options]);
                    config[setting] =
                        setting == 'point_size_options' ? point_size_options : valid_options;
                    input.values = config[setting];
                }
            }
        });
        //check that all measure_values have associated cuts
        Object.keys(config.measure_values).forEach(function(m) {
            // does a cut point for the measure exist? If not, create a placeholder.
            if (!config.cuts.hasOwnProperty(m)) {
                config.cuts[m] = {};
            }

            // does the cut have non-null baseline and ULN cuts associated, if not use the default values
            config.cuts[m].relative_baseline =
                config.cuts[m].relative_baseline || config.cuts.defaults.relative_baseline;
            config.cuts[m].relative_uln =
                config.cuts[m].relative_uln || config.cuts.defaults.relative_uln;
        });
    }

    function iterateOverData() {
        var _this = this;

        this.raw_data.forEach(function(d) {
            d[_this.config.x.column] = null; // placeholder variable for x-axis
            d[_this.config.y.column] = null; // placeholder variable for y-axis
            d.NONE = 'All Participants'; // placeholder variable for non-grouped comparisons

            //Remove space characters from result variable.
            if (typeof d[_this.config.value_col] == 'string')
                d[_this.config.value_col] = d[_this.config.value_col].replace(/\s/g, ''); // remove space characters
        });
    }

    function addRRatioFilter() {
        if (this.config.r_ratio_filter) {
            this.filters.push({
                col: 'rRatioFlag',
                val: 'Y',
                choices: ['Y', 'N'],
                loose: undefined
            });
        }
    }

    function imputeColumn(data, measure_column, value_column, measure, llod, imputed_value, drop) {
        //returns a data set with imputed values (or drops records) for records at or below a lower threshold for a given measure
        //data = the data set for imputation
        //measure_column = the column with the text measure names
        //value_column = the column with the numeric values to be changed via imputation
        //measure = the measure to be imputed
        //llod = the lower limit of detection - values at or below the llod are imputed
        //imputed_value = value for imputed records
        //drop = boolean flag indicating whether values at or below the llod should be dropped (default = false)

        if (drop == undefined) drop = false;
        if (drop) {
            return data.filter(function(f) {
                dropFlag = d[measure_column] == measure && +d[value_column] <= 0;
                return !dropFlag;
            });
        } else {
            data.forEach(function(d) {
                if (
                    d[measure_column] == measure &&
                    +d[value_column] < +llod &&
                    d[value_column] >= 0
                ) {
                    d.impute_flag = true;
                    d[value_column + '_original'] = d[value_column];
                    d[value_column] = imputed_value;
                }
            });

            var impute_count = d3.sum(
                data.filter(function(d) {
                    return d[measure_column] === measure;
                }),
                function(f) {
                    return f.impute_flag;
                }
            );

            if (impute_count > 0)
                console.warn(
                    '' +
                        impute_count +
                        ' value(s) less than ' +
                        llod +
                        ' were imputed to ' +
                        imputed_value +
                        ' for ' +
                        measure
                );
            return data;
        }
    }

    function imputeData() {
        var chart = this;
        var config = this.config;

        Object.keys(config.measure_values).forEach(function(measureKey) {
            var values = chart.imputed_data
                    .filter(function(f) {
                        return f[config.measure_col] == config.measure_values[measureKey];
                    })
                    .map(function(m) {
                        return +m[config.value_col];
                    })
                    .sort(function(a, b) {
                        return a - b;
                    }),
                minValue = d3.min(
                    values.filter(function(f) {
                        return f > 0;
                    })
                ),
                //minimum value > 0
                llod = null,
                imputed_value = null,
                drop = null;

            if (config.imputation_methods[measureKey] == 'data-driven') {
                llod = minValue;
                imputed_value = minValue / 2;
                drop = false;
            } else if (config.imputation_methods[measureKey] == 'user-defined') {
                llod = config.imputation_values[measureKey];
                imputed_value = config.imputation_values[measureKey] / 2;
                drop = false;
            } else if (config.imputation_methods[measureKey] == 'drop') {
                llod = null;
                imputed_value = null;
                drop = true;
            }
            chart.imputed_data = imputeColumn(
                chart.imputed_data,
                config.measure_col,
                config.value_col,
                config.measure_values[measureKey],
                llod,
                imputed_value,
                drop
            );

            var total_imputed = d3.sum(chart.raw_data, function(f) {
                return f.impute_flag ? 1 : 0;
            });
        });
    }

    function dropRows() {
        var chart = this;
        var config = this.config;
        this.dropped_rows = [];

        /////////////////////////
        // Remove invalid rows
        /////////////////////////
        var numerics = ['value_col', 'studyday_col', 'normal_col_high'];
        console.log(chart.initial_data)
        chart.imputed_data = chart.initial_data.filter(function(f) {
            return true;
        });
        numerics.forEach(function(setting) {
            chart.imputed_data = chart.imputed_data.filter(function(d) {
                //Remove non-numeric value_col
                var numericCol = /^-?(\d*\.?\d+|\d+\.?\d*)(E-?\d+)?$/.test(d[config[setting]]);
                if (!numericCol) {
                    d.dropReason = setting + ' Column ("' + config[setting] + '") is not numeric.';
                    chart.dropped_rows.push(d);
                }
                return numericCol;
            });
        });
    }

    function deriveVariables() {
        var config = this.config;

        //filter the lab data to only the required measures
        var included_measures = Object.keys(config.measure_values).map(function(e) {
            return config.measure_values[e];
        });

        var sub = this.imputed_data.filter(function(f) {
            return included_measures.indexOf(f[config.measure_col]) > -1;
        });

        var missingBaseline = 0;

        //coerce numeric values to number
        this.imputed_data = this.imputed_data.map(function(d) {
            var numerics = ['value_col', 'studyday_col', 'normal_col_low', 'normal_col_high'];
            numerics.forEach(function(col) {
                d[config[col]] = parseFloat(d[config[col]]);
            });
            return d;
        });

        //create an object mapping baseline values for id/measure pairs
        var baseline_records = sub.filter(function(f) {
            var current =
                typeof f[config.baseline.value_col] == 'string'
                    ? f[config.baseline.value_col].trim()
                    : parseFloat(f[config.baseline.value_col]);
            return config.baseline.values.indexOf(current) > -1;
        });

        var baseline_values = d3
            .nest()
            .key(function(d) {
                return d[config.id_col];
            })
            .key(function(d) {
                return d[config.measure_col];
            })
            .rollup(function(d) {
                return d[0][config.value_col];
            })
            .map(baseline_records);

        this.imputed_data = this.imputed_data.map(function(d) {
            //standardize key variables
            d.key_measure = false;
            if (included_measures.indexOf(d[config.measure_col]) > -1) {
                d.key_measure = true;

                //map the raw value to a variable called 'absolute'
                d.absolute = d[config.value_col];

                //get the value relative to the ULN (% of the upper limit of normal) for the measure
                d.uln = d[config.normal_col_high];
                d.relative_uln = d[config.value_col] / d[config.normal_col_high];

                //get value relative to baseline
                if (baseline_values[d[config.id_col]]) {
                    if (baseline_values[d[config.id_col]][d[config.measure_col]]) {
                        d.baseline_absolute =
                            baseline_values[d[config.id_col]][d[config.measure_col]];
                        d.relative_baseline = d.absolute / d.baseline_absolute;
                    } else {
                        missingBaseline = missingBaseline + 1;
                        d.baseline_absolute = null;
                        d.relative_baseline = null;
                    }
                } else {
                    missingBaseline = missingBaseline + 1;
                    d.baseline_absolute = null;
                    d.relative_baseline = null;
                }
            }
            return d;
        });

        if (config.debug & (missingBaseline > 0))
            console.warn(
                'No baseline value found for ' + missingBaseline + ' of ' + sub.length + ' records.'
            );
    }

    function makeAnalysisFlag() {
        var config = this.config;
        this.imputed_data = this.imputed_data.map(function(d) {
            var hasAnalysisSetting =
                config.analysisFlag.value_col != null && config.analysisFlag.values.length > 0;
            d.analysisFlag = hasAnalysisSetting
                ? config.analysisFlag.values.indexOf(d[config.analysisFlag.value_col]) > -1
                : true;
            return d;
        });
    }

    function makePaltFlag() {
        var config = this.config;
        this.imputed_data = this.imputed_data.map(function(d) {
            var hasPaltSetting =
                config.paltFlag.value_col != null && config.paltFlag.values.length > 0;
            d.paltFlag = hasPaltSetting
                ? config.paltFlag.values.indexOf(d[config.paltFlag.value_col]) > -1
                : true;
            return d;
        });
    }

    function makeRRatio() {
        var chart = this;
        var config = this.config;
        //adds rows for rRatio and nrRatio to this.imputed_data

        var rRatio = d3
            .nest()
            .key(function(f) {
                return (
                    f[config.id_col] + '::' + f[config.studyday_col] + '::' + f[config.visitn_col]
                );
            })
            .rollup(function(d) {
                //get ALT, AST and ALP for each visit
                var alt_data = d.find(function(f) {
                    return f[config.measure_col] == config.measure_values.ALT;
                });
                var alt = alt_data ? alt_data.relative_uln : null;
                var alt_relative_baseline = alt_data ? alt_data.relative_baseline : null;

                var alp_data = d.find(function(f) {
                    return f[config.measure_col] == config.measure_values.ALP;
                });
                var alp = alp_data ? alp_data.relative_uln : null;
                var alp_relative_baseline = alp_data ? alp_data.relative_baseline : null;

                var rratio = alt === null || alp === null ? null : alt / alp;
                var rratio_relative_baseline =
                    alt_relative_baseline === null || alp_relative_baseline === null
                        ? null
                        : alt_relative_baseline / alp_relative_baseline;

                //create object to return - keep the demographics, etc. overwrite measure-specific variables
                var obj = {};
                obj[config.id_col] = d[0][config.id_col];
                obj[config.studyday_col] = d[0][config.studyday_col];
                obj.analysisFlag = d[0].analysisFlag;
                obj.key_measure = true;

                obj[config.measure_col] = 'rRatio';
                obj[config.value_col] = rratio;
                obj[config.normal_col_low] = null;
                obj[config.normal_col_high] = null;
                obj.uln = null;

                obj.absolute = rratio; // NOTE: absolute doesn't really make sense, but this hack lets us use the relative values in visit-level plot.
                obj.relative_uln = rratio;
                obj.relative_baseline = rratio_relative_baseline;
                // note that the baseline calculation uses raw values and doesn't account for changes in ULN over the course of the study.
                return obj;
            })
            .entries(chart.imputed_data)
            .map(function(m) {
                return m.values;
            })
            .filter(function(f) {
                return f.absolute || f.relative_baseline;
            });

        console.log(rRatio);

        var nrRatio = d3
            .nest()
            .key(function(f) {
                return (
                    f[config.id_col] + '::' + f[config.studyday_col] + '::' + f[config.visitn_col]
                );
            })
            .rollup(function(d) {
                //get ALT, AST and ALP for each visit
                var alt_data = d.find(function(f) {
                    return f[config.measure_col] == config.measure_values.ALT;
                });
                var alt = alt_data ? alt_data.relative_uln : null;
                var alt_relative_baseline = alt_data ? alt_data.relative_baseline : null;

                var alp_data = d.find(function(f) {
                    return f[config.measure_col] == config.measure_values.ALP;
                });
                var alp = alp_data ? alp_data.relative_uln : null;
                var alp_relative_baseline = alp_data ? alp_data.relative_baseline : null;

                var ast_data = d.find(function(f) {
                    return f[config.measure_col] == config.measure_values.AST;
                });
                var ast = ast_data ? ast_data.relative_uln : null;
                var ast_relative_baseline = ast_data ? ast_data.relative_baseline : null;

                var nrratio =
                    Math.max(alt, ast) == null || alp == null ? null : Math.max(alt, ast) / alp;
                var nrratio_relative_baseline =
                    Math.max(alt_relative_baseline, ast_relative_baseline) == null ||
                    alp_relative_baseline == null
                        ? null
                        : Math.max(alt_relative_baseline, ast_relative_baseline) /
                          alp_relative_baseline;

                //create object to return - keep the demographics, etc. overwrite measure-specific variables

                var obj = {};
                obj.raw = d;
                obj[config.id_col] = d[0][config.id_col];
                obj[config.studyday_col] = d[0][config.studyday_col];
                obj.analysisFlag = d[0].analysisFlag;
                obj.key_measure = true;

                obj[config.measure_col] = 'nrRatio';
                obj[config.value_col] = nrratio;
                obj[config.normal_col_low] = null;
                obj[config.normal_col_high] = null;
                obj.uln = null;

                obj.absolute = nrratio; // NOTE: absolute doesn't really make sense, but this hack lets us use the relative values in visit-level plot.
                obj.relative_uln = nrratio;
                obj.relative_baseline = nrratio_relative_baseline;
                // note that the baseline calculation uses raw values and doesn't account for changes in ULN over the course of the study.
                return obj;
            })
            .entries(chart.imputed_data)
            .map(function(m) {
                return m.values;
            })
            .filter(function(f) {
                return f.absolute || f.relative_baseline;
            });
        console.log(nrRatio);

        this.imputed_data = d3.merge([this.imputed_data, rRatio, nrRatio]);
        console.log(this.imputed_data);
    }

    function cleanData() {
        //drop rows with invalid data
        this.imputedData = dropRows.call(this);

        this.imputed_data.forEach(function(d) {
            d.impute_flag = false;
        });

        imputeData.call(this);
        deriveVariables.call(this);
        makeAnalysisFlag.call(this);
        makePaltFlag.call(this);
        makeRRatio.call(this);
    }

    function initCustomEvents() {
        var chart = this;
        chart.participantsSelected = [];
        chart.events.participantsSelected = new CustomEvent('participantsSelected');
    }

    function onInit() {
        checkMeasureDetails.call(this);
        iterateOverData.call(this);
        addRRatioFilter.call(this);
        cleanData.call(this); //clean visit-level data - imputation and variable derivations
        initCustomEvents.call(this);
    }

    function formatRRatioControl() {
        var chart = this;
        var config = this.config;
        if (this.config.r_ratio_filter) {
            var min_r_ratio = this.controls.wrap.selectAll('.control-group').filter(function(d) {
                return d.option === 'r_ratio[0]';
            });
            var min_r_ratio_input = min_r_ratio.select('input');

            var max_r_ratio = this.controls.wrap.selectAll('.control-group').filter(function(d) {
                return d.option === 'r_ratio[1]';
            });
            var max_r_ratio_input = max_r_ratio.select('input');

            min_r_ratio_input.attr('id', 'r_ratio_min');
            max_r_ratio_input.attr('id', 'r_ratio_max');

            //move the max r ratio control next to the min control
            min_r_ratio.append('span').text(' - ');
            min_r_ratio.append(function() {
                return max_r_ratio_input.node();
            });

            max_r_ratio.remove();

            //add a reset button
            min_r_ratio
                .append('button')
                .style('padding', '0.2em 0.5em 0.2em 0.4em')
                .style('margin-left', '0.5em')
                .style('border-radius', '0.4em')
                .text('Reset')
                .on('click', function() {
                    config.r_ratio[0] = 0;
                    min_r_ratio.select('input#r_ratio_min').property('value', config.r_ratio[0]);
                    config.r_ratio[1] = config.max_r_ratio;
                    min_r_ratio.select('input#r_ratio_max').property('value', config.r_ratio[1]);
                    chart.draw();
                });
        }
    }

    function updateSummaryTable() {
        var chart = this;
        var config = chart.config;
        var quadrants = this.config.quadrants;
        var rows = quadrants.table.rows;
        var cells = quadrants.table.cells;

        function updateCells(d) {
            var cellData = cells.map(function(cell) {
                cell.value = d[cell.value_col];
                return cell;
            });
            var row_cells = d3
                .select(this)
                .selectAll('td')
                .data(cellData, function(d) {
                    return d.value_col;
                });

            row_cells
                .enter()
                .append('td')
                .style('text-align', function(d, i) {
                    return d.label != 'Quadrant' ? 'center' : null;
                })
                .style('font-size', '0.9em')
                .style('padding', '0 0.5em 0 0.5em');

            row_cells.html(function(d) {
                return d.value;
            });
        }

        //make sure the table is visible
        this.config.quadrants.table.wrap.style('display', null);
        //update the content of each row
        rows.data(quadrants, function(d) {
            return d.label;
        });
        rows.each(updateCells);
    }

    function initSummaryTable() {
        var chart = this;
        var config = chart.config;
        var quadrants = this.config.quadrants;

        quadrants.table = {};
        quadrants.table.wrap = this.wrap
            .append('div')
            .attr('class', 'quadrantTable')
            .style('padding-top', '1em');
        quadrants.table.tab = quadrants.table.wrap
            .append('table')
            .style('border-collapse', 'collapse');

        //table header
        quadrants.table.cells = [
            {
                value_col: 'label',
                label: 'Quadrant'
            },
            {
                value_col: 'count',
                label: '#'
            },
            {
                value_col: 'percent',
                label: '%'
            }
        ];

        if (config.populationProfileURL) {
            quadrants.forEach(function(d) {
                d.link = "<a href='" + config.populationProfileURL + "'>&#128279</a>";
            });
            quadrants.table.cells.push({
                value_col: 'link',
                label: 'Population Profile'
            });
        }
        quadrants.table.thead = quadrants.table.tab
            .append('thead')
            .style('border-top', '2px solid #999')
            .style('border-bottom', '2px solid #999')
            .append('tr')
            .style('padding', '0.1em');

        quadrants.table.thead
            .selectAll('th')
            .data(quadrants.table.cells)
            .enter()
            .append('th')
            .html(function(d) {
                return d.label;
            });

        //table contents
        quadrants.table.tbody = quadrants.table.tab
            .append('tbody')
            .style('border-bottom', '2px solid #999');
        quadrants.table.rows = quadrants.table.tbody
            .selectAll('tr')
            .data(quadrants, function(d) {
                return d.label;
            })
            .enter()
            .append('tr')
            .style('padding', '0.1em');

        //initial table update
        updateSummaryTable.call(this);
    }

    function init() {
        var chart = this;
        var config = chart.config;
        var quadrants = this.config.quadrants;

        var x_input = chart.controls.wrap
            .selectAll('div.control-group')
            .filter(function(f) {
                return f.description == 'X-axis Reference Line';
            })
            .select('input');

        var y_input = chart.controls.wrap
            .selectAll('div.control-group')
            .filter(function(f) {
                return f.description == 'Y-axis Reference Line';
            })
            .select('input');

        ///////////////////////////////////////////////////////////
        // set initial values
        //////////////////////////////////////////////////////////
        x_input.node().value = config.cuts[config.x.column][config.display];
        y_input.node().value = config.cuts[config.y.column][config.display];

        ///////////////////////////////////////////////////////////
        // set control step to 0.1
        //////////////////////////////////////////////////////////
        x_input.attr('step', 0.1);
        y_input.attr('step', 0.1);

        ///////////////////////////////////////////////////////////
        // initialize the summary table
        //////////////////////////////////////////////////////////
        initSummaryTable.call(chart);
    }

    function layoutQuadrantLabels() {
        var chart = this;
        var config = chart.config;
        var quadrants = this.config.quadrants;

        //////////////////////////////////////////////////////////
        //layout the quadrant labels
        /////////////////////////////////////////////////////////

        chart.quadrant_labels = {};
        chart.quadrant_labels.g = this.svg.append('g').attr('class', 'quadrant-labels');

        chart.quadrant_labels.text = chart.quadrant_labels.g
            .selectAll('text.quadrant-label')
            .data(quadrants)
            .enter()
            .append('text')
            .attr('class', function(d) {
                return 'quadrant-label ' + d.position;
            })
            .attr('dy', function(d) {
                return d.position.search('lower') > -1 ? '-.2em' : '.5em';
            })
            .attr('dx', function(d) {
                return d.position.search('right') > -1 ? '-.5em' : '.5em';
            })
            .attr('text-anchor', function(d) {
                return d.position.search('right') > 0 ? 'end' : null;
            })
            .attr('fill', '#bbb')
            .text(function(d) {
                return d.label;
            });
    }

    function layoutCutLines() {
        var chart = this;
        var config = chart.config;
        var quadrants = this.config.quadrants;

        //////////////////////////////////////////////////////////
        //layout the cut lines
        /////////////////////////////////////////////////////////
        chart.cut_lines = {};
        chart.cut_lines.wrap = this.svg.append('g').attr('class', 'cut-lines');
        var wrap = chart.cut_lines.wrap;

        //slight hack to make life easier on drag
        var cutLineData = [{ dimension: 'x' }, { dimension: 'y' }];

        cutLineData.forEach(function(d) {
            d.chart = chart;
        });

        chart.cut_lines.g = wrap
            .selectAll('g.cut')
            .data(cutLineData)
            .enter()
            .append('g')
            .attr('class', function(d) {
                return 'cut ' + d.dimension;
            });

        chart.cut_lines.lines = chart.cut_lines.g
            .append('line')
            .attr('class', 'cut-line')
            .attr('stroke-dasharray', '5,5')
            .attr('stroke', '#bbb');

        chart.cut_lines.backing = chart.cut_lines.g
            .append('line')
            .attr('class', 'cut-line-backing')
            .attr('stroke', 'transparent')
            .attr('stroke-width', '10')
            .attr('cursor', 'move');
    }

    function initQuadrants() {
        init.call(this);
        layoutCutLines.call(this);
        layoutQuadrantLabels.call(this);
    }

    function initRugs() {
        //initialize a 'rug' on each axis to show the distribution for a participant on addPointMouseover
        this.x_rug = this.svg.append('g').attr('class', 'rug x');
        this.y_rug = this.svg.append('g').attr('class', 'rug y');
    }

    function initVisitPath() {
        //initialize a 'rug' on each axis to show the distribution for a participant on addPointMouseover
        this.visitPath = this.svg.append('g').attr('class', 'visit-path');
    }

    function initParticipantDetails() {
        //layout participant details section
        this.participantDetails = {};
        this.participantDetails.wrap = this.wrap.append('div').attr('class', 'participantDetails');

        this.participantDetails.header = this.participantDetails.wrap
            .append('div')
            .attr('class', 'participantHeader');

        //layout spaghettiPlot
        var splot = this.participantDetails.wrap.append('div').attr('class', 'spaghettiPlot');
        splot
            .append('h3')
            .attr('class', 'id')
            .html('Standardized Lab Values by Study Day')
            .style('border-top', '2px solid black')
            .style('border-bottom', '2px solid black')
            .style('padding', '.2em');

        splot.append('div').attr('class', 'chart');

        //layout rRatio plot
        var rrplot = this.participantDetails.wrap.append('div').attr('class', 'rrPlot');
        rrplot
            .append('h3')
            .attr('class', 'id')
            .html('R Ratio by Study Day')
            .style('border-top', '2px solid black')
            .style('border-bottom', '2px solid black')
            .style('padding', '.2em');

        rrplot.append('div').attr('class', 'chart');

        //layout measure table
        var mtable = this.participantDetails.wrap.append('div').attr('class', 'measureTable');
        mtable
            .append('h3')
            .attr('class', 'id')
            .html('Raw Lab Values Summary Table')
            .style('border-top', '2px solid black')
            .style('border-bottom', '2px solid black')
            .style('padding', '.2em');

        //initialize the measureTable
        var settings = {
            cols: ['key', 'n', 'min', 'median', 'max', 'spark'],
            headers: ['Measure', 'N', 'Min', 'Median', 'Max', ''],
            searchable: false,
            sortable: false,
            pagination: false,
            exportable: false,
            applyCSS: true
        };
        this.measureTable = webcharts.createTable(
            this.element + ' .participantDetails .measureTable',
            settings
        );
        this.measureTable.init([]);

        //hide the section until needed
        this.participantDetails.wrap.selectAll('*').style('display', 'none');
    }

    function initResetButton() {
        var chart = this;

        this.controls.reset = {};
        var reset = this.controls.reset;
        reset.wrap = this.controls.wrap.append('div').attr('class', 'control-group');
        reset.label = reset.wrap
            .append('span')
            .attr('class', 'wc-control-label')
            .text('Reset Chart');
        reset.button = reset.wrap
            .append('button')
            .text('Reset')
            .on('click', function() {
                var initial_container = chart.element;
                var initial_settings = chart.initial_settings;
                var initial_data = chart.initial_data;
                chart.emptyChartWarning.remove();

                chart.destroy();
                chart = null;

                var newChart = hepexplorer(initial_container, initial_settings);
                newChart.init(initial_data);
            });
    }

    function initDisplayControl() {
        var chart = this;
        var config = this.config;
        var displayControlWrap = this.controls.wrap.selectAll('div').filter(function(controlInput) {
            return controlInput.label === 'Display Type';
        });

        var displayControl = displayControlWrap.select('select');

        //set the start value
        var start_value = config.display_options.find(function(f) {
            return f.value == config.display;
        }).label;
        displayControl.selectAll('option').attr('selected', function(d) {
            return d == start_value ? 'selected' : null;
        });

        //annotation of baseline visit (only visible when mDish is selected)
        displayControlWrap
            .append('span')
            .attr('class', 'displayControlAnnotation span-description')
            .style('color', 'blue')
            .text(
                'Note: Baseline defined as ' +
                    chart.config.baseline.value_col +
                    ' = ' +
                    chart.config.baseline.values.join(',')
            )
            .style('display', config.display == 'relative_baseline' ? null : 'none');

        displayControl.on('change', function(d) {
            var currentLabel = this.value;
            var currentValue = config.display_options.find(function(f) {
                return f.label == currentLabel;
            }).value;
            config.display = currentValue;

            if (currentValue == 'relative_baseline') {
                displayControlWrap.select('span.displayControlAnnotation').style('display', null);
            } else {
                displayControlWrap.select('span.displayControlAnnotation').style('display', 'none');
            }

            config.cuts.display_change = true;

            chart.draw();
        });
    }

    function layoutPanels() {
        this.wrap.style('display', 'inline-block').style('width', '75%');

        this.controls.wrap
            .style('display', 'inline-block')
            .style('width', '25%')
            .style('vertical-align', 'top');

        this.controls.wrap.selectAll('div.control-group').style('display', 'block');
        this.controls.wrap
            .selectAll('div.control-group')
            .select('select')
            .style('width', '200px');
    }

    function initTitle() {
        this.titleDiv = this.controls.wrap
            .insert('div', '*')
            .attr('class', 'title')
            .style('margin-right', '1em')
            .style('margin-bottom', '1em');

        this.titleDiv
            .append('span')
            .text(this.config.title)
            .style('font-size', '1.5em')
            .style('font-weight', 'strong')
            .style('display', 'block');
    }

    function add(messageText, type, label, messages, callback) {
        var messageObj = {
            id: messages.list.length + 1,
            type: type,
            message: messageText,
            label: label,
            hidden: false,
            callback: callback
        };
        messages.list.push(messageObj);
        messages.update(messages);
    }

    function remove(id, label, messages) {
        // hide the the message(s) by id or label
        if (id) {
            var matches = messages.list.filter(function(f) {
                return +f.id == +id;
            });
        } else if (label.length) {
            var matches = messages.list.filter(function(f) {
                return label == 'all' ? true : f.label == label;
            });
        }
        matches.forEach(function(d) {
            d.hidden = true;
        });
        messages.update(messages);
    }

    function update(messages) {
        function jsUcfirst(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        var visibleMessages = messages.list.filter(function(f) {
            return f.hidden == false;
        });

        //update title
        messages.header.title.text('Messages (' + visibleMessages.length + ')');

        //
        var messageDivs = messages.wrap.selectAll('div.message').data(visibleMessages, function(d) {
            return d.id;
        });

        var newMessages = messageDivs
            .enter()
            .append('div')
            .attr('class', function(d) {
                return d.type + ' message ' + d.label;
            })
            .html(function(d) {
                var messageText = '<strong>' + jsUcfirst(d.type) + '</strong>: ' + d.message;
                return messageText.split('.')[0] + '.';
            })
            .style('border-radius', '.5em')
            .style('margin-right', '1em')
            .style('margin-bottom', '0.5em')
            .style('padding', '0.2em')
            .style('font-size', '0.9em');

        newMessages
            .append('div.expand')
            .html('•••')
            .style('background', 'white')
            .style('display', 'inline-block')
            .style('border', '1px solid #999')
            .style('padding', '0 0.2em')
            .style('margin-left', '0.3em')
            .style('font-size', '0.4em')
            .style('border-radius', '0.6em')
            .style('cursor', 'pointer')
            .on('click', function(d) {
                d3.select(this.parentNode)
                    .html(function(d) {
                        return '<strong>' + jsUcfirst(d.type) + '</strong>: ' + d.message;
                    })
                    .each(function(d) {
                        if (d.callback) {
                            d.callback.call(this.parentNode);
                        }
                    });
            });

        messageDivs.each(function(d) {
            var type = d.type;
            var thisMessage = d3.select(this);
            if (type == 'caution') {
                thisMessage
                    .style('border', '1px solid #faebcc')
                    .style('color', '#8a6d3b')
                    .style('background-color', '#fcf8e3');
            } else if (type == 'warning') {
                thisMessage
                    .style('border', '1px solid #ebccd1')
                    .style('color', '#a94442')
                    .style('background-color', '#f2dede');
            } else {
                thisMessage
                    .style('border', '1px solid #999')
                    .style('color', '#999')
                    .style('background-color', null);
            }

            if (d.callback) {
                d.callback.call(this);
            }
        });

        messageDivs.exit().remove();
    }

    function init$1() {
        var chart = this;
        this.messages = {
            add: add,
            remove: remove,
            update: update
        };
        //  this.messages.add = addMessage;
        //  this.messages.remove = removeMessage;
        this.messages.list = [];
        this.messages.wrap = this.controls.wrap.insert('div', '*').style('margin', '0 1em 1em 0');
        this.messages.header = this.messages.wrap
            .append('div')
            .style('border-top', '1px solid black')
            .style('border-bottom', '1px solid black')
            .style('font-weight', 'strong')
            .style('margin', '0 1em 1em 0');

        this.messages.header.title = this.messages.header
            .append('div')
            .attr('class', 'title')
            .style('display', 'inline-block')
            .text('Messages (0)');

        this.messages.header.clear = this.messages.header
            .append('div')
            .text('Clear')
            .style('font-size', '0.8em')
            .style('vertical-align', 'center')
            .style('display', 'inline-block')
            .style('float', 'right')
            .style('color', 'blue')
            .style('cursor', 'pointer')
            .style('text-decoration', 'underline')
            .on('click', function() {
                chart.messages.remove(null, 'all', chart.messages);
            });
    }

    function initCustomWarning() {
        if (this.config.warningText) {
            this.messages.add(
                this.config.warningText,
                'caution',
                'validationCaution',
                this.messages
            );
        }
    }

    function downloadCSV(data, cols, file) {
        var CSVarray = [];

        //add headers to CSV array
        var cols = cols ? cols : Object.keys(data[0]);
        var headers = cols.map(function(header) {
            return '"' + header.replace(/"/g, '""') + '"';
        });
        CSVarray.push(headers);
        //add rows to CSV array
        data.forEach(function(d, i) {
            var row = cols.map(function(col) {
                var value = d[col];

                if (typeof value === 'string') value = value.replace(/"/g, '""');

                return '"' + value + '"';
            });

            CSVarray.push(row);
        });

        //transform blob array into a blob of characters
        var blob = new Blob([CSVarray.join('\n')], {
            type: 'text/csv;charset=utf-8;'
        });
        var fileCore = file ? file : 'eDish';
        var fileName = fileCore + '_' + d3.time.format('%Y-%m-%dT%H-%M-%S')(new Date()) + '.csv';
        var link = d3.select(this);

        if (navigator.msSaveBlob)
            //IE
            navigator.msSaveBlob(blob, fileName);
        else if (link.node().download !== undefined) {
            //21st century browsers
            var url = URL.createObjectURL(blob);
            link.node().setAttribute('href', url);
            link.node().setAttribute('download', fileName);
        }
    }

    function initDroppedRowsWarning() {
        var chart = this;
        if (this.dropped_rows.length > 0) {
            var warningText =
                this.dropped_rows.length +
                ' rows were removed. This is probably because of non-numeric or missing data provided for key variables. Click <a class="rowDownload">here</a> to download a csv with a brief explanation of why each row was removed.';

            this.messages.add(warningText, 'caution', 'droppedRows', this.messages, function() {
                //custom callback to activate the droppedRows download
                d3.select(this)
                    .select('a.rowDownload')
                    .style('color', 'blue')
                    .style('text-decoration', 'underline')
                    .style('cursor', 'pointer')
                    .datum(chart.dropped_rows)
                    .on('click', function(d) {
                        var systemVars = d3.merge([
                            ['dropReason', 'NONE'],
                            Object.keys(chart.config.measure_values)
                        ]);
                        var cols = d3.merge([
                            ['dropReason'],
                            Object.keys(d[0]).filter(function(f) {
                                return systemVars.indexOf(f) == -1;
                            })
                        ]);
                        downloadCSV.call(this, d, cols, 'eDishDroppedRows');
                    });
            });
        }
    }

    function initControlLabels() {
        var config = this.config;

        //Add settings label
        var first_setting = this.controls.wrap
            .selectAll('div.control-group')
            .filter(function(f) {
                return f.type != 'subsetter';
            })
            .filter(function(f) {
                return f.option != 'r_ratio[0]';
            })
            .filter(function(f, i) {
                return i == 0;
            })
            .attr('class', 'first-setting');

        this.controls.setting_header = this.controls.wrap
            .insert('div', '.first-setting')
            .attr('class', 'subtitle')
            .style('border-top', '1px solid black')
            .style('border-bottom', '1px solid black')
            .style('margin-right', '1em')
            .style('margin-bottom', '1em');

        this.controls.setting_header
            .append('span')
            .text('Settings')
            .style('font-weight', 'strong')
            .style('display', 'block');

        //Add filter label if at least 1 filter exists
        if (config.r_ratio_filter || config.filters.length > 0) {
            //insert a header before the first filter
            var control_wraps = this.controls.wrap
                .selectAll('div')
                .filter(function(controlInput) {
                    return (
                        controlInput.label === 'R Ratio Range' || controlInput.type === 'subsetter'
                    );
                })
                .classed('subsetter', true);

            this.controls.filter_header = this.controls.wrap
                .insert('div', 'div.subsetter')
                .attr('class', 'subtitle')
                .style('border-top', '1px solid black')
                .style('border-bottom', '1px solid black')
                .style('margin-right', '1em')
                .style('margin-bottom', '1em');
            this.controls.filter_header
                .append('span')
                .text('Filters')
                .style('font-weight', 'strong')
                .style('display', 'block');
            var population = d3
                .set(
                    this.initial_data.map(function(m) {
                        return m[config.id_col];
                    })
                )
                .values().length;
            this.controls.filter_header
                .append('span')
                .attr('class', 'popCount')
                .html(
                    '<span class="numerator">' +
                        population +
                        '</span> of <span class="denominator">' +
                        population +
                        '</span> participants shown.'
                )
                .style('font-size', '0.8em');

            this.controls.filter_numerator = this.controls.filter_header
                .select('span.popCount')
                .select('span.numerator');
            this.controls.filter_denominator = this.controls.filter_header
                .select('span.popCount')
                .select('span.denominator');
        }
    }

    function addFootnote() {
        this.footnote = this.wrap
            .append('div')
            .attr('class', 'footnote')
            .text('Use controls to update chart or click a point to see participant details.')
            .style('font-size', '0.7em')
            .style('padding-top', '0.1em');
        this.footnote.timing = this.footnote.append('p');
    }

    function addDownloadButton() {
        var chart = this;
        var config = this.config;
        if (config.downloadLink) {
            this.titleDiv
                .select('span')
                .append('a')
                .attr('class', 'downloadRaw')
                .html('&#x2193; Raw Data')
                .attr('title', 'Download Raw Data')
                .style('font-size', '.5em')
                .style('margin-left', '1em')
                .style('border', '1px solid black')
                .style('border-radius', '2px')
                .style('padding', '2px 4px')
                .style('text-align', 'center')
                .style('display', 'inline-block')
                .style('cursor', 'pointer')
                .style('font-weight', 'bold')
                .datum(chart.initial_data)
                .on('click', function(d) {
                    var systemVars = [
                        'dropReason',
                        'NONE',
                        'ALT',
                        'TB',
                        'impute_flag',
                        'key_measure',
                        'analysisFlag'
                    ];
                    var cols = Object.keys(d[0]).filter(function(f) {
                        return systemVars.indexOf(f) == -1;
                    });
                    downloadCSV.call(this, d, cols, 'eDishRawData');
                });
        }
    }

    function initEmptyChartWarning() {
        this.emptyChartWarning = d3
            .select(this.element)
            .append('span')
            .text('No data selected. Try updating your settings or resetting the chart. ')
            .style('display', 'none')
            .style('color', '#a94442')
            .style('background-color', '#f2dede')
            .style('border', '1px solid #ebccd1')
            .style('padding', '0.5em')
            .style('margin', '0 2% 12px 2%')
            .style('border-radius', '0.2em');
    }

    function relabelMeasureControls() {
        var chart = this;
        var config = this.config;
        var controlLabels = ['X-axis Measure', 'Y-axis Measure', 'Point Size'];
        var controlWraps = chart.controls.wrap.selectAll('div').filter(function(controlInput) {
            return controlLabels.indexOf(controlInput.label) > -1;
        });
        var controls = controlWraps.select('select');
        var options = controls.selectAll('option');
        var allKeys = Object.keys(config.measure_values);
        options
            .text(function(d) {
                return allKeys.indexOf(d) > -1 ? config.measure_values[d] : d;
            })
            .property('value', function(d) {
                return d;
            });
    }

    function stopAnimation() {
        var chart = this;
        chart.svg
            .transition()
            .duration(0)
            .each('end', function() {
                chart.controls.studyDayPlayButton.datum({ state: 'play' });
                chart.controls.studyDayPlayButton.html('&#9658;');
                chart.draw();
            });
    }

    function customizePlotStyleToggle() {
        var chart = this;
        this.controls.wrap
            .selectAll('.control-group')
            .filter(function(d) {
                return d.option === 'plot_max_values';
            })
            .selectAll('input')
            .on('change', function(d) {
                chart.config.plot_max_values = d;
                stopAnimation.call(chart);
            });
    }

    function startAnimation() {
        var chart = this;
        var config = this.config;

        // calculate animation duration
        var day_count = chart.controls.studyDayRange[1] - config.plot_day;
        var duration = day_count < 100 ? day_count * 100 : 30000;
        var day_duration = duration / day_count;

        var base_size = config.marks[0].radius || config.flex_point_size;
        var small_size = base_size / 2;

        function reposition(point) {
            point
                .transition()
                .duration(day_duration)
                .attr('cx', function(d) {
                    return chart.x(d[config.x.column]);
                })
                .attr('cy', function(d) {
                    return chart.y(d[config.y.column]);
                })
                .attr('r', function(d) {
                    if (d.outOfRange) {
                        return small_size;
                    } else if (config.point_size == 'Uniform') {
                        return base_size;
                    } else {
                        return chart.sizeScale(d[config.point_size]);
                    }
                })
                .attr('fill-opacity', function(d) {
                    return config.plot_day < d.day_range[0] ? 0 : 0.5;
                });
        }

        function updateDatum(d, currentDay) {
            // adds temporary x, y and size (if any) measures for the current day to the core datum (instead of under d.value)
            // these get removed when the transition ends and chart.draw() is called.
            var measures = [config.x.column, config.y.column];
            if (config.point_size != 'Uniform') {
                measures = d3.merge([measures, [config.point_size]]);
            }

            var raw = d.values.raw[0];
            d.outOfRange = false;
            d.day_range = raw.day_range;
            d.moved = false;
            measures.forEach(function(m) {
                var vals = raw[m + '_raw'];
                // capture the previous point position
                d[m + '_prev'] = d[m];

                // Did currentDay occur while participant was enrolled?
                if (vals && vals.length) {
                    // && [config.x.column, config.y.column].includes(m)) { // out-of-range should be calculated study day of with x- and y-axis measures
                    var first = vals[0];
                    var last = vals[vals.length - 1];
                    var before = currentDay < first.day;
                    var after = currentDay > last.day;
                    d.outOfRange = d.outOfRange || before || after;
                }

                //Get the most recent data point (or the first point if participant isn't enrolled yet)
                var getLastMeasureIndex = d3.bisector(function(d) {
                    return d.day;
                }).right;
                var lastMeasureIndexPlusOne = vals ? getLastMeasureIndex(vals, currentDay) : 0;
                var lastMeasureIndex = lastMeasureIndexPlusOne - 1;

                d[m] =
                    lastMeasureIndex >= 0
                        ? vals[lastMeasureIndex]['value']
                        : vals && vals.length
                        ? vals[0].value
                        : null;

                d[m + '_length'] = d[m] - d[m + '_prev'];
                if (d[m + '_length']) {
                    d.moved = true;
                }
            });
            return d;
        }

        function showDay(currentDay) {
            //update the controls
            config.plot_day = Math.floor(currentDay);
            chart.controls.studyDayInput.node().value = config.plot_day;

            //update the label
            chart.controls.studyDayControlWrap
                .select('span.wc-control-label')
                .html('Showing data from: <strong>Day ' + config.plot_day + '</strong>')
                .select('strong')
                .style('color', 'blue');

            //reposition the points
            var marks = chart.marks[0];

            var groups = marks.groups.datum(function(d) {
                return updateDatum(d, config.plot_day);
            });

            var points = groups.select('circle').each(function(d) {
                if (d.moved) d3.select(this).call(reposition);
            });

            //draw trails
            var tails = groups
                .filter(function(d) {
                    return d.moved;
                })
                .insert('line', ':first-child')
                //static attributes
                .attr('x1', function(d) {
                    return chart.x(d[config.x.column + '_prev']);
                })
                .attr('y1', function(d) {
                    return chart.y(d[config.y.column + '_prev']);
                })
                .attr('stroke', function(d) {
                    return chart.colorScale(d.values.raw[0][config.color_by]);
                })
                //.attr('stroke', '#999')

                //transitional attributes
                .attr('x2', function(d) {
                    return chart.x(d[config.x.column + '_prev']);
                })
                .attr('y2', function(d) {
                    return chart.y(d[config.y.column + '_prev']);
                })
                .attr('stroke-width', base_size);
            tails.each(function(d) {
                var path = d3.select(this);
                var transition1 = path
                    .transition()
                    .duration(day_duration)
                    .ease('linear')
                    .attr('x2', function(d) {
                        return chart.x(d[config.x.column]);
                    })
                    .attr('y2', function(d) {
                        return chart.y(d[config.y.column]);
                    });
                var transition2 = transition1
                    .transition()
                    .duration(day_duration * 10)
                    .attr('stroke-width', '0px');
            });
        }

        function tweenStudyDay() {
            var min = config.plot_day;
            var max = chart.controls.studyDayRange[1];
            var studyday = d3.interpolateNumber(min, max);

            return function(t) {
                showDay(studyday(t));
            };
        }

        //draw the chart to clear details view
        chart.draw();

        //hide quadrant info during startAnimation
        chart.config.quadrants.table.wrap.style('display', 'none');
        chart.quadrant_labels.g.attr('display', 'none');

        //show the stop button
        chart.controls.studyDayPlayButton.datum({ state: 'stop' });
        chart.controls.studyDayPlayButton.html('&#9632;');

        // Initialize the Transition
        chart.myTransition = chart.svg
            .transition()
            .duration(duration)
            .ease('linear')
            .tween('studyday', tweenStudyDay)
            .each('end', function() {
                chart.draw();
            });
    }

    // &#9658; = play symbol
    // &#9632; = stop symbol
    // &#8634; = restart symbol

    function initPlayButton() {
        var chart = this;
        var config = this.config;
        chart.controls.studyDayPlayButton = chart.controls.studyDayControlWrap
            .append('button')
            .datum({ state: 'play' })
            .html('&#9658;') //play symbol
            .style('padding', '0.2em 0.5em 0.2em 0.5em')
            .style('margin-left', '0.5em')
            .style('border-radius', '0.4em')
            //.style('display', 'none')
            .on('click', function(d) {
                var button = d3.select(this);
                if (d.state === 'play') {
                    startAnimation.call(chart);
                } else if (d.state === 'restart') {
                    config.plot_day =
                        chart.controls.studyDayRange[0] > 0 ? chart.controls.studyDayRange[0] : 0;
                    chart.controls.studyDayInput.node().value = config.plot_day;
                    chart.draw();

                    startAnimation.call(chart);
                } else {
                    stopAnimation.call(chart);
                }
            });
    }

    function initStudyDayControl() {
        var chart = this;
        var config = this.config;

        // Move the study day control beneath the chart
        chart.controls.secondary = chart.wrap
            .insert('div', 'div.footnote')
            .attr('class', 'wc-controls secondary-controls');

        var removed = chart.controls.wrap
            .selectAll('div')
            .filter(function(controlInput) {
                return controlInput.label === 'Study Day';
            })
            .remove();

        chart.controls.studyDayControlWrap = chart.controls.secondary.append(function() {
            return removed.node();
        });

        //convert control to a slider
        chart.controls.studyDayInput = chart.controls.studyDayControlWrap.select('input');
        chart.controls.studyDayInput.attr('type', 'range');

        //set min and max values and add annotations
        chart.controls.studyDayRange = d3.extent(
            chart.imputed_data.filter(function(f) {
                return f.key_measure;
            }),
            function(d) {
                return d[config.studyday_col];
            }
        );
        chart.controls.studyDayInput.attr('min', chart.controls.studyDayRange[0]);
        chart.controls.studyDayInput.attr('max', chart.controls.studyDayRange[1]);

        chart.controls.studyDayControlWrap
            .insert('span', 'input')
            .attr('class', 'span-description')
            .style('display', 'inline-block')
            .style('padding-right', '0.2em')
            .text(chart.controls.studyDayRange[0]);
        chart.controls.studyDayControlWrap
            .append('span')
            .attr('class', 'span-description')
            .style('display', 'inline-block')
            .style('padding-left', '0.2em')
            .text(chart.controls.studyDayRange[1]);

        //initialize plot_day to day 0 or the min value, whichever is greater
        if (config.plot_day === null) {
            config.plot_day =
                chart.controls.studyDayRange[0] > 0 ? chart.controls.studyDayRange[0] : 0;
            chart.controls.studyDayInput.node().value = config.plot_day;
        }

        initPlayButton.call(this);
    }

    function onLayout() {
        layoutPanels.call(this);

        //init messages section
        init$1.call(this);
        initCustomWarning.call(this);
        initDroppedRowsWarning.call(this);

        initTitle.call(this);
        addDownloadButton.call(this);

        addFootnote.call(this);
        formatRRatioControl.call(this);
        initQuadrants.call(this);
        initRugs.call(this);
        initVisitPath.call(this);
        initParticipantDetails.call(this);
        initResetButton.call(this);
        customizePlotStyleToggle.call(this);
        initDisplayControl.call(this);
        initControlLabels.call(this);
        initEmptyChartWarning.call(this);
        initStudyDayControl.call(this);
        relabelMeasureControls.call(this);
    }

    function updateAxisSettings() {
        var config = this.config;
        var unit =
            config.display == 'relative_uln'
                ? ' [xULN]'
                : config.display == 'relative_baseline'
                ? ' [xBaseline]'
                : config.display == 'absolute'
                ? ' [raw values]'
                : null;

        //Update axis labels.
        var xValue = config.measure_values[config.x.column]
            ? config.measure_values[config.x.column]
            : config.x.column;
        config.x.label = xValue + unit;
        var yValue = config.measure_values[config.y.column]
            ? config.measure_values[config.y.column]
            : config.y.column;
        config.y.label = yValue + unit;
    }

    function updateControlCutpointLabels() {
        var config = this.config;
        if (
            this.controls.config.inputs.find(function(input) {
                return input.description === 'X-axis Reference Line';
            })
        )
            this.controls.wrap
                .selectAll('.control-group')
                .filter(function(d) {
                    return d.description === 'X-axis Reference Line';
                })
                .select('.wc-control-label')
                .text(config.measure_values[config.x.column] + ' Reference Line');
        if (
            this.controls.config.inputs.find(function(input) {
                return input.description === 'Y-axis Reference Line';
            })
        )
            this.controls.wrap
                .selectAll('.control-group')
                .filter(function(d) {
                    return d.description === 'Y-axis Reference Line';
                })
                .select('.wc-control-label')
                .text(config.measure_values[config.y.column] + ' Reference Line');
    }

    function setMaxRRatio() {
        var chart = this;
        var config = this.config;
        var r_ratio_wrap = chart.controls.wrap.selectAll('.control-group').filter(function(d) {
            return d.option === 'r_ratio[0]';
        });

        //if no max value is defined, use the max value from the data
        if (this.config.r_ratio_filter) {
            if (!config.r_ratio[1]) {
                var max_r_ratio = d3.max(this.raw_data, function(d) {
                    return d.rRatio_relative_uln;
                });
                config.max_r_ratio = Math.ceil(max_r_ratio * 10) / 10; //round up to the nearest 0.1
                config.r_ratio[1] = config.max_r_ratio;
                chart.controls.wrap
                    .selectAll('.control-group')
                    .filter(function(d) {
                        return d.option === 'r_ratio[0]';
                    })
                    .select('input#r_ratio_max')
                    .property('value', config.max_r_ratio);
            }

            //make sure r_ratio[0] <= r_ratio[1]
            if (config.r_ratio[0] > config.r_ratio[1]) {
                config.r_ratio = config.r_ratio.reverse();
                r_ratio_wrap.select('input#r_ratio_min').property('value', config.r_ratio[0]);
                r_ratio_wrap.select('input#r_ratio_max').property('value', config.r_ratio[1]);
            }

            //Define flag given r-ratio minimum.
            this.raw_data.forEach(function(participant_obj) {
                var aboveMin = participant_obj.rRatio_relative_uln >= config.r_ratio[0];
                var belowMax = participant_obj.rRatio_relative_uln <= config.r_ratio[1];
                participant_obj.rRatioFlag = aboveMin & belowMax ? 'Y' : 'N';
            });
        }
    }

    function addParticipantLevelMetadata(d, participant_obj) {
        var varList = [];
        if (this.config.filters) {
            var filterVars = this.config.filters.map(function(d) {
                return d.hasOwnProperty('value_col') ? d.value_col : d;
            });
            varList = d3.merge([varList, filterVars]);
        }
        if (this.config.group_cols) {
            var groupVars = this.config.group_cols.map(function(d) {
                return d.hasOwnProperty('value_col') ? d.value_col : d;
            });
            varList = d3.merge([varList, groupVars]);
        }
        if (this.config.details) {
            var detailVars = this.config.details.map(function(d) {
                return d.hasOwnProperty('value_col') ? d.value_col : d;
            });
            varList = d3.merge([varList, detailVars]);
        }

        varList.forEach(function(v) {
            participant_obj[v] = '' + d[0][v];
        });
    }

    function calculateMaxRRatio(d, participant_obj) {
        var config = this.config;

        // R-ratio should be the ratio of ALT to ALP
        console.log(d);
        console.log(participant_obj);
        // For current time point or maximal values (depends on view)
        // participant_obj.rRatio_current = participant_obj['rRatio_relative_uln'];

        // //get r-ratio data for every visit where both ALT and ALP are available
        // var allMatches = chart.imputed_data.filter(
        //     f => f[config.id_col] == participant_obj[config.id_col]
        // );
        // console.log(allMatches);
        // participant_obj.rRatio_raw = allMatches.filter(f => f[config.measure_col] == 'rRatio');
        // console.log(participant_obj.rRatio_raw);
        // //max rRatios across visits
        // participant_obj.rRatio_max = d3.max(participant_obj.rRatio_raw, f => f[config.value_col]); //max rRatio for all visits
        // participant_obj.rRatio_max_anly = d3.max(
        //     participant_obj.rRatio_raw.filter(f => f.analysisFlag),
        //     f => f[config.value_col]
        // );

        // // rRatio at time of max ALT
        // let maxAltRecord = participant_obj.rRatio_raw
        //     .filter(f => f.analysisFlag)
        //     .sort(function(a, b) {
        //         return b.alt_relative_uln - a.alt_relative_uln; //descending sort (so max is first value)
        //     })[0];

        // participant_obj.rRatio_max_alt = maxAltRecord ? maxAltRecord.rRatio : null;

        // // Use the r ratio at the tme of the max ALT value for standard eDish, otherwise use rRatio from the current time point
        // participant_obj.rRatio = config.plot_max_values
        //     ? participant_obj.rRatio_max_alt
        //     : participant_obj.rRatio_current;
    }

    function getMaxValues(d) {
        var chart = this;
        var config = this.config;

        var participant_obj = {};
        participant_obj.days_x = null;
        participant_obj.days_y = null;
        participant_obj.outOfRange = false;
        Object.keys(config.measure_values).forEach(function(mKey) {
            //get all raw data for the current measure
            var all_matches = d
                .filter(function(f) {
                    return config.measure_values[mKey] == f[config.measure_col];
                }) //get matching measures
                .sort(function(a, b) {
                    return a[config.studyday_col] - b[config.studyday_col];
                });

            //Drop Participants with no analysis data
            var analysis_matches = all_matches.filter(function(f) {
                return f.analysisFlag;
            });
            participant_obj.drop_participant = analysis_matches.length === 0;

            if (participant_obj.drop_participant) {
                if (config.debug) {
                    console.warn(
                        'No analysis records found for ' + d[0][config.id_col] + ' for ' + mKey
                    );
                }

                participant_obj.drop_reason =
                    'No analysis results found for 1+ key measure, including ' + mKey + '.';
            } else {
                //keep an array of all [value, studyday] pairs for the measure
                participant_obj[mKey + '_raw'] = all_matches.map(function(m, i) {
                    return {
                        value: m[config.display],
                        day: m[config.studyday_col],
                        analysisFlag: m.analysisFlag
                    };
                });

                var currentRecord = null;
                //get the current record for each participant
                if (config.plot_max_values) {
                    //get record with maximum value for the current display type
                    var max_value = d3.max(analysis_matches, function(d) {
                        return +d[config.display];
                    });
                    var currentRecords = analysis_matches.filter(function(d) {
                        return max_value == +d[config.display];
                    });
                    if (config.debug & (currentRecords.length > 1)) {
                        var firstDay = currentRecords[0][config.studyday_col];
                        var id = currentRecords[0][config.id_col];
                        console.warn(
                            'Found duplicate maximum ' +
                                mKey +
                                ' values for ' +
                                id +
                                '. Using first value from study day ' +
                                firstDay +
                                ' for timing calculations.'
                        );
                    }
                    var currentRecord = currentRecords[0];
                    participant_obj[mKey] = +currentRecord[config.display];
                } else {
                    //see if all selected config.plot_day was while participant was enrolled
                    var first = all_matches[0];
                    var last = all_matches[all_matches.length - 1];

                    if ([config.x.column, config.y.column].includes(mKey)) {
                        // out-of-range should be calculated study day of with x- and y-axis measures
                        var before = config.plot_day < first[config.studyday_col];
                        var after = config.plot_day > last[config.studyday_col];
                        participant_obj.outOfRange = participant_obj.outOfRange || before || after;
                    }

                    //get the most recent measure on or before config.plot_day
                    var onOrBefore = all_matches.filter(function(di) {
                        return di[config.studyday_col] <= config.plot_day;
                    });
                    var latest = onOrBefore[onOrBefore.length - 1];

                    currentRecord = latest ? latest : first;
                    participant_obj[mKey] = currentRecord[config.display];
                }
                //  var currentRecord = all_matches.find(d => participant_obj[mKey] == +d[config.display]);

                //map all measure specific values
                config.flat_cols.forEach(function(col) {
                    participant_obj[mKey + '_' + col] = currentRecord ? currentRecord[col] : null;
                });

                //determine whether the value is above the specified threshold
                if (config.cuts[mKey][config.display]) {
                    config.show_quadrants = true;
                    participant_obj[mKey + '_cut'] = config.cuts[mKey][config.display];
                    participant_obj[mKey + '_flagged'] =
                        participant_obj[mKey] >= participant_obj[mKey + '_cut'];
                } else {
                    config.show_quadrants = false;
                    participant_obj[mKey + '_cut'] = null;
                    participant_obj[mKey + '_flagged'] = null;
                }

                //save study days for each axis;
                if (currentRecord) {
                    if (mKey == config.x.column)
                        participant_obj.days_x = currentRecord[config.studyday_col];
                    if (mKey == config.y.column)
                        participant_obj.days_y = currentRecord[config.studyday_col];
                }
            }
        });

        //Add participant level metadata
        addParticipantLevelMetadata.call(chart, d, participant_obj);

        //Calculate ratios between measures.
        calculateMaxRRatio.call(chart, d, participant_obj);
        //calculateNRRatio.call(chart, d, participant_obj);

        //calculate the day difference between x and y and total day range for all measure values
        participant_obj.day_diff = Math.abs(participant_obj.days_x - participant_obj.days_y);
        participant_obj.day_range = d3.extent(d, function(d) {
            return d[config.studyday_col];
        });

        return participant_obj;
    }

    function getFlatCols() {
        var config = this.config;

        //get list of columns to flatten
        var flat_cols = [];
        var user_cols = [
            'measure_col',
            'value_col',
            'studyday_col',
            'normal_col_low',
            'normal_col_high'
        ];
        var derived_cols = [
            'absolute',
            'relative_uln',
            'relative_baseline',
            'baseline_absolute',
            'analysisFlag'
        ];

        // populate the full list of columns to flatten labels
        user_cols.forEach(function(d) {
            if (Array.isArray(d)) {
                d.forEach(function(di) {
                    flat_cols.push(
                        di.hasOwnProperty('value_col') ? config[di.value_col] : config[di]
                    );
                });
            } else {
                flat_cols.push(d.hasOwnProperty('value_col') ? config[d.value_col] : config[d]);
            }
        });

        //merge in the derived columns
        return d3.merge([flat_cols, derived_cols]);
    }

    function calculatePalt(pt) {
        // Calculates the pAlt value for the given participant ID
        // For more on PAlt see the following paper: A Rapid Method to Estimate Hepatocyte Loss Due to Drug-Induced Liver Injury by Chung et al
        // Requires: Baseline visit
        // Assumes: Units on Alt are IU/L
        var config = this.config;

        //Get a list of raw post-baseline ALT values
        var alt_values = pt.values.raw
            .filter(function(f) {
                return f[config.measure_col] == config.measure_values.ALT;
            })
            .filter(function(f) {
                return f.paltFlag;
            })
            .map(function(d) {
                var obj = {};
                obj.value = d[config.value_col];
                obj.day = d[config.studyday_col];
                obj.hour = d.day * 24;
                return obj;
            });
        if (alt_values.length > 1) {
            //get peak alt value
            var alt_peak = d3.max(alt_values, function(f) {
                return f.value;
            });

            //caluculate ALT AUC
            var alt_auc = d3.sum(alt_values, function(d, i) {
                if (i < alt_values.length - 1) {
                    var di = d;
                    var vi = di.value;
                    var hi = di.hour;
                    var dii = alt_values[i + 1];
                    var vii = dii.value;
                    var hii = dii.hour;
                    var v_avg = (vii + vi) / 2;
                    var h_diff = hii - hi;
                    var segment_auc = v_avg * h_diff;

                    return segment_auc;
                } else {
                    return 0;
                }
            });

            //calculate pAlt  (ALT AUC + AltPeak ^ 0.18)
            var p_alt = (alt_auc * Math.pow(alt_peak, 0.18)) / 100000;
            var p_alt_rounded = d3.format('0.2f')(p_alt);
            var alt_auc_rounded = d3.format('0.2f')(alt_auc);
            var alt_peak_rounded = d3.format('0.2f')(alt_peak);
            var note =
                '<em>NOTE: </em>' +
                'For this participant, P<sub>ALT</sub> was calculated as: ' +
                'ALT AUC * Peak ALT <sup>0.18</sup> / 10<sup>5</sup> = ' +
                alt_auc_rounded +
                ' * ' +
                alt_peak_rounded +
                ' <sup>0.18</sup> / 10<sup>5</sup> = ' +
                p_alt_rounded +
                '<br>' +
                'P<sub>ALT</sub> shows promise in predicting the percentage hepatocyte loss on the basis of the maximum value and the AUC of serum ALT observed during a DILI event. For more details see <a href = "https://www.ncbi.nlm.nih.gov/pubmed/30303523">A Rapid Method to Estimate Hepatocyte Loss Due to Drug-Induced Liver Injury</a> by Chung et al.';

            var obj = {
                value: p_alt,
                text_value: p_alt_rounded,
                values: alt_values,
                note: note,
                components: {
                    peak: alt_peak,
                    auc: alt_auc
                }
            };

            return obj;
        } else {
            return null; //if no alt values are found
        }
    }

    //Converts a one record per measure data object to a one record per participant objects
    function flattenData() {
        var chart = this;
        var config = this.config;

        //////////////////////////////////////////////
        //make a data set with one object per ID
        /////////////////////////////////////////////

        //get a list of columns to flatten
        config.flat_cols = getFlatCols.call(this);

        //get maximum values for each measure type
        var flat_data = d3
            .nest()
            .key(function(f) {
                return f[config.id_col];
            })
            .rollup(function(d) {
                return getMaxValues.call(chart, d);
            })
            .entries(
                this.imputed_data.filter(function(f) {
                    return f.key_measure;
                })
            );

        chart.dropped_participants = flat_data
            .filter(function(f) {
                return f.values.drop_participant;
            })
            .map(function(d) {
                return {
                    id: d.key,
                    drop_reason: d.values.drop_reason,
                    allrecords: chart.initial_data.filter(function(f) {
                        return f[config.id_col] == d.key;
                    })
                };
            });
        var flat_data = flat_data
            .filter(function(f) {
                return !f.values.drop_participant;
            })
            .map(function(m) {
                m.values[config.id_col] = m.key;

                //link the raw data to the flattened object
                var allMatches = chart.imputed_data.filter(function(f) {
                    return f[config.id_col] == m.key;
                });
                m.values.raw = allMatches;

                m.values.p_alt = config.calculate_palt ? calculatePalt.call(chart, m) : null;
                return m.values;
            });
        return flat_data;
    }

    function setLegendLabel() {
        //change the legend label to match the group variable
        //or hide legend if group = NONE
        this.config.legend.label =
            this.config.color_by !== 'NONE'
                ? this.config.group_cols[
                      this.config.group_cols
                          .map(function(group) {
                              return group.value_col;
                          })
                          .indexOf(this.config.color_by)
                  ].label
                : '';
    }

    function showMissingDataWarning() {
        var chart = this;
        var config = chart.config;

        if (config.debug) {
            //confirm participants are only dropped once (?!)
            var unique_dropped_participants = d3
                .set(
                    this.dropped_participants.map(function(m) {
                        return m.id;
                    })
                )
                .values().length;
            console.warn(
                'Of ' +
                    this.dropped_participants.length +
                    ' dropped participants, ' +
                    unique_dropped_participants +
                    ' are unique.'
            );
            console.warn(this.dropped_participants);
        }

        chart.messages.remove(null, 'droppedPts', chart.messages); //remove message from previous render
        if (this.dropped_participants.length > 0) {
            var warningText =
                this.dropped_participants.length +
                ' participants are not plotted. They likely have invalid or missing data for key variables in the current chart. Click <a class="ptDownload">here</a> to download a csv with a brief explanation of why each participant was not plotted.';

            this.messages.add(warningText, 'caution', 'droppedPts', this.messages, function() {
                //custom callback to activate the droppedRows download
                d3.select(this)
                    .select('a.ptDownload')
                    .style('color', 'blue')
                    .style('text-decoration', 'underline')
                    .style('cursor', 'pointer')
                    .datum(chart.dropped_participants)
                    .on('click', function(d) {
                        var cols = ['id', 'drop_reason'];
                        downloadCSV.call(this, d, cols, 'eDishDroppedParticipants');
                    });
            });
        }
    }

    function dropMissingValues() {
        var chart = this;
        var config = this.config;
        //drop records with missing or invalid (negative) values
        var missing_count = d3.sum(this.raw_data, function(f) {
            return f[config.x.column] <= 0 || f[config.y.column] <= 0;
        });

        if (missing_count > 0) {
            this.raw_data = this.raw_data.map(function(d) {
                d.nonPositiveFlag = d[config.x.column] <= 0 || d[config.y.column] <= 0;
                var type = config.display == 'relative_uln' ? 'eDish' : 'mDish';
                // generate an informative reason the participant was dropped
                var dropText =
                    type +
                    ' values could not be generated for ' +
                    config.x.column +
                    ' or ' +
                    config.y.column +
                    '. ';

                // x type is mdish and baseline is missing
                if ((type == 'mDish') & !d[config.x.column + '_baseline_absolute']) {
                    dropText = dropText + 'Baseline for ' + config.x.column + ' is missing. ';
                }

                // y type is mdish and baseline is missing
                if ((type == 'mDish') & !d[config.y.column + '_baseline_absolute']) {
                    dropText = dropText + 'Baseline for ' + config.y.column + ' is missing. ';
                }

                d.drop_reason = d.nonPositiveFlag ? dropText : '';
                return d;
            });

            this.dropped_participants = d3.merge([
                this.dropped_participants,
                this.raw_data
                    .filter(function(f) {
                        return f.nonPositiveFlag;
                    })
                    .map(function(m) {
                        return { id: m[config.id_col], drop_reason: m.drop_reason };
                    })
            ]);

            this.dropped_participants.map(function(m) {
                m.raw = chart.initial_data.filter(function(f) {
                    return f[config.id_col] == m.id;
                });
            });
        }

        this.raw_data = this.raw_data.filter(function(f) {
            return !f.nonPositiveFlag;
        });
        showMissingDataWarning.call(this);
    }

    function onPreprocess() {
        updateAxisSettings.call(this); //update axis label based on display type
        updateControlCutpointLabels.call(this); //update cutpoint control labels given x- and y-axis variables
        this.raw_data = flattenData.call(this); //convert from visit-level data to participant-level data
        setMaxRRatio.call(this);
        setLegendLabel.call(this); //update legend label based on group variable
        dropMissingValues.call(this);
    }

    function onDataTransform() {}

    function updateQuadrantData() {
        var chart = this;
        var config = this.config;

        //add "eDISH_quadrant" column to raw_data
        var x_var = this.config.x.column;
        var y_var = this.config.y.column;

        var x_cut = this.config.cuts[x_var][config.display];
        var y_cut = this.config.cuts[y_var][config.display];

        this.filtered_data.forEach(function(d) {
            var x_cat = d[x_var] >= x_cut ? 'xHigh' : 'xNormal';
            var y_cat = d[y_var] >= y_cut ? 'yHigh' : 'yNormal';
            d['eDISH_quadrant'] = x_cat + ':' + y_cat;
        });

        //update Quadrant data
        config.quadrants.forEach(function(quad) {
            quad.count = chart.filtered_data.filter(function(d) {
                return d.eDISH_quadrant == quad.dataValue;
            }).length;
            quad.total = chart.filtered_data.length;
            quad.percent = d3.format('0.1%')(quad.count / quad.total);
        });
    }

    function setDomain(dimension) {
        var config = this.config;
        var domain = this[dimension].domain();
        var measure = config[dimension].column;
        var measure_long = config.measure_values[measure];
        var cut = config.cuts[measure][config.display];
        var values = this.imputed_data
            .filter(function(f) {
                return f[config.measure_col] == measure_long;
            })
            .map(function(m) {
                return +m[config.display];
            })
            .filter(function(m) {
                return m > 0;
            })
            .sort(function(a, b) {
                return a - b;
            });
        var val_extent = d3.extent(values);

        //make sure the domain contains the cut point and the max possible value for the measure
        domain[1] = d3.max([domain[1], cut * 1.01, val_extent[1]]);

        // make sure the domain lower limit captures all of the raw Values
        if (this.config[dimension].type == 'linear') {
            // just use the lower limit of 0 for continuous
            domain[0] = 0;
        } else if (this.config[dimension].type == 'log') {
            // use the smallest raw value for a log axis

            var minValue = val_extent[0];

            if (minValue < domain[0]) {
                domain[0] = minValue;
            }

            //throw a warning if the domain is > 0 if using log scale
            if (this[dimension].type == 'log' && domain[0] <= 0) {
                console.warn(
                    "Can't draw a log " + dimension + '-axis because there are values <= 0.'
                );
            }
        }
        this[dimension + '_dom'] = domain;
    }

    function clearVisitPath() {
        this.visitPath.selectAll('*').remove();
    }

    function clearParticipantHeader() {
        this.participantDetails.header.selectAll('*').remove(); //clear participant header
    }

    function hideMeasureTable() {
        this.measureTable.draw([]);
        this.measureTable.wrap.selectAll('*').style('display', 'none');
    }

    function clearRugs(axis) {
        this[axis + '_rug'].selectAll('*').remove();
    }

    function formatPoints() {
        var chart = this;
        var config = this.config;
        var points = this.svg
            .select('g.point-supergroup.mark1')
            .selectAll('g.point')
            .select('circle');

        points
            .attr('stroke', function(d) {
                var disabled = d3.select(this).classed('disabled');
                var raw = d.values.raw[0],
                    pointColor = chart.colorScale(raw[config.color_by]);
                return disabled ? '#ccc' : pointColor;
            })
            .attr('fill', function(d) {
                var disabled = d3.select(this).classed('disabled');
                var raw = d.values.raw[0],
                    pointColor = chart.colorScale(raw[config.color_by]);
                return disabled ? 'white' : pointColor;
            })
            .attr('stroke-width', 1)
            .style('clip-path', null);
    }

    function clearParticipantDetails() {
        var chart = this;
        var config = this.config;
        var points = this.svg
            .select('g.point-supergroup.mark1')
            .selectAll('g.point')
            .select('circle');

        points.classed('disabled', false);

        // update
        chart.participantsSelected = [];
        chart.events.participantsSelected.data = chart.participantsSelected;
        chart.wrap.node().dispatchEvent(chart.events.participantsSelected);

        // remove/hide details
        this.config.quadrants.table.wrap.style('display', null);
        clearVisitPath.call(this); //remove path
        clearParticipantHeader.call(this);
        clearRugs.call(this, 'x'); //clear rugs
        clearRugs.call(this, 'y');
        hideMeasureTable.call(this); //remove the detail table
        formatPoints.call(this);

        this.participantDetails.wrap.selectAll('*').style('display', 'none');
    }

    function updateFilterLabel() {
        if (this.controls.filter_numerator) {
            this.controls.filter_numerator.text(this.filtered_data.length);
        }
    }

    function setCutpointMinimums() {
        var chart = this;
        var config = this.config;
        var lower_limits = {
            x: chart['x_dom'][0],
            y: chart['y_dom'][0]
        };

        //Make sure cutpoint isn't below lower domain - Comes in to play when changing from log to linear axes
        Object.keys(lower_limits).forEach(function(dimension) {
            var measure = config[dimension].column;
            var current_cut = config.cuts[measure][config.display];
            var min = lower_limits[dimension];
            if (current_cut < min) {
                config.cuts[measure][config.display] = min;
                chart.controls.wrap
                    .selectAll('div.control-group')
                    .filter(function(f) {
                        return f.description
                            ? f.description.toLowerCase() == dimension + '-axis reference line'
                            : false;
                    })
                    .select('input')
                    .node().value = min;
            }
        });

        //Update cut point controls
        var controlWraps = this.controls.wrap
            .selectAll('.control-group')
            .filter(function(d) {
                return /.-axis Reference Line/i.test(d.description);
            })
            .attr('min', function(d) {
                return lower_limits[d.description.split('-')[0]];
            });

        controlWraps.select('input').on('change', function(d) {
            var dimension = d.description.split('-')[0].toLowerCase();
            var min = chart[dimension + '_dom'][0];
            var input = d3.select(this);

            //Prevent a cutpoint less than the lower domain.
            if (input.property('value') < min) input.property('value', min);

            //Update chart setting.
            var measure = config[dimension].column;
            config.cuts[measure][config.display] = input.property('value');
            chart.draw();
        });
    }

    function syncCutpoints() {
        var chart = this;
        var config = this.config;

        //check to see if the cutpoint used is current
        if (
            config.cuts.x != config.x.column ||
            config.cuts.y != config.y.column ||
            config.cuts.display != config.display
        ) {
            // if not, update it!

            // track the current cut point variables
            config.cuts.x = config.x.column;
            config.cuts.y = config.y.column;
            config.cuts.display = config.display;

            // update the cutpoint shown in the control
            config.cuts.display_change = false; //reset the change flag;
            var dimensions = ['x', 'y'];
            dimensions.forEach(function(dimension) {
                //change the control to point at the correct cut point
                var dimInput = chart.controls.wrap
                    .selectAll('div.control-group')
                    .filter(function(f) {
                        return f.description
                            ? f.description.toLowerCase() == dimension + '-axis reference line'
                            : false;
                    })
                    .select('input');

                dimInput.node().value = config.cuts[config[dimension].column][config.display];

                //don't think this actually changes functionality, but nice to have it accurate just in case
                dimInput.option =
                    'settings.cuts.' + [config[dimension].column] + '.' + [config.display];
            });
        }
    }

    function hideEmptyChart() {
        var emptyChart = this.filtered_data.length == 0;
        this.wrap.style('display', emptyChart ? 'none' : 'inline-block');
        this.emptyChartWarning.style('display', emptyChart ? 'inline-block' : 'none');
    }

    function updateStudyDayControl() {
        var chart = this;
        var config = this.config;

        // cancel the animation (if any is running)
        var activeAnimation = chart.controls.studyDayPlayButton.datum().state == 'stop';
        if (activeAnimation) {
            chart.svg.transition().duration(0);
        }

        // hide study day control if viewing max values
        chart.controls.studyDayControlWrap.style('display', config.plot_max_values ? 'none' : null);

        //set the status of the play button
        if (config.plot_day >= chart.controls.studyDayRange[1]) {
            chart.controls.studyDayPlayButton.datum({ state: 'restart' });
            chart.controls.studyDayPlayButton.html('&#8634;');
        } else {
            chart.controls.studyDayPlayButton.datum({ state: 'play' });
            chart.controls.studyDayPlayButton.html('&#9658;');
        }

        //update the study day control label with the currently selected values
        var currentValue = chart.controls.studyDayControlWrap.select('input').property('value');
        chart.controls.studyDayControlWrap
            .select('span.wc-control-label')
            .html('Showing data from: <strong>Day ' + currentValue + '</strong>')
            .select('strong')
            .style('color', 'blue');
    }

    function onDraw() {
        //show/hide the study day controls
        updateStudyDayControl.call(this);

        //clear participant Details (if they exist)
        clearParticipantDetails.call(this);

        //get correct cutpoint for the current view
        syncCutpoints.call(this);

        //update domains to include cut lines
        setDomain.call(this, 'x');
        setDomain.call(this, 'y');

        //Set update cutpoint interactivity
        setCutpointMinimums.call(this);

        //Classify participants in to eDISH quadrants
        updateQuadrantData.call(this);

        //update the count in the filter label
        updateFilterLabel.call(this);
        hideEmptyChart.call(this);
    }

    //draw marginal rug for visit-level measures
    function drawRugs(d, axis) {
        var chart = this;
        var config = this.config;

        //get matching measures
        var allMatches = d.values.raw[0].raw;
        var measure = config.measure_values[config[axis].column];
        var matches = allMatches.filter(function(f) {
            return f[config.measure_col] == measure;
        });

        //draw the rug
        var min_value = axis == 'x' ? chart.y.domain()[0] : chart.x.domain()[0];
        var rugs = chart[axis + '_rug']
            .selectAll('text')
            .data(matches)
            .enter()
            .append('text')
            .attr({
                class: 'rug-tick',
                x: function x(di) {
                    return axis === 'x' ? chart.x(di[config.display]) : chart.x(min_value);
                },
                y: function y(di) {
                    return axis === 'y' ? chart.y(di[config.display]) : chart.y(min_value);
                },
                dy: axis === 'y' ? 4 : 0,
                'text-anchor': axis === 'y' ? 'end' : null,
                'alignment-baseline': axis === 'x' ? 'hanging' : null,
                'font-size': axis === 'x' ? '6px' : null,
                stroke: function stroke(di) {
                    return chart.colorScale(di[config.color_by]);
                },
                'stroke-width': function strokeWidth(di) {
                    return di[config.display] === d.values[axis] ? '3px' : '1px';
                }
            })
            .text(function(d) {
                return axis === 'x' ? '|' : '–';
            });

        //Add tooltips to rugs.
        rugs.append('svg:title').text(function(d) {
            return (
                d[config.measure_col] +
                '=' +
                d3.format('.2f')(d.absolute) +
                ' (' +
                d3.format('.2f')(d.relative_uln) +
                ' xULN) @ ' +
                d[config.visit_col] +
                '/Study Day ' +
                d[config.studyday_col]
            );
        });
    }

    function addPointMouseover() {
        var chart = this;
        var config = this.config;
        var points = this.marks[0].circles;

        //add event listener to all participant level points
        points
            .filter(function(d) {
                var disabled = d3.select(this).classed('disabled');
                return !disabled;
            })
            .on('mouseover', function(d) {
                //disable mouseover when highlights (onClick) are visible
                var disabled = d3.select(this).classed('disabled');
                if (!disabled) {
                    //clear previous mouseover if any
                    points.attr('stroke-width', 1);
                    clearRugs.call(chart, 'x');
                    clearRugs.call(chart, 'y');

                    //draw the rugs
                    d3.select(this).attr('stroke-width', 3);
                    drawRugs.call(chart, d, 'x');
                    drawRugs.call(chart, d, 'y');
                }
            });
    }

    function drawVisitPath(d) {
        var chart = this;
        var config = chart.config;

        var allMatches = d.values.raw[0].raw;
        var x_measure = config.measure_values[config.x.column];
        var y_measure = config.measure_values[config.y.column];
        var matches = allMatches.filter(function(f) {
            return f[config.measure_col] == x_measure || f[config.measure_col] == y_measure;
        });

        //get coordinates by visit
        var visits = d3
            .set(
                matches.map(function(m) {
                    return m[config.studyday_col];
                })
            )
            .values();
        var visit_data = visits
            .map(function(m) {
                var visitObj = {};
                visitObj.studyday = +m;
                visitObj.visit = config.visit_col
                    ? matches.filter(function(f) {
                          return f[config.studyday_col] == m;
                      })[0][config.visit_col]
                    : null;
                visitObj.visitn = config.visitn_col
                    ? matches.filter(function(f) {
                          return f[config.studyday_col] == m;
                      })[0][config.visitn_col]
                    : null;
                visitObj[config.color_by] = matches[0][config.color_by];

                //get x coordinate
                var x_match = matches
                    .filter(function(f) {
                        return f[config.studyday_col] == m;
                    })
                    .filter(function(f) {
                        return f[config.measure_col] == x_measure;
                    });

                if (x_match.length) {
                    visitObj.x = x_match[0][config.display];
                    visitObj.xMatch = x_match[0];
                } else {
                    visitObj.x = null;
                    visitObj.xMatch = null;
                }

                //get y coordinate
                var y_match = matches
                    .filter(function(f) {
                        return f[config.studyday_col] == m;
                    })
                    .filter(function(f) {
                        return f[config.measure_col] == y_measure;
                    });
                if (y_match.length) {
                    visitObj.y = y_match[0][config.display];
                    visitObj.yMatch = y_match[0];
                } else {
                    visitObj.y = null;
                    visitObj.yMatch = null;
                }

                //get rRatio
                var rRatio_match = d.values.raw[0].rRatio_raw.filter(function(f) {
                    return f[config.studyday_col] == m;
                });
                visitObj.rRatio = rRatio_match.length ? rRatio_match[0].rRatio : null;

                return visitObj;
            })
            .sort(function(a, b) {
                return a.studyday - b.studyday;
            })
            .filter(function(f) {
                return (f.x > 0) & (f.y > 0);
            });

        //draw the path
        var myLine = d3.svg
            .line()
            .x(function(d) {
                return chart.x(d.x);
            })
            .y(function(d) {
                return chart.y(d.y);
            });

        chart.visitPath.selectAll('*').remove();
        chart.visitPath.moveToFront();

        var path = chart.visitPath
            .append('path')
            .attr('class', 'participant-visits')
            .datum(visit_data)
            .attr('d', myLine)
            .attr('stroke', function(d) {
                return chart.colorScale(matches[0][config.color_by]);
            })
            .attr('stroke-width', '2px')
            .attr('fill', 'none');

        //Little trick for animating line drawing
        var totalLength = path.node().getTotalLength();
        path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(2000)
            .ease('linear')
            .attr('stroke-dashoffset', 0);

        //draw visit points
        var visitPoints = chart.visitPath
            .selectAll('g.visit-point')
            .data(visit_data)
            .enter()
            .append('g')
            .attr('class', 'visit-point');

        visitPoints
            .append('circle')
            .attr('class', 'participant-visits')
            .attr('r', 0)
            .attr('stroke', function(d) {
                return chart.colorScale(d[config.color_by]);
            })
            .attr('stroke-width', 1)
            .attr('cx', function(d) {
                return chart.x(d.x);
            })
            .attr('cy', function(d) {
                return chart.y(d.y);
            })
            .attr('fill', function(d) {
                return chart.colorScale(d[config.color_by]);
            })
            .attr('fill-opacity', 0)
            .transition()
            .delay(2000)
            .duration(200)
            .attr('r', 4);

        //custom titles for points on mouseover
        visitPoints.append('title').text(function(d) {
            var xvar = config.x.column;
            var yvar = config.y.column;

            var studyday_label = 'Study day: ' + d.studyday + '\n',
                visitn_label = d.visitn ? 'Visit Number: ' + d.visitn + '\n' : '',
                visit_label = d.visit ? 'Visit: ' + d.visit + '\n' : '',
                x_label = config.x.label + ': ' + d3.format('0.3f')(d.x) + '\n',
                y_label = config.y.label + ': ' + d3.format('0.3f')(d.y),
                rRatio_label = d.rRatio ? '\nR Ratio: ' + d3.format('0.2f')(d.rRatio) : '';

            return studyday_label + visit_label + visitn_label + x_label + y_label + rRatio_label;
        });
    }

    function makeNestedData(d) {
        var chart = this;
        var config = chart.config;
        var allMatches = d.values.raw[0].raw
            .filter(function(d) {
                return d[config.measure_col] != 'rRatio';
            })
            .filter(function(d) {
                return d[config.measure_col] != 'nrRatio';
            });
        //.filter(function(d) {
        //    return ['nrRatio', 'rRatio'].indexOf(d[config.measure_col] == -1);
        //});

        var ranges = d3
            .nest()
            .key(function(d) {
                return d[config.measure_col];
            })
            .rollup(function(d) {
                var vals = d
                    .map(function(m) {
                        return m[config.value_col];
                    })
                    .sort(function(a, b) {
                        return a - b;
                    });
                var lower_extent = d3.quantile(vals, config.measureBounds[0]),
                    upper_extent = d3.quantile(vals, config.measureBounds[1]);
                return [lower_extent, upper_extent];
            })
            .entries(chart.initial_data);
        console.log(ranges);
        //make nest by measure
        var nested = d3
            .nest()
            .key(function(d) {
                return d[config.measure_col];
            })
            .rollup(function(d) {
                var measureObj = {};
                measureObj.eDish = chart;
                measureObj.key = d[0][config.measure_col];
                measureObj.raw = d;
                measureObj.values = d.map(function(d) {
                    return +d[config.value_col];
                });
                measureObj.max = +d3.format('0.2f')(d3.max(measureObj.values));
                measureObj.min = +d3.format('0.2f')(d3.min(measureObj.values));
                measureObj.median = +d3.format('0.2f')(d3.median(measureObj.values));
                measureObj.n = measureObj.values.length;
                measureObj.spark = 'spark!';
                console.log(measureObj);
                measureObj.population_extent = ranges.find(function(f) {
                    return measureObj.key == f.key;
                }).values;
                var hasColor =
                    chart.spaghetti.colorScale.domain().indexOf(d[0][config.measure_col]) > -1;
                measureObj.color = hasColor
                    ? chart.spaghetti.colorScale(d[0][config.measure_col])
                    : 'black';
                measureObj.spark_data = d.map(function(m) {
                    var obj = {
                        id: m[config.id_col],
                        lab: m[config.measure_col],
                        visit: config.visit_col ? m[config.visit_col] : null,
                        visitn: config.visitn_col ? +m[config.visitn_col] : null,
                        studyday: +m[config.studyday_col],
                        value: +m[config.value_col],
                        lln: config.normal_col_low ? +m[config.normal_col_low] : null,
                        uln: +m[config.normal_col_high],
                        population_extent: measureObj.population_extent,
                        outlier_low: config.normal_col_low
                            ? +m[config.value_col] < +m[config.normal_col_low]
                            : null,
                        outlier_high: +m[config.value_col] > +m[config.normal_col_high]
                    };
                    obj.outlier = obj.outlier_low || obj.outlier_high;
                    return obj;
                });
                return measureObj;
            })
            .entries(allMatches);

        var nested = nested
            .map(function(m) {
                return m.values;
            })
            .sort(function(a, b) {
                var a_order = Object.keys(config.measure_values)
                    .map(function(e) {
                        return config.measure_values[e];
                    })
                    .indexOf(a.key);
                var b_order = Object.keys(config.measure_values)
                    .map(function(e) {
                        return config.measure_values[e];
                    })
                    .indexOf(b.key);
                return b_order - a_order;
            });
        return nested;
    }

    function addSparkLines(d) {
        if (this.data.raw.length > 0) {
            //don't try to draw sparklines if the table is empty
            this.tbody
                .selectAll('tr')
                .style('background', 'none')
                .style('border-bottom', '.5px solid black')
                .each(function(row_d) {
                    //Spark line cell
                    var cell = d3
                            .select(this)
                            .select('td.spark')
                            .classed('minimized', true)
                            .text(''),
                        toggle = cell
                            .append('span')
                            .html('&#x25BD;')
                            .style('cursor', 'pointer')
                            .style('color', '#999')
                            .style('vertical-align', 'middle'),
                        width = 100,
                        height = 25,
                        offset = 4,
                        overTime = row_d.spark_data.sort(function(a, b) {
                            return +a.studyday - +b.studyday;
                        }),
                        color = row_d.color;

                    var x = d3.scale
                        .linear()
                        .domain(
                            d3.extent(overTime, function(m) {
                                return m.studyday;
                            })
                        )
                        .range([offset, width - offset]);

                    //y-domain includes 99th population percentile + any participant outliers
                    var y_min = d3.min(d3.merge([row_d.values, row_d.population_extent])) * 0.99;
                    var y_max = d3.max(d3.merge([row_d.values, row_d.population_extent])) * 1.01;
                    var y = d3.scale
                        .linear()
                        .domain([y_min, y_max])
                        .range([height - offset, offset]);

                    //render the svg
                    var svg = cell
                        .append('svg')
                        .attr({
                            width: width,
                            height: height
                        })
                        .append('g');

                    //draw the normal range polygon ULN and LLN
                    var upper = overTime.map(function(m) {
                        return { studyday: m.studyday, value: m.uln };
                    });
                    var lower = overTime
                        .map(function(m) {
                            return { studyday: m.studyday, value: m.lln };
                        })
                        .reverse();
                    var normal_data = d3.merge([upper, lower]).filter(function(m) {
                        return m.value;
                    });

                    var drawnormal = d3.svg
                        .line()
                        .x(function(d) {
                            return x(d.studyday);
                        })
                        .y(function(d) {
                            return y(d.value);
                        });

                    var normalpath = svg
                        .append('path')
                        .datum(normal_data)
                        .attr({
                            class: 'normalrange',
                            d: drawnormal,
                            fill: '#eee',
                            stroke: 'none'
                        });

                    //draw lines at the population guidelines
                    svg.selectAll('lines.guidelines')
                        .data(row_d.population_extent)
                        .enter()
                        .append('line')
                        .attr('class', 'guidelines')
                        .attr('x1', 0)
                        .attr('x2', width)
                        .attr('y1', function(d) {
                            return y(d);
                        })
                        .attr('y2', function(d) {
                            return y(d);
                        })
                        .attr('stroke', '#ccc')
                        .attr('stroke-dasharray', '2 2');

                    //draw the sparkline
                    var draw_sparkline = d3.svg
                        .line()
                        .interpolate('cardinal')
                        .x(function(d) {
                            return x(d.studyday);
                        })
                        .y(function(d) {
                            return y(d.value);
                        });
                    var sparkline = svg
                        .append('path')
                        .datum(overTime)
                        .attr({
                            class: 'sparkLine',
                            d: draw_sparkline,
                            fill: 'none',
                            stroke: color
                        });

                    //draw outliers
                    var outliers = overTime.filter(function(f) {
                        return f.outlier;
                    });
                    var outlier_circles = svg
                        .selectAll('circle.outlier')
                        .data(outliers)
                        .enter()
                        .append('circle')
                        .attr('class', 'circle outlier')
                        .attr('cx', function(d) {
                            return x(d.studyday);
                        })
                        .attr('cy', function(d) {
                            return y(d.value);
                        })
                        .attr('r', '2px')
                        .attr('stroke', color)
                        .attr('fill', color);
                });
        }
    }

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    var defaultSettings = {
        max_width: 800,
        aspect: 4,
        x: {
            column: 'studyday',
            type: 'linear',
            label: 'Study Day'
        },
        y: {
            column: 'value',
            type: 'linear',
            label: '',
            format: '.1f'
        },
        marks: [
            {
                type: 'line',
                per: ['lab']
            },
            {
                type: 'circle',
                radius: 4,
                per: ['lab', 'studyday'] //,
                //  values: { outlier: [true] },
                //  attributes: {
                //      'fill-opacity': 1
                //  }
            }
        ],
        margin: { top: 20 },
        gridlines: 'x',
        colors: []
    };

    function setDomain$1(d) {
        //y-domain includes 99th population percentile + any participant outliers
        var raw_values = this.raw_data.map(function(m) {
            return m.value;
        });
        var population_extent = this.raw_data[0].population_extent;
        var y_min = d3.min(d3.merge([raw_values, population_extent])) * 0.99;
        var y_max = d3.max(d3.merge([raw_values, population_extent])) * 1.01;
        this.y.domain([y_min, y_max]);
        this.y_dom = [y_min, y_max];
    }

    function drawPopulationExtent() {
        var lineChart = this;
        this.svg
            .selectAll('line.guidelines')
            .data(lineChart.raw_data[0].population_extent)
            .enter()
            .append('line')
            .attr('class', 'guidelines')
            .attr('x1', 0)
            .attr('x2', lineChart.plot_width)
            .attr('y1', function(d) {
                return lineChart.y(d);
            })
            .attr('y2', function(d) {
                return lineChart.y(d);
            })
            .attr('stroke', '#ccc')
            .attr('stroke-dasharray', '2 2');
    }

    function drawNormalRange() {
        var lineChart = this;
        var upper = this.raw_data.map(function(m) {
            return { studyday: m.studyday, value: m.uln };
        });
        var lower = this.raw_data
            .map(function(m) {
                return { studyday: m.studyday, value: m.lln };
            })
            .reverse();
        var normal_data = d3.merge([upper, lower]).filter(function(f) {
            return f.value || f.value == 0;
        });
        var drawnormal = d3.svg
            .line()
            .x(function(d) {
                return lineChart.x(d.studyday);
            })
            .y(function(d) {
                return lineChart.y(d.value);
            });
        var normalpath = this.svg
            .append('path')
            .datum(normal_data)
            .attr({
                class: 'normalrange',
                d: drawnormal,
                fill: '#eee',
                stroke: 'none'
            });
        normalpath.moveToBack();
    }

    function addPointTitles() {
        var config = this.edish.config;
        var points = this.marks[1].circles;
        points.select('title').remove();
        points.append('title').text(function(d) {
            var raw = d.values.raw[0];
            var xvar = config.x.column;
            var yvar = config.y.column;
            var studyday_label = 'Study day: ' + raw.studyday + '\n',
                visitn_label = raw.visitn ? 'Visit Number: ' + raw.visitn + '\n' : '',
                visit_label = raw.visit ? 'Visit: ' + raw.visit + '\n' : '',
                lab_label = raw.lab + ': ' + d3.format('0.3f')(raw.value);
            return studyday_label + visit_label + visitn_label + lab_label;
        });
    }

    function updatePointFill() {
        var points = this.marks[1].circles;
        points.attr('fill-opacity', function(d) {
            var outlier = d.values.raw[0].outlier;
            return outlier ? 1 : 0;
        });
    }

    function init$2(d, edish) {
        //layout the new cells on the DOM (slightly easier than using D3)
        var summaryRow_node = this.parentNode;
        var chartRow_node = document.createElement('tr');
        var chartCell_node = document.createElement('td');
        insertAfter(chartRow_node, summaryRow_node);
        chartRow_node.appendChild(chartCell_node);

        //update the row styles
        d3.select(chartRow_node)
            .style('background', 'none')
            .style('border-bottom', '0.5px solid black');

        //layout the svg with D3
        var cellCount = d3.select(summaryRow_node).selectAll('td')[0].length;
        var chartCell = d3.select(chartCell_node).attr('colspan', cellCount);

        //draw the chart
        defaultSettings.colors = [d.color];
        var lineChart = webcharts.createChart(chartCell_node, defaultSettings);
        lineChart.on('draw', function() {
            setDomain$1.call(this);
        });
        lineChart.edish = edish;
        lineChart.on('resize', function() {
            drawPopulationExtent.call(this);
            drawNormalRange.call(this);
            addPointTitles.call(this);
            updatePointFill.call(this);
        });
        lineChart.init(d.spark_data);
        lineChart.row = chartRow_node;
        return lineChart;
    }

    function addSparkClick() {
        var edish = this.edish;
        if (this.data.raw.length > 0) {
            this.tbody
                .selectAll('tr')
                .select('td.spark')
                .on('click', function(d) {
                    if (d3.select(this).classed('minimized')) {
                        d3.select(this).classed('minimized', false);
                        d3.select(this.parentNode).style('border-bottom', 'none');

                        this.lineChart = init$2.call(this, d, edish);
                        d3.select(this)
                            .select('svg')
                            .style('display', 'none');

                        d3.select(this)
                            .select('span')
                            .html('&#x25B3; Minimize Chart');
                    } else {
                        d3.select(this).classed('minimized', true);

                        d3.select(this.parentNode).style('border-bottom', '0.5px solid black');

                        d3.select(this)
                            .select('span')
                            .html('&#x25BD;');

                        d3.select(this)
                            .select('svg')
                            .style('display', null);

                        d3.select(this.lineChart.row).remove();
                        this.lineChart.destroy();
                    }
                });
        }
    }

    function addFootnote$1() {
        var footnoteText = [
            'The y-axis for each chart is set to the ' +
                this.edish.config.measureBounds
                    .map(function(bound) {
                        var percentile = '' + Math.round(bound * 100);
                        var lastDigit = +percentile.substring(percentile.length - 1);
                        var text =
                            percentile +
                            ([0, 4, 5, 6, 7, 8, 9].indexOf(lastDigit) > -1
                                ? 'th'
                                : lastDigit === 3
                                ? 'rd'
                                : lastDigit === 2
                                ? 'nd'
                                : 'st');
                        return text;
                    })
                    .join(' and ') +
                " percentiles of the entire population's results for that measure. " +
                'Values outside the normal range are plotted as individual points. ' +
                'Click a sparkline to view a more detailed version of the chart.'
        ];
        var footnotes = this.wrap.selectAll('span.footnote').data(footnoteText, function(d) {
            return d;
        });

        footnotes
            .enter()
            .append('span')
            .attr('class', 'footnote')
            .style('font-size', '0.7em')
            .style('padding-top', '0.1em')
            .text(function(d) {
                return d;
            });

        footnotes.exit().remove();
    }

    function addExtraMeasureToggle() {
        var measureTable = this;
        var chart = this.edish;
        var config = chart.config;

        measureTable.wrap.selectAll('div.wc-controls').remove();

        //check to see if there are extra measures in the MeasureTable
        var specifiedMeasures = Object.keys(config.measure_values).map(function(e) {
            return config.measure_values[e];
        });
        var tableMeasures = measureTable.data.raw.map(function(f) {
            return f.key;
        });

        //if extra measure exist...
        if (tableMeasures.length > specifiedMeasures.length) {
            var extraRows = measureTable.table
                .select('tbody')
                .selectAll('tr')
                .filter(function(f) {
                    return specifiedMeasures.indexOf(f.key) == -1;
                });

            //hide extra rows by default
            extraRows.style('display', 'none');

            //add a toggle
            var toggleDiv = measureTable.wrap
                .insert('div', '*')
                .attr('class', 'wc-controls')
                .append('div')
                .attr('class', 'control-group');
            var extraCount = tableMeasures.length - specifiedMeasures.length;
            toggleDiv
                .append('span')
                .attr('class', 'wc-control-label')
                .style('display', 'inline-block')
                .style('padding-right', '.3em')
                .text(
                    'Show ' +
                        extraCount +
                        ' additional measure' +
                        (extraCount == 1 ? '' : 's') +
                        ':'
                );
            var toggle = toggleDiv.append('input').property('type', 'checkbox');
            toggle.on('change', function() {
                var showRows = this.checked;
                extraRows.style('display', showRows ? null : 'none');
            });
        }
    }

    function drawMeasureTable(d) {
        var nested = makeNestedData.call(this, d);

        //draw the measure table
        this.measureTable.edish = this;
        this.measureTable.on('draw', function() {
            addSparkLines.call(this);
            addSparkClick.call(this);
            addExtraMeasureToggle.call(this);
            addFootnote$1.call(this);
        });
        this.measureTable.draw(nested);
    }

    function makeParticipantHeader(d) {
        var chart = this;
        var wrap = this.participantDetails.header;
        var raw = d.values.raw[0];
        var title = this.participantDetails.header
            .append('h3')
            .attr('class', 'id')
            .html('Participant Details')
            .style('border-top', '2px solid black')
            .style('border-bottom', '2px solid black')
            .style('padding', '.2em');

        if (chart.config.participantProfileURL) {
            title
                .append('a')
                .html('Full Participant Profile')
                .attr('href', chart.config.participantProfileURL)
                .style('font-size', '0.8em')
                .style('padding-left', '1em');
        }

        title
            .append('Button')
            .text('Clear')
            .style('margin-left', '1em')
            .style('float', 'right')
            .on('click', function() {
                clearParticipantDetails.call(chart);
            });

        //show detail variables in a ul
        var ul = this.participantDetails.header
            .append('ul')
            .style('list-style', 'none')
            .style('padding', '0');

        var lis = ul
            .selectAll('li')
            .data(chart.config.details)
            .enter()
            .append('li')
            .style('', 'block')
            .style('display', 'inline-block')
            .style('text-align', 'center')
            .style('padding', '0.5em');

        lis.append('div')
            .text(function(d) {
                return d.label;
            })
            .style('font-size', '0.8em');

        lis.append('div').text(function(d) {
            return raw[d.value_col];
        });

        //show overall rRatio
        var rratio_li = ul
            .append('li')
            .style('', 'block')
            .style('display', 'inline-block')
            .style('text-align', 'center')
            .style('padding', '0.5em');

        rratio_li
            .append('div')
            .html('R Ratio')
            .style('font-size', '0.8em');

        rratio_li.append('div').text(d3.format('0.2f')(raw.rRatio));

        //show PALT`
        if (raw.p_alt) {
            var palt_li = ul
                .append('li')
                .style('', 'block')
                .style('display', 'inline-block')
                .style('text-align', 'center')
                .style('padding', '0.5em');

            palt_li
                .append('div')
                .html('P<sub>ALT</sub>')
                .style('font-size', '0.8em');

            palt_li
                .append('div')
                .text(raw.p_alt.text_value)
                .style('border-bottom', '1px dotted #999')
                .style('cursor', 'pointer')
                .on('click', function() {
                    wrap.select('p.footnote')
                        .attr('class', 'footnote')
                        .html(raw.p_alt.note);
                });
        }

        //initialize empty footnote
        wrap.append('p')
            .attr('class', 'footnote')
            .style('font-size', '0.7em')
            .style('padding', '0.5em');
    }

    var defaultSettings$1 = {
        max_width: 600,
        x: {
            column: null,
            type: 'linear',
            label: 'Study Day'
        },
        y: defineProperty(
            {
                column: 'relative_uln',
                type: 'linear',
                label: null, // set in ../callbacks/onPreprocess
                domain: null,
                format: '.1f'
            },
            'domain',
            [0, null]
        ),
        marks: [
            {
                type: 'line',
                per: []
            },
            {
                type: 'circle',
                radius: 4,
                per: []
            }
        ],
        margin: { top: 20, bottom: 70 }, // bottom margin provides space for exposure plot
        gridlines: 'xy',
        color_by: null,
        colors: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628'],
        aspect: 2
    };

    var controlInputs$1 = [
        {
            type: 'subsetter',
            label: 'Select Labs',
            value_col: null,
            multiple: true
        },
        {
            type: 'dropdown',
            label: 'Y-axis Display Type',
            description: null,
            option: 'displayLabel',
            start: null,
            values: null,
            require: true
        }
    ];

    function onLayout$1() {
        var spaghetti = this;
        var eDish = this.edish;

        //customize the display control
        var displayControlWrap = spaghetti.controls.wrap
            .selectAll('div')
            .filter(function(controlInput) {
                return controlInput.label === 'Y-axis Display Type';
            });

        var displayControl = displayControlWrap.select('select');

        //set the start value
        var start_value = eDish.config.display_options.find(function(f) {
            return f.value == eDish.config.display;
        }).label;

        displayControl.selectAll('option').attr('selected', function(d) {
            return d == start_value ? 'selected' : null;
        });

        displayControl.on('change', function(d) {
            var currentLabel = this.value;
            var currentValue = eDish.config.display_options.find(function(f) {
                return f.label == currentLabel;
            }).value;
            spaghetti.config.y.column = currentValue;
            spaghetti.draw();
        });
    }

    function onPreprocess$1() {
        var config = this.config;
        var unit = this.config.y.column == 'relative_uln' ? '[xULN]' : '[xBaseline]';
        config.y.label = 'Standardized Result ' + unit;
    }

    function drawCutLine(d) {
        //bit of a hack to make this work with paths and circles
        var spaghetti = this;
        var config = this.config;
        var raw = d.values.raw ? d.values.raw[0] : d.values[0].values.raw[0];
        var cut = raw[config.y.column + '_cut'];
        var param = raw[config.color_by];
        spaghetti.cutLine = spaghetti.svg
            .append('line')
            .attr('y1', spaghetti.y(cut))
            .attr('y2', spaghetti.y(cut))
            .attr('x1', 0)
            .attr('x2', spaghetti.plot_width)
            .attr('stroke', spaghetti.colorScale(param))
            .attr('stroke-dasharray', '3 3');
        spaghetti.cutLabel = spaghetti.svg
            .append('text')
            .attr('y', spaghetti.y(cut))
            .attr('dy', '-0.2em')
            .attr('x', spaghetti.plot_width)
            .attr('text-anchor', 'end')
            .attr('alignment-baseline', 'baseline')
            .attr('fill', spaghetti.colorScale(param))
            .text(d3.format('0.1f')(cut));
    }

    function addPointTitles$1() {
        var spaghetti = this;
        var config = this.edish.config;
        var points = this.marks[1].circles;
        points.select('title').remove();
        points.append('title').text(function(d) {
            var raw = d.values.raw[0];
            var ylabel = spaghetti.config.displayLabel;
            var yvar = spaghetti.config.y.column;
            var studyday_label = 'Study day: ' + raw[config.studyday_col] + '\n',
                visitn_label = config.visitn_col
                    ? 'Visit Number: ' + raw[config.visitn_col] + '\n'
                    : '',
                visit_label = config.visit_col ? 'Visit: ' + raw[config.visit_col] + '\n' : '',
                raw_label =
                    'Raw ' +
                    raw[config.measure_col] +
                    ': ' +
                    d3.format('0.3f')(raw[config.value_col]) +
                    '\n',
                adj_label =
                    'Adjusted ' + raw[config.measure_col] + ': ' + d3.format('0.3f')(raw[yvar]);
            return studyday_label + visit_label + visitn_label + raw_label + adj_label;
        });
    }

    function addExposure() {
        var context = this;
        this.svg.select('.se-exposure-supergroup').remove();

        //If exposure data exists, annotate exposures beneath x-axis.
        if (this.edish.exposure.include) {
            var supergroup = this.svg
                .insert('g', '.supergroup')
                .classed('se-exposure-supergroup', true);
            var dy = 20; // offset from chart
            var strokeWidth = 5; // width/diameter of marks
            this.svg.selectAll('.x.axis .tick text').attr('dy', dy + strokeWidth * 3 + 'px'); // offset x-axis tick labels

            //top boundary line
            supergroup.append('line').attr({
                x1: -this.margin.left,
                y1: this.plot_height + dy - strokeWidth * 2,
                x2: this.plot_width,
                y2: this.plot_height + dy - strokeWidth * 2,
                stroke: 'black',
                'stroke-opacity': 0.1
            });

            //Exposure text
            supergroup
                .append('text')
                .attr({
                    x: -3,
                    y: this.plot_height + dy + strokeWidth,
                    'text-anchor': 'end',
                    textLength: this.margin.left - 3
                })
                .text('Exposure');

            //bottom boundary line
            supergroup.append('line').attr({
                x1: -this.margin.left,
                y1: this.plot_height + dy + strokeWidth * 2,
                x2: this.plot_width,
                y2: this.plot_height + dy + strokeWidth * 2,
                stroke: 'black',
                'stroke-opacity': 0.1
            });

            //Exposures
            var groups = supergroup
                .selectAll('g.se-exposure-group')
                .data(this.exposure_data)
                .enter()
                .append('g')
                .classed('se-exposure-group', true);
            groups.each(function(d) {
                var group = d3.select(this);

                //draw a line if exposure start and end dates are unequal
                if (
                    d[context.edish.config.exposure_stdy_col] !==
                    d[context.edish.config.exposure_endy_col]
                ) {
                    group
                        .append('line')
                        .classed('se-exposure-line', true)
                        .attr({
                            x1: function x1(d) {
                                return context.x(+d[context.edish.config.exposure_stdy_col]);
                            },
                            y1: context.plot_height + dy,
                            x2: function x2(d) {
                                return context.x(+d[context.edish.config.exposure_endy_col]);
                            },
                            y2: context.plot_height + dy,
                            stroke: 'black',
                            'stroke-width': strokeWidth,
                            'stroke-opacity': 0.25
                        })
                        .on('mouseover', function(d) {
                            this.setAttribute('stroke-width', strokeWidth * 2);

                            //annotate a rectangle in the chart
                            group
                                .append('rect')
                                .classed('se-exposure-highlight', true)
                                .attr({
                                    x: function x(d) {
                                        return context.x(
                                            +d[context.edish.config.exposure_stdy_col]
                                        );
                                    },
                                    y: 0,
                                    width: function width(d) {
                                        return (
                                            context.x(+d[context.edish.config.exposure_endy_col]) -
                                            context.x(+d[context.edish.config.exposure_stdy_col])
                                        );
                                    },
                                    height: context.plot_height,
                                    fill: 'black',
                                    'fill-opacity': 0.25
                                });
                        })
                        .on('mouseout', function(d) {
                            this.setAttribute('stroke-width', strokeWidth);

                            //remove rectangle from the chart
                            group.select('.se-exposure-highlight').remove();
                        })
                        .append('title')
                        .text(
                            'Study Day: ' +
                                d[context.edish.config.exposure_stdy_col] +
                                '-' +
                                d[context.edish.config.exposure_endy_col] +
                                ' (' +
                                (+d[context.edish.config.exposure_endy_col] -
                                    +d[context.edish.config.exposure_stdy_col] +
                                    (+d[context.edish.config.exposure_endy_col] >=
                                        +d[context.edish.config.exposure_stdy_col])) +
                                ' days)\nTreatment: ' +
                                d[context.edish.config.exposure_trt_col] +
                                '\nDose: ' +
                                d[context.edish.config.exposure_dose_col] +
                                ' ' +
                                d[context.edish.config.exposure_dosu_col]
                        );
                }
                //draw a circle if exposure start and end dates are equal
                else {
                    group
                        .append('circle')
                        .classed('se-exposure-circle', true)
                        .attr({
                            cx: function cx(d) {
                                return context.x(+d[context.edish.config.exposure_stdy_col]);
                            },
                            cy: context.plot_height + dy,
                            r: strokeWidth / 2,
                            fill: 'black',
                            'fill-opacity': 0.25,
                            stroke: 'black',
                            'stroke-opacity': 1
                        })
                        .on('mouseover', function(d) {
                            this.setAttribute('r', strokeWidth);

                            //annotate a vertical line in the chart
                            group
                                .append('line')
                                .classed('se-exposure-highlight', true)
                                .attr({
                                    x1: context.x(+d[context.edish.config.exposure_stdy_col]),
                                    y1: 0,
                                    x2: context.x(+d[context.edish.config.exposure_stdy_col]),
                                    y2: context.plot_height,
                                    stroke: 'black',
                                    'stroke-width': 1,
                                    'stroke-opacity': 0.5,
                                    'stroke-dasharray': '3 1'
                                });
                        })
                        .on('mouseout', function(d) {
                            this.setAttribute('r', strokeWidth / 2);

                            //remove vertical line from the chart
                            group.select('.se-exposure-highlight').remove();
                        })
                        .append('title')
                        .text(
                            'Study Day: ' +
                                d[context.edish.config.exposure_stdy_col] +
                                '\nTreatment: ' +
                                d[context.edish.config.exposure_trt_col] +
                                '\nDose: ' +
                                d[context.edish.config.exposure_dose_col] +
                                ' ' +
                                d[context.edish.config.exposure_dosu_col]
                        );
                }
            });
        }
    }

    function onResize() {
        var spaghetti = this;
        var config = this.config;

        addPointTitles$1.call(this);

        //fill circles above the cut point
        var y_col = this.config.y.column;
        this.marks[1].circles
            .attr('fill-opacity', function(d) {
                return d.values.raw[0][y_col + '_flagged'] ? 1 : 0;
            })
            .attr('fill-opacity', function(d) {
                return d.values.raw[0][y_col + '_flagged'] ? 1 : 0;
            });

        //Show  cut lines on mouseover
        this.marks[1].circles
            .on('mouseover', function(d) {
                drawCutLine.call(spaghetti, d);
            })
            .on('mouseout', function() {
                spaghetti.cutLine.remove();
                spaghetti.cutLabel.remove();
            });

        this.marks[0].paths
            .on('mouseover', function(d) {
                drawCutLine.call(spaghetti, d);
            })
            .on('mouseout', function() {
                spaghetti.cutLine.remove();
                spaghetti.cutLabel.remove();
            });

        //annotate treatment exposure
        addExposure.call(this);

        //embiggen clip-path so points aren't clipped
        var radius = this.config.marks.find(function(mark) {
            return mark.type === 'circle';
        }).radius;
        this.svg
            .select('.plotting-area')
            .attr('width', this.plot_width + radius * 2 + 2) // plot width + circle radius * 2 + circle stroke width * 2
            .attr('height', this.plot_height + radius * 2 + 2) // plot height + circle radius * 2 + circle stroke width * 2
            .attr(
                'transform',
                'translate(-' +
                    (radius + 1) + // translate left circle radius + circle stroke width
                    ',-' +
                    (radius + 1) + // translate up circle radius + circle stroke width
                    ')'
            );
    }

    function onDraw$1() {
        var _this = this;

        var spaghetti = this;
        var eDish = this.edish;

        //make sure x-domain includes the extent of the exposure data
        if (this.edish.exposure.include) {
            this.exposure_data = this.edish.exposure.data.filter(function(d) {
                return d[_this.edish.config.id_col] === _this.edish.participantsSelected[0];
            });
            var extent = [
                d3.min(this.exposure_data, function(d) {
                    return +d[_this.edish.config.exposure_stdy_col];
                }),
                d3.max(this.exposure_data, function(d) {
                    return +d[_this.edish.config.exposure_endy_col];
                })
            ];
            if (extent[0] < this.x_dom[0]) this.x_dom[0] = extent[0];
            if (extent[1] > this.x_dom[1]) this.x_dom[1] = extent[1];
        }

        //make sure y domain includes the current cut point for all measures
        var max_value = d3.max(spaghetti.filtered_data, function(f) {
            return f[spaghetti.config.y.column];
        });
        var max_cut = d3.max(spaghetti.filtered_data, function(f) {
            return f[spaghetti.config.y.column + '_cut'];
        });
        var y_max = d3.max([max_value, max_cut]);
        spaghetti.config.y.domain = [0, y_max];
        spaghetti.y_dom = spaghetti.config.y.domain;

        //initialize the measureTable
        if (spaghetti.config.firstDraw) {
            drawMeasureTable.call(eDish, this.participant_data);
            spaghetti.config.firstDraw = false;
        }
    }

    function init$3(d) {
        var chart = this; //the full eDish object
        var config = this.config; //the eDish config
        var matches = d.values.raw[0].raw.filter(function(f) {
            return f.key_measure;
        });

        if ('spaghetti' in chart) {
            chart.spaghetti.destroy();
        }

        //sync settings
        defaultSettings$1.x.column = config.studyday_col;
        defaultSettings$1.color_by = config.measure_col;
        defaultSettings$1.marks[0].per = [config.id_col, config.measure_col];
        defaultSettings$1.marks[1].per = [config.id_col, config.studyday_col, config.measure_col];
        defaultSettings$1.firstDraw = true; //only initailize the measure table on first draw

        //flag variables above the cut-off
        matches.forEach(function(d) {
            var measure = d[config['measure_col']];
            var label = Object.keys(config.measure_values).find(function(key) {
                return config.measure_values[key] == measure;
            });

            d.relative_uln_cut = config.cuts[label].relative_uln;
            d.relative_baseline_cut = config.cuts[label].relative_baseline;

            d.relative_uln_flagged = d.relative_uln >= d.relative_uln_cut;
            d.relative_baseline_flagged = d.relative_baseline >= d.relative_baseline_cut;
        });

        //update the controls
        var spaghettiElement = this.element + ' .participantDetails .spaghettiPlot .chart';

        //Add y axis type options
        controlInputs$1.find(function(f) {
            return f.label == 'Y-axis Display Type';
        }).values = config.display_options.map(function(m) {
            return m.label;
        });

        //sync parameter filter
        controlInputs$1.find(function(f) {
            return f.label == 'Select Labs';
        }).value_col = config.measure_col;

        var spaghettiControls = webcharts.createControls(spaghettiElement, {
            location: 'top',
            inputs: controlInputs$1
        });

        //draw that chart
        if (!this.exposure.include) delete defaultSettings$1.margin.bottom; // use default bottom margin when not plotting exposure
        chart.spaghetti = webcharts.createChart(
            spaghettiElement,
            defaultSettings$1,
            spaghettiControls
        );

        chart.spaghetti.edish = chart; //link the full eDish object
        chart.spaghetti.participant_data = d; //include the passed data (used to initialize the measure table)
        chart.spaghetti.on('layout', onLayout$1);
        chart.spaghetti.on('preprocess', onPreprocess$1);
        chart.spaghetti.on('draw', onDraw$1);
        chart.spaghetti.on('resize', onResize);
        chart.spaghetti.init(matches);

        //add informational footnote
        chart.spaghetti.wrap
            .append('div')
            .attr('class', 'footnote')
            .style('font-size', '0.7em')
            .style('padding-top', '0.1em')
            .text(
                'Points are filled for values above the current reference value. Mouseover a line to see the reference line for that lab.'
            );
    }

    //import { init as initRRatioPlot } from './addPointClick/rRatioPlot/init';

    function addPointClick() {
        var chart = this;
        var config = this.config;
        var points = this.marks[0].circles;

        //add event listener to all participant level points
        points.on('click', function(d) {
            //Stop animation.
            chart.svg.transition().duration(0);
            chart.controls.studyDayPlayButton.datum({ state: 'play' });
            chart.controls.studyDayPlayButton.html('&#9658;');

            // Reset the details view
            clearParticipantDetails.call(chart, d); //clear the previous participant
            chart.config.quadrants.table.wrap.style('display', 'none'); //hide the quadrant summary

            //Update chart object & trigger the participantsSelected event on the overall chart.
            chart.participantsSelected = [d.key];
            chart.events.participantsSelected.data = chart.participantsSelected;
            chart.wrap.node().dispatchEvent(chart.events.participantsSelected);

            //format the eDish chart
            points
                .attr('stroke', '#ccc') //set all points to gray
                .attr('fill', 'white')
                .classed('disabled', true); //disable mouseover while viewing participant details

            d3.select(this)
                .attr('stroke', function(d) {
                    return chart.colorScale(d.values.raw[0][config.color_by]);
                }) //highlight selected point
                .attr('stroke-width', 3);

            //Add elements to the eDish chart
            drawVisitPath.call(chart, d); //draw the path showing participant's pattern over time
            drawRugs.call(chart, d, 'x');
            drawRugs.call(chart, d, 'y');

            //draw the "detail view" for the clicked participant
            chart.participantDetails.wrap.selectAll('*').style('display', null);
            makeParticipantHeader.call(chart, d);
            init$3.call(chart, d); //NOTE: the measure table is initialized from within the spaghettiPlot
            //initRRatioPlot.call(chart, d);
        });
    }

    function addPointTitles$2() {
        var config = this.config;
        var points = this.marks[0].circles;
        points.select('title').remove();
        points.append('title').text(function(d) {
            var xvar = config.x.column;
            var yvar = config.y.column;
            var raw = d.values.raw[0],
                xLabel =
                    config.x.label +
                    ': ' +
                    d3.format('0.2f')(raw[xvar]) +
                    ' @  Day ' +
                    raw[xvar + '_' + config.studyday_col],
                yLabel =
                    config.y.label +
                    ': ' +
                    d3.format('0.2f')(raw[yvar]) +
                    ' @ Day ' +
                    raw[yvar + '_' + config.studyday_col],
                dayDiff = raw['day_diff'] + ' days apart',
                idLabel = 'Participant ID: ' + raw[config.id_col],
                rRatioLabel = config.r_ratio_filter
                    ? '\n' + 'R Ratio: ' + d3.format('0.2f')(raw.rRatio)
                    : '';
            return idLabel + rRatioLabel + '\n' + xLabel + '\n' + yLabel + '\n' + dayDiff;
        });
    }

    function setPointSize() {
        var _this = this;

        var chart = this;
        var config = this.config;
        var points = this.marks[0].circles;

        //create the scale
        var base_size = config.marks[0].radius || config.flex_point_size;
        var max_size = base_size * 5;
        var small_size = base_size / 2;

        if (config.point_size != 'Uniform') {
            var sizeValues_all = d3.merge(
                chart.raw_data.map(function(m) {
                    return m[config.point_size + '_raw'];
                })
            );
            var sizeDomain_all = d3.extent(sizeValues_all, function(f) {
                return f.value;
            });
            var sizeDomain_max = d3.extent(
                chart.raw_data.map(function(m) {
                    return m[config.point_size];
                })
            );
            var sizeDomain_rRatio = [
                0,
                d3.max(this.raw_data, function(d) {
                    return d.rRatio_max;
                })
            ];
            var sizeDomain_nrRatio = [
                0,
                d3.max(this.raw_data, function(d) {
                    return d.nrRatio_max;
                })
            ];

            var sizeDomain = config.point_size == 'rRatio' ? sizeDomain_rRatio : sizeDomain_nrRatio;
            chart.sizeScale = d3.scale
                .linear()
                .range([base_size, max_size])
                .domain(sizeDomain);
        }

        //TODO: draw a legend (coming later?)

        //set the point radius
        points
            .transition()
            .attr('r', function(d) {
                var raw = d.values.raw[0];
                if (raw.outOfRange) {
                    return small_size;
                } else if (config.point_size == 'Uniform') {
                    return base_size;
                } else {
                    return chart.sizeScale(raw[config.point_size]);
                }
            })
            .attr('cx', function(d) {
                return _this.x(d.values.x);
            })
            .attr('cy', function(d) {
                return _this.y(d.values.y);
            });
    }

    function setPointOpacity() {
        var config = this.config;
        var points = this.marks[0].circles;

        points.attr('fill-opacity', function(d) {
            var raw = d.values.raw[0];
            if (config.plot_max_values) {
                // if viewing max values, fill based on time window
                return raw.day_diff <= config.visit_window ? 0.5 : 0;
            } else {
                //fill points after participant's first day
                return config.plot_day < raw.day_range[0] ? 0 : 0.5;
            }
        });
    }

    // Reposition any exisiting participant marks when the chart is resized
    function updateParticipantMarks() {
        var chart = this;
        var config = this.config;

        //reposition participant visit path
        var myNewLine = d3.svg
            .line()
            .x(function(d) {
                return chart.x(d.x);
            })
            .y(function(d) {
                return chart.y(d.y);
            });

        chart.visitPath
            .select('path')
            .transition()
            .attr('d', myNewLine);

        //reposition participant visit circles and labels
        chart.visitPath
            .selectAll('g.visit-point')
            .select('circle')
            .transition()
            .attr('cx', function(d) {
                return chart.x(d.x);
            })
            .attr('cy', function(d) {
                return chart.y(d.y);
            });

        chart.visitPath
            .selectAll('g.visit-point')
            .select('text.participant-visits')
            .transition()
            .attr('x', function(d) {
                return chart.x(d.x);
            })
            .attr('y', function(d) {
                return chart.y(d.y);
            });

        //reposition axis rugs
        chart.x_rug
            .selectAll('text')
            .transition()
            .attr('x', function(d) {
                return chart.x(d[config.display]);
            })
            .attr('y', function(d) {
                return chart.y(chart.y.domain()[0]);
            });

        chart.y_rug
            .selectAll('text')
            .transition()
            .attr('x', function(d) {
                return chart.x(chart.x.domain()[0]);
            })
            .attr('y', function(d) {
                return chart.y(d[config.display]);
            });
    }

    function customizePoints() {
        addPointMouseover.call(this);
        addPointClick.call(this);
        addPointTitles$2.call(this);
        formatPoints.call(this);
        setPointSize.call(this);
        setPointOpacity.call(this);
        updateParticipantMarks.call(this);
    }

    function drawQuadrants() {
        var _this = this;

        var config = this.config;
        var x_var = this.config.x.column;
        var y_var = this.config.y.column;

        var x_cut = this.config.cuts[x_var][config.display];
        var y_cut = this.config.cuts[y_var][config.display];

        //position for cut-point lines
        this.cut_lines.lines
            .filter(function(d) {
                return d.dimension == 'x';
            })
            .attr('x1', this.x(x_cut))
            .attr('x2', this.x(x_cut))
            .attr('y1', this.plot_height)
            .attr('y2', 0);

        this.cut_lines.lines
            .filter(function(d) {
                return d.dimension == 'y';
            })
            .attr('x1', 0)
            .attr('x2', this.plot_width)
            .attr('y1', function(d) {
                return _this.y(y_cut);
            })
            .attr('y2', function(d) {
                return _this.y(y_cut);
            });

        this.cut_lines.backing
            .filter(function(d) {
                return d.dimension == 'x';
            })
            .attr('x1', this.x(x_cut))
            .attr('x2', this.x(x_cut))
            .attr('y1', this.plot_height)
            .attr('y2', 0);

        this.cut_lines.backing
            .filter(function(d) {
                return d.dimension == 'y';
            })
            .attr('x1', 0)
            .attr('x2', this.plot_width)
            .attr('y1', function(d) {
                return _this.y(y_cut);
            })
            .attr('y2', function(d) {
                return _this.y(y_cut);
            });

        //position labels
        this.quadrant_labels.g.attr('display', null); //show labels if they're hidden
        this.quadrant_labels.g
            .select('text.upper-right')
            .attr('x', this.plot_width)
            .attr('y', 0);

        this.quadrant_labels.g
            .select('text.upper-left')
            .attr('x', 0)
            .attr('y', 0);

        this.quadrant_labels.g
            .select('text.lower-right')
            .attr('x', this.plot_width)
            .attr('y', this.plot_height);

        this.quadrant_labels.g
            .select('text.lower-left')
            .attr('x', 0)
            .attr('y', this.plot_height);

        this.quadrant_labels.text.text(function(d) {
            return d.label + ' (' + d.percent + ')';
        });
    }

    function addAxisLabelTitles() {
        var chart = this;
        var config = this.config;

        var details =
            config.display == 'relative_uln'
                ? 'Values are plotted as multiples of the upper limit of normal for the measure.'
                : config.display == 'relative_baseline'
                ? "Values are plotted as multiples of the partipant's baseline value for the measure."
                : config.display == 'absolute'
                ? ' Values are plotted using the raw units for the measure.'
                : null;

        var axisLabels = chart.svg
            .selectAll('.axis')
            .select('.axis-title')
            .select('tspan')
            .remove();

        var axisLabels = chart.svg
            .selectAll('.axis')
            .select('.axis-title')
            .append('tspan')
            .html(function(d) {
                //var current = d3.select(this).text();
                return ' &#9432;';
            })
            .attr('font-size', '0.8em')
            .style('cursor', 'help')
            .append('title')
            .text(details);
    }

    function toggleLegend() {
        var hideLegend = this.config.color_by == 'NONE';
        this.wrap.select('.legend').style('display', hideLegend ? 'None' : 'block');
    }

    function dragStarted() {
        var dimension = d3.select(this).classed('x') ? 'x' : 'y';
        var chart = d3.select(this).datum().chart;

        d3.select(this)
            .select('line.cut-line')
            .attr('stroke-width', '2')
            .attr('stroke-dasharray', '2,2');

        chart.quadrant_labels.g.style('display', 'none');
    }

    function dragged() {
        var chart = d3.select(this).datum().chart;

        var x = d3.event.dx;
        var y = d3.event.dy;

        var line = d3.select(this).select('line.cut-line');
        var lineBack = d3.select(this).select('line.cut-line-backing');

        var dimension = d3.select(this).classed('x') ? 'x' : 'y';

        // Update the line properties
        var attributes = {
            x1: Math.max(0, parseInt(line.attr('x1')) + (dimension == 'x' ? x : 0)),
            x2: Math.max(0, parseInt(line.attr('x2')) + (dimension == 'x' ? x : 0)),
            y1: Math.min(chart.plot_height, parseInt(line.attr('y1')) + (dimension == 'y' ? y : 0)),
            y2: Math.min(chart.plot_height, parseInt(line.attr('y2')) + (dimension == 'y' ? y : 0))
        };

        line.attr(attributes);
        lineBack.attr(attributes);

        var rawCut = line.attr(dimension + '1');
        var current_cut = +d3.format('0.1f')(chart[dimension].invert(rawCut));

        //update the cut control in real time
        chart.controls.wrap
            .selectAll('div.control-group')
            .filter(function(f) {
                return f.description
                    ? f.description.toLowerCase() == dimension + '-axis reference line'
                    : false;
            })
            .select('input')
            .node().value = current_cut;
        var measure = chart.config[dimension].column;
        chart.config.cuts[measure][chart.config.display] = current_cut;
    }

    function dragEnded() {
        var chart = d3.select(this).datum().chart;

        d3.select(this)
            .select('line.cut-line')
            .attr('stroke-width', '1')
            .attr('stroke-dasharray', '5,5');
        chart.quadrant_labels.g.style('display', null);

        //redraw the chart (updates the needed cutpoint settings and quadrant annotations)
        chart.draw();
    }

    // credit to https://bl.ocks.org/dimitardanailov/99950eee511375b97de749b597147d19

    function init$4() {
        var drag = d3.behavior
            .drag()
            .origin(function(d) {
                return d;
            })
            .on('dragstart', dragStarted)
            .on('drag', dragged)
            .on('dragend', dragEnded);

        this.cut_lines.wrap.moveToFront();
        this.cut_lines.g.call(drag);
    }

    function addBoxPlot(
        svg,
        results,
        height,
        width,
        domain,
        boxPlotWidth,
        boxColor,
        boxInsideColor,
        fmt,
        horizontal,
        log
    ) {
        //set default orientation to "horizontal"
        var horizontal = horizontal == undefined ? true : horizontal;

        //make the results numeric and sort
        var results = results
            .map(function(d) {
                return +d;
            })
            .sort(d3.ascending);

        //set up d3.scales
        if (horizontal) {
            var y = log ? d3.scale.log() : d3.scale.linear();
            y.range([height, 0]).domain(domain);
            var x = d3.scale.linear().range([0, width]);
        } else {
            var x = log ? d3.scale.log() : d3.scale.linear();
            x.range([0, width]).domain(domain);
            var y = d3.scale.linear().range([height, 0]);
        }

        var probs = [0.05, 0.25, 0.5, 0.75, 0.95];
        for (var i = 0; i < probs.length; i++) {
            probs[i] = d3.quantile(results, probs[i]);
        }

        var boxplot = svg
            .append('g')
            .attr('class', 'boxplot')
            .datum({ values: results, probs: probs });

        //draw rectangle from q1 to q3
        var box_x = horizontal ? x(0.5 - boxPlotWidth / 2) : x(probs[1]);
        var box_width = horizontal
            ? x(0.5 + boxPlotWidth / 2) - x(0.5 - boxPlotWidth / 2)
            : x(probs[3]) - x(probs[1]);
        var box_y = horizontal ? y(probs[3]) : y(0.5 + boxPlotWidth / 2);
        var box_height = horizontal
            ? -y(probs[3]) + y(probs[1])
            : y(0.5 - boxPlotWidth / 2) - y(0.5 + boxPlotWidth / 2);

        boxplot
            .append('rect')
            .attr('class', 'boxplot fill')
            .attr('x', box_x)
            .attr('width', box_width)
            .attr('y', box_y)
            .attr('height', box_height)
            .style('fill', boxColor);

        //draw dividing lines at d3.median, 95% and 5%
        var iS = [0, 2, 4];
        var iSclass = ['', 'd3.median', ''];
        var iSColor = [boxColor, boxInsideColor, boxColor];
        for (var i = 0; i < iS.length; i++) {
            boxplot
                .append('line')
                .attr('class', 'boxplot ' + iSclass[i])
                .attr('x1', horizontal ? x(0.5 - boxPlotWidth / 2) : x(probs[iS[i]]))
                .attr('x2', horizontal ? x(0.5 + boxPlotWidth / 2) : x(probs[iS[i]]))
                .attr('y1', horizontal ? y(probs[iS[i]]) : y(0.5 - boxPlotWidth / 2))
                .attr('y2', horizontal ? y(probs[iS[i]]) : y(0.5 + boxPlotWidth / 2))
                .style('fill', iSColor[i])
                .style('stroke', iSColor[i]);
        }

        //draw lines from 5% to 25% and from 75% to 95%
        var iS = [[0, 1], [3, 4]];
        for (var i = 0; i < iS.length; i++) {
            boxplot
                .append('line')
                .attr('class', 'boxplot')
                .attr('x1', horizontal ? x(0.5) : x(probs[iS[i][0]]))
                .attr('x2', horizontal ? x(0.5) : x(probs[iS[i][1]]))
                .attr('y1', horizontal ? y(probs[iS[i][0]]) : y(0.5))
                .attr('y2', horizontal ? y(probs[iS[i][1]]) : y(0.5))
                .style('stroke', boxColor);
        }

        boxplot
            .append('circle')
            .attr('class', 'boxplot d3.mean')
            .attr('cx', horizontal ? x(0.5) : x(d3.mean(results)))
            .attr('cy', horizontal ? y(d3.mean(results)) : y(0.5))
            .attr('r', horizontal ? x(boxPlotWidth / 3) : y(1 - boxPlotWidth / 3))
            .style('fill', boxInsideColor)
            .style('stroke', boxColor);

        boxplot
            .append('circle')
            .attr('class', 'boxplot d3.mean')
            .attr('cx', horizontal ? x(0.5) : x(d3.mean(results)))
            .attr('cy', horizontal ? y(d3.mean(results)) : y(0.5))
            .attr('r', horizontal ? x(boxPlotWidth / 6) : y(1 - boxPlotWidth / 6))
            .style('fill', boxColor)
            .style('stroke', 'None');

        var formatx = fmt ? d3.format(fmt) : d3.format('.2f');

        boxplot
            .selectAll('.boxplot')
            .append('title')
            .text(function(d) {
                return (
                    'N = ' +
                    d.values.length +
                    '\n' +
                    'Min = ' +
                    d3.min(d.values) +
                    '\n' +
                    '5th % = ' +
                    formatx(d3.quantile(d.values, 0.05)) +
                    '\n' +
                    'Q1 = ' +
                    formatx(d3.quantile(d.values, 0.25)) +
                    '\n' +
                    'Median = ' +
                    formatx(d3.median(d.values)) +
                    '\n' +
                    'Q3 = ' +
                    formatx(d3.quantile(d.values, 0.75)) +
                    '\n' +
                    '95th % = ' +
                    formatx(d3.quantile(d.values, 0.95)) +
                    '\n' +
                    'Max = ' +
                    d3.max(d.values) +
                    '\n' +
                    'Mean = ' +
                    formatx(d3.mean(d.values)) +
                    '\n' +
                    'StDev = ' +
                    formatx(d3.deviation(d.values))
                );
            });
    }

    function init$5() {
        // Draw box plots
        this.svg.selectAll('g.yMargin').remove();
        this.svg.selectAll('g.xMargin').remove();

        // Y-axis box plot
        var yValues = this.current_data.map(function(d) {
            return d.values.y;
        });
        var ybox = this.svg.append('g').attr('class', 'yMargin');
        addBoxPlot(
            ybox,
            yValues,
            this.plot_height,
            1,
            this.y_dom,
            10,
            '#bbb',
            'white',
            '0.2f',
            true,
            this.config.y.type == 'log'
        );
        ybox.select('g.boxplot').attr(
            'transform',
            'translate(' + (this.plot_width + this.config.margin.right / 2) + ',0)'
        );

        //X-axis box plot
        var xValues = this.current_data.map(function(d) {
            return d.values.x;
        });
        var xbox = this.svg.append('g').attr('class', 'xMargin');
        addBoxPlot(
            xbox, //svg element
            xValues, //values
            1, //height
            this.plot_width, //width
            this.x_dom, //domain
            10, //box plot width
            '#bbb', //box color
            'white', //detail color
            '0.2f', //format
            false, // horizontal?
            this.config.y.type == 'log' // log?
        );
        xbox.select('g.boxplot').attr(
            'transform',
            'translate(0,' + -(this.config.margin.top / 2) + ')'
        );
    }

    function adjustTicks() {
        this.svg
            .selectAll('.x.axis .tick text')
            .attr({
                transform: 'rotate(-45)',
                dx: -10,
                dy: 10
            })
            .style('text-anchor', 'end');
    }

    function updateTimingFootnote() {
        var config = this.config;
        if (config.plot_max_values) {
            var windowText =
                config.visit_window == 0
                    ? 'on the same day'
                    : config.visit_window == 1
                    ? 'within 1 day'
                    : 'within ' + config.visit_window + ' days';
            var timingFootnote =
                ' Points where maximum ' +
                config.measure_values[config.x.column] +
                ' and ' +
                config.measure_values[config.y.column] +
                ' values were collected ' +
                windowText +
                ' are filled, others are empty.';

            this.footnote.timing.text(timingFootnote);
        } else {
            var timingFootnote =
                "Small points are drawn when the selected day occurs outside of the participant's study enrollment; either the first collected measures (empty circle) or last collected measures (filled circle) for the participant are plotted for these points.";
            this.footnote.timing.text(timingFootnote);
        }
    }

    function onResize$1() {
        //add maximum point interactivity, custom title and formatting
        customizePoints.call(this);

        //draw the quadrants and add drag interactivity
        updateSummaryTable.call(this);
        drawQuadrants.call(this);
        init$4.call(this);

        // hide the legend if no group options are given
        toggleLegend.call(this);

        // add boxplots
        init$5.call(this);

        //axis formatting
        adjustTicks.call(this);
        addAxisLabelTitles.call(this);

        //add timing footnote
        updateTimingFootnote.call(this);
    }

    function onDestroy() {
        this.emptyChartWarning.remove();
    }

    var callbacks = {
        onInit: onInit,
        onLayout: onLayout,
        onPreprocess: onPreprocess,
        onDataTransform: onDataTransform,
        onDraw: onDraw,
        onResize: onResize$1,
        onDestroy: onDestroy
    };

    function init$6() {
        var lb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var ex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        //const data = mergeData(lb,ex);
        this.data = {
            lb: lb,
            ex: ex
        };
        this.chart.exposure = {
            include: Array.isArray(ex) && ex.length,
            data: ex
        };
        this.chart.init(lb);
    }

    function destroy() {
        this.chart.destroy();
    }

    function hepexplorer(element, settings) {
        var initial_settings = clone(settings);
        var defaultSettings = configuration.settings();
        var controlInputs = configuration.controlInputs();
        var mergedSettings = Object.assign({}, defaultSettings, settings);
        var syncedSettings = configuration.syncSettings(mergedSettings);
        var syncedControlInputs = configuration.syncControlInputs(controlInputs, syncedSettings);
        var controls = webcharts.createControls(element, {
            location: 'top',
            inputs: syncedControlInputs
        });
        var chart = webcharts.createChart(element, syncedSettings, controls);

        chart.element = element;
        chart.initial_settings = initial_settings;

        //Define callbacks.
        for (var callback in callbacks) {
            chart.on(callback.substring(2).toLowerCase(), callbacks[callback]);
        }
        var hepexplorer = {
            element: element,
            settings: settings,
            chart: chart,
            init: init$6,
            destroy: destroy
        };

        return hepexplorer;
    }

    return hepexplorer;
});
