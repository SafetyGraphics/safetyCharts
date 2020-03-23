#########################################
#   Load libraries
#########################################
library(dplyr)
library(forcats)
library(stringr)
library(ggplot2)



config <- list()
config[["description"]] <- "Test page"
config[["data"]] <- "https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv"
config[["settings"]] <- safetyGraphics::generateSettings("sdtm", charts="safetyshiftplot")


data <- read.csv(config[["data"]], stringsAsFactors = FALSE, na.strings = c("NA",""))
settings <- config[["settings"]]
settings[["unit_col"]] <- "STRESU"
settings[["time_col"]] <- "VISITN"

# selections within the graphic
settings[["axis"]] <- "log"
settings[["visits_base"]] <- "Screening" # can also be NULL
settings[["visits_comp"]] <- c("Visit 2", "Visit 3") # can also be NULL

description <- config$description

#########################################
#   settings manipulation for fig
#########################################
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

# lims
lims <- range(dd$value_col)

p1 <- ggplot(data=dd_all, aes(x=mean_base, y=mean_comp)) +
  geom_point(alpha=0.6, shape=21, color=col) +
  geom_abline(slope=1, intercept=0) +
  theme_bw() +
  labs(x=xlab,
       y=ylab,
       title=plot_title,
       subtitle=plot_subtitle)+
  theme(#axis.title.y = element_text(angle=0),
        panel.border = element_blank(),
        axis.line = element_line(color = 'black'))+
  ylim(lims) +
  xlim(lims)

p2 <- ggplot(data=dd_all, aes(x=1, y=mean_comp)) +
  geom_boxplot(fill="gray80", width=0.25) +
  theme_bw() +
  stat_summary(fun.y=mean,
               geom="point",
               show.legend = FALSE)+
  ylim(lims)#+
 # theme_void()

p3 <- ggplot(data=dd_all, aes(x=1, y=mean_base)) +
  geom_boxplot(fill="gray80", width=0.25) +
  theme_bw() +
  stat_summary(fun.y=mean,
               geom="point",
               show.legend = FALSE)+
  ylim(lims)+
  #theme_void() +
  coord_flip()

p4 <- ggplot() + theme_void() #placehodler
library(gridExtra)
grid.arrange(p3,p1, ncol = 1, heights = c(0.5, 1))
grid.newpage()
grid.arrange(ggplotGrob(p1),
             ggplotGrob(p2),
             ggplotGrob(p3),
             ggplotGrob(p4),
             widths = c(1, 1, 0.1, 0.1),
             # heights = c(1, 0.1,1, 0.1),
             layout_matrix = matrix(c(3, 3, 4,
                                         1, 1, 2,
                                         1, 1, 2), ncol=3, byrow=TRUE))


g1 <- ggplotGrob(p1)
g2 <- ggplotGrob(p2)
g3 <- ggplotGrob(p3)
g4 <- ggplotGrob(p4)
maxWidth = grid::unit.pmax(g1$widths[2:5], g3$widths[2:5])
gA$widths[2:5] <- as.list(maxWidth)
gB$widths[2:5] <- as.list(maxWidth)
grid.arrange(g1,
             g2,
             g3,
             g4,
             #widths = c(1, 1, 0.1, 0.1),
             # heights = c(1, 0.1,1, 0.1),
             layout_matrix = matrix(c(3, 3, 4,
                                      1, 1, 2,
                                      1, 1, 2), ncol=3, byrow=TRUE))


grid.draw(cbind(rbind(g3, g1), rbind(g4, g2)))
