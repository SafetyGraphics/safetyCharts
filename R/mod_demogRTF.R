#' Demographics Table RTF - UI
#' 
#' @param id module id
#'
#' @return returns shiny module UI
#'
#' @importFrom DT DTOutput
#' @importFrom htmltools div br
#' @import shiny
#'
#' @export
#'

demogRTF_ui <- function(id) {
    ns <- NS(id)
    div(
        downloadButton(ns("downloadRTF"), "Download RTF", class="btn-primary pull-right"),
        br(),
        DT::DTOutput(ns("rtfTable"))
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
#' @import ggplot2
#' @import dplyr
#' @importFrom DT renderDT
#' @importFrom pharmaRTF write_rtf
#' @import shiny
#'
#' @export

demogRTF_server <- function(input, output, session, params) {
    ns <- session$ns

    demogTable <- reactive({
        demogRTF_table(params()$data, params()$settings)
    })

    output[["rtfTable"]] <- DT::renderDT(
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
#' settings <- list(treatment_col = "ARM", sex_col = "SEX", race_col = "RACE", age_col = "AGE")
#' demogRTF_table(safetyData::sdtm_dm, settings)
#'
#' @importFrom huxtable as_hux set_bold set_align set_valign set_bottom_border set_width set_escape_contents set_col_width
#' @importFrom pharmaRTF rtf_doc add_titles hf_line add_footnotes set_font_size set_ignore_cell_padding set_column_header_buffer
#' @import Tplyr
#'
#' @return rtf doc object
#'
#' @export

demogRTF_table <- function(
    data,
    settings
) {
    tplyr_tab <- Tplyr::tplyr_table(data, !!sym(settings$treatment_col)) %>%
        Tplyr::add_total_group() %>%
        Tplyr::add_layer(
            Tplyr::group_desc(!!sym(settings$age_col), by = "Age (Years)")
        ) %>%
        Tplyr::add_layer(
            Tplyr::group_count(!!sym(settings$sex_col), by = "Sex")
        ) %>%
        Tplyr::add_layer(
            Tplyr::group_count(!!sym(settings$race_col), by = "Race")
        )

    treatments<- data%>%pull(settings$treatment_col) %>% unique() 
    treatment_vars <- paste0("var1_",treatments)
    treatment_labels <- paste0(treatments, "\\line(N=**",treatments,"**)|", collapse=" ")
    header <- paste0(" | | ",treatment_labels," Total\\line(N=**Total**)")
    tab <- tplyr_tab %>%
        Tplyr::build() %>%
        arrange(.data$ord_layer_index, .data$ord_layer_1, .data$ord_layer_2) %>% 
        select(starts_with("row_label"), treatment_vars, .data$var1_Total) %>%
        Tplyr::add_column_headers(header, header_n = Tplyr::header_n(tplyr_tab))

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
            pharmaRTF::hf_line("Protocol: XXX", "PAGE_FORMAT: Page %s of %s", align='split', bold=TRUE, italic=TRUE),
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
