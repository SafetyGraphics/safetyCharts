#' Make standalone hepExplorer html widget
#' 
#' Convience mapping of render_widget for hepExplorer. 
#' 
#' @details The [data](https://github.com/SafetyGraphics/hep-explorer/wiki/Data-Guidelines) and [mapping](https://github.com/SafetyGraphics/hep-explorer/wiki/Configuration) should match the specs described in the [hepExplorer](https://github.com/SafetyGraphics/hep-explorer/wiki/Configuration) javascript library. Items passed in ... are added to mapping, and then the list is converted to json via `jsonlite::toJSON(mapping, auto_unbox=TRUE, null="null")`.
#' 
#' The default mapping shown below is designed to work with data in the CDISC ADaM format (like `safetydata::adam_adlbc`).    
#' 
#' ```
#' mapping <- list(
#'            measure_col = "PARAM", 
#'            measure_values = list(
#'                ALT = "Alanine Aminotransferase (U/L)", 
#'                AST = "Aspartate Aminotransferase (U/L)", 
#'                TB = "Bilirubin (umol/L)",
#'                ALP = "Alkaline Phosphatase (U/L)"
#'            ), 
#'            id_col = "USUBJID", 
#'            value_col = "AVAL", 
#'            normal_col_low = "A1LO",                    
#'            normal_col_high = "A1HI", 
#'            studyday_col = "ADY", 
#'            visit_col = "VISIT",
#'            visitn_col = "VISITNUM"
#'        )                  
#' ```
#'
#' Parameters that are not included in the default mapping can be accessed via ...; Key options and defaults for safetyData::adam_adlbc shown below: 
#'
#' - `filters`: list of columns to be included as data filters (e.g. `filters=c("SEX","AGEGR1")``)
#' - `group_cols`: list of columns used to define grouping and set point color (e.g. `filters=c("SEX","AGEGR1")``)
#' - `x_options` and `y_options` - specify which labs can be used for x and y axis dropdowns. By default, all options are included on x-axis, but only Bilirubin is shown on y-axis. To allow an interactive y-axis, use `y_options="all"`. 
#' - `baseline` - flag defining the baseline visit for each participant. `baseline` must be provided to enable the mDish view on the hep-explorer chart. Define as a list with `value_col` and `values` (e.g. `baseline=list(value_col="ABLFL",values="Y")`)
#' - `title` and `warningText` - Strings used to define the header text shown above the filters.  
#' 
#' For more options see the [full specs](https://github.com/SafetyGraphics/hep-explorer/wiki/Configuration) in the javascript library.
#' 
#' @examples 
#' 
#' # Render widget with defaults
#' hepExplorer() 
#' 
#' # Add age group to default
#' hepExplorer(group_cols=c("SEX","AGEGR1")) 
#' 
#' # Enable interactive y-axis
#' hepExplorer(y_options='all') 
#' 
#' # Use custom mapping for SDTM data
#' hepExplorer(
#'     df=safetyData::sdtm_lb,
#'     measure_col = "LBTEST", 
#'     measure_values = list(
#'         ALT = "Alanine Aminotransferase", 
#'         AST = "Aspartate Aminotransferase", 
#'         TB = "Bilirubin",
#'         ALP = "Alkaline Phosphatase"
#'     ), 
#'     id_col = "USUBJID", 
#'     value_col = "LBSTRESN", 
#'     normal_col_low = "LBORNRLO",                    
#'     normal_col_high = "LBORNRHI", 
#'     studyday_col = "LBDY", 
#'     visit_col = "VISIT",
#'     visitn_col = "VISITNUM"
#' )
#' 
#' @param df data frame containing lab data used to render for hepExplorer. Default is safetyData::adam_adlbc. 
#' @param mapping named list with the current data mappings. See details for default mapping. 
#' @param ... additional options to be added to mapping. Will overwrite mapping. 
#' 
#' @importFrom purrr list_modify
#' 
#' @export

hepExplorer <- function(df=safetyData::adam_adlbc, mapping=NULL, ...){
    
    #default mapping
    if(is.null(mapping)){
        mapping <- list(
            measure_col = "PARAM", 
            measure_values = list(
                ALT = "Alanine Aminotransferase (U/L)", 
                AST = "Aspartate Aminotransferase (U/L)", 
                TB = "Bilirubin (umol/L)",
                ALP = "Alkaline Phosphatase (U/L)"
            ), 
            id_col = "USUBJID", 
            value_col = "AVAL", 
            normal_col_low = "A1LO",                    
            normal_col_high = "A1HI", 
            studyday_col = "ADY", 
            visit_col = "VISIT",
            visitn_col = "VISITNUM"
        )                   
    }

    # add ... to mapping
    if(length(list(...))>0){
        mapping <-  purrr::list_modify(mapping, !!!list(...))
    }

    # render widget as standalone html page
    render_widget("hepExplorer" ,df, mapping)
}