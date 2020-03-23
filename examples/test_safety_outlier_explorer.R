config <- list()
config[["description"]] <- "Test page"
config[["data"]] <- "https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv"
config[["settings"]] <- safetyGraphics::generateSettings("sdtm", charts="safetyoutlierexplorer")


data <- read.csv('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv',
                 stringsAsFactors = FALSE, na.strings = c("NA",""))

settings <- config[["settings"]]
settings[["study_name"]] <- "Test page"
settings[["group_cols"]] <- c("Site" = "SITEID","Treatment Arm" = "ARM",
                              "Sex" = "SEX","Race" = "RACE")
settings[["unit_col"]] <- "STRESU"

# manipulate SG settings
settings[["time_cols"]] <- list(list(),list());
settings[["time_cols"]][[1]]<-list(
  type= "ordinal",
  value_col= settings[["visit_col"]],
  label= "Visit",
  order_col= settings[["visitn_col"]],
  order= NULL,
  rotate_tick_labels= TRUE,
  vertical_space= 100
)
settings[["time_cols"]][[2]]<-list(
  type= "linear",
  value_col= settings[["studyday_col"]],
  label= "Study Day",
  order_col= settings[["studyday_col"]],
  order= NULL,
  rotate_tick_labels= FALSE,
  vertical_space= 0
)

## settings not in SG but needed
set.seed(124)
settings[["id_selected"]] <- sample(data[[settings[["id_col"]]]],1)
# settings[["id_selected"]] <- NULL
settings[["axis"]] <- "log"
settings[["normal_range_method"]] <- "LLN-ULN" # other options: None, # of SDs, quantiles (specify)

source("R/safety_outlier_explorer.R")
p <- safety_outlier_explorer(data=data, settings=settings, description=config$description)
ggsave("examples/test_safety_outlier_explorer.png", plot=p, height=4, width=6.5, dpi=300)
