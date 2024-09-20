// Communicate participantsSelected event with safetyGraphics when Shiny exists in the environment.
const addClickListener = function(instance, el) {
    if (!!Shiny) {
        const wrap = instance.hasOwnProperty('chart')
            ? instance.chart.wrap
            : instance.wrap;

        if (wrap !== undefined)
            wrap.on('participantsSelected', function() {
                console.log(
                    `Selected participant ID: ${d3.event.data}`
                );

                const namespace = el.id.split('-')[0];

                Shiny.setInputValue(
                    `${namespace}-participants_selected`,
                    d3.event.data
                );
            });
    }
}
