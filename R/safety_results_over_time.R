#' Safety Results Over Time plot
#'
#' @param data labs data structured as one record per person per visit per measurement. See details for column requirements.
#' @param settings named list of settings with the parameters specified below.
#'
#' @details The settings object provides details the columns in the data set.
#'
#' \itemize{
#'  \item{"value_col"}{Value column}
#'  \item{"measure_col"}{Measure column}
#'  \item{"measure_values"}{Measure values}
#'  \item{"visit_col"}{Study Visit}
#'  \item{"visitn_col"}{Study Number}
#'  \item{"group_col"}{Grouping column}
#'  \item{"violins"}{Show Violin plots?}
#'  \item{"boxplots"}{Show Box Plots?}
#'  \item{"axis"}{set to "log" to use a log transformed axis, linear otherwise}
#'  \item{"drop_visit_string"}{Drop visits that contain this string. e.g. "unscheduled"}
#' }
#'
#' @examples
#' library(dplyr)
#' lb <- safetyData::sdtm_lb
#' sub_ids <- unique(lb$USUBJID)[1:100]
#' lb<-lb %>% filter(USUBJID %in% sub_ids)
#' settings <- list(
#'     value_col = "LBORRES",
#'     measure_col = "LBTEST",
#'     measure_values = c("Chloride"),
#'     visit_col = "VISIT",
#'     visitn_col = "VISITNUM",
#'     axis = "log"
#' )
#' safety_results_over_time(lb, settings)
#'
#' # remove unscheduled visits, add violin plot and 2nd panel
#' settings$drop_visit_string <- "unscheduled"
#' settings$violins <- TRUE
#' settings$measure_values <- c("Albumin")
#' safety_results_over_time(lb, settings)
#'
#' # add grouping by treatment
#' dm_sub <- safetyData::sdtm_dm %>% select(USUBJID, ARM)
#' dm_lb <- dm_sub %>% left_join(lb)
#' settings$group_col <- "ARM"
#' safety_results_over_time(dm_lb, settings)
#' 
#' @return returns a chart object
#'
#' @import ggplot2
#' @import dplyr
#' @importFrom utils hasName
#' @importFrom stringr str_detect
#' 
#' @export

safety_results_over_time <- function(data, settings) {

    #########################################
    #  Set default values
    #########################################
    if (!hasName(settings, "axis")) settings$axis <- "linear"
    if (!hasName(settings, "violins")) settings$violins <- FALSE
    if (!hasName(settings, "boxplots")) settings$boxplots <- TRUE
    if (!hasName(settings, "group_col")) settings$group_col <- "Overall"
    if (!hasName(settings, "drop_visit_string")) settings$drop_visit_string <- ""

    #########################################
    #  Chart appearance settings
    #########################################
    if (settings$group_col == "Overall") {
        data$Overall <- "Overall"
        colors <- "gray80"
    } else {
        colors <- c(RColorBrewer::brewer.pal(9, "Set1")[c(2, 3, 1, 4:9)], RColorBrewer::brewer.pal(8, "Set2"))
    }

    alpha <- ifelse(settings[["violins"]] & settings[["boxplots"]], 0.7, 1)
    pd <- position_dodge(width = 0.75, preserve = "total")

    #########################################
    #   Prep data
    #########################################

    # Convert settings to symbols ready for standard evaluation
    visit_sym <- sym(settings[["visit_col"]])
    visitn_sym <- sym(settings[["visitn_col"]])
    value_sym <- sym(settings[["value_col"]])
    measure_sym <- sym(settings[["measure_col"]])

    # Filter to selected measures if specified
    if (hasName(settings, "measure_values")) {
        dd <- data %>% filter(!!measure_sym %in% settings$measure_values)
    } else {
        dd <- data
    }

    # Drop unscheduled visits if specified
    if (nchar(settings[["drop_visit_string"]]) > 0) {
        dd <- filter(
            dd,
            !str_detect(
                tolower(!!visit_sym),
                tolower(settings[["drop_visit_string"]])
            )
        )
    }

    dd <- dd %>%
        mutate(!!value_sym := as.numeric(!!value_sym)) %>% # coerce result to numeric
        filter(!is.na(!!value_sym)) %>% # drop visits without data
        mutate(!!visit_sym := forcats::fct_drop(as.factor(!!visit_sym))) %>% # remove unused factor levels
        mutate(!!visit_sym := forcats::fct_reorder(!!visit_sym, !!visitn_sym)) # reorder visits by visit number

    #########################################
    #   Create figure
    #########################################

    # initiate plot - overall or by group
    params <- aes_(
        x = as.name(settings$visit_col),
        y = as.name(settings$value_col),
        color = as.name(settings$group_col)
    )

    p <- ggplot(data = dd, params) +
        scale_color_manual(values = colors) +
        facet_grid(
            rows = as.name(settings$measure_col),
            scales = "free_y"
        )

    if (settings[["violins"]]) {
        p <- p +
            geom_violin(
                alpha = alpha,
                position = pd
            )
    }

    if (settings[["boxplots"]]) {
        p <- p +
            geom_boxplot(
                alpha = alpha,
                position = position_dodge2(width = 0.75, preserve = "single"),
                fatten = 1,
                outlier.alpha = 0.8,
                outlier.shape = 21
            )
    }

    if (settings[["axis"]] == "log") {
        p <- p +
            scale_y_log10() +
            annotation_logticks(sides = "l")

        summary_fun <- function(x) {
            log10(mean(10**x))
        }
    } else {
        summary_fun <- mean
    }

    p <- p +
        coord_cartesian(clip = "off") +
        stat_summary(
            fun.y = summary_fun,
            geom = "point",
            position = pd
        )

    p <- p +
        theme_bw() +
        theme(
            axis.text.x = element_text(
                angle = 45,
                hjust = 1
            ),
            legend.position = "bottom"
        )

    return(p)
}
