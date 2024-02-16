#' Initialize Settings for Adverse Event Explorer widget
#'
#' @param data `list` Named list of data frames that includes participant-level subject data (`dm`)
#' and event-level adverse event data (`aes`).
#' @param settings `list` Named list of settings.
#' 
#' @return returns list with data and settings
#'
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
        data$dm <- data$dm %>% dplyr::mutate(group_placeholder="All")
        settings[["dm"]][["treatment_col"]] <- "group_placeholder"
    }
    
    # Merge treatment with adverse events.
    dm_sub <- data$dm %>%
        dplyr::select(
            settings[["dm"]][["id_col"]],
            settings[["dm"]][["treatment_col"]]
        )

    # left join to keep all rows in dm (even if there were no AEs)
    anly <- dm_sub %>%
        dplyr::left_join(
            data$aes,
            settings[['dm']][['id_col']]
        )

    ae_settings <- list()

    ae_settings$variables <- list(
        major = settings[['aes']][["bodsys_col"]],
        minor = settings[['aes']][["term_col"]],
        group = settings[["dm"]][["treatment_col"]],
        id = settings[["dm"]][["id_col"]]
    )

    # Pass data filters through.
    if ('filters' %in% names(settings)) {
        if (is.character(settings$filters)) {
            settings$filters <- settings$filters %>%
                purrr::map(
                    ~ list(
                        label = .x,
                        type = ifelse(
                            .x %in% setdiff(
                                names(data$ae),
                                names(data$dm)
                            ),
                            'event',
                            'participant'
                        ),
                        value_col = .x
                    )
                )
        } else if (!is.list(settings$details)) {
            cli::cli_alert_warning(
                '[ filters ] must be a character vector or a list of column specifications with these key=value pairs:'
            )

            cli::cli_bullets(
                '[ label=<column label> ]',
                '[ type=<"participant" or "event"> ]',
                '[ value_col=<column name> ]'
            )

            settings$details <- list()
        } else {
            details <- settings$details %>%
                purrr::keep(
                    ~ 'value_col' %in% names(.x)
                )

            if (length(details) < length(settings$details))
                cli::cli_alert_warning(
                    '{length(settings$details) - length(details)} column specification(s) without a key=value pair of [ value_col=<column name> ] removed.'
                )

            settings$details <- details
        }

        ae_settings$variables$filters <- settings$filters
    } else {
        ae_settings$variables$filters <- list()
    }

    # Pass listing columns through with an expected structure of:
    #     list(
    #         value_col = 'column_name',
    #         label = 'column_label'
    #     )
    if ('details' %in% names(settings)) {
        if (is.character(settings$details)) {
            settings$details <- settings$details %>%
                purrr::map(
                    ~ list(
                        value_col = .x
                    )
                )
        } else if (!is.list(settings$details)) {
            cli::cli_alert_warning(
                '[ details ] must be a character vector or a list of column specifications with these key=value pairs:'
            )

            cli::cli_bullets(
                '[ label=<column label> ]',
                '[ value_col=<column name> ]'
            )

            settings$details <- list()
        } else {
            details <- settings$details %>%
                purrr::keep(
                    ~ 'value_col' %in% names(.x)
                )

            if (length(details) < length(settings$details))
                cli::cli_alert_warning(
                    '{length(settings$details) - length(details)} column specification(s) without a key=value pair of [ value_col=<column name> ] removed.'
                )

            settings$details <- details
        }


        ae_settings$variables$details <- settings$details
    } else {
        ae_settings$variables$details <- list()
    }

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
