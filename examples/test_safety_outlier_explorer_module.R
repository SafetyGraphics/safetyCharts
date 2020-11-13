devtools::install()
library(safetyCharts)
library(shiny)

data <- read.csv(
    'https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv',
    stringsAsFactors = FALSE, 
    na.strings = c("NA","")
)

settings <- list(
    id_col="USUBJID",
    value_col="STRESN",
    measure_col="TEST",
    visit_col="VISIT",
    studyday_col="DY",
    normal_col_low="STNRLO",
    normal_col_high="STNRHI",
    visitn_col="VISITN",
    unit_col="STRESU"
)

ui <- safetyOutlierExplorer_ui("soe")

server <-  function(input, output, session){
    callModule(
        safetyOutlierExplorer_server,
        "soe",
        params = reactive({list(data=data, settings=settings)})
    )
}

shinyApp(ui,server)