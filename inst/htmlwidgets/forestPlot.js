HTMLWidgets.widget({
    name: 'forestPlot',
    type: 'output',
    factory: function(el, width, height) {

        return {
        // renderValue delivers data & settings to the DOM element
        // x = data & settings
            renderValue: function(x) {

                x.data = HTMLWidgets.dataframeToD3(x.data);
                console.log(x);        
                forestplot(x.data, el, x.groups, x.pairs);
            },

            resize: function(width, height) {
            // TODO: code to re-render the widget with a new size
            }
        };
    }
});