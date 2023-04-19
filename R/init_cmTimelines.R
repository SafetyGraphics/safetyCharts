#' Initialize Settings for CM Timeline widget
#' 
#' @param data concomitant medication data structured as one record per event. See details for
#' column requirements.
#' @param settings named list of settings
#'
#' @return returns list with data and settings
#'
#' @export

init_cmTimelines <- function(data, settings) {
    settings$color <- list(
        value_col = settings[["indication_col"]]
    )
    data$AESER <- NA
    #settings$highlight <- NULL

    return(list(data = data, settings = settings))
}
