timeToAE_ui <- function(id) {
    ns <- NS(id)

    sidebar <- sidebarPanel(
        selectizeInput(
            ns('ae'),
            'Time to',
            multiple = FALSE,
            choices = NULL
        ),
        selectizeInput(
            ns('stratum'),
            'Stratum',
            multiple = FALSE,
            choices = NULL
        )
    )

    main <- mainPanel(
        plotOutput(ns('survival_plot'))
    )

    ui <- fluidPage(
        sidebarLayout(
            sidebar,
            main,
            position = c('right'),
            fluid = TRUE
        )
    )

    return(ui)
}

timeToAE_server <- function(input, output, session, params) {
    ns <- session$ns

    observe({
        params <- params()
        data <- params$data
        settings <- params$settings

        ae_choices <- data$aes %>%
            group_by(!!sym(settings$aes$term_col)) %>%
            tally %>%
            arrange(desc(n)) %>%
            pull(!!sym(settings$aes$term_col))

        updateSelectizeInput(
            session,
            'ae',
            choices = c('Any AE', ae_choices),
            selected = 'Any AE'
        )
    })

    observe({
        params <- params()
        data <- params$data
        settings <- params$settings

        updateSelectizeInput(
            session,
            'stratum',
            choices = c(
                'None',
                settings$dm$treatment_col,
                settings$dm$sex_col,
                settings$dm$race_col
            ),
            selected = 'None'
        )
    })

    output$survival_plot <- renderPlot({
        params <- params()

        timeToAE(
            params$data,
            params$settings,
            input$ae,
            input$stratum
        )
    })
}
