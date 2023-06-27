const defineWidget = function(name, fn) {
    HTMLWidgets.widget({
        name: name,
        type: "output",
        factory: function(el, width, height) {
            return {
                renderValue: function(inputs) {
                    console.log(inputs);
                    // clear element
                    el.innerHTML = "";

                    // define widget inputs
                    const wrapID = inputs.ns
                        ? `#${inputs.ns}`
                        : `#${d3.select(el).property("id")}`;
                    const settings = inputs.settings;
                    const data = HTMLWidgets.dataframeToD3(inputs.data);

                    // instantiate widget
                    const instance = fn(
                        wrapID,
                        settings
                    );

                    // render widget
                    instance.init(data);

                    // add click event listener to send particpiant ID to safetyGraphics
                    addClickListener(instance, el);
                },
                resize: function(width, height) {
                }
            };
        }
    });
}
