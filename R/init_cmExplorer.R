#' Initialize Settings for Conmeds Explorer widget
#'
#' @param data Con meds and demographics data. See details for column requirements.
#' @param settings named list of settings
#' 
#' @return returns list with data and settings
#'
#' @export

init_cmExplorer <- function(data, settings) {
    # Merge treatment with adverse events.
    dm_sub <- data$dm %>%
        select(
            settings[["dm"]][["id_col"]],
            settings[["dm"]][["treatment_col"]]
        )

    # left join to keep all rows in dm (even if there were no CMs)
    anly <- dm_sub %>%
        left_join(
            data$cm,
            settings[['dm']][['id_col']]
        )

    settings <- settings$cm

    settings$variables <- list(
        major = settings[["class_col"]],
        minor = settings[["code_col"]],
        group = settings[["trt_col"]],
        id = paste0(settings[["id_col"]]),
        filters = list(),
        details = list()
    )

    settings$variableOptions <- list(
        group = c(
            settings[["treatment_values--group1"]],
            settings[["treatment_values--group2"]]
        )
    )

    settings$defaults <- list(
        placeholderFlag = list(
            valueCol = settings[["class_col"]],
            values = c("", NA, NULL)
        )
    )
    return(list(data = anly, settings = settings))
}
