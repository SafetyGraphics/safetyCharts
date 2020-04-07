library(dplyr)
library(ggplot2)

source("R/safety_histogram.R")

data <- read.csv('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv',
                 stringsAsFactors = FALSE, na.strings = c("NA",""))

TestSettings <- safetyGraphics::generateSettings(standard="sdtm", charts="safetyhistogram")
TestSettings[["unit_col"]] <- "STRESU"
TestSettings[["description"]] <- "Test page"

p <- safety_histogram(data=data, settings=TestSettings)
ggsave("examples/images/test_safety_histogram.png", plot=p, dpi=300)
