#' Initialize Settings for Adverse Event Explorer widget
#'
#' @param data labs data structured as one record per person per visit per measurement. See details for column requirements. 
#' @param settings named list of settings
#' 
#' @examples
#' 
#' init_aeExplorer(safetyData::aes, safetyGraphics::meta)
#' 
#' @return returns list with data and settings 
#' 
#' @export 


init_aeExplorer<- function(data, settings){

    #Merge treatment with adverse events. 
    dm_sub <- data$dm %>% select(settings[["dm"]][["id_col"]], settings[["dm"]][["treatment_col"]])
    anly <- dm_sub %>% left_join(data$aes) #left join to keep all rows in dm (even if there were no AEs)

    settings<-c(settings$aes, settings$labs)
    
    settings$variables<-list(
        major=settings[["bodsys_col"]],
        minor=settings[["term_col"]],
        group=settings[["trt_col"]],
        id=paste0(settings[["id_col"]]),
        filters=list(),
        details=list()
    )

    settings$variableOptions<-list(
        group=c(
            settings[["treatment_values--group1"]],
            settings[["treatment_values--group2"]]
        )
    )

    settings$defaults = list(
        placeholderFlag = list(
            valueCol = settings[["bodsys_col"]],
            values = c("", NA, NULL)
        )
    )
    return(list(data=anly,settings=settings))
}