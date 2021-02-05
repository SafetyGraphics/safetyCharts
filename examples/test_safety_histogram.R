
config <- list()
config[["description"]] <- "Test page"
config[["data"]] <- "https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv"
config[["settings"]] <- safetyGraphics::generateSettings("sdtm", charts="safetyhistogram")

data <- read.csv('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv',
                 stringsAsFactors = FALSE, na.strings = c("NA",""))
settings <- config[["settings"]]
settings[["unit_col"]] <- "STRESU"
description <- config[["description"]]

source("R/safety_histogram.R")
p <- safety_histogram(data=data, settings=settings, description=config$description)
ggsave("examples/test_safety_histogram.png", plot=p, dpi=300)



# test create safety histogram  ---------------------------------------------------------------


histogram_settings <- list(
  id_col="USUBJID", # DONE
  value_col="LBORRES", # DONE
  measure_col="LBTEST", # DONE
  visit_col="VISIT", # DONE
  studyday_col="LBDY", # DONE
  normal_col_low="LBSTNRLO", # DONE
  normal_col_high="LBSTNRHI", # DONE
  visitn_col="VISITNUM", # DONE
  unit_col="LBORRESU" # DONE
)

safety_histogram(data = safetyData::sdtm_lb, settings = histogram_settings)



# measure values ----------------------------------------------------------

unique(safetyData::sdtm_lb$LBTEST)

histogram_settings <- list(
  id_col="USUBJID", # DONE
  value_col="LBORRES", # DONE
  measure_col="LBTEST", # DONE
  visit_col="VISIT", # DONE
  studyday_col="LBDY", # DONE
  normal_col_low="LBSTNRLO", # DONE
  normal_col_high="LBSTNRHI", # DONE
  visitn_col="VISITNUM", # DONE
  unit_col="LBORRESU", # DONE,
  # measure_values = "Microcytes",
  measure_values = "Albumin" 
)

safety_histogram(data = safetyData::sdtm_lb, settings = histogram_settings)
