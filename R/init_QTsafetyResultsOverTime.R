#' Initialize Settings for Safety Results Over Time widget
#'
#' @param data labs data structured as one record per person per visit per measurement. See details for column requirements.
#' @param settings named list of settings
#'
#' @return returns list with data and settings
#'
#' @export

init_QTsafetyResultsOverTime <- function(data, settings) {
    settings$time_settings <- list(
        value_col = settings[["visit_col"]],
        label = "Visit",
        order_col = settings[["visitn_col"]],
        order = NULL,
        rotate_tick_labels = TRUE,
        vertical_space = 100
    )
    
    if(!is.null(settings[["treatment_col"]])) {
        groups_col <- settings[["treatment_col"]]
        settings$groups <- data.frame(value_col = groups_col, label = groups_col)  
    }

    return(list(data = data, settings = settings))
}
