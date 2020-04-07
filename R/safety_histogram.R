#' Safety Histogram Chart
#'
#' Create a static Safety Histogram
#'
#' This function generates safety histograms by parameter using user-defined settings,
#' or calling settings from safetyGraphics to generate a static version of the
#' histogram generated in the interactive histogram from safetyGraphics.
#'
#' @param data  a data frame containing the lab data
#' @param settings
#'
#' @import dplyr
#' @import ggplot2
#' @import safetyGraphics
#'
#' @return
#'
#' @export
#'
#' @examples
#' \dontrun{
#' # Create a histogram on lab parameter with SDTM data
#' data <- read.csv('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv', stringsAsFactors = FALSE, na.strings = c("NA",""))
#' TestSettings <- safetyGraphics::generateSettings(standard="sdtm", charts="safetyhistogram")
#' TestSettings[["unit_col"]] <- "STRESU"
#' TestSettings[["description"]] <- "Test page"
#' safety_histogram(data=data, settings=TestSettings)
#' }
#'
#' @seealso \link[safetyGraphics]{}
#' @source Safety Histogram: \url{}.
safety_histogram <- function(data, settings){

  id_col <- settings[["id_col"]]
  value_col <- settings[["value_col"]]
  measure_col <- settings[["measure_col"]]
  normal_col_low <- settings[["normal_col_low"]]
  normal_col_high <- settings[["normal_col_high"]]
  #filters <- settings[["filters"]]
  unit_col <- settings[["unit_col"]]
  #start_value <- settings[["start_value"]]
  #details <- settings[["details"]]
  missingValues <- settings[["missingValues"]] # "" "NA" "N/A"

  measure_selected <- ifelse(!is.null(settings[["start_value"]]),
                             settings[["start_value"]],
                             sort(unique(data[[measure_col]]))[1])

  # prep data
  dd <- data %>%
    select(one_of(c(id_col, value_col, unit_col, measure_col, normal_col_low, normal_col_high))) %>%
    setNames(., c("id_col","value_col","unit_col","measure_col","normal_col_low","normal_col_high")) %>%
    filter(!is.na(value_col)) %>%
    filter(measure_col==measure_selected) %>%
    mutate(bw = 3.5 * sd(value_col)/(n()^(1/3))) # calculate pre-filtering

  # from JS code:
  # The x-domain can be in three states:
  # - the extent of all results
  # - user-defined, e.g. narrower to exclude outliers
  #
  # Bin width is calculated with two variables:
  # - the interquartile range
  # - the number of results
  #
  # 1 When the x-domain is set to the extent of all results, the bin width should be calculated
  #   with the unfiltered set of results, regardless of the state of the current filters.
  #
  # 2 Given a user-defined x-domain, the bin width should be calculated with the results that
  #   fall inside the current domain.


  #########################################
  #   Create figure
  #########################################

  # get labels for fig
  ylab <- "# of\nObservations"
  xlab <- paste0(measure_selected, " (", dd$unit_col[1],")")
  plot_title <- settings[["description"]]
  plot_subtitle <- paste0("Measure: ", xlab)


  # color for histogram
  col <- RColorBrewer::brewer.pal(3, "Set2")[1]

  p <- ggplot(data=dd) +
    geom_rect(aes(xmin=normal_col_low , xmax=normal_col_high, ymin=-Inf, ymax=Inf),
              alpha=0.5, stat="identity", fill = "gray90", color="gray70") +
    geom_histogram(aes(x=value_col), binwidth=dd$bw[1], fill=col, alpha=0.6, color=col) +
    theme_bw() +
    labs(x=xlab,
         y=ylab,
         title=plot_title,
         subtitle=plot_subtitle)+
    theme(axis.title.y = element_text(angle=0),
          panel.border = element_blank(),
          panel.grid.major.x = element_blank(),
          panel.grid.minor.x = element_blank(),
          axis.line = element_line(color = 'black'))+
    scale_y_continuous(expand = c(0,0))

  return(p)

}
