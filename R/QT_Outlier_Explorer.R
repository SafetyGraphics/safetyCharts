#' QT Outlier Explorer
#'
#' @param data ECG data structured as one record per person per visit per measurement. See details for column requirements.
#' @param settings named list of settings with the parameters specified below.
#'
#' @details The settings object provides details the columns in the data set.
#'
#' \itemize{
#'  \item{"id_col"}{ID column}
#'  \item{"value_col"}{Value column}
#'  \item{"measure_col"}{Measure column}
#'  \item{"measure_values"}{Measure values}
#'  \item{"visit_col"}{Visit column}
#'  \item{"visitn_col"}{Visit number column (numeric)}
#'  \item{"baseline_flag_col}{Baseline flag column}
#'  \item{"baseline_flag_values}{Baseline flag value}
#' }
#'
#'
#' @return returns a chart object
#'
#' @import dplyr
#' @importFrom plotly plot_ly animation_slider layout
#' @import rlang
#' @importFrom rlang .data
#'
#' @export

QT_Outlier_Explorer <- function(
    data,
    settings
) {
    
    # horizontal reference line
    hline <- function(y = 0, color = "blue") {
        list(
            type = "line",
            x0 = 0,
            x1 = 1,
            xref = "paper",
            y0 = y,
            y1 = y,
            line = list(color = color, width= 2, dash = 'dash')
        )
    }
    
    
    # derive baseline and change from baseline
    data_filtered <- data %>%
        filter(.data[[settings$measure_col]] %in% settings$measure_values)  
    
    data_bl <- data_filtered %>% 
        filter( .data[[settings$baseline_flag_col]] == settings$baseline_flag_values) 
    
    
    data1 <- data_bl %>% 
        mutate( BL = .data[[ settings$value_col ]]) %>% 
        select( .data$BL, settings$id_col) %>%
        right_join(data_filtered, by = settings$id_col) %>% 
        mutate(CHANGE = .data[[settings$value_col]] - .data$BL) %>%
        mutate(Y450 = 450-.data$BL, Y480=480-.data$BL, Y500=500-.data$BL) 
    
    
    #TODO: handle cross-over TQT study, VISIT-TPT scenario
    #TODO: add mean profile plot
    
    
    
    fig <- data1 %>%
    plot_ly(
        x         = ~BL,
        y         = ~CHANGE,
        size      = ~CHANGE,
        color     = ~.data[[settings$treatment_col]],
        frame     = ~paste0(sprintf("%02d", .data[[settings$visitn_col]]), " - ", .data[[settings$visit_col]] ),
        text      = ~paste0(.data[[settings$measure_col]], "<br>Time point: ", .data[[settings$visit_col]], "<br>Treatment: ",
                            .data[[settings$treatment_col]], "<br>Baseline:", BL, "<br>Change: ", CHANGE),
        hoverinfo = "text",
        type      = 'scatter',
        mode      = 'markers'
    ) %>%
    animation_slider(
        currentvalue = list(prefix = "Time Point: ")
    ) %>%
    layout(shapes = 
        list(
            hline(0), 
            hline(30), 
            hline(60),
            list(
                type="line", 
                width= 2,  
                line = list(dash = 'dash',color = "red"),
                x0=0, 
                x1=450, 
                y0=450, 
                y1=0
            )
        )
    )

return(fig)    
}
