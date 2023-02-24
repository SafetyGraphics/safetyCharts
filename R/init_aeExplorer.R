#' Initialize Settings for Adverse Event Explorer widget
#'
#' @param data adverse events data structured as one record per event. See details for column requirements.
#' @param settings named list of settings
#' 
#' @return returns list with data and settings
#'
#' @export


init_aeExplorer <- function(data, settings) {
    # Merge treatment with adverse events.
    dm_sub <- data$dm %>% select(settings[["dm"]][["id_col"]], settings[["dm"]][["treatment_col"]])
    anly <- dm_sub %>% left_join(data$aes) # left join to keep all rows in dm (even if there were no AEs)

    ae_settings <- list()

    ae_settings$variables <- list(
        major = settings[['aes']][["bodsys_col"]],
        minor = settings[['aes']][["term_col"]],
        group = settings[["dm"]][["treatment_col"]],
        id = settings[["dm"]][["id_col"]],
        filters = list(),
        details = list()
    )

    ae_settings$variableOptions <- list(
        group = c(
            settings[['dm']][["treatment_values--group1"]],
            settings[['dm']][["treatment_values--group2"]]
        )
    )

    ae_settings$defaults <- list(
        placeholderFlag = list(
            valueCol = settings[['aes']][["bodsys_col"]],
            values = c("", NA, NULL)
        )
    )
    return(list(data = anly, settings = ae_settings))
}
