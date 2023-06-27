#' Render an htmlwidget using standard safetyGraphics workflow
#' 
#' @param widgetName name of the widget saved in safetyCharts 
#' @param data named list of current data sets
#' @param mapping named list with the current data mappings
#'
#' @importFrom htmlwidgets createWidget sizingPolicy
#' @importFrom jsonlite toJSON
#'
#' @export
 
render_widget <- function(widgetName, data, mapping) {
    params <- list(
        data=data,
        settings=mapping
    )

    widgetParams <- list(
        name=widgetName,
        package='safetyCharts',
        sizingPolicy = htmlwidgets::sizingPolicy(viewer.suppress=TRUE, browser.external = TRUE),
        x=list()
    )

    widgetParams$x$data <- params$data
    widgetParams$x$rSettings <- params$settings
    widgetParams$x$settings <- jsonlite::toJSON(
        params$settings,
        auto_unbox = TRUE,
    null = "null"
    )
    params <- widgetParams

    # Run the chart
    do.call(htmlwidgets::createWidget, params)
}

