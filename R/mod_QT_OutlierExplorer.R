
#' QT Outlier Explorer Module - UI
#'
#' @param id module id
#'
#' @return returns shiny module UI
#'
#' @import shiny
#' @importFrom plotly plotlyOutput
#'
#' @export
#'

QT_OutlierExplorer_ui <- function(id) {
    ns <- NS(id)
    sidebar<-sidebarPanel(
        uiOutput(ns("selectMeasures"))
    )
    main<-mainPanel(
        tabsetPanel(
            tabPanel("QT Vis", plotlyOutput(ns("QT_OutlierExplorer"), height = 800)),
            tabPanel("QT Data Info", verbatimTextOutput(ns("info")))
        )
        
    )
    ui<-fluidPage(
        sidebarLayout(
            sidebar,
            main,
            position = c("right"),
            fluid=TRUE
        )
    )
    return(ui)
}


#' QT Outlier Explorer Module - UI
#'
#' @param input module input
#' @param output module output
#' @param session module session
#' @param params parameters object with `data` and `settings` options.
#'
#' @return returns shiny module Server function
#'
#' @import shiny
#' @importFrom plotly renderPlotly
#'
#' @export

QT_OutlierExplorer_server <- function(input, output, session, params) {
    ns <- session$ns
    
    
    output$selectMeasures <- renderUI({
        measure_col <- params()$settings$measure_col
        measures <- unique(params()$data[[measure_col]])
        
        
        selectizeInput(
            ns("measures"),
            "Select Measures",
            multiple=TRUE,
            choices=measures,
            selected = "QTcF"
        )
    })
    
    # Populate control with measures and select all by default
    
    # customize selected measures based on input
    settingsR <- reactive({
        settings <- params()$settings
        settings$measure_values <- input$measures
        return(settings)
    })
    
    # data info

    output$info <- renderPrint({
        params()$data %>% count(.data[[params()$settings$visit_col]], .data[[params()$settings$tpt_col]], sort=FALSE) %>% data.frame
    })
    
    #draw the chart
    output$QT_OutlierExplorer <- renderPlotly({
        
        req(input$measures)
        QT_Outlier_Explorer(params()$data, settingsR())
    })
}
