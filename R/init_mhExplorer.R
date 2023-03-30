#' Initialize Settings for Medical History Explorer widget
#'
#' @param data medical history and demographics data.
#' @param settings named list of settings
#' 
#' @return returns list with data and settings
#'
#' @export


init_mhExplorer <- function(data, settings) {
    print("MH TIME")
    # Merge treatment with adverse events.
    dm_sub <- data$dm %>% select(settings[["dm"]][["id_col"]], settings[["dm"]][["treatment_col"]])
    anly <- dm_sub %>% left_join(data$mh) # left join to keep all rows in dm (even if there were no AEs)

    settings <- c(settings$mh, settings$labs)

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
