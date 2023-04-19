#' Initialize Settings for Adverse Event Explorer widget
#'
#' @param data adverse events data structured as one record per event. See details for column requirements.
#' @param settings named list of settings
#' 
#' @return returns list with data and settings
#'
#' @importFrom magrittr %>%
#' @import dplyr
#'
#' @export


init_aeExplorer <- function(data, settings) {
    
    # creates flag if treatment_col is missing to trigger actions to avoid downstream JS errors and enable visualization of blinded(no treatment_col) data
    missing_trt_flag <- (
        is.null(settings[["dm"]][["treatment_col"]]) || # Check NULL first and evaluate logic left to right
        trimws(settings[["dm"]][["treatment_col"]])==""
    )

    #if no treatment_col provided, create dummy treatment_col for group setting so that ae explorer JS doesn't bomb
    if (missing_trt_flag) {
        data$dm <- data$dm %>% mutate(group_placeholder="All")
        settings[["dm"]][["treatment_col"]] <- "group_placeholder"
    }
    
    # Merge treatment with adverse events.
    dm_sub <- data$dm %>%
        select(
            settings[["dm"]][["id_col"]],
            settings[["dm"]][["treatment_col"]]
        )

    # left join to keep all rows in dm (even if there were no AEs)
    anly <- dm_sub %>%
        left_join(
            data$aes,
            settings[['dm']][['id_col']]
        )

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
    
    #if no treatment_col provided, remove total column and group selection dropdown
    if (missing_trt_flag){
        ae_settings$defaults[["groupCols"]] = FALSE
        ae_settings$defaults[["useVariableControls"]] = FALSE
    }
    
    return(list(data = anly, settings = ae_settings))
}
