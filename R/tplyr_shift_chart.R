#' Demographics chart created with tplyr
#'
#' @param data demographics data frame with columns specified in settings object
#' @param settings list with parameters specifying the column names for:
#' - ANRIND
#' - BNRIND
#' - TRTA
#' - PARAMCD
#' - VISIT
#'
#' @import Tplyr
#' @importFrom knitr kable
#' @importFrom kableExtra kable_styling scroll_box
#'
#' @export

# TODO: use variable names captured in settings
tplyr_shift_chart <- function(data, settings) {
    adlb <- data$labs
    adlb$ANRIND <- factor(adlb$ANRIND, levels = c("L", "N", "H"))
    adlb$BNRIND <- factor(adlb$BNRIND, levels = c("L", "N", "H"))
    # Create the table object
    t <- tplyr_table(adlb, .data$TRTA, where = .data$PARAMCD == "ALP") %>%
        # Add the shift layer, which takes two variables that will be the
        # row and column variable you want for presentation
        # Additionally note here that we're using two by variables to group by
        # parameter and visit (though we've filtered to the CK parameter)
        add_layer(
            group_shift(
                vars(
                    row = .data$BNRIND, 
                    column = .data$ANRIND
                ), 
                by = vars(.data$PARAM, .data$VISIT)
            )
        ) %>%
        build() %>%
        kable() %>%
        kable_styling() %>%
        scroll_box(width = "100%", height = "500px")
    return(t)
}
