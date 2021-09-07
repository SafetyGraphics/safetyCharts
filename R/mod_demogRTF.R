#' Demographics Table RTF - UI
#' 
#' @param id module id
#'
#' @return returns shiny module UI
#'
#' @import shiny
#'
#' @export
#'

demogRTF_ui <- function(id) {
    ns <- NS(id)
    div(
        downloadButton(ns("downloadRTF"), "Download RTF", class="btn-primary pull-right"),
        br(),
        DT::dataTableOutput(ns("rtfTable"))
    )
}

#' Demographics Table RTF - UI
#' 
#' @param input module input
#' @param output module output
#' @param session module session
#' @param params parameters object with `data` and `settings` options.
#'
#' @return returns shiny module Server function
#'
#' @import shiny
#' @import ggplot2
#' @import dplyr
#'
#' @export

demogRTF_server <- function(input, output, session, params) {
    ns <- session$ns
    demogTable <- reactive({demogRTF_table(params()$data, params()$settings)})

    output[["rtfTable"]] <- DT::renderDataTable(
        demogTable()$table, 
        rownames = FALSE,
        options = list(
            pageLength = 20,
            ordering = FALSE,
            searching = FALSE
        )
    ) 
    
    output[["downloadRTF"]] <- downloadHandler(
        filename = "SafetyGraphics.rtf",
        content = function(file) {
            pharmaRTF::write_rtf(demogTable(), file = file)
        }
    )
}

#' create demographics RTF table
#'
#' @param data demographics data frame with columns specified in settings object
#' @param settings list with parameters specifying the column names for:
#' - sex (settings$sex_col),
#' - race (settings$race_col)
#' - age (settings$age_Col)
#'
#' @examples
#' dm <- read.csv("https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/sdtm/cdisc-pilot-01/dm.csv")
#' settings <- list(treatment_col = "ARM", sex_col = "SEX", race_col = "RACE", age_col = "AGE")
#' demogRTF_table(data, settings)
#'
#' @importFrom pharmaRTF rtf_doc add_titles hf_line add_footnotes set_font_size set_ignore_cell_padding set_column_header_buffer
#' @importFrom huxtable as_hux set_bold set_align set_valign set_bottom_border set_width set_escape_contents set_col_width
#' @import Tplyr
#'
#' @return rtf doc object
#'
#' @export

demogRTF_table <- function(data, settings) {
    tplyr_tab <- Tplyr::tplyr_table(data, !!sym(settings$treatment_col)) %>%
        Tplyr::add_total_group() %>%
        Tplyr::add_layer(
            Tplyr::group_count(!!sym(settings$race_col), by = "Race")
        ) %>%
        Tplyr::add_layer(
            Tplyr::group_desc(!!sym(settings$age_col), by = "Age (Years)")
        )
    tab <- tplyr_tab %>%
        Tplyr::build() %>%
        arrange(ord_layer_index, ord_layer_1, ord_layer_2) %>% 
        select(starts_with("row_label"), var1_Placebo, `var1_Xanomeline Low Dose`, `var1_Xanomeline High Dose`, var1_Total) %>%
        Tplyr::add_column_headers(
            paste0(" | | Placebo\\line(N=**Placebo**)| Xanomeline Low Dose\\line(N=**Xanomeline Low Dose**) ", 
            "| Xanomeline High Dose\\line(N=**Xanomeline High Dose**) | Total\\line(N=**Total**)"), 
            header_n = Tplyr::header_n(tplyr_tab)
        )

    ht <- huxtable::as_hux(tab, add_colnames=FALSE) %>%
        huxtable::set_bold(1, 1:ncol(tab), TRUE) %>% # bold the first row
        huxtable::set_align(1, 1:ncol(tab), 'center') %>% # Center align the first row 
        huxtable::set_align(2:nrow(tab), 3:ncol(tab), 'center') %>% # Center align the results
        huxtable::set_valign(1, 1:ncol(tab), 'bottom') %>% # Bottom align the first row
        huxtable::set_bottom_border(1, 1:ncol(tab), 1) %>% # Put a border under the first row
        huxtable::set_width(1.5) %>% # Set the table width
        huxtable::set_escape_contents(FALSE) %>% # Don't escape RTF syntax
        huxtable::set_col_width(c(.2, .2, .15, .15, .15, .15)) # Set the column widths

    doc <- pharmaRTF::rtf_doc(ht) %>% 
        pharmaRTF::add_titles(
            pharmaRTF::hf_line("Protocol: CDISCPILOT01", "PAGE_FORMAT: Page %s of %s", align='split', bold=TRUE, italic=TRUE),
            pharmaRTF::hf_line("Table 14-2.01", align='center', bold=TRUE, italic=TRUE),
            pharmaRTF::hf_line("Summary of Demographic and Baseline Characteristics", align='center', bold=TRUE, italic=TRUE)
        ) %>% 
        pharmaRTF::add_footnotes(
            pharmaRTF::hf_line("FILE_PATH: Source: %s", "DATE_FORMAT: %H:%M %A, %B %d, %Y", align='split', bold=FALSE, italic=TRUE)
        ) %>% 
        pharmaRTF::set_font_size(10) %>%
        pharmaRTF::set_ignore_cell_padding(TRUE) %>% 
        pharmaRTF::set_column_header_buffer(top=1)

    return(doc)
}