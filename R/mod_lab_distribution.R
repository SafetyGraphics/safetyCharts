#' Lab distribution Module - UI
#' 
#' A simple UI for a shiny module looking at lab histograms. Intended primarily for technical demos. 
#'
#' @param id module id
#'
#' @return returns shiny module UI
#'
#' @import shiny
#'
#' @export
#'

lab_distribution_ui <- function(id) {
    ns <- NS(id)
    tagList(
        checkboxInput(ns("show_points"), "Show points?", value = FALSE),
        checkboxInput(ns("show_outliers"), "Show outliers?", value = TRUE),
        selectInput(ns("scale"), "Scale Transform", choices = c("Log-10", "None")),
        plotOutput(ns("labdist"), width = "1000px")
    )
}
#' lab distribution Module - Server
#'
#' A simple server for a shiny module looking at lab histograms. Intended primarily for technical demos. 
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

lab_distribution_server <- function(input, output, session, params) {
    ns <- session$ns

    mapped_data <- reactive({
        params()$data %>%
            select(
                Value = params()$settings[["value_col"]],
                Measure = params()$settings[["measure_col"]]
            ) %>%
            filter(!is.na(.data$Value))
    })

    output$labdist <- renderPlot({
        req(mapped_data())

        # set up the plot
        p <- ggplot(data = mapped_data(), aes(x = .data$Measure, y = .data$Value)) +
            theme_bw() +
            theme(
                axis.text.x = element_text(angle = 25, hjust = 1),
                axis.text = element_text(size = 12),
                axis.title = element_text(size = 12)
            )

        # add/remove outliers
        if (input$show_outliers) {
            p <- p + geom_boxplot(fill = "orange")
        } else {
            p <- p + geom_boxplot(fill = "orange", outlier.shape = NA)
        }

        # log-transform scale
        if (input$scale == "Log-10") {
            p <- p + scale_y_log10()
        }

        # show individual data points
        if (input$show_points) {
            p <- p + geom_jitter(width = 0.2)
        }

        p
    })
}
