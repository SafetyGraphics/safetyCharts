#' Initialize Settings for Paneled Outlier Explorer widget
#'
#' @param data labs data structured as one record per person per visit per measurement. See details for column requirements.
#' @param settings named list of settings
#'
#' @return returns list with data and settings
#'
#' @export

init_paneledOutlierExplorer <- function(data, settings) {
    settings$time_cols <- data_frame(
        value_col = c(settings[["visit_col"]], settings[["studyday_col"]]),
        type = c("ordinal", "linear"),
        order_col = c(settings[["visitn_col"]], "null"),
        label = c("Visit", "Study Day"),
        rotate_tick_labels = c(T, F),
        vertical_space = c(100, 0)
    )

    return(list(data = data, settings = settings))
}
