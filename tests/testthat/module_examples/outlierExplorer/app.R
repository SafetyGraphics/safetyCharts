library(shiny)
library(safetyCharts)
library(dplyr)

ui <- tagList(
    fluidPage(
        h2("Example 1: Outlier explorer module - all values"),
        safetyOutlierExplorer_ui("example1"),
    )
)

lb <- safetyData::sdtm_lb
sub <- lb %>% filter(LBTEST %in% c("Albumin", "Bilirubin", "Chloride"))
settings <- list(
    measure_col = "LBTEST",
    studyday_col = "VISITDY",
    value_col = "LBORRES",
    id_col = "USUBJID"
)
params <- reactive({
    list(data = sub, settings = settings)
})

server <- function(input, output, session) {
    callModule(safetyOutlierExplorer_server, "example1", params)
}


shinyApp(ui, server)
