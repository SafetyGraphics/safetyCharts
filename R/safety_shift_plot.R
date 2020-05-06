#########################################
#   Load libraries
#########################################
library(dplyr)
library(ggplot2)
library(ggExtra) # for boxplots on sides of scatterplot
library(scales) # for better ticks spacing on axis


#########################################
#   settings manipulation for fig
#########################################

safety_histogram <- function(data, settings, description){ 
  
  id_col <- settings[["id_col"]]
  value_col <- settings[["value_col"]]
  measure_col <- settings[["measure_col"]]
  visit_col <- settings[["visit_col"]]
  visitn_col <- settings[["time_col"]]
  unit_col <- settings[["unit_col"]]
  measure_selected <- ifelse(!is.null(settings[["start_value"]]),
                             settings[["start_value"]],
                             sort(unique(data[[measure_col]]))[1])
  
  #########################################
  #   Prep data
  #########################################
  
  dd <- data %>%
    select(one_of(c(id_col, value_col, measure_col, unit_col,
                    visit_col, visitn_col))) %>%
    setNames(., c("id_col","value_col","measure_col", "unit_col",
                  "visit_col","visitn_col")) %>%
    filter(!is.na(value_col)) %>%
    mutate(visit_col = fct_reorder(visit_col, visitn_col)) %>%
    filter(measure_col==measure_selected)
  
  ### transform based on visits selected
  if (is.null(settings[["visits_base"]])){
    visits_base <- levels(dd$visit_col)[1]
  } else {
    visits_base <- settings[["visits_base"]]}
  if (is.null(settings[["visits_comp"]])){
    visits_comp <- levels(dd$visit_col)[-1]
  } else {
    visits_comp <- settings[["visits_comp"]]
  }
  
  dd_base <- dd %>%
    filter(visit_col %in% visits_base) %>%
    group_by(id_col) %>%
    summarise(mean_base = mean(value_col))
  
  dd_comp <- dd %>%
    filter(visit_col %in% visits_comp) %>%
    group_by(id_col) %>%
    summarise(mean_comp = mean(value_col))
  
  dd_all <- left_join(dd_base, dd_comp) %>%
    na.omit
  
  #########################################
  #   Create figure
  #########################################
  
  # get labels for fig
  ylab <- "Comparison Value"
  xlab <- "Baseline Value"
  plot_title <- description
  plot_subtitle <- paste0("Measure: ", measure_selected, " (", dd$unit_col[1],")")
  
  # color for points
  col <- RColorBrewer::brewer.pal(3, "Set2")[1]
  
  # scatterplot
  p1 <- ggplot(data=dd_all, aes(x=mean_base, y=mean_comp)) +
    geom_point(alpha=0.6, shape=21, color=col, fill=col) +
    geom_abline(slope=1, intercept=0) +
    theme_bw() +
    labs(title=plot_title,
         subtitle=plot_subtitle)+
    theme(panel.border = element_blank(),
          axis.line = element_line(color = 'black'))+
    scale_y_continuous(ylab, breaks=pretty_breaks(n=6)) +
    scale_x_continuous(xlab, breaks=pretty_breaks(n=6))
  
  # boxplots on sides of scatterplot
  ggMarginal(p1, type="boxplot", size=30, xparams = list(fill="grey90", outlier.shape=NA), yparams = list(fill="grey90", outlier.shape=NA))
}



##### testing ####
# highlight, cmd + shift + c to uncomment chunk below
# config <- list()
# config[["description"]] <- "Test page"
# config[["data"]] <- "https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv"
# config[["settings"]] <- safetyGraphics::generateSettings("sdtm", charts="safetyshiftplot") 
# 
# 
# data <- read.csv(config[["data"]], stringsAsFactors = FALSE, na.strings = c("NA",""))
# settings <- config[["settings"]]
# settings[["unit_col"]] <- "STRESU"
# settings[["time_col"]] <- "VISITN"
# 
# # selections within the graphic
# settings[["axis"]] <- "log"
# settings[["visits_base"]] <- "Screening" # can also be NULL
# settings[["visits_comp"]] <- c("Visit 2", "Visit 3") # can also be NULL
# settings[["start_value"]] = "Bicarbonate"  # if no  parameter selected, defaults to first (albumin)
# description <- config$description

#  safety_histogram(data=data, settings=settings, description=description)
