library(ggplot2)
devtools::document()
devtools::install()
library(safetyCharts)

data <- read.csv(
  'https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv',
  stringsAsFactors = FALSE, 
  na.strings = c("NA","")
)

settings <- list(
  id_col="USUBJID",
  value_col="STRESN",
  measure_col="TEST",
  visit_col="VISIT",
  studyday_col="DY",
  normal_col_low="STNRLO",
  normal_col_high="STNRHI",
  visitn_col="VISITN",
  unit_col="STRESU"
)


# Example 1 ---------------------------------------------------------------

## Example 1 - Summary with all measures

p1 <- safetyCharts::safety_outlier_explorer(
  data=data, 
  settings=settings
)
# ggsave("examples/test_safety_outlier_explorer_all.png", plot=p1, dpi=300)

p1

# Example 2 ---------------------------------------------------------------
## Example 2 - Summary with 3 measures

settings$measure_values <- c("Albumin","Bicarbonate","Calcium")
p2 <- safetyCharts::safety_outlier_explorer(
  data=data, 
  settings=settings
)

p2
# ggsave("examples/test_safety_outlier_explorer_subset.png", plot=p2, dpi=300)


# Example 3 ---------------------------------------------------------------

## Example 3 - Summary with 1 measure

settings$measure_values <- c("eGFR")

p3 <- safetyCharts::safety_outlier_explorer(
  data=data, 
  settings=settings
)

p3
# ggsave("examples/test_safety_outlier_explorer_solo.png", plot=p3, dpi=300)
