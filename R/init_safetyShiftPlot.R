#' Initialize Settings for Safety Shift Plot widget
#'
#' @param data labs data structured as one record per person per visit per measurement. See details for column requirements.
#' @param settings named list of settings
#'
#' @return returns list with data and settings
#'
#' @export

init_safetyShiftPlot <- function(data, settings) {
    settings$time_col <- settings[["visit_col"]]

    return(list(data = data, settings = settings))
}
