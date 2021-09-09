#' RTF table
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
#' pharmaRTF_demog_chart(data, settings)
#'
#' @import pharmaRTF
#' @import huxtable
#' @import Tplyr
#'
#' @return rtf doc object
#'
#' @export

pharmartf_render_table <- function(data, settings) {
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
      header_n = Tplyr::header_n(tplyr_tab))
  
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