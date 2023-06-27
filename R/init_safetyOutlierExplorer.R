#' Initialize Settings for Safety Outlier Explorer widget
#'
#' @param data labs data structured as one record per person per visit per measurement. See details for column requirements.
#' @param settings named list of settings
#'
#' @return returns list with data and settings
#'
#' @importFrom dplyr left_join select
#' @importFrom stats setNames
#'
#' @export

init_safetyOutlierExplorer <- function(data, settings) {
    # Keep only those column in DM not present in LB.
    dm <- data$dm %>%
        dplyr::select(
            settings$dm$id_col,
            setdiff(
                names(data$dm),
                names(data$labs)
            )
        )

    # Merge DM onto LB.
    labs <- data$labs %>%
        dplyr::left_join(
            dm,
            stats::setNames(
                settings$dm$id_col,
                settings$labs$id_col
            )
        )

    # Capture both ordinal and discrete longitudinal settings.
    settings$labs$time_cols <- data.frame(
        value_col = c(
            settings$labs$visit_col,
            settings$labs$studyday_col
        ),
        type = c(
            "ordinal",
            "linear"
        ),
        order_col = c(
            settings$labs$visitn_col,
            "null"
        ),
        label = c(
            "Visit",
            "Study Day"
        ),
        rotate_tick_labels = c(
            T,
            F
        ),
        vertical_space = c(
            100,
            0
        )
    )

    return(
        list(
            data = labs,
            settings = settings$labs
        )
    )
}
