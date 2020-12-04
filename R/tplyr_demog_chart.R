#' Demographics chart created with tplyr
#'
#' @param data demographics data frame with columns specified in settings object
#' @param settings list with parameters specifying the column names for:
#' - sex (settings$sex_col), 
#' - race (settings$race_col)
#' - age (settings$age_Col) 
#'
#' @examples
#' dm <- read.csv("https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/sdtm/cdisc-pilot-01/dm.csv")
#' settings<-list(treatment_col="ARM", sex_col="SEX", race_col="RACE", age_col="AGE")
#' tplyr_demog_chart(data, settings)
#' 
#' @import Tplyr
#' 
#' @return tplyr table object
#' 
#' @export

tplyr_demog_chart <- function(data, settings){

    tab<-tplyr_table(data, !!sym(settings$treatment_col), cols=!!sym(settings$sex_col)) %>% 
        add_layer(
            group_count(!!sym(settings$race_col), by = "Race")
        ) %>% 
        add_layer(
            group_desc(!!sym(settings$age_col), by = "Age (Years)")
        ) %>% 
        build()
    
    return(tab)
}