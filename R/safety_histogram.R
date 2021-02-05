#' @title Histogram of lab data from SDTM and ADaM data
#' @description What are the settings? description?
#' @param data PARAM_DESCRIPTION
#' @param settings PARAM_DESCRIPTION
#' @param description PARAM_DESCRIPTION
#' @return OUTPUT_DESCRIPTION
#' @export 
#' @importFrom RColorBrewer brewer.pal
safety_histogram <- function(data, settings, description){

  id_col <- settings[["id_col"]]
  value_col <- settings[["value_col"]]
  measure_col <- settings[["measure_col"]]
  normal_col_low <- settings[["normal_col_low"]]
  normal_col_high <- settings[["normal_col_high"]]
  
  unit_col <- settings[["unit_col"]]
  low_lim <- settings[["low_lim"]]
  up_lim <- settings[["up_lim"]]
  #page_layout <- settings[["page_layout"]] # option doesn't work yet
  

  if (!is.null(settings[["measure_values"]])){
    measure_selected = settings[["measure_values"]]
  } else {
    measure_selected = sort(unique(data[[measure_col]]))[1]
  }
  
  # prep data
  dd <- data %>%
    dplyr::select(one_of(c(id_col, value_col, unit_col, measure_col, normal_col_low, normal_col_high))) %>%
    setNames(., c("id_col","value_col","unit_col","measure_col","normal_col_low","normal_col_high")) %>%
    dplyr::filter(!is.na(value_col)) %>%
    
    dplyr::filter(measure_col%in%measure_selected) %>%
    dplyr::mutate(measure_label =  paste0(measure_col, " (", unit_col,")")) %>%
    dplyr::group_by(measure_col) %>%
    dplyr::mutate(bw = 3.5 * sd(value_col)/(n()^(1/3))) %>% # for binwidth. does nothing for now.
    dplyr::group_by()
  
  n_obs <- nrow(dd)
  
  # filter for x limits
  if (!is.null(low_lim)){
    low_lim_df = data.frame(measure_col = measure_selected, low_limit=low_lim)
    dd <-  dd %>%
      left_join(low_lim_df, by="measure_col") %>%
      filter(value_col>=low_limit)
  } 
  
  if (!is.null(up_lim)){
    up_lim_df = data.frame(measure_col = measure_selected, up_limit=up_lim)
    dd <-  dd %>%
      left_join(up_lim_df, by="measure_col") %>%
      filter(value_col<=up_limit)
  } 
  
  dd <- dd %>% mutate(measure_col = factor(measure_col, levels=measure_selected))
  
  
  # from JS code:
  # The x-domain can be in three states:
  # - the extent of all results
  # - user-defined, e.g. narrower to exclude outliers
  #
  # Bin width is calculated with two variables:
  # - the interquartile range
  # - the number of results
  #
  # 1 When the x-domain is set to the extent of all results, the bin width should be calculated
  #   with the unfiltered set of results, regardless of the state of the current filters.
  #
  # 2 Given a user-defined x-domain, the bin width should be calculated with the results that
  #   fall inside the current domain.
  
  
  #########################################
  #   Create figure
  #########################################
  
  # get labels for fig
  
  ylab <- "# of Observations"
  #plot_title <- description
  plot_title <- paste0(nrow(dd)," of ", n_obs, " participant(s) shown (", round(100*nrow(dd)/n_obs,1),"%)")
  
  # color for histogram
  col <- RColorBrewer::brewer.pal(3, "Set2")[1]
  
  dd <- dd %>% dplyr::mutate(value_col = as.numeric(value_col))
  #options(repr.plot.width = 1, repr.plot.height = 5) # set width and height? not sure if works
  p <- ggplot2::ggplot(data=dd) +
    theme_bw() +
    labs(subtitle=plot_title)+
    theme(panel.border = element_rect(fill = NA, color = "black"),
          strip.text = element_text(size=11),
          strip.background = element_blank(),
          strip.placement = "outside",
          panel.grid.major.x = element_blank(),
          panel.grid.minor.x = element_blank(),
          axis.line = element_line(color = 'black'))+
    scale_x_continuous("", breaks = scales::pretty_breaks(n=6))+
    scale_y_continuous(ylab, breaks = scales::pretty_breaks(n=6), expand = expansion(mult = c(0, .1)))+
    geom_rect(aes(xmin=normal_col_low , xmax=normal_col_high, ymin=-Inf, ymax=Inf),
              alpha=0.5, stat="identity", fill = "gray90", color="gray70") +
    geom_histogram(aes(x=value_col), bins=12, fill=col, alpha=0.6, color=col) +
    facet_wrap(~measure_label, scales="free",strip.position="bottom",ncol=3)
  
  
  return(p)
}


