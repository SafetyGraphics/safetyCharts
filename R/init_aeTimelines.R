#' Initialize Settings for AE Timeline widget
#' 
#' @param data labs data structured as one record per person per visit per measurement. See details for column requirements.
#' @param settings named list of settings
#'
#' @return returns list with data and settings
#'
#' @export

init_aeTimelines <- function(data, settings) {
    
    settings$color <- list(
        value_col = settings[["severity_col"]]
    )
    settings$highlight <- list(
        value_col = settings[["serious_col"]]
    )

    return(list(data = data, settings = settings))
}
