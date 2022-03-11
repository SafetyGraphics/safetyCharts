#' Convience mapping of render_widget for hepExplorer
#' 
#' @details The [data](https://github.com/SafetyGraphics/hep-explorer/wiki/Data-Guidelines) and [mapping](https://github.com/SafetyGraphics/hep-explorer/wiki/Configuration) should match the specs described in the [hepExplorer](https://github.com/SafetyGraphics/hep-explorer/wiki/Configuration) javascript library. Items passed in ... are added to mapping, and then the list is converted to json via `jsonlite::toJSON(mapping, auto_unbox=TRUE, null="null").
#' 
#' The default mapping - designed to work with safetyata::adam_adlbc is:   
#' ```
#' mapping <- list(
#'            measure_col = "PARAM", 
#'            measure_values = list(
#'                ALT = "Alanine Aminotransferase (U/L)", 
#'                AST = "Aspartate Aminotransferase (U/L)", 
#'                TB = "Bilirubin (umol/L)",
#'                ALP = "Alkaline Phosphatase (U/L)"
#'            ), 
#'            baseline_flag_col = "", 
#'            baseline_flag_values = "", 
#'            analysis_flag_col = "", 
#'            analysis_flag_values = "",
#'           id_col = "USUBJID", 
#'            value_col = "AVAL", 
#'            normal_col_low = "A1LO",                    
#'            normal_col_high = "A1HI", 
#'            studyday_col = "ADY", 
#'            visit_col = "VISIT",
#'            visitn_col = "VISITNUM", 
#'            unit_col = ""
#'        )                  
#' ```
#' 
#' @examples 
#' hepExplorer() #render widget with defaults
#' hepExplorer(group_cols=c("SEX","AGEGR1")) # Adding age group
#'
#' @param df data frame for hep-explorer
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
            baseline_flag_col = "", 
            baseline_flag_values = "", 
            analysis_flag_col = "", 
            analysis_flag_values = "",
            id_col = "USUBJID", 
            value_col = "AVAL", 
            normal_col_low = "A1LO",                    
            normal_col_high = "A1HI", 
            studyday_col = "ADY", 
            visit_col = "VISIT",
            visitn_col = "VISITNUM", 
            unit_col = ""
        )                   
    }

    # add ... to mapping
    if(length(list(...))>0){
        mapping <-  purrr::list_modify(mapping, !!!list(...))
    }

    render_widget("hepExplorer" ,df, mapping)
}