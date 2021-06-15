HTMLWidgets.widget({
  name: "hepExplorer",
  type: "output",

  factory: function(el, width, height) {

    return {
      renderValue: function(rSettings) {
        console.log(rSettings)
        el.innerHTML=""
        let settings = rSettings.settings;
        let data = HTMLWidgets.dataframeToD3(rSettings.data);
        let wrapID = rSettings.ns ? "#"+rSettings.ns : "#"+d3.select(el).property("id");
        var chart = hepexplorer(wrapID, settings)
        chart.init(data);
      },
      resize: function(width, height) {
        // TODO: code to re-render the widget with a new size
      }

    };
  }
});
