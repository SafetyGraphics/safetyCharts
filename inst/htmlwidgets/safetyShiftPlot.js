HTMLWidgets.widget({

  name: 'safetyShiftPlot',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    return {

      renderValue: function(x) {

        el.innerHTML = "";
        
        x.data = HTMLWidgets.dataframeToD3(x.data);
        
        console.log(x.settings);

        safetyShiftPlot("#" + x.ns, x.settings).init(x.data);

      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});