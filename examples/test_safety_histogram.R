library(dplyr)
library(ggplot2)

source("R/safety_histogram.R")

#library(safetyCharts)

data <- read.csv('https://raw.githubusercontent.com/RhoInc/data-library/master/data/clinical-trials/renderer-specific/adbds.csv',
                 stringsAsFactors = FALSE, na.strings = c("NA",""))

settings <- safetyGraphics::generateSettings(standard="sdtm", charts="safetyhistogram")
settings[["unit_col"]] <- "STRESU"
settings[["description"]] <- "Test page"

p <- safety_histogram(data=data, settings=settings)
ggsave("examples/images/test_safety_histogram.png", plot=p, dpi=300)
