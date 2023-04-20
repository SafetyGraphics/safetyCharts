#' Stack Measures
#'
#' @param data 
#' @param settings named list of settings with the parameters specified below.
#'
#' @details The settings object provides details the columns in the data set.
#'
#' @return returns a stacked data frame with one row per measure
#'
#' @importFrom rlang .data
#' @import dplyr
#'
#' @export


stackMeasures <- function(
    data, 
    settings, 
    domains=c('labs','vitals','ecg'),
    required_cols=c('id_col','value_col','measure_col','visit_col'),
    optional_cols=c('normal_col_high','normal_col_low','studyday_col','visitn_col','unit_col')
){   
    # only keep domains found in the data
    domains <- domains[names(data)]

    # rename the key columns in each domain
    domains %>% map(function(domain){
        domainData <- data[domain]
        domainSettings <- settings[[domain]]

        # check that required columns are found
        requiredFound <- required_cols %in% names(domainSettings)
        
        if(!all(requiredFound)){
            # if required columns are missing throw a warning
            missing <- required_cols[!requiredFound]
            cli::cli_alert_warning("Issue in stackMeasures(): {missing} settings not found for {domain}. No data added. ")
            return(NULL)
        } else {
            # if require columns are found, rename all columns
            cols <- c(required_cols,optional_cols) %>% map(
                ~list(
                        orig=domainSetting[.x],
                        new=sub("_col", "",.x, fixed = TRUE)
                    )
            )

            for(col in cols){
                if(col$orig %in% colnames(domainData)){
                    domainData[col$new,] <- domainData[col$orig,]
                }else{
                    domainData[col$new,]<-""
                }
            }

            colsNew <- cols %>% map(~.x$new)
            return(
                domainData %>% 
                    select(colsNew) %>%
                    mutate(domain=domain)
            )        
        }
    })

    return(rbind(domains))
}
