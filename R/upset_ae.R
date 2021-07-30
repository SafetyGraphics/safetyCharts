#' upset AE co-occurence plot
#'
#' Create a plot using the {{upset}} package
#'
#' @param data ae data with one record per event
#' @param settings named list of domain-specific settings with the parameters specified below.
#'
#' @details The settings object provides details regarding the columns in the data sets.
#'
#' \itemize{
#'  \item{"settings$dm$id_col"}{ID column}
#'  \item{"settings$aes$bodsys_col"}{Body System}
#' }
#'
#' @examples
#' aes <- safetyData::adam_adae
#' settings <- list(
#'    id_col = "USUBJID",
#'    bodsys_col = "AEBODSYS"
#' )
#'
#' upset_ae(aes, settings)
#' @return returns a chart object
#'
#' @import UpSetR
#' @import rlang
#' @import dplyr
#'
#' @export
#'
upset_ae <- function(data, settings) {
    # Convert settings to symbols ready for standard evaluation
    ae_id_sym <- sym(settings[["aes"]][["id_col"]])
    ae_bodsys_sym <- sym(settings[["aes"]][["bodsys_col"]])

    ae_w<-ae %>% 
        select(!!ae_id_sym, !!ae_bodsys_sym) %>%
        mutate(count=1)%>%
        mutate(System = substr(!!ae_bodsys_sym,0,10))%>%
        distinct()%>%
        pivot_wider(
            id_cols=System, 
            names_from=!!ae_bodsys_sym,
            values_from = "count", 
            values_fill=0
        )

    p<-upset(as.data.frame(ae_w), order.by = "freq", nsets=10)


    return(p)
}
