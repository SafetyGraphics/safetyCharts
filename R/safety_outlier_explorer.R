#' Safety Outlier Explorer
#'
#' @param data labs data structured as one record per person per visit per measurement. See details for column requirements. 
#' @param settings named list of settings with the parameters specified below. 
#' @param description description to be included as a subtitle
#'
#' @details The settings object provides details the columns in the data set. 
#' 
#' \itemize{
#'  \item{"id_col"}{ID column}
#'  \item{"value_col"}{Value column}
#'  \item{"measure_col"}{Measure column}
#'  \item{"visit_col"}{Visit Column (character)}
#'  \item{"visitn_col"}{Visit Column (numeric)}
#'  \item{"unit_cols"}{Unit Columns}
#' }
#' 
#' @return returns a chart object
#' 
#' @import ggplot2
#' @import rlang
#' @import dplyr
#' 
#' @export 
#'
#' @examples
#' 

safety_outlier_explorer <- function(data, settings, title, subtitle){
  #ylab <- paste0(measure_selected, " (", dd$unit_col[1],")")
  plot_title <- ifelse(missing(title), "Outlier Explorer", title)
  plot_subtitle <- ifelse(missing(subtitle), "", subtitle)

  # start plot
  params <- aes_(
    x=as.name(settings$studyday_col), 
    y=as.name(settings$value_col), 
    group=as.name(settings$id_col)
  )

  if(hasName(settings, "measure_values")){
    sub <- data %>% filter(!!sym(settings$measure_col) %in% settings$measure_values)
  } else {
    sub <- data
  }
  
  p <- ggplot(data=sub, params) +
    #geom_point(color = "black", alpha=0.35, fill=alpha("gray", 0.05), size=0.1)+
    geom_path(color = "black", alpha=0.15) +
    labs(x="Study Day", y="Lab Value", title="Lab Overview", subtitle="")+
    facet_wrap(
      as.name(settings$measure_col),
      scales="free_y"
    ) +
    theme_bw()

  # add normal range
  # p <- p + annotate(
  #   "rect", 
  #   ymin=dd$normal_col_low[1] , 
  #   ymax=dd$normal_col_high[1],
  #   xmin=-Inf, 
  #   xmax=Inf,
  #   alpha=0.1, 
  #   fill = brewer.pal(9, "Set1")[2], 
  #   color="transparent"
  # )
  
  # use log axis?
  # if(settings[["axis"]]=="log") {
  #   p <- p +
  #     scale_y_log10() +
  #     annotation_logticks(sides="l")
  # }

  return(p)

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
