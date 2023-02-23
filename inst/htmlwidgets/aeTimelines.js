HTMLWidgets.widget({
    name: 'aeTimelines',
    type: 'output',
    factory: function(el, width, height) {
        return {
            renderValue: function(x) {
                el.innerHTML = "";
                x.data = HTMLWidgets.dataframeToD3(x.data);
                console.log(x.settings);
                let wrapID = "#"+d3.select(el).property("id");
                const instance = aeTimelines(wrapID, x.settings).init(x.data);

                // Communicate participantsSelected event with safetyGraphics when Shiny exists in
                // the environment.
                if (!!Shiny) {
                    instance.wrap.on('participantsSelected', function() {
                        console.log('Participant Selected Event:');
                        console.log(d3.event.data);
                        const namespace = el.id.split('-')[0];
                        console.log(namespace);
                        Shiny.setInputValue(
                            `${namespace}-participants_selected`,
                            d3.event.data
                        );
                    });
                }
            },
            resize: function(width, height) {
            }
        };
    }
});
