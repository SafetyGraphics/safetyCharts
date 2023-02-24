#' Make standalone paneledOutlierExplorer html widget
#' 
#' Convience mapping of render_widget for paneledOutlierExplorer. 
#' 
#' @details The [data](https://github.com/Rhoinc/paneled-outlier-explorer/wiki/Data-Guidelines) and [mapping](https://github.com/RhoInc/paneled-outlier-explorer/wiki/Configuration) should match the specs described in the [paneledOutlierExplorer](https://github.com/rhoinc/paneled-outlier-explorer/wiki/Configuration) javascript library. Items passed in ... are added to mapping, and then the list is converted to json via `jsonlite::toJSON(mapping, auto_unbox=TRUE, null="null")`.
#' 
#' The default mapping shown below is designed to work with data in the CDISC ADaM format (like `safetydata::adam_adlbc`).    
#' 
#' ```
#' mapping <-  list(
#'        measure_col = 'PARAM',
#'        time_cols = list(
#'          list(
#'            value_col = "VISIT",
#'            order_col = "VISITNUM",
#'            label = "VISIT",
#'            type = 'ordinal',
#'            label="Visit",
#'            rotate_tick_labels = TRUE,
#'            vertical_space = 75
#'          ),
#'          list(
#'            value_col = "ADY",
#'            order_col = "ADY",
#'            label = "Study Day",
#'            type = 'linear',
#'            label="Visit",
#'            rotate_tick_labels = FALSE,
#'            vertical_space = 0
#'          )
#'        ),
#'        value_col = 'AVAL',
#'        id_col = 'USUBJID',
#'        lln_col = 'A1LO',
#'        uln_col = 'A1HI'
#'      )                
#' ```
#'
#' Parameters that are not included in the default mapping can be accessed via ...; Key options and defaults for safetyData::adam_adlbc shown below: 
#'
#' - `filters`: list of columns to be included as data filters formatted as `filters=c("SEX","AGEGR1")``)
#' 
#' For more options see the [full specs](https://github.com/rhoinc/paneled-outlier-explorer/wiki/Configuration) in the javascript library.
#' 
#' @examples 
#' \dontrun{
#' # Render widget with defaults
#' paneledOutlierExplorer() 
#' 
#' # Add Sex and Age Filters
#' paneledOutlierExplorer(
#'     filters=list(
#'         list(value_col="SEX"),
#'         list(value_col="AGEGR1",label="Age")
#'     )
#' )
#' 
#' # customize panel size (in pixels)
#' paneledOutlierExplorer(multiples_sizing=list("width"= 500,"height"= 300))
#' 
#' # customize default normal range
#' paneledOutlierExplorer(
#'    normal_range_method = 'quantiles',
#'    normal_range_quantile_low = 0.2,
#'    normal_range_quantile_high = 0.8,
#' )
#' }
#' @param df data frame containing lab data used to render for paneledOutlierExplorer. Default is safetyData::adam_adlbc. 
#' @param mapping named list with the current data mappings. See details for default mapping. 
#' @param ... additional options to be added to mapping. Will overwrite mapping. 
#' 
#' @importFrom purrr list_modify
#' 
#' @export
#' 

paneledOutlierExplorer <- function(df=safetyData::adam_adlbc, mapping=NULL, ...){
    if(is.null(mapping)){
      mapping <- list(
        measure_col = 'PARAM',
        time_cols = list(
          list(
            value_col = "VISIT",
            order_col = "VISITNUM",
            label = "VISIT",
            type = 'ordinal',
            label="Visit",
            rotate_tick_labels = TRUE,
            vertical_space = 75
          ),
          list(
            value_col = "ADY",
            order_col = "ADY",
            label = "Study Day",
            type = 'linear',
            label="Visit",
            rotate_tick_labels = FALSE,
            vertical_space = 0
          )
        ),
        value_col = 'AVAL',
        id_col = 'USUBJID',
        lln_col = 'A1LO',
        uln_col = 'A1HI'
      )
    }

    # add ... to mapping
    if(length(list(...))>0){
        mapping <-  purrr::list_modify(mapping, !!!list(...))
    }

    # render widget as standalone html page
    render_widget("paneledOutlierExplorer" ,df, mapping)
}
