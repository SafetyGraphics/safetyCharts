#' Initialize Settings for Paneled Outlier Explorer widget
#'
#' @param data labs data structured as one record per person per visit per measurement. See details for column requirements.
#' @param settings named list of settings
#'
#' @return returns list with data and settings
#'
#' @export

init_paneledOutlierExplorer <- function(
    data,
    x_value_col = "VISIT",
    x_type = 'ordinal',
    x_order = NULL,
    x_order_col = 'VISITNUM',
    x_label = "VISIT",
    x_rotate_tick_labels = TRUE,
    x_vertical_space = 75,
    y_value_col = 'DY',
    y_type = 'linear',
    y_order = NULL,
    y_order_col = 'DY',
    y_label = 'Study Day',
    y_rotate_tick_labels = FALSE,
    y_vertical_space = 0,
    value_col = 'STRESN',
    id_col = 'USUBJID',
    unit_col = 'STRESU',
    lln_col = 'STNRLO',
    uln_col = 'STNRHI',
    measures = NULL,
    filters = NULL,
    multiples_sizing_width = 350,
    mutliples_sizing_height = 175,
    inliers = FALSE,
    normal_range_method = 'LLN-ULN',
    normal_range_sd = 1.96,
    normal_range_quantile_low = 0.05,
    normal_range_quantile_high = 0.95,
    visits_without_data = FALSE,
    unscheduled_visits = FALSE,
    unscheduled_visit_pattern = '/unscheduled|early termination/i',
    unscheduled_visit_values = NULL
) {
  
  settings = list(
    measure_col = 'TEST',
    time_cols = list(
      list(
        value_col = x_value_col,
        type =  x_type,
        order = x_order,
        order_col = x_order_col,
        label = x_label,
        rotate_tick_labels = x_rotate_tick_labels,
        vertical_space = x_vertical_space
      ),
      list(
        value_col = y_value_col,
        type = y_type,
        order = y_order,
        order_col = y_order_col,
        label = y_label,
        rotate_tick_labels = y_rotate_tick_labels,
        vertical_space = y_vertical_space
      )
    ),
    value_col = value_col,
    id_col = id_col,
    unit_col = unit_col,
    lln_col = lln_col,
    uln_col = uln_col,
    measures = measures,
    filters = filters,
    multiples_sizing = list(
      width = 350,
      height = 175
    ),
    inliers = inliers,
    normal_range_method = normal_range_method,
    normal_range_sd = normal_range_sd,
    normal_range_quantile_low = normal_range_quantile_low,
    normal_range_quantile_high = normal_range_quantile_high,
    visits_without_data = visits_without_data,
    unscheduled_visits = unscheduled_visits,
    unscheduled_visit_pattern = unscheduled_visit_pattern,
    unscheduled_visit_values =  unscheduled_visit_values, # takes precedence over unscheduled_visit_pattern   visits_without_data: false,
    x = list(
      type = x_type, #sync to [ time_cols[0].type ]
      column = x_value_col, #sync to [ time_cols[0].value_col ]
      label = x_label #sync to [ time_cols[0].label ]
    ),
    y = list(
      type = y_type,
      column = y_value_col, # sync to [ value_col ]
      label = y_label
    ),
    marks = list(
      list(
        type = 'line',
        per = id_col, #sync to [ id_col ] and [ measure_col ]
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
