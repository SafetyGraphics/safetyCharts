#' Combine Event Domains
#'
#' @param data safetyGraphics data object
#' @param settings safetyGraphics settings object
#' @param domains list of safetyGraphics domains. Adverse events ('aes'), concominate medications ('cm') and exposure ('ex') included by default. 
#' @return combined dataset with stacked AE and CM data

#'
#' @examples
#' stack_events(
#' )

stack_events <- function(data, settings, domains=c("aes","cm", "ex")){

  all_events <- domains %>% map(function(domain){
    # check it exists in the data
    if(!domain %in% names(data)){
      message(paste0("'",domain, "' data not found in data object and will be skipped in stacked event data."))
      return(NULL)
      
    }else{
      domain_data <- data[[domain]]
      domain_settings<- settings[[domain]]
      return(standardize_events(domain_data, domain_settings, domain=domain))
    }

  }) %>% bind_rows

  return(all_events)
}

#' Create a standardized event data set 
#'
#' Create an event data set with a standard set of hard-coded column names using standard safetyGraphics settings and data. The settings for each specified domain should contain valid mappings for ID ("id_col"), event start date ("stdy_col") and event end date ("endy_col"). Missing start day and end day values are extrapolated to NA. All other columns specified in settings are collapsed into a single "details" column. The final standardized data contains the following columns: "id", "domain", "stdy", "endy", "details".
#' 
#' @param data safetyGraphics data object
#' @param settings safetyGraphics settings object. 
#' @param domains list of safetyGraphics domains. Adverse events ('aes'), concominate medications ('cm') and exposure ('ex') included by default. 
#' @return combined dataset with stacked AE and CM data
#' 
#' @import purrr
#' @import tidyr

standardize_events <- function(data, settings, domain=""){
      # stop if id_col doesn't exist
      stopifnot("id_col" %in% names(settings))
      stopifnot(settings$id_col %in% names(data))

      # add stdy_col & endy_col if missing      
      if(!"stdy_col" %in% names(settings)){
        settings$stdy_col <- 'stdy'
        data$stdy<-NA
      }else{
        stopifnot(settings$stdy_col %in% names(data))
      }

      if(!"endy_col" %in% names(settings)){
        settings$endy_col <- 'endy'
        data$endy<-NA
      }else{
        stopifnot(settings$endy_col %in% names(data))
      }

      # make a details object with all other columns in settings
      cols<-as.character(settings) 
      details <- data %>% 
        select(all_of(cols)) %>%
        select(-settings[["id_col"]]) %>%
        select(-settings[["stdy_col"]]) %>%
        select(-settings[["endy_col"]]) %>%
        imap( ~ paste(.y, .x, sep=": ")) %>%
        as_tibble %>%
        unite("details", sep="\n")
      
      # get id, start day and end day
      event_data <-  data %>% select(
        id = settings[["id_col"]],
        stdy = settings[["stdy_col"]],
        endy = settings[["endy_col"]]
      ) %>% 
      bind_cols(details) %>% 
      mutate(domain = domain)
      
      return(event_data)
}