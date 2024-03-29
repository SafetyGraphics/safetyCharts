#' Combine Event Domains
#'
#' @param data `list` Named list of data domains.
#' @param settings `list` Named list of settings objects containing column and value mappings.
#' @param domains `character` Vector of data domain names to stack.
#'
#' @return combined dataset with stacked AE and CM data
#'
#' @examples
#' stack_events()
#'
#' @importFrom purrr map
#' @importFrom rlang set_names
#'
#' @export

stack_events <- function(
    data = list(
        aes = safetyData::sdtm_ae,
        cm = safetyData::sdtm_cm,
        ex = safetyData::sdtm_ex
    ),
    settings = list(
        aes = rlang::set_names(
            as.list(safetyCharts::meta_aes$standard_sdtm),
            safetyCharts::meta_aes$col_key
        ),
        cm = rlang::set_names(
            as.list(safetyCharts::meta_cm$standard_sdtm),
            safetyCharts::meta_cm$col_key
        ),
        ex = rlang::set_names(
            as.list(safetyCharts::meta_ex$standard_sdtm),
            safetyCharts::meta_ex$col_key
        )
    ),
    domains = c(
        "aes",
        "cm",
        "ex"
    )
) {

  all_events <- domains %>% purrr::map(function(domain) {
    # check it exists in the data
    if (!domain %in% names(data)) {
      message(paste0("'",domain, "' data not found in data object and will be skipped in stacked event data."))

      return(NULL)
    } else {
      domain_data <- data[[domain]]
      domain_settings <- settings[[domain]]

      return(standardize_events(domain_data, domain_settings, domain=domain))
    }
  }) %>% bind_rows

  return(all_events)
}

#' Create a standardized event data set 
#'
#' Create an event data set with a standard set of hard-coded column names using standard safetyGraphics settings and data. The settings for each specified domain should contain valid mappings for ID ("id_col"), event start date ("stdy_col") and event end date ("endy_col"). Missing start day and end day values are extrapolated to NA. All other columns specified in settings are collapsed into a single "details" column. The final standardized data contains the following columns: "id", "domain", "stdy", "endy", "details".
#' 
#' @param data `data.frame` Data domain.
#' @param settings `list` List of column and value mappings.
#' @param domain `character` Name of data domain.
#'
#' @return combined dataset with stacked AE and CM data
#' 
#' @import dplyr
#' @importFrom purrr imap
#' @importFrom tibble as_tibble
#' @importFrom tidyr unite
#'
#' @export

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
        dplyr::select(dplyr::all_of(cols)) %>%
        dplyr::select(-settings[["id_col"]]) %>%
        dplyr::select(-settings[["stdy_col"]]) %>%
        dplyr::select(-settings[["endy_col"]]) %>%
        purrr::imap(~ paste(.y, .x, sep=": ")) %>%
        dplyr::bind_cols() %>%
        tibble::as_tibble() %>%
        tidyr::unite("details", sep="\n")
      
      # get id, start day and end day
      event_data <-  data %>% dplyr::select(
        id = settings[["id_col"]],
        stdy = settings[["stdy_col"]],
        endy = settings[["endy_col"]]
      ) %>% 
      dplyr::bind_cols(details) %>% 
      dplyr::mutate(domain = domain)
      
      return(event_data)
}
