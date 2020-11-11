#' Safety Results Over Time plot
#'
#' @param data 
#' @param settings 
#' @param description 
#'
#' @return plot object
#' 
#' @import dplyr
#' @import forcats
#' @import stringr
#' @import ggplot2
#' @import RColorBrewer
#' @import grid
#' 
#' @export



safety_results_over_time <- function(data, settings, description){
  
  draw_key_cust <- function(data, params, size) {
    data$fill <- data$colour
    size <- 0.5
    draw_key_rect(data, params, size)
  }
  
  id_col <- settings[["id_col"]]
  value_col <- settings[["value_col"]]
  measure_col <- settings[["measure_col"]]
  normal_col_low <- settings[["normal_col_low"]]
  normal_col_high <- settings[["normal_col_high"]]
  visit_col <- settings[["visit_col"]]
  visitn_col <- settings[["visitn_col"]]
 # group_cols <- settings[["group_cols"]]
  unit_col <- settings[["unit_col"]]
  if (!is.null(settings[["groups"]])){
    group_col <- settings[["groups"]][["value_col"]]
    group_col_label <- settings[["groups"]][["label"]]
  } else {
    group_col <- NULL
    group_col_label <- NULL
  }

  measure_selected <- ifelse(!is.null(settings[["start_value"]]),
                             settings[["start_value"]],
                             sort(unique(data[[measure_col]]))[1])
  # group_selected <- settings[["group_selected"]]
  # group_selected_label <- names(group_cols[group_cols==group_selected])

  if (is.null(group_col)){
    colors <- "gray80"
  } else {
    colors <- c(brewer.pal(9, "Set1")[c(2,3,1,4:9)], brewer.pal(8, "Set2"))
  }

  alpha <- ifelse(settings[["violins"]] & settings[["boxplots"]], 0.7, 1)

  pd <- position_dodge(width=0.75, preserve="total")
  pd2 <- position_dodge2(width=0.75, preserve="single")
  ## settings in JS but not used - yet
  # rotate tick labels
  # rotate tick label spacing
  # y axis limits

  #########################################
  #   Prep data
  #########################################

  dd <- data %>%
    select(one_of(c(id_col, value_col, measure_col, unit_col,
                    normal_col_low, normal_col_high,
                    visit_col, visitn_col, group_col))) %>%
    setNames(., c("id_col","value_col","measure_col", "unit_col",
                  "normal_col_low","normal_col_high",
                  "visit_col","visitn_col", group_col)) %>%
    mutate_at(vars(group_col), ~ as_factor(.)) %>%
    mutate(visit_col = fct_reorder(visit_col, visitn_col)) %>%
    filter(measure_col==measure_selected)

  # drop visits without data (default)
  if (settings[["visits_without_data"]]==FALSE){
    dd <- dd %>%
      filter(!is.na(value_col)) %>%
      mutate(visit_col = fct_drop(visit_col))
  }

  # drop unscheduled visits (default)
  if (settings[["unscheduled_visits"]]==FALSE){
    dd <- dd %>%
      filter(! str_detect(tolower(visit_col), "unscheduled")) %>%
      mutate(visit_col = fct_drop(visit_col))
  }


  #########################################
  #   Create figure
  #########################################

  # get labels for fig
  xlab <- settings[["time_settings"]][["label"]]
  ylab <- paste0(measure_selected, " (", dd$unit_col[1],")")
  plot_title <- description #settings[["description"]]
  plot_subtitle <- paste0("Measure: ", ylab) %>%
    {ifelse(!is.null(group_col), paste0(., "; Group: ", group_col_label), paste0(.,""))}



  # initiate plot - overall or by group
  if  (!is.null(group_col)) {
    grp <- ensym(group_col)
    p <- ggplot(data=dd,aes(x=visit_col, y=value_col, color=!!grp)) +
      scale_color_manual(values=colors) +
      labs(color = group_col_label)
  } else {
    p <- ggplot(data=dd,aes(x=visit_col, y=value_col)) +
      scale_colour_manual(values=colors)
  }

  # tweak theme
  p <- p +
    labs(x=xlab,
         y=ylab,
         title=plot_title,
         subtitle=plot_subtitle)+
    theme_bw() +
    theme(axis.text.x = element_text(angle=45, hjust=1),
          legend.position = "bottom",
          legend.justification = "left",
          legend.key.size = unit(0.3,"cm"),
          text = element_text(size=8),
          panel.grid.major.x = element_blank(),
          panel.grid.minor.y = element_blank(),
          axis.text.y=element_text(margin = margin(r = 10)))


  # violin plots?
  if (settings[["violins"]]) {
    p <- p +
      geom_violin(alpha=alpha, key_glyph="cust", position = pd)
  }

  # boxplots?
  if (settings[["boxplots"]]){  # note that whiskers are IQR*1.5- JS draws them from 5-95th%ile
    if (settings[["outliers"]]){
      p <- p +
        geom_boxplot(alpha=alpha, key_glyph="cust",
                     position = pd2, fatten=1,
                     outlier.alpha=0.8, outlier.shape=21)
    } else {
      p <- p +
        geom_boxplot(alpha=alpha, key_glyph="cust",
                     outlier.color=NA,
                     position = pd2, fatten=1)
    }
  }


  # log transform y axis?
  if(settings[["axis"]]=="log") {
    p <- p +
      scale_y_log10()+
    # annotation_logticks2(sides = "l",
    #                      short=unit(-0.1, "cm"),
    #                      mid=unit(-0.2, "cm"),
    #                      long=unit(-0.3,"cm")) +
    annotation_logticks(sides="l") +
    coord_cartesian(clip="off")+
    stat_summary(fun.y= function(x){log10(mean(10**x))}, # force arithmetic mean
                     geom="point",
                      position=pd,
                     show.legend = FALSE)
  } else {
    p <- p +
        stat_summary(fun.y=mean,
                     geom="point",
                     position=pd,
                     show.legend = FALSE)

  }

  return(p)


}

