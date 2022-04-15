#' Initialize Settings for Paneled Outlier Explorer widget
#'
#' @param data labs data structured as one record per person per visit per measurement. See details for column requirements.
#' @param settings named list of settings
#'
#' @return returns list with data and settings
#'
#' @export

init_paneledOutlierExplorer <- function(data) {
  
  settings = list(
    measure_col = 'TEST',
    time_cols = list(
      list(
        value_col = "VISIT",
        type = "ordinal",
        order = NULL,
        order_col = "VISITNUM",
        label = "VISIT",
        rotate_tick_labels = TRUE,
        vertical_space = 75
      ),
      list(
        value_col = 'DY',
        type = 'linear',
        order = NULL,
        order_col = 'DY',
        label = 'Study Day',
        rotate_tick_labels = FALSE,
        vertical_space = 0
      )
    ),
    value_col = 'STRESN',
    id_col = 'USUBJID',
    unit_col = 'STRESU',
    lln_col = 'STNRLO',
    uln_col = 'STNRHI',
    measures = NULL,
    filters = NULL,
    multiples_sizing = list(
      width = 350,
      height = 175
    ),
    inliers = FALSE,
    normal_range_method = 'LLN-ULN',
    normal_range_sd = 1.96,
    normal_range_quantile_low = 0.05,
    normal_range_quantile_high = 0.95,
    visits_without_data = FALSE,
    unscheduled_visits = FALSE,
    unscheduled_visit_pattern = '/unscheduled|early termination/i',
    unscheduled_visit_values = NULL,
    x = list(
      type = NULL,
      column = NULL,
      label = NULL
    ),
    y = list(
      type = 'linear',
      column = NULL,
      label = ''
    ),
    marks = list(
      list(
        type = 'line',
        per = NULL, #sync to [ id_col ] and [ measure_col ]
        attributes = list(
          'stroke-width' = 1,
          'stroke-opacity' = 0.2,
          stroke = 'black'
        )
      )
    ),
    resizable = FALSE,
    scale_text = FALSE,
    margin = list(
      bottom = 0,
      left = 50
    ),
    gridlines = 'xy'
  )
  
  return(list(data = data, settings = settings))
  
}
