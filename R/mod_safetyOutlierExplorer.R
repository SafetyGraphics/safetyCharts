
#' Safety Outlier Explorer Module - UI
#'
#' @param id module id
#'
#' @return returns shiny module UI
#'
#' @import shiny
#'
#' @export
#'

safetyOutlierExplorer_ui <- function(id) {
    ns <- NS(id)
    sidebar <- sidebarPanel(
        selectizeInput(
            ns("measures"),
            "Select Measures",
            multiple = TRUE,
            choices = c("")
        )
    )
    main <- mainPanel(plotOutput(ns("outlierExplorer")))
    ui <- fluidPage(
        sidebarLayout(
            sidebar,
            main,
            position = c("right"),
            fluid = TRUE
        )
    )
    return(ui)
}


#' Safety Outlier Explorer Module - UI
#'
#' @param input module input
#' @param output module output
#' @param session module session
#' @param params parameters object with `data` and `settings` options.
#'
#' @return returns shiny module Server function
#'
#' @import shiny
#'
#' @export

safetyOutlierExplorer_server <- function(input, output, session, params) {
    ns <- session$ns
    # Populate control with measures and select all by default
    observe({
        measure_col <- params()$settings$measure_col
        measures <- unique(params()$data[[measure_col]])
        updateSelectizeInput(
            session,
            "measures",
            choices = measures,
            selected = measures
        )
    })

    # cusomize selected measures based on input
    settingsR <- reactive({
        settings <- params()$settings
        settings$measure_values <- input$measures
        return(settings)
    })

    # draw the chart
    output$outlierExplorer <- renderPlot({
        safety_outlier_explorer(params()$data, settingsR())
    })
}
