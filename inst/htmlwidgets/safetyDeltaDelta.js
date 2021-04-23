HTMLWidgets.widget({
  name: "safetyDeltaDelta",
  type: "output",

  factory: function(el, width, height) {

    return {
      renderValue: function(rSettings) {
        console.log("widget started ...")
        console.log(el)
        console.log(rSettings)
        //console.log(rSettings)
        //el.innerHTML = "<div class='.hepexplorer-wrap'></div>";
        el.innerHTML=""
        let settings = rSettings.settings;
        let data = HTMLWidgets.dataframeToD3(rSettings.data);
        let wrapID = rSettings.ns ? "#"+rSettings.ns : "#"+d3.select(el).property("id");
        var chart = safetyDeltaDelta(wrapID, settings)
        chart.init(data);
      },
      resize: function(width, height) {
        // TODO: code to re-render the widget with a new size
      }

    };
  }
});
//HTMLWidgets.widget({
//
//  name: 'safetyDeltaDelta',
//
//  type: 'output',
//
//  factory: function(el, width, height) {
//
//
//    return {
//
//      renderValue: function(x) {
//       
//       el.innerHTML = "";
//        
//       x.data = HTMLWidgets.dataframeToD3(x.data);
//       
//       console.log(x.settings);
//       
//       safetyDeltaDelta(el, x.settings).init(x.data);
//
//      },
//
//      resize: function(width, height) {
//
//        // TODO: code to re-render the widget with a new size
//
//      }
//
//    };
//  }
//});
