#' Initialize Settings for Safety Results Over Time widget
#'
#' @param data labs data structured as one record per person per visit per measurement. See details for column requirements.
#' @param settings named list of settings
#'
#' @return returns list with data and settings
#'
#' @export

init_safetyResultsOverTime <- function(data, settings) {
    settings$time_settings <- list(
        value_col = settings[["visit_col"]],
        label = "Visit",
        order_col = settings[["visitn_col"]],
        order = NULL,
        rotate_tick_labels = TRUE,
        vertical_space = 100
    )

    return(list(data = data, settings = settings))
}
