timeToAE <- function(data, settings, ae = 'Any AE', stratum = 'None') {
    require(dplyr)
    require(survival)
    require(survminer)

    # Participant-level data
    participants <- data$dm %>%
        filter(!is.na(RFSTDTC)) %>%
        mutate(
            RFSTDT = as.Date(RFSTDTC),
            RFENDT = as.Date(RFENDTC)
        )

    # Event-level data
    aes <- data$aes %>%
        filter(
            ae == 'Any AE' | !!sym(settings$aes$term_col) == ae
        ) %>%
        mutate(
            AESTDT = as.Date(ASTDT)
        )

    # Get first instance of adverse event for each participant.
    first_ae <- aes %>%
        left_join(
            participants,
            settings$dm$id_col
        ) %>%
        filter(RFSTDT <= AESTDT) %>%
        arrange(!!sym(settings$dm$id_col), AESTDT) %>%
        group_by(!!sym(settings$dm$id_col)) %>%
        filter(row_number() == 1) %>%
        ungroup %>%
        select(!!sym(settings$dm$id_col), AESTDT)

    # Get list of participants without adverse event.
    censored <- setdiff(
        participants[[settings$dm$id_col]],
        first_ae[[settings$dm$id_col]]
    )

    # Merge all participants with participants who experienced an event and define time to event.
    tte <- participants %>%
        left_join(
            first_ae,
            settings$dm$id_col
        ) %>%
        mutate(
            stdt = RFSTDT,
            endt = coalesce(AESTDT, RFENDT),
            time = (endt - stdt + 1) %>% as.numeric,
            cnsr = (!!sym(settings$dm$id_col) %in% censored) %>% as.numeric,
            event = !as.logical(cnsr) %>% as.numeric
        )

    # Define survival formula.
    fit <- NULL
    legend.labs <- NULL
    if (stratum == 'None' | is.null(stratum))
        fit = survfit(
            Surv(time, event) ~ 1,
            data = tte
        )
    else {
        tte$stratum <- tte[[stratum]]
        legend.labs = unique(tte$stratum)
        fit = survfit(
            Surv(time, event) ~ stratum,
            data = tte
        )
    }

    # Plot survival curve.
    p <- ggsurvplot(
        fit = fit,
        data = tte,
        title = paste('Time to', ae),
        xlab = 'Study Day',
        ylab = 'Survival probability',
        risk.table = TRUE,
        legend.labs = legend.labs
    )

    return(p)
}
