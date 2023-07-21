#' Make standalone aeExplorer html widget
#' 
#' Convience mapping of render_widget for aeExplorer.
#' 
#' The [data](https://github.com/RhoInc/aeexplorer/wiki/Data-Guidelines) and
#' [mapping](https://github.com/RhoInc/aeexplorer/wiki/Configuration) should match the specs
#' described in the [aeExplorer](https://github.com/RhoInc/aeexplorer/wiki/Configuration)
#' JavaScript library. Items passed in ... are added to mapping, and then the list is converted to
#' JSON via `jsonlite::toJSON(mapping, auto_unbox=TRUE, NULL="NULL")`.
#' 
#' The default mapping shown below is designed to work with data in the CDISC ADaM format (like
#' `safetydata::adam_adlbc`).    
#' 
#' ```
#' mapping <- list(
#'     dm = list(
#'         id_col = 'USUBJID',
#'         treatment_col = 'ARM'
#'     ),
#'     aes = list(
#'         id_col = 'USUBJID',
#'         bodsys_col = 'AEBODSYS',
#'         term_col = 'AEDECOD'
#'     )
#' )
#' ```
#'
#' Parameters that are not included in the default mapping can be accessed via ....
#'
#' For more options see the [full specs](https://github.com/RhoInc/aeexplorer/wiki/Configuration) in
#' the JavaScript library.
#' 
#' @examples 
#' \dontrun{
#' # Render widget with defaults.
#' aeExplorer() 
#' 
#' # Render widget without stratification.
#' aeExplorer(
#'     mapping = list(
#'         dm = list(
#'             id_col = 'USUBJID'
#'         ),
#'         aes = list(
#'             id_col = 'USUBJID',
#'             bodsys_col = 'AEBODSYS',
#'             term_col = 'AEDECOD'
#'         )
#'     )
#' )
#' }
#' 
#' @param data `list` Named list of data frames that includes participant-level subject data (`dm`)
#' and event-level adverse event data (`aes`).
#' @param mapping `list` Named list with current data mappings. See details for default mapping. 
#' @param ... additional options to be added to mapping. Will overwrite mapping. 
#' 
#' @importFrom purrr list_modify
#' 
#' @export

aeExplorer <- function(
    data = list(
        dm = safetyData::sdtm_dm,
        aes = safetyData::sdtm_ae
    ),
    mapping = NULL,
    ...
) {
    # Default mapping - TODO: retrieve mapping from a dedicated file or object (in safetyGraphics?).
    if (is.null(mapping)) {
        mapping <- list(
            dm = list(
                id_col = 'USUBJID',
                treatment_col = 'ARM'
            ),
            aes = list(
                id_col = 'USUBJID',
                bodsys_col = 'AEBODSYS',
                term_col = 'AEDECOD'
            )
        )
    }

    # Add ... to mapping.
    if (length(list(...)) > 0) {
        mapping <-  purrr::list_modify(mapping, !!!list(...))
    }

    initialized <- init_aeExplorer(
        data = data,
        settings = mapping
    )

    # Render widget as standalone HTML page.
    render_widget("aeExplorer", initialized$data, initialized$settings)
}
