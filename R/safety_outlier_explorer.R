#########################################
#   Load libraries
#########################################
library(dplyr)
library(forcats)
library(stringr)
library(ggplot2)
library(gridExtra)
library(RColorBrewer)
library(grid)

source("R/ggtickmarks2.R")

safety_outlier_explorer <- function(data, settings, description){

  id_col <- settings[["id_col"]]
  value_col <- settings[["value_col"]]
  measure_col <- settings[["measure_col"]]
  normal_col_low <- settings[["normal_col_low"]]
  normal_col_high <- settings[["normal_col_high"]]
  visit_col <- settings[["visit_col"]]
  visitn_col <- settings[["visitn_col"]]
  group_cols <- settings[["group_cols"]]
  unit_col <- settings[["unit_col"]]

  id_selected <- settings[["id_selected"]]
  measure_selected <- ifelse(!is.null(settings[["start_value"]]),
                             settings[["start_value"]],
                             sort(unique(data[[measure_col]]))[1])
  normal_range_method <- settings[["normal_range_method"]]


  #########################################
  #   Prep data
  #########################################
  dd0 <- data %>%
    select(one_of(c(id_col, value_col, measure_col, unit_col,
                    normal_col_low, normal_col_high,
                    visit_col, visitn_col))) %>%
    setNames(., c("id_col","value_col","measure_col", "unit_col",
                  "normal_col_low","normal_col_high",
                  "visit_col","visitn_col")) %>%
    mutate(visit_col = fct_reorder(visit_col, visitn_col),
           id_flag = case_when(
             is.null(id_selected) ~ FALSE,
             id_col==id_selected ~ TRUE,
             TRUE ~ FALSE)
    )

  # filter on primary measure of interest
  dd <- filter(dd0, measure_col==measure_selected)

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

  color_select <- "#E41A1C"
 # lines <-"#377EB8"

  # get labels for fig
  xlab <- settings[["time_cols"]][[1]][["label"]]
  ylab <- paste0(measure_selected, " (", dd$unit_col[1],")")
  plot_title <- description
  plot_subtitle <- paste0("Measure: ", ylab) %>%
    {paste0(., "; Normal range method: ", normal_range_method)}


  # start plot
  p <- ggplot(data=dd, aes(x=visit_col, y=value_col, group=id_col)) +
    labs(x=xlab,
         y=ylab,
         title=plot_title,
         subtitle=plot_subtitle)

  # add normal range
  if (normal_range_method=="LLN-ULN"){
    p <- p +
      annotate("rect", ymin=dd$normal_col_low[1] , ymax=dd$normal_col_high[1],
                       xmin=-Inf, xmax=Inf,
                alpha=0.1, fill = brewer.pal(9, "Set1")[2], color="transparent")
  }

  # add gridlines
  p <- p +
    theme_bw() +
    theme(axis.text.x = element_text(angle=45, hjust=1),
          text = element_text(size=8),
          panel.grid.major.x = element_blank(),
          panel.grid.minor.y = element_blank(),
          axis.text.y=element_text(margin = margin(r = 10)))

  # color selected individuals, if applicable
  if (!is.null(id_selected)){

    dd1 <- filter(dd, id_flag==TRUE)
    p <- p +
      geom_point(color = "black", alpha=0.35, fill=alpha("gray", 0.05))+
      geom_path(color = "black", alpha=0.35)+
      geom_point(data=dd1, aes(x=visit_col, y=value_col, group=id_col), color = color_select, fill="transparent")+
      geom_path(data=dd1, aes(x=visit_col, y=value_col, group=id_col), color = color_select)

  } else {
    p <- p +
      geom_point(color = "black", alpha=0.35, fill=alpha("gray", 0.05))+
      geom_path(color = "black", alpha=0.35)
  }


  # log transform y axis?
  if(settings[["axis"]]=="log") {
    p <- p +
      scale_y_log10() +
      annotation_logticks(sides="l")
      # annotation_logticks2(sides = "l",
      #                      short=unit(-0.1, "cm"),
      #                      mid=unit(-0.2, "cm"),
      #                      long=unit(-0.3,"cm")) +
      # coord_cartesian(clip="off")
  }

  p

}


#
# p_orig <- p
#
#
# #########################################
# #   Small multiples
# #########################################
# ddm <- dd0 %>%
#   filter((! measure_col==measure_selected) &
#          (id_col==id_selected))
# measures <- unique(ddm$measure_col)
#
# p_list <- list()
# p_list[[1]] <- p_orig
#
# #for (i in 1:length(measures)){
# for (i in 1:6){
#
#   ddmm <- filter(ddm, measure_col==measures[i])
#
#   # get labels for fig
#   plot_title <- paste0(measures[i], " (", ddmm$unit_col[1],")")
#   xlab <- settings[["time_settings"]][["label"]]
#   ylab <- ""
#
#
#   p <- ggplot(data=ddmm, aes(x=visit_col, y=value_col, group=id_col)) +
#     labs(x=xlab,
#          y=ylab,
#          title=plot_title)+
#     theme_minimal() +
#     theme(axis.text.x = element_text(angle=45, hjust=1),
#           text=element_text(size=8),
#           title = element_text(size=10))+
#     geom_point(color=color_select) +
#     geom_line(color=color_select)
#
#   # add normal range
#   if (normal_range_method=="LLN-ULN"){
#     p <- p +
#       geom_rect(data=ddmm, aes(ymin=normal_col_low , ymax=normal_col_high, xmin=-Inf, xmax=Inf),
#                 alpha=0.5, stat="identity", fill = "transparent", color="gray70")
#   }
#
#   # log transform y axis?
#   if(axis_log) {
#     p <- p +
#       scale_y_log10()
#   }
#
#   p_list[[i+1]] <- p
# }
#
# # combine
# layout1 <- rbind(c(1,1,1),
#                 c(1,1,1))
#
# ncol <- 3
# np <- length(p_list)-1
# layout2 <- matrix(c(2:(length(p_list)), rep(NA, ncol-np%%ncol)), ncol=ncol, byrow=TRUE)
#
# lay <- rbind(layout1, layout2)
#
# grid.arrange(grobs = p_list, layout_matrix=lay)
#
