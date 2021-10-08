#' Tendril plot
#'
#' Create a survival plot using the {{survminer}} package
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
#' @import Tendril
#' @import rlang
#' @import dplyr
#'
#' @export
#'
timeToAdverseEvent <- function(data, settings) {
    require(dplyr)
    require(survival)
    require(survminer)

    ids_dm <- data$dm$USUBJID %>% unique
    ids_ae <- data$aes$USUBJID %>% unique
    ids_cnsr <- setdiff(ids_dm, ids_ae)

    dm <- data$dm %>%
        filter(!is.na(RFSTDTC)) %>%
        mutate(
            RFSTDT = as.Date(RFSTDTC),
            RFENDT = as.Date(RFENDTC)
        ) %>%
        select(USUBJID, ARM, RFSTDT, RFENDT)

    ae <- data$aes %>%
        mutate(
            AESTDT = as.Date(ASTDT)
        ) %>%
        left_join(
            dm,
            by = c('USUBJID' = 'USUBJID')
        ) %>%
        filter(RFSTDT <= AESTDT) %>%
        arrange(USUBJID, AESTDT) %>%
        group_by(USUBJID) %>%
        filter(row_number() == 1) %>%
        ungroup %>%
        select(USUBJID, AESTDT)

    tte <- dm %>%
        left_join(
            ae,
            by = c('USUBJID' = 'USUBJID')
        ) %>%
        mutate(
            stdt = RFSTDT,
            endt = coalesce(AESTDT, RFENDT),
            time = (endt - stdt + 1) %>% as.numeric,
            cnsr = (USUBJID %in% ids_cnsr) %>% as.numeric
        ) %>%
        select(USUBJID, ARM, RFSTDT, stdt, AESTDT, RFENDT, endt, time, cnsr)

    fit <- survfit(
        Surv(time, cnsr) ~ ARM,
        data = tte
    )

    p <- ggsurvplot(
        fit = fit,
        data = tte,
        xlab = 'Days',
        ylab = 'Overall survival probability',
        risk.table = TRUE
    )

    return(p)
}
