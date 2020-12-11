config <- list()
config[["description"]] <- "Test page"
config[["data"]] <- "https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv"
config[["settings"]] <- safetyGraphics::generateSettings("sdtm", charts="safetyresultsovertime")


data <- read.csv(config[["data"]], stringsAsFactors = FALSE, na.strings = c("NA",""))
settings <- config[["settings"]]
settings[["group_cols"]] <- c("Site" = "SITEID","Treatment Group" = "ARM",
                              "Sex" = "SEX","Race" = "RACE")
settings[["unit_col"]] <- "STRESU"

# manipulate SG settings
settings[["time_settings"]] =list(
  value_col= settings[["visit_col"]],
  label= "Visit",
  order_col= settings[["visitn_col"]],
  order= NULL,
  rotate_tick_labels= TRUE,
  vertical_space= 100
)

## settings not in SG but needed
#settings[["measure_selected"]] <- "Albumin"
settings[["groups"]][["value_col"]] <- "ARM"
settings[["groups"]][["label"]] <- "Treatment arm"
# settings[["groups"]] <- list(value_col=NULL, label=NULL)
settings[["boxplots"]] <- TRUE
settings[["violins"]] <- FALSE
settings[["outliers"]] <- TRUE
settings[["axis"]] <- "log"

source("R/safety_results_over_time.R")

p <- safety_results_over_time(data=data, settings = settings)
# p <- safety_results_over_time(data=data, settings=settings, description=config$description)
# ggsave("examples/test_safety_results_over_time.png", plot=p, height=4, width=6.5, dpi=300)
