
#' Tendril plot
#'
#' Create a plot using the {{Tendril}} package
#'
#' @param data list of data frames including dataframes named `aes` (adverse events) and `dm` (demographics)
#' @param settings named list of domain-specific settings with the parameters specified below.
#'
#' @details The settings object provides details regarding the columns in the data sets.
#'
#' \itemize{
#'  \item{"settings$dm$id_col"}{ID column}
#'  \item{"settings$dm$treatment_col"}{Treatment column}
#'  \item{"settings$dm$treatment_values--group1"}{Name of treatment 1}
#'  \item{"settings$dm$treatment_values--group2"}{Name of treatment 2}
#'  \item{"settings$aes$id_col"}{ID column)}
#'  \item{"settings$aes$bodsys_col"}{Body System}
#'  \item{"settings$aes$stdy_col"}{Study Day}
#' }
#' @return returns a chart object
#'
#' @import dplyr
#' @importFrom Tendril Tendril
#' @importFrom rlang sym
#'
#' @export
#'
tendril_chart <- function(data, settings) {
    #########################################
    #   Prep data
    #########################################

    # Convert settings to symbols ready for standard evaluation
    dm_id_sym <- rlang::sym(settings[["dm"]][["id_col"]])
    dm_treatment_sym <- rlang::sym(settings[["dm"]][["treatment_col"]])

    ae_id_sym <- rlang::sym(settings[["aes"]][["id_col"]])
    ae_bodsys_sym <- rlang::sym(settings[["aes"]][["bodsys_col"]])
    ae_stdy_sym <- rlang::sym(settings[["aes"]][["stdy_col"]])

    aes_arm <- dplyr::left_join(
        data$aes,
        data$dm %>% dplyr::select(!!dm_id_sym, !!dm_treatment_sym),
        by = settings[["dm"]][["id_col"]]
    )

    # get treatments
    treatments <- c(
        settings[["aes"]][["treatment_values--group1"]],
        settings[["aes"]][["treatment_values--group2"]]
    )

    # TODO check that the treatments exsits in the data

    if (length(treatments) < 2) {
        all_treatments <- unique(aes_arm %>% dplyr::pull(!!dm_treatment_sym))
        treatments <- all_treatments[1:2]
    }

    # subject data
    subj <- data$dm %>%
        dplyr::count(!!dm_id_sym, !!dm_treatment_sym) %>%
        dplyr::select(-n) %>%
        as.data.frame()

    data.tendril <- Tendril::Tendril(
        mydata = aes_arm,
        rotations = rep(3, dim(aes_arm)[1]),
        AEfreqThreshold = 5,
        Tag = "Comment",
        Treatments = treatments,
        Unique.Subject.Identifier = settings[["aes"]][["id_col"]],
        Terms = settings[["aes"]][["bodsys_col"]],
        Treat = settings[["dm"]][["treatment_col"]],
        StartDay = settings[["aes"]][["stdy_col"]],
        SubjList = subj,
        SubjList.subject = settings[["dm"]][["id_col"]],
        SubjList.treatment = settings[["dm"]][["treatment_col"]],
        filter_double_events = TRUE,
        suppress_warnings = TRUE
    )

    p <- plot(
        data.tendril,
        coloring = "OR",
        percentile = TRUE
    )

    return(p)
}
