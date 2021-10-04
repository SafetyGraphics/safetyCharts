#' Safety Outlier Explorer
#'
#' @param data labs data structured as one record per person per visit per measurement. See details for column requirements.
#' @param settings named list of settings with the parameters specified below.
#'
#' @details The settings object provides details the columns in the data set.
#'
#' \itemize{
#'  \item{"id_col"}{ID column}
#'  \item{"value_col"}{Value column}
#'  \item{"measure_col"}{Measure column}
#'  \item{"measure_values"}{Measure values}
#'  \item{"studyday_col"}{Study Day (numeric)}
#' }
#'
#' @examples
#'
#' settings <- list(
#'     id_col = "USUBJID",
#'     measure_col = "LBTEST",
#'     measure_values = c("Albumin", "Bilirubin", "Chloride"),
#'     studyday_col = "VISITDY",
#'     value_col = "LBORRES"
#' )
#' safety_outlier_explorer(safetyData::sdtm_lb, settings)
#' @return returns a chart object
#'
#' @import ggplot2
#' @import rlang
#' @import dplyr
#' @importFrom utils hasName
#'
#' @export

safety_outlier_explorer <- function(data, settings) {
    params <- aes_(
        x = as.name(settings$studyday_col),
        y = as.name(settings$value_col),
        group = as.name(settings$id_col)
    )


    if (hasName(settings, "measure_values")) {
        sub <- data %>% filter(!!sym(settings$measure_col) %in% settings$measure_values)
    } else {
        sub <- data
    }

    p <- ggplot(data = sub, params) +
        geom_line(color = "black", alpha = 0.15) +
        labs(x = "Study Day", y = "Lab Value", title = "Lab Overview", subtitle = "") +
        facet_grid(
            rows = as.name(settings$measure_col),
            scales = "free_y"
        ) +
        theme_bw()

    return(p)
}
